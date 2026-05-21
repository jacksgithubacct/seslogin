import { getCurrentClientVersion } from "./clientVersion";
import {
  getClientUpdateLeases,
  onClientUpdateLeasesChange,
} from "./clientUpdateLeases";

const VERSION_META_NAME = "seslogin-client-version";
const POLL_INTERVAL_MS = 60_000;

function getVersionFromHtml(html: string): string | null {
  const escapedName = VERSION_META_NAME.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    "\\$&",
  );
  const pattern = new RegExp(
    `<meta\\s+name=["']${escapedName}["']\\s+content=["']([^"']*)["']`,
    "i",
  );
  const match = html.match(pattern);
  if (!match) {
    return null;
  }
  const value = match[1].trim();
  return value.length > 0 ? value : null;
}

async function fetchDeployedVersion(): Promise<string | null> {
  const url = `/index.html?__version_check=${Date.now()}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Version check failed with status ${response.status}`);
  }

  const html = await response.text();
  return getVersionFromHtml(html);
}

export function startClientUpdatePolling(): () => void {
  if (typeof window === "undefined" || import.meta.env.MODE === "development") {
    return () => {};
  }

  const currentVersion = getCurrentClientVersion();
  if (!currentVersion || currentVersion === "dev") {
    return () => {};
  }

  let pendingVersion: string | null = null;
  let disposed = false;
  let lastDeferredLeaseSignature: string | null = null;

  const tryReload = () => {
    if (disposed || pendingVersion == null) {
      return;
    }
    const activeLeases = getClientUpdateLeases();
    if (activeLeases.length > 0) {
      const signature = JSON.stringify(
        activeLeases.map((lease) => ({
          uuid: lease.uuid,
          description: lease.description,
        })),
      );
      if (signature !== lastDeferredLeaseSignature) {
        console.info(
          "Client update deferred due to active leases",
          activeLeases,
        );
        lastDeferredLeaseSignature = signature;
      }
      return;
    }
    lastDeferredLeaseSignature = null;
    console.info(
      "New client version detected, reloading",
      currentVersion,
      "->",
      pendingVersion,
    );
    window.location.reload();
  };

  const checkOnce = async () => {
    if (disposed) {
      return;
    }
    try {
      const deployedVersion = await fetchDeployedVersion();
      if (!deployedVersion || deployedVersion === currentVersion) {
        return;
      }
      if (pendingVersion !== deployedVersion) {
        pendingVersion = deployedVersion;
        console.info("Update available", currentVersion, "->", deployedVersion);
      }
      tryReload();
    } catch (error) {
      console.warn("Failed to check for client update", error);
    }
  };

  // we don't check immediately because we don't want to get stuck in a reload
  // loop if the CDN is serving an old version
  const intervalId = window.setInterval(() => {
    void checkOnce();
  }, POLL_INTERVAL_MS);

  const unsubscribeLeases = onClientUpdateLeasesChange(() => {
    tryReload();
  });

  return () => {
    disposed = true;
    window.clearInterval(intervalId);
    unsubscribeLeases();
  };
}
