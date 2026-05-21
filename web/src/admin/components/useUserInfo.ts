import { useContext } from "react";
import { UserInfoContext, type LoadedUserInfoType } from "./UserInfoContext";

let pendingUserInfoPromise: Promise<void> | null = null;
let resolvePendingUserInfoPromise: (() => void) | null = null;

function getPendingUserInfoPromise() {
  if (pendingUserInfoPromise == null) {
    pendingUserInfoPromise = new Promise<void>((resolve) => {
      resolvePendingUserInfoPromise = resolve;
    });
  }

  return pendingUserInfoPromise;
}

function resolvePendingUserInfo() {
  if (resolvePendingUserInfoPromise != null) {
    resolvePendingUserInfoPromise();
  }
  pendingUserInfoPromise = null;
  resolvePendingUserInfoPromise = null;
}

/**
 * Hook to access user info from UserInfoProvider
 * Must be used within a component wrapped by UserInfoProvider
 */
export function useUserInfo(): LoadedUserInfoType {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }

  if (!context.isLoaded) {
    throw getPendingUserInfoPromise();
  }

  resolvePendingUserInfo();

  if (context.user == null) {
    throw new Error("User info is loaded but no user is available");
  }

  return context.user;
}
