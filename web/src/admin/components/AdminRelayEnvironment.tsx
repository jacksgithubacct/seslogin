import { RelayEnvironmentProvider } from "react-relay";
import { Suspense, useCallback, useMemo, type ReactNode } from "react";
import { createAdminGraphQLEnvironment } from "../../lib/environments";
import LoadingIndicator from "../../components/LoadingIndicator";
import { getAdminToken } from "../../lib/adminToken";

/**
 * Relay environment provider for admin routes.
 * Uses the stored opaque seslogin token; if there's none, the request fails
 * and the caller (onTokenError) sends the user back to the login page.
 */
export default function AdminRelayEnvironment({
  onUnauthorized,
  onTokenError,
  children,
}: {
  onUnauthorized: () => void;
  onTokenError: () => void;
  children: ReactNode;
}) {
  const getToken = useCallback(async () => {
    const stored = getAdminToken();
    if (!stored) throw new Error("No seslogin token");
    return stored;
  }, []);

  // Pass getToken directly so it's called lazily per-request.
  // This keeps the Environment object stable across renders, preserving the
  // Relay store and preventing the Suspense remount loop.
  const environment = useMemo(() => {
    return createAdminGraphQLEnvironment(
      getToken,
      onTokenError,
      onUnauthorized,
    );
  }, [getToken, onTokenError, onUnauthorized]);

  // The Suspense boundary must be INSIDE RelayEnvironmentProvider so that when
  // UserInfoProvider suspends, this component (and its Environment) stays
  // mounted. If Suspense were above this component, every suspension would
  // unmount the Environment and wipe the Relay store, restarting the loop.
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>
    </RelayEnvironmentProvider>
  );
}
