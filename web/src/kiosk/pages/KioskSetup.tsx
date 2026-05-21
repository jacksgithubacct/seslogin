import { RelayEnvironmentProvider } from "react-relay";
import { unauthenticatedEnvironment } from "../../lib/environments";
import KioskSetupForm from "../components/KioskSetupForm";

export default function KioskSetup() {
  return (
    <RelayEnvironmentProvider environment={unauthenticatedEnvironment}>
      <KioskSetupForm />
    </RelayEnvironmentProvider>
  );
}
