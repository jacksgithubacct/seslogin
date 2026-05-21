import { NavLink } from "react-router";

interface MenuBarProps {
  onLogout: () => void;
  isSuper: boolean;
}

export default function MenuBar({ onLogout, isSuper }: MenuBarProps) {
  return (
    <div id="menu_bar">
      <NavLink to="/admin" end>
        Home
      </NavLink>
      <NavLink to="/admin/members">Members</NavLink>
      <NavLink to="/admin/activity">Activity</NavLink>
      <NavLink to="/admin/reports">Reports</NavLink>
      <NavLink to="/admin/sessions">Kiosks</NavLink>
      <NavLink to="/admin/settings">Settings</NavLink>
      {isSuper && <NavLink to="/admin/locations">Locations</NavLink>}
      {isSuper && <NavLink to="/admin/users">Users</NavLink>}
      {isSuper && <NavLink to="/admin/categories">Categories</NavLink>}
      <button className="link-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
