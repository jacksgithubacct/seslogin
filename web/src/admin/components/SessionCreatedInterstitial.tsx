import { Link } from "react-router";

type SessionCreatedInterstitialProps = {
  code: string;
};

export default function SessionCreatedInterstitial({
  code,
}: SessionCreatedInterstitialProps) {
  return (
    <div className="session-created-interstitial">
      <p>
        Your kiosk session has been created and can now be assigned to a
        computer.
      </p>
      <p>
        Please enter the following code on your kiosk computer by accessing the{" "}
        <b>SES Activity</b> (seslogin.com) system and selecting the <b>Kiosk</b>{" "}
        module.
      </p>

      <p className="session-created-code">{code || "Unavailable"}</p>

      <p className="session-created-actions">
        <Link to="/admin/sessions" className="button">
          Continue
        </Link>
      </p>
    </div>
  );
}
