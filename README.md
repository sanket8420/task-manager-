# Task Manager — Full-Stack App (React + FastAPI + PostgreSQL)

A three-tier task management application with JWT authentication, built to
demonstrate containerized full-stack development and CI/CD with GitLab.

## Architecture

```
┌─────────────┐      /api/*       ┌─────────────┐      SQL      ┌──────────────┐
│   React     │ ───────────────►  │   FastAPI   │ ─────────────► │  PostgreSQL  │
│  (nginx)    │ ◄───────────────  │  (uvicorn)  │ ◄───────────── │              │
│  port 80    │      JSON         │  port 8000  │                │  port 5432   │
└─────────────┘                   └─────────────┘                └──────────────┘
```

- **Frontend**: React (Vite), served as a static build by nginx in production.
  nginx also reverse-proxies `/api/*` to the backend container so the browser
  only ever talks to one origin.
- **Backend**: FastAPI, SQLAlchemy ORM, JWT auth (python-jose + passlib/bcrypt).
- **Database**: PostgreSQL, schema created via SQLAlchemy models on startup.
- **Orchestration**: Docker Compose ties all three services together for local
  dev / single-host deployment.
- **CI/CD**: `.gitlab-ci.yml` runs a build check on both services and pushes
  Docker images to the GitLab Container Registry on every push to `main`.

## Project structure

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, router registration
│   │   ├── config.py        # Settings (env vars)
│   │   ├── database.py      # SQLAlchemy engine/session
│   │   ├── models.py        # User, Task ORM models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── auth.py          # Password hashing, JWT create/verify
│   │   └── routers/
│   │       ├── auth.py      # /api/auth/register, /login, /me
│   │       └── tasks.py     # /api/tasks CRUD
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── api.js           # Axios instance with JWT interceptor
│   │   ├── App.jsx          # Routes + private route guard
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile            # multi-stage: node build -> nginx serve
│   └── nginx.conf
├── docker-compose.yml
├── .gitlab-ci.yml
└── .gitignore
```

## Running locally

Requires Docker and Docker Compose.

```bash
git clone <your-gitlab-repo-url>
cd task-manager
docker compose up --build
```

- Frontend: http://localhost
- Backend API docs (Swagger): http://localhost:8000/docs
- Postgres: localhost:5432 (user `taskuser` / pass `taskpass` / db `taskdb`)

## API endpoints

| Method | Endpoint             | Auth required | Description          |
|--------|-----------------------|:--------------:|-----------------------|
| POST   | `/api/auth/register`  | No             | Create a new user     |
| POST   | `/api/auth/login`     | No             | Get a JWT access token|
| GET    | `/api/auth/me`        | Yes            | Current user info     |
| GET    | `/api/tasks/`         | Yes            | List your tasks       |
| POST   | `/api/tasks/`         | Yes            | Create a task         |
| GET    | `/api/tasks/{id}`     | Yes            | Get one task          |
| PUT    | `/api/tasks/{id}`     | Yes            | Update a task         |
| DELETE | `/api/tasks/{id}`     | Yes            | Delete a task          |

## Deploying via GitLab

1. Push this project to a new GitLab repo.
2. The included `.gitlab-ci.yml` automatically:
   - Sanity-checks the backend (`py_compile`) and builds the frontend
     (`npm run build`) on every push/MR.
   - Builds and pushes `backend` and `frontend` Docker images to your
     project's Container Registry (`registry.gitlab.com/<namespace>/<project>`)
     on pushes to `main`. No extra config needed — GitLab provides
     `CI_REGISTRY`, `CI_REGISTRY_USER`, and `CI_REGISTRY_PASSWORD` automatically.
3. To actually deploy the pulled images to a server, uncomment and adapt the
   `deploy` job at the bottom of `.gitlab-ci.yml` (SSH into your host and run
   `docker compose pull && docker compose up -d`), or wire it into a
   Kubernetes deploy step if you're pointing it at a cluster.

## Environment variables (backend)

Copy `backend/.env.example` to `backend/.env` for local (non-Docker) runs
and adjust as needed. In Docker Compose these are already set inline in
`docker-compose.yml` — for real deployments, move `SECRET_KEY` and DB
credentials into CI/CD variables or a secrets manager rather than committing
them.

## Notes / next steps

- Tables are created via `Base.metadata.create_all()` on backend startup —
  fine for a demo; swap in Alembic migrations (already in requirements.txt)
  before treating this as production-grade.
- CORS is wide open (`allow_origins=["*"]`) — restrict it to your actual
  frontend origin once deployed.
- Add `backend/tests/` with pytest and wire it into `backend-test` in the
  CI pipeline.
