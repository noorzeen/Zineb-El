import { Bell, Clock3, Eye, LogOut, Moon, Palette, Settings2, ShieldCheck, Type } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage({ compact, setCompact, theme, setTheme, user, onLogout }) {
  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const [reminders, setReminders] = useState(() => localStorage.getItem("studybuddy-reminders") !== "off");
  const [dailyGoal, setDailyGoal] = useState(() => localStorage.getItem("studybuddy-goal") || "30");
  const [comfortableText, setComfortableText] = useState(() => localStorage.getItem("studybuddy-large-text") === "on");

  useEffect(() => { localStorage.setItem("studybuddy-reminders", reminders ? "on" : "off"); }, [reminders]);
  useEffect(() => { localStorage.setItem("studybuddy-goal", dailyGoal); }, [dailyGoal]);
  useEffect(() => {
    localStorage.setItem("studybuddy-large-text", comfortableText ? "on" : "off");
    document.documentElement.classList.toggle("comfortable-text", comfortableText);
  }, [comfortableText]);
  return (
    <section className="content-page settings-page">
      <div className="page-title"><span><Settings2 /></span><div><p>Personalise StudyBuddy</p><h1>Settings</h1><small>Choose how your study space looks and feels.</small></div></div>
      <div className="settings-grid">
        <article className="settings-profile"><div className="large-avatar">{initials}</div><h2>{user.name}</h2><p>{user.course}</p><span><ShieldCheck /> Private account</span><small>{user.email}</small><button className="profile-logout" onClick={onLogout}><LogOut /> Log out</button></article>
        <div className="settings-list">
          <article><span className="setting-icon"><Palette /></span><div><h2>Appearance</h2><p>Choose a light or calm dark theme.</p></div><button className="choice-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}><Moon /> {theme === "light" ? "Use dark" : "Use light"}</button></article>
          <article><span className="setting-icon"><Bell /></span><div><h2>Compact task cards</h2><p>Show a shorter task list when you need more space.</p></div><label className="switch"><input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} /><span /></label></article>
          <article><span className="setting-icon mint"><Bell /></span><div><h2>Study reminders</h2><p>Keep deadline reminders enabled for your study routine.</p></div><label className="switch"><input type="checkbox" checked={reminders} onChange={(event) => setReminders(event.target.checked)} /><span /></label></article>
          <article><span className="setting-icon orange"><Clock3 /></span><div><h2>Daily study goal</h2><p>Choose the number of focused minutes you want each day.</p></div><select className="settings-select" value={dailyGoal} onChange={(event) => setDailyGoal(event.target.value)}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></article>
          <article><span className="setting-icon blue"><Type /></span><div><h2>Comfortable text</h2><p>Increase text size across the application for easier reading.</p></div><label className="switch"><input type="checkbox" checked={comfortableText} onChange={(event) => setComfortableText(event.target.checked)} /><span /></label></article>
          <article className="privacy-setting"><span className="setting-icon green"><Eye /></span><div><h2>Privacy protection</h2><p>Your account and tasks are private. Protected Express routes return only records that belong to you.</p></div><span className="protected-badge"><ShieldCheck /> Protected</span></article>
        </div>
      </div>
    </section>
  );
}
