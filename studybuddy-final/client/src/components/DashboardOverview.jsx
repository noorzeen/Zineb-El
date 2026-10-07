import { AlertCircle, ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3, ListTodo, Sparkles } from "lucide-react";

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })
    .format(new Date(`${dateValue}T00:00:00`));
}

export default function DashboardOverview({ tasks, onNavigate, user }) {
  // Dashboard values are calculated from the same task data used by My Tasks.
  const completed = tasks.filter((task) => task.completed).length;
  const todo = tasks.length - completed;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = tasks.filter((task) => !task.completed && task.deadline < today).length;
  const upcoming = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <section className="overview-page">
      <div className="welcome-banner">
        <div>
          <span className="welcome-label"><Sparkles /> Your study space</span>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Your private study dashboard brings deadlines, progress and useful resources together in one clear place.</p>
          <button onClick={() => onNavigate("tasks")}>View my tasks <ArrowRight /></button>
        </div>
        <figure className="hero-photo"><img src="/images/coding-mentor.png" alt="Student learning web development with a mentor" /><figcaption>Learn · Plan · Progress</figcaption></figure>
      </div>

      <div className="stat-grid">
        <article className="stat-card purple"><span><ListTodo /></span><div><strong>{tasks.length}</strong><small>Total tasks</small></div></article>
        <article className="stat-card blue"><span><Clock3 /></span><div><strong>{todo}</strong><small>Still to do</small></div></article>
        <article className="stat-card green"><span><CheckCircle2 /></span><div><strong>{completed}</strong><small>Completed</small></div></article>
        <article className="stat-card coral"><span><AlertCircle /></span><div><strong>{overdue}</strong><small>Overdue</small></div></article>
      </div>

      <div className="overview-grid">
        <article className="overview-card weekly-card">
          <div className="section-heading"><div><span>Weekly progress</span><h2>Keep your momentum</h2></div><strong>{percentage}%</strong></div>
          <div className="large-progress"><span style={{ width: `${percentage}%` }} /></div>
          <p>You have completed {completed} of {tasks.length} study tasks.</p>
          <div className="mini-chart" aria-label="Decorative weekly progress chart">
            {[35, 52, 43, 68, percentage || 10, 48, 28].map((height, index) => <span key={index} style={{ height: `${Math.max(height, 10)}%` }} />)}
          </div>
          <div className="chart-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
        </article>

        <article className="overview-card upcoming-card">
          <div className="section-heading"><div><span>Your schedule</span><h2>Upcoming deadlines</h2></div><CalendarDays /></div>
          {upcoming.length === 0 ? <p className="calm-message">Nothing urgent—your list is clear.</p> : upcoming.map((task) => (
            <div className="deadline-row" key={task.id}>
              <div className={`date-tile ${task.priority}`}><strong>{formatDate(task.deadline).split(" ")[0]}</strong><small>{formatDate(task.deadline).split(" ")[1]}</small></div>
              <div><strong>{task.title}</strong><small>{task.subject}</small></div>
              <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
