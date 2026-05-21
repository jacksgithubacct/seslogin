import { getCurrentClientVersion } from "../lib/clientVersion";

function formatClientVersion(version: string): string {
  const normalized = version.trim();
  if (/^[0-9a-f]{40}$/i.test(normalized)) {
    return normalized.slice(0, 7);
  }
  return normalized;
}

export default function ClientVersionLabel() {
  const currentVersion = getCurrentClientVersion();
  const displayVersion = formatClientVersion(currentVersion);

  return <span className="client-version">{displayVersion}</span>;
}
