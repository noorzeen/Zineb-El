import { useState } from "react";
import { ArrowRight, BookOpenCheck, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AuthPage({ onAuthenticate }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "zineb@example.com", password: "StudyBuddy2026!" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try { await onAuthenticate(mode, form); }
    catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <img src="/images/web-development.png" alt="Digital web-development interface" />
        <div className="auth-overlay" />
        <div className="auth-story-content">
          <div className="auth-brand"><BookOpenCheck /><span><strong>StudyBuddy</strong><small>Plan smarter. Study better.</small></span></div>
          <span className="auth-kicker"><ShieldCheck /> Private study planning</span>
          <h1>Your studies.<br />Your progress.<br /><em>Your space.</em></h1>
          <p>Organise deadlines, protect your personal task list and build consistent study habits from any device.</p>
          <div className="auth-benefits"><span><CheckCircle2 /> Private account</span><span><CheckCircle2 /> Saved tasks</span><span><CheckCircle2 /> Responsive design</span></div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <span className="form-icon"><LockKeyhole /></span>
          <p className="eyebrow">Secure student access</p>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="auth-intro">{mode === "login" ? "Log in to view your private tasks and progress." : "Register to start your own private study planner."}</p>

          <div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Log in</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button></div>
          <form onSubmit={submit}>
            {mode === "register" && <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your full name" required /></label>}
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="student@example.com" required /></label>
            <label>Password<span className="password-input"><input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} minLength="8" required /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label="Show or hide password">{showPassword ? <EyeOff /> : <Eye />}</button></span></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in securely" : "Create private account"}<ArrowRight /></button>
          </form>
          {mode === "login" && <div className="demo-login"><strong>Demonstration account</strong><span>Email: zineb@example.com</span><span>Password: StudyBuddy2026!</span></div>}
          <p className="privacy-note"><ShieldCheck /> Your tasks are requested from Express only after authentication.</p>
        </div>
      </section>
    </main>
  );
}
