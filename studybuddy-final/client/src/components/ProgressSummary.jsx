import { CircleCheck } from "lucide-react";

export default function ProgressSummary({ completed, total }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="progress-card" aria-labelledby="progress-title">
      <div
        className="progress-ring"
        style={{ "--progress": `${percentage * 3.6}deg` }}
        aria-hidden="true"
      >
        <span>{percentage}%</span>
      </div>

      <div className="progress-copy">
        <span className="eyebrow">Progress</span>
        <h1 id="progress-title">{completed} of {total} tasks completed</h1>
        <p>{total === 0 ? "Add your first task to begin." : "You're making great progress!"}</p>
        <div className="mobile-progress-bar" aria-hidden="true">
          <span style={{ width: `${percentage}%` }} />
        </div>
      </div>

      <div className="encouragement">
        <CircleCheck />
        <span><strong>Keep going!</strong><small>Consistency builds success.</small></span>
      </div>
    </section>
  );
}

