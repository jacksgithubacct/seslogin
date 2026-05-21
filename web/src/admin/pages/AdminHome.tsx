import { useUserInfo } from "../components/useUserInfo";
import ClearLocationButton from "../components/ClearLocationButton";
import DevOnly from "../components/DevOnly";

export default function AdminHome() {
  const userInfo = useUserInfo();

  return (
    <div>
      <p>
        Welcome the unit dashboard. Use this section of the website to
        administer your unit and monitor it's activity.
      </p>

      <DevOnly>
        <ClearLocationButton />
        <p>User info</p>
        <pre style={{ textAlign: "left" }}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </DevOnly>
    </div>
  );
}
