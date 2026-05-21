import { useKioskSession } from "./useKioskSession";
import logoWhite from "../../assets/logo-white.svg";

export default function ScanTitleBar(props: {
  onCancelSignOut?: () => void;
  signingOutName?: string;
}) {
  const session = useKioskSession();
  const locationName = session?.location.name ?? "Unknown location";
  const sessionName = session?.name ?? "Unknown kiosk";
  const title = props.signingOutName
    ? `${locationName} > ${sessionName} > ${props.signingOutName}`
    : `${locationName} > ${sessionName}`;

  return (
    <div id="title_bar">
      <span>{title}</span>
      <a href="/">
        <img src={logoWhite} alt="" />
      </a>
      {props.onCancelSignOut && (
        <button className="cancel" onClick={props.onCancelSignOut}>
          Cancel sign out
        </button>
      )}
    </div>
  );
}
