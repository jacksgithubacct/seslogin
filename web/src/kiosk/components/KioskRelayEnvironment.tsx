import { RelayEnvironmentProvider } from "react-relay";
import { useMemo, type ReactNode } from "react";
import { createKioskGraphQLEnvironment } from "../../lib/environments";

/**
 * Relay environment provider for kiosk routes
 * Provides a Relay environment with access to the scan auth token from settings
 */
export default function KioskRelayEnvironment({
  getToken,
  onUnauthorized,
  children,
}: {
  getToken: () => string | null;
  onUnauthorized: () => void;
  children: ReactNode;
}) {
  const environment = useMemo(() => {
    return createKioskGraphQLEnvironment(getToken, () => {
      onUnauthorized();
    });
  }, [getToken, onUnauthorized]);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
