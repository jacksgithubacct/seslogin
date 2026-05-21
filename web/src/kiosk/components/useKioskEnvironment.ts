import { useContext } from "react";
import { KioskEnvironmentContext } from "./KioskEnvironmentContext";

export default function useKioskEnvironment() {
  const context = useContext(KioskEnvironmentContext);
  if (context == null) {
    throw new Error("useKioskEnvironment must be used within KioskEnvironment");
  }
  return context;
}
