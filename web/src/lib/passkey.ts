import {
  startAuthentication,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from "@simplewebauthn/browser";
import { getGraphQLEndpoint } from "./api";
import {
  getCurrentClientVersion,
  CLIENT_VERSION_HEADER,
} from "./clientVersion";

export { browserSupportsWebAuthn, browserSupportsWebAuthnAutofill };

const PASSKEY_LOGIN_FLAG = "passkey_login_session";

/** True if the current browser session was authenticated via passkey. */
export function wasPasskeyLoginSession(): boolean {
  return sessionStorage.getItem(PASSKEY_LOGIN_FLAG) === "1";
}

export function clearPasskeyLoginSession(): void {
  sessionStorage.removeItem(PASSKEY_LOGIN_FLAG);
}

const ENROLL_PROMPT_TS = "passkey_enroll_prompt_ts";
const ENROLL_PROMPT_INTERVAL_MS = 12 * 60 * 60 * 1000;

/** True if the enrollment interstitial was shown within the last 12 hours. */
export function passkeyEnrollPromptThrottled(): boolean {
  const raw = localStorage.getItem(ENROLL_PROMPT_TS);
  if (!raw) return false;
  const ts = Number.parseInt(raw, 10);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < ENROLL_PROMPT_INTERVAL_MS;
}

/** Record that the enrollment interstitial was just shown. */
export function markPasskeyEnrollPromptShown(): void {
  localStorage.setItem(ENROLL_PROMPT_TS, String(Date.now()));
}

async function rawGraphQL(
  query: string,
  variables: Record<string, unknown>,
): Promise<unknown> {
  const resp = await fetch(getGraphQLEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [CLIENT_VERSION_HEADER]: getCurrentClientVersion(),
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.json();
}

/**
 * Attempt a discoverable (usernameless) passkey login.
 *
 * Returns an opaque session token on success, or null if the user has no
 * passkey, cancels the prompt, or verification fails. With `useAutofill`,
 * the browser surfaces saved passkeys inline on the email field (conditional
 * UI) rather than showing a modal.
 */
export async function loginWithPasskey(opts?: {
  useAutofill?: boolean;
}): Promise<string | null> {
  const beginResp = (await rawGraphQL(
    `mutation BeginPasskeyLogin {
      beginPasskeyLogin { challengeId optionsJson }
    }`,
    {},
  )) as {
    data?: {
      beginPasskeyLogin?: { challengeId: string; optionsJson: string } | null;
    };
  };

  const challenge = beginResp?.data?.beginPasskeyLogin;
  if (!challenge) return null;

  const optionsJSON = JSON.parse(challenge.optionsJson);

  let authResponse;
  try {
    authResponse = await startAuthentication({
      optionsJSON,
      useBrowserAutofill: opts?.useAutofill ?? false,
    });
  } catch {
    // User cancelled, no matching credential, or an aborted autofill request.
    return null;
  }

  const finishResp = (await rawGraphQL(
    `mutation FinishPasskeyLogin($challengeId: String!, $credentialJson: String!) {
      finishPasskeyLogin(challengeId: $challengeId, credentialJson: $credentialJson)
    }`,
    {
      challengeId: challenge.challengeId,
      credentialJson: JSON.stringify(authResponse),
    },
  )) as { data?: { finishPasskeyLogin?: string | null } };

  const token = finishResp?.data?.finishPasskeyLogin ?? null;
  if (token) {
    sessionStorage.setItem(PASSKEY_LOGIN_FLAG, "1");
  }
  return token;
}
