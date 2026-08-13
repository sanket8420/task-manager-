import { useState } from "react";
import { formatDueDate, PRIORITY_LABEL } from "../utils.js";

const RAIL_COLORS = { low: "var(--low)", medium: "var(--medium)", high: "var(--high)" };

export default function TaskItem({ task, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.slice(0, 10) : "");
  const [saving, setSaving] = useState(false);

  const due = formatDueDate(task.due_date);

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "medium");
    setDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <li
      className={`task-card ${task.is_completed ? "completed" : ""}`}
      style={{ "--rail-color": RAIL_COLORS[task.priority] || "var(--border)" }}
    >
      <div className="task-main">
        <input
          type="checkbox"
          className="task-check"
          checked={task.is_completed}
          onChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" ${task.is_completed ? "active" : "complete"}`}
        />
        <div className="task-body">
          <div className="task-title-row">
            <span className="task-title">{task.title}</span>
          </div>
          {task.description && !editing && <p className="task-desc">{task.description}</p>}
          {!editing && (
            <div className="task-meta">
              <span className={`badge priority-${task.priority}`}>
                <span className="led" />
                {PRIORITY_LABEL[task.priority] || "Medium"}
              </span>
              {due && (
                <span className={`badge ${due.overdue ? "overdue" : ""}`}>{due.label}</span>
              )}
            </div>
          )}
        </div>
        <div className="task-actions">
          {!editing && !confirmingDelete && (
            <>
              <button onClick={startEdit} title="Edit task" aria-label="Edit task">
                ✎
              </button>
              <button
                onClick={() => setConfirmingDelete(true)}
                title="Delete task"
                aria-label="Delete task"
              >
                🗑
              </button>
            </>
          )}
          {confirmingDelete && (
            <>
              <button className="confirm-delete" onClick={() => onDelete(task.id)}>
                Delete?
              </button>
              <button onClick={() => setConfirmingDelete(false)} aria-label="Cancel delete">
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="edit-panel">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <div className="edit-row">
            <div className="priority-picker">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className="priority-chip"
                  data-active={priority === p}
                  style={{ "--chip-color": RAIL_COLORS[p] }}
                  onClick={() => setPriority(p)}
                >
                  <span className="led" />
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="edit-actions">
            <button className="btn btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
