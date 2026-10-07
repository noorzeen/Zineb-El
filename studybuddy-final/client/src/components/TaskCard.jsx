import { CalendarDays, Trash2 } from "lucide-react";

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateValue}T00:00:00`));
}

export default function TaskCard({ task, onToggle, onDelete, disabled }) {
  return (
    <article className={`task-card ${task.completed ? "completed" : ""}`}>
      <button
        className="check-button"
        type="button"
        aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        aria-pressed={task.completed}
        onClick={() => onToggle(task)}
        disabled={disabled}
      >
        {task.completed && "✓"}
      </button>

      <div className="task-main">
        <h3>{task.title}</h3>
        <span className="subject-tag">{task.subject}</span>
        {task.notes && <p>{task.notes}</p>}
      </div>

      <div className="task-date"><CalendarDays /> {formatDate(task.deadline)}</div>
      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>

      <button
        className="delete-button"
        type="button"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task)}
        disabled={disabled}
      >
        <Trash2 />
      </button>
    </article>
  );
}

