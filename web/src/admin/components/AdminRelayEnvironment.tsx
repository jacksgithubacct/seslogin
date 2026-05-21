import { RelayEnvironmentProvider } from "react-relay";
import { useAuth0 } from "@auth0/auth0-react";
import { Suspense, useMemo, type ReactNode } from "react";
import { createAdminGraphQLEnvironment } from "../../lib/environments";
import LoadingIndicator from "../../components/LoadingIndicator";

/**
 * Relay environment provider for admin routes
 * Provides a Relay environment with direct access to Auth0 tokens
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
  const { getAccessTokenSilently } = useAuth0();

  // Pass getAccessTokenSilently directly so it's called lazily per-request.
  // This keeps the Environment object stable across renders, preserving the
  // Relay store and preventing the Suspense remount loop.
  const environment = useMemo(() => {
    return createAdminGraphQLEnvironment(
      getAccessTokenSilently,
      onTokenError,
      onUnauthorized,
    );
  }, [getAccessTokenSilently, onTokenError, onUnauthorized]);

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
