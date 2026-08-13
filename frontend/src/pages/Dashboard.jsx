import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import TaskItem from "../components/TaskItem.jsx";
import { useToast } from "../components/ToastContext.jsx";
import { PRIORITY_ORDER } from "../utils.js";

const RAIL_COLORS = { low: "var(--low)", medium: "var(--medium)", high: "var(--high)" };

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [sortBy, setSortBy] = useState("created"); // created | due | priority
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        showToast("Couldn't load tasks", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    try {
      await api.post("/tasks/", {
        title: title.trim(),
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTitle("");
      setPriority("medium");
      setDueDate("");
      showToast("Task added");
      loadTasks();
    } catch {
      showToast("Couldn't add task", "error");
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_completed: !t.is_completed } : t))
    );
    try {
      await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
    } catch {
      showToast("Couldn't update task", "error");
      loadTasks();
    }
  };

  const saveTask = async (id, patch) => {
    try {
      await api.put(`/tasks/${id}`, patch);
      showToast("Task updated");
      loadTasks();
    } catch {
      showToast("Couldn't save changes", "error");
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
      showToast("Task deleted");
    } catch {
      showToast("Couldn't delete task", "error");
      loadTasks();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (filter === "active") list = list.filter((t) => !t.is_completed);
    if (filter === "completed") list = list.filter((t) => t.is_completed);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sortBy === "priority") {
      sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1));
    } else if (sortBy === "due") {
      sorted.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  }, [tasks, filter, search, sortBy]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <h1 className="app-title">My Tasks</h1>
          <div className="stat-line">
            <span><b>{total}</b> total</span>
            <span className="dot">·</span>
            <span><b>{pending}</b> pending</span>
            <span className="dot">·</span>
            <span><b>{completed}</b> done</span>
          </div>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {total > 0 && (
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      )}

      <form className="composer" onSubmit={handleAdd}>
        <div className="composer-row">
          <input
            type="text"
            placeholder="Add a task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due date"
          />
        </div>
        <div className="composer-row" style={{ marginTop: 8, alignItems: "center" }}>
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
                {p[0].toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding || !title.trim()}>
            {adding ? "Adding…" : "Add task"}
          </button>
        </div>
      </form>

      <div className="toolbar">
        <input
          type="text"
          className="search-box"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="created">Newest first</option>
          <option value="due">By due date</option>
          <option value="priority">By priority</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">{total === 0 ? "( )" : "∅"}</div>
          <p>
            {total === 0
              ? "No tasks yet — add your first one above."
              : "Nothing matches your filters."}
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleComplete}
              onDelete={deleteTask}
              onSave={saveTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
