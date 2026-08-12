import axios from "axios";

// In Docker/production, nginx proxies /api to the backend container.
// In local `vite dev`, vite.config.js proxies /api to localhost:8000.
const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
