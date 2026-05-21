import { type ReactNode, useEffect } from "react";
import { useLazyLoadQuery, useRelayEnvironment } from "react-relay";
import { fetchQuery, graphql } from "relay-runtime";
import type { UserInfoProviderQuery } from "./__generated__/UserInfoProviderQuery.graphql";
import { UserInfoContext } from "./UserInfoContext";

export { UserInfoContext, type UserInfoContextType } from "./UserInfoContext";

const USER_INFO_RELOAD_INTERVAL_MS = 2 * 60 * 1000;

const userInfoQuery = graphql`
  query UserInfoProviderQuery {
    user {
      id
      email
      isSuper
      isDev
      locations {
        id
        name
        enabled
      }
    }
  }
`;

/**
 * Provider component that fetches and provides basic user info via GraphQL
 * Wraps children and makes user data available via useUserInfo() hook
 * Must be wrapped by a Relay Suspense boundary for loading states
 */
export function UserInfoProvider({ children }: { children: ReactNode }) {
  const environment = useRelayEnvironment();

  useEffect(() => {
    let currentSubscription: { unsubscribe: () => void } | undefined;

    const refreshUserInfo = () => {
      currentSubscription?.unsubscribe();
      currentSubscription = fetchQuery<UserInfoProviderQuery>(
        environment,
        userInfoQuery,
        {},
        {
          // Periodically force a network refresh so we verify the user's auth token is still valid.
          fetchPolicy: "network-only",
        },
      ).subscribe({
        next: () => undefined,
        complete: () => undefined,
        error: () => undefined,
      });
    };

    const intervalId = window.setInterval(() => {
      refreshUserInfo();
    }, USER_INFO_RELOAD_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      currentSubscription?.unsubscribe();
    };
  }, [environment]);

  const data = useLazyLoadQuery<UserInfoProviderQuery>(
    userInfoQuery,
    {},
    {
      fetchPolicy: "store-or-network",
    },
  );
  const contextValue = { user: data.user, isLoaded: true };

  return (
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  );
}
