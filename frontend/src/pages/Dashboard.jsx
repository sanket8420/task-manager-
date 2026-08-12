import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Failed to load tasks");
      }
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/tasks/", { title });
      setTitle("");
      loadTasks();
    } catch {
      setError("Failed to add task");
    }
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="topbar">
        <h1>My Tasks</h1>
        <button className="secondary" onClick={handleLogout}>Log out</button>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="task-form" onSubmit={handleAdd}>
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.is_completed ? "completed" : ""}`}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleComplete(task)}
              />
              <span className="title">{task.title}</span>
            </label>
            <div className="actions">
              <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p>No tasks yet — add one above.</p>}
    </div>
  );
}
