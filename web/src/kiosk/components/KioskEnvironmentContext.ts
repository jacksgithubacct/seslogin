import { createContext } from "react";

export type KioskEnvironmentContextType = {
  setToken: (token: string) => void;
};

export const KioskEnvironmentContext = createContext<
  KioskEnvironmentContextType | undefined
>(undefined);
