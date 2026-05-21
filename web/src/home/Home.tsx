import { Link } from "react-router";
import logo from "../assets/logo.svg";

export default function Home() {
  return (
    <div id="content">
      <div id="home">
        <img className="logo" src={logo} />

        <p className="intro">Welcome, please choose an option to continue...</p>

        <ul>
          <li>
            <Link to="/kiosk">
              <span className="title">Kiosk</span>
              <img src="/image/home-icons/scan.png" alt="Kiosk" />
              <p className="description">
                Allow members to sign in and out using this computer
              </p>
            </Link>
          </li>

          <li>
            <Link to="/admin" className="bottom">
              <span className="title">Admin</span>
              <img src="/image/home-icons/dash.png" alt="Admin" />
              <p className="description">
                Use the administrator dashboard to administer your unit, create
                reports and view activity
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
