import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, House, Plus, Search, Settings2, SlidersHorizontal, ListTodo } from "lucide-react";
import AuthPage from "./components/AuthPage.jsx";
import Header from "./components/Header.jsx";
import ProgressSummary from "./components/ProgressSummary.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskCard from "./components/TaskCard.jsx";
import DashboardOverview from "./components/DashboardOverview.jsx";
import ResourcesPage from "./components/ResourcesPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";

const filters = [
  { value: "all", label: "All" },
  { value: "todo", label: "To do" },
  { value: "completed", label: "Completed" }
];

export default function App() {
  // Authentication state controls access to every private StudyBuddy screen.
  const [token, setToken] = useState(() => localStorage.getItem("studybuddy-token") || "");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(token));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [compact, setCompact] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("studybuddy-theme") || "light");
  const [taskDraft, setTaskDraft] = useState(null);

  useEffect(() => {
    localStorage.setItem("studybuddy-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setAuthLoading(false);
      setLoading(false);
      return;
    }

    // Restore the private session, then load only this student's tasks.
    request("/api/auth/me", {}, token)
      .then((account) => {
        setUser(account);
        return loadTasks(token);
      })
      .catch(() => clearSession())
      .finally(() => setAuthLoading(false));
  }, [token]);

  // Reusable helper attaches the login token to protected Express requests.
  async function request(url, options = {}, activeToken = token) {
    const headers = { ...(options.headers || {}) };
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`;
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Something went wrong.");
    }
    return response.status === 204 ? null : response.json();
  }

  async function handleAuthentication(mode, details) {
    const result = await request(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details)
    }, "");
    localStorage.setItem("studybuddy-token", result.token);
    setToken(result.token);
    setUser(result.user);
    showMessage(mode === "register" ? "Your private account is ready." : `Welcome back, ${result.user.name.split(" ")[0]}!`);
  }

  function clearSession() {
    localStorage.removeItem("studybuddy-token");
    setToken("");
    setUser(null);
    setTasks([]);
  }

  async function logout() {
    try { await request("/api/auth/logout", { method: "POST" }); } catch { /* Clear locally even if server is unavailable. */ }
    clearSession();
  }

  async function loadTasks(activeToken = token) {
    setLoading(true);
    try {
      setTasks(await request("/api/tasks", {}, activeToken));
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text, type = "success") {
    setMessage(text);
    setMessageType(type);
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => setMessage(""), 3500);
  }

  async function addTask(formData) {
    setBusy(true);
    try {
      const newTask = await request("/api/tasks", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)
      });
      setTasks((current) => [...current, newTask]);
      showMessage("Task added successfully.");
      return true;
    } catch (error) {
      showMessage(error.message, "error");
      return false;
    } finally { setBusy(false); }
  }

  async function toggleTask(task) {
    setBusy(true);
    try {
      const updatedTask = await request(`/api/tasks/${task.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: !task.completed })
      });
      setTasks((current) => current.map((item) => item.id === task.id ? updatedTask : item));
      showMessage(updatedTask.completed ? "Task completed. Well done!" : "Task moved back to your list.");
    } catch (error) { showMessage(error.message, "error"); }
    finally { setBusy(false); }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    setBusy(true);
    try {
      await request(`/api/tasks/${task.id}`, { method: "DELETE" });
      setTasks((current) => current.filter((item) => item.id !== task.id));
      showMessage("Task deleted.");
    } catch (error) { showMessage(error.message, "error"); }
    finally { setBusy(false); }
  }

  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length
  }), [tasks]);

  // Filter, search and sort without changing the original task array.
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === "todo") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    }).filter((task) => `${task.title} ${task.subject}`.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") return ({ high: 0, medium: 1, low: 2 })[a.priority] - ({ high: 0, medium: 1, low: 2 })[b.priority];
      return a.deadline.localeCompare(b.deadline);
    });
  }, [tasks, filter, sortBy, search]);

  function navigate(nextPage) {
    setPage(nextPage);
    window.location.hash = nextPage;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function planLesson(lessonDraft) {
    setTaskDraft({ ...lessonDraft, deadline: "", priority: "medium" });
    setPage("tasks");
    setFormOpen(true);
    window.location.hash = "tasks";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (authLoading) return <div className="app-loading">Checking your secure session…</div>;
  if (!user) return <AuthPage onAuthenticate={handleAuthentication} />;

  return (
    <div className={`app-shell theme-${theme}`} id="dashboard">
      <Header page={page} onNavigate={navigate} user={user} onLogout={logout} />
      <main className={page === "tasks" ? "dashboard-layout" : "page-layout"}>
        {page === "dashboard" && <DashboardOverview tasks={tasks} onNavigate={navigate} user={user} />}
        {page === "resources" && <ResourcesPage onNavigate={navigate} onPlanLesson={planLesson} />}
        {page === "settings" && <SettingsPage compact={compact} setCompact={setCompact} theme={theme} setTheme={setTheme} user={user} onLogout={logout} />}

        {page === "tasks" && <>
          <TaskForm onSubmit={addTask} isSaving={busy} mobileOpen={formOpen} onClose={() => setFormOpen(false)} draft={taskDraft} onDraftUsed={() => setTaskDraft(null)} />
          {formOpen && <button className="page-overlay" type="button" onClick={() => setFormOpen(false)} aria-label="Close form" />}
          <section className="dashboard-main" id="tasks">
            <div className="tasks-hero">
              <img src="/images/web-development.png" alt="" />
              <div><span>Focused study planning</span><h1>Turn each chapter into an achievable task.</h1><p>Choose a subject, set a deadline and track your progress in one private place.</p></div>
            </div>
            <ProgressSummary completed={counts.completed} total={counts.all} />
            <button className="mobile-add-button" type="button" onClick={() => setFormOpen(true)}><Plus /> Add task</button>
            <div className={`task-list-panel ${compact ? "compact" : ""}`}>
              <div className="task-toolbar">
                <div className="filters" aria-label="Filter tasks">
                  {filters.map((item) => <button className={filter === item.value ? "active" : ""} type="button" key={item.value} onClick={() => setFilter(item.value)}>{item.label} ({counts[item.value]})</button>)}
                </div>
                <label className="task-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your tasks" /></label>
                <label className="sort-control"><SlidersHorizontal /><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="deadline">Deadline</option><option value="priority">Priority</option></select></label>
              </div>
              {loading ? <div className="empty-state">Loading your private tasks…</div> : visibleTasks.length === 0 ? <div className="empty-state"><h2>No tasks here</h2><p>Add a study task or choose a different filter.</p></div> : <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} disabled={busy} />)}</div>}
            </div>
          </section>
        </>}
      </main>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button className={page === "dashboard" ? "active" : ""} onClick={() => navigate("dashboard")}><House /><span>Home</span></button>
        <button className={page === "tasks" ? "active" : ""} onClick={() => navigate("tasks")}><ListTodo /><span>Tasks</span></button>
        <button className={page === "resources" ? "active" : ""} onClick={() => navigate("resources")}><BookOpenCheck /><span>Resources</span></button>
        <button className={page === "settings" ? "active" : ""} onClick={() => navigate("settings")}><Settings2 /><span>Settings</span></button>
      </nav>
      {message && <div className={`toast ${messageType}`} role="status">{message}</div>}
    </div>
  );
}
