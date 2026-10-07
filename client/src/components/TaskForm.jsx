import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  subject: "",
  deadline: "",
  priority: "medium",
  notes: ""
};

export default function TaskForm({ onSubmit, isSaving, mobileOpen, onClose, draft, onDraftUsed }) {
  // A controlled form keeps every field value inside React state.
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!draft) return;
    setForm({ ...initialForm, ...draft });
    setErrors({});
    onDraftUsed?.();
  }, [draft, onDraftUsed]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // Validate required fields before sending anything to the server.
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Please enter a task title.";
    if (!form.subject) nextErrors.subject = "Please select a subject.";
    if (!form.deadline) nextErrors.deadline = "Please choose a deadline.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const wasSaved = await onSubmit(form);
    if (wasSaved) {
      setForm(initialForm);
      setErrors({});
      onClose();
    }
  }

  return (
    <aside className={`task-form-panel ${mobileOpen ? "is-open" : ""}`} aria-label="Add a study task">
      <button className="close-form" type="button" onClick={onClose} aria-label="Close task form">
        <X />
      </button>
      <h2>Add a study task</h2>
      <p>Create a new task and keep on track.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Task title</label>
        <input
          className={errors.title ? "invalid" : ""}
          id="title"
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="e.g. Read chapter 5"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}

        <label htmlFor="subject">Subject</label>
        <select
          className={errors.subject ? "invalid" : ""}
          id="subject"
          name="subject"
          value={form.subject}
          onChange={updateField}
        >
          <option value="">Select a subject</option>
          <option>Web Development</option>
          <option>Software Engineering</option>
          <option>Databases</option>
          <option>Code Lab</option>
          <option>Other</option>
        </select>
        {errors.subject && <span className="field-error">{errors.subject}</span>}

        <label htmlFor="deadline">Deadline</label>
        <input
          className={errors.deadline ? "invalid" : ""}
          id="deadline"
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={updateField}
        />
        {errors.deadline && <span className="field-error">{errors.deadline}</span>}

        <fieldset>
          <legend>Priority</legend>
          <div className="priority-options">
            {[
              ["low", "Low"],
              ["medium", "Medium"],
              ["high", "High"]
            ].map(([value, label]) => (
              <label className={`priority-choice ${value}`} key={value}>
                <input
                  type="radio"
                  name="priority"
                  value={value}
                  checked={form.priority === value}
                  onChange={updateField}
                />
                <span className="priority-dot" />{label}
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="notes">Notes <span className="optional">(optional)</span></label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={updateField}
          rows="3"
          placeholder="Add a short description"
        />

        <button className="primary-button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Add task"}
        </button>
      </form>
    </aside>
  );
}
