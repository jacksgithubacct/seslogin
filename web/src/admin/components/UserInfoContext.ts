import { createContext } from "react";
import type { UserInfoProviderQuery$data } from "./__generated__/UserInfoProviderQuery.graphql";

export interface UserInfoContextType {
  user: UserInfoProviderQuery$data["user"] | null;
  isLoaded: boolean;
}

export type LoadedUserInfoType = NonNullable<UserInfoContextType["user"]>;

export const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined,
);
