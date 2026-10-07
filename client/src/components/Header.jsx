import { GraduationCap, LogOut } from "lucide-react";

export default function Header({ page, onNavigate, user, onLogout }) {
  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-icon" aria-hidden="true"><GraduationCap /></span>
        <span>
          <strong>StudyBuddy</strong>
          <small>Plan smarter. Study better.</small>
        </span>
      </div>

      <nav className="desktop-nav" aria-label="Main navigation">
        <button className={page === "dashboard" ? "active" : ""} onClick={() => onNavigate("dashboard")}>Dashboard</button>
        <button className={page === "tasks" ? "active" : ""} onClick={() => onNavigate("tasks")}>My Tasks</button>
        <button className={page === "resources" ? "active" : ""} onClick={() => onNavigate("resources")}>Resources</button>
        <button className={page === "settings" ? "active" : ""} onClick={() => onNavigate("settings")}>Settings</button>
        <span className="avatar" aria-label="User initials">{initials}</span>
        <button className="logout-button" onClick={onLogout}><LogOut /> Log out</button>
      </nav>
      <div className="mobile-account"><span className="avatar">{initials}</span><button onClick={onLogout} aria-label="Log out"><LogOut /></button></div>
    </header>
  );
}
