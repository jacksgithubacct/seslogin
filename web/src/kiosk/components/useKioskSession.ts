import { useContext } from "react";
import {
  KioskSessionContext,
  type KioskSessionContextType,
} from "./KioskSessionContext";

/**
 * Hook to access kiosk session info from KioskSessionProvider.
 * Must be used within a component wrapped by KioskSessionProvider.
 */
export function useKioskSession(): KioskSessionContextType["session"] | null {
  const context = useContext(KioskSessionContext);
  if (context === undefined) {
    throw new Error(
      "useKioskSession must be used within a KioskSessionProvider",
    );
  }
  return context?.session;
}
