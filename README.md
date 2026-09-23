# Task Manager

A full-stack task management application built with React, FastAPI, and PostgreSQL. The project demonstrates a containerized web app with authentication, task CRUD operations, and a Docker-based deployment setup.

## Features

- User registration and login
- JWT-based authentication
- Create, read, update, and delete tasks
- Role-based access to user-owned task data
- React frontend with protected routes
- FastAPI backend with validation and OpenAPI docs
- PostgreSQL database persistence
- Docker Compose setup for local development

## Architecture

The application is organized into three main layers:

- Frontend: React + Vite + Nginx
- Backend: FastAPI + SQLAlchemy + JWT auth
- Database: PostgreSQL

```text
Client Browser
      │
      ▼
React Frontend (port 8081 or reverse-proxied in Docker)
      │
      ▼
FastAPI Backend (port 8000)
      │
      ▼
PostgreSQL Database (port 5432)
```

## Tech Stack

- Frontend: React, Vite, Axios, React Router
- Backend: Python, FastAPI, SQLAlchemy, Pydantic, Passlib, python-jose
- Database: PostgreSQL
- Infrastructure: Docker, Docker Compose
- CI/CD: GitLab CI

## Repository Structure

```text
task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── auth.py
│   │       └── tasks.py
│   ├── .env.example
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .venv/   # optional local virtual environment
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .gitignore
├── docker-compose.yaml
├── .gitignore
├── .gitlab-ci.yml
├── changes.patch
├── README.md
└── k8s/
```

## Prerequisites

Before running the project locally, make sure you have:

- Docker
- Docker Compose
- Git
- Node.js (only if you want to run frontend locally outside Docker)
- Python 3.11+ (only if you want to run backend locally outside Docker)

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/sanket8420/task-manager-.git
cd task-manager-
```

### 2. Start the application with Docker Compose

```bash
docker compose up --build
```

This will start:

- Frontend: http://localhost:8081
- Backend API docs: http://localhost:8000/docs
- PostgreSQL database: localhost:5432

### 3. Stop the application

```bash
docker compose down
```

To remove volumes as well:

```bash
docker compose down -v
```

## Environment Variables

The backend includes an example environment file at `backend/.env.example`.

Copy it as needed:

```bash
cp backend/.env.example backend/.env
```

Update values if you are running parts of the project outside Docker or customizing the setup.

Default database configuration used by Docker Compose:

- Database: `taskdb`
- Username: `taskuser`
- Password: `taskpass`
- Host: `db`

## API Endpoints

The backend exposes REST API endpoints for authentication and task management.

### Authentication

- `POST /api/auth/register` – register a new user
- `POST /api/auth/login` – log in and receive a JWT token
- `GET /api/auth/me` – fetch current authenticated user details

### Tasks

- `GET /api/tasks/` – list tasks for the authenticated user
- `POST /api/tasks/` – create a new task
- `GET /api/tasks/{id}` – fetch one task
- `PUT /api/tasks/{id}` – update a task
- `DELETE /api/tasks/{id}` – delete a task

## Frontend Overview

The frontend is a React app created with Vite. It provides pages for:

- Login
- Registration
- Dashboard
- Task creation and task management

Protected routes are enforced with client-side authentication checks through the app logic and token handling.

## Backend Overview

The backend is built with FastAPI and SQLAlchemy. It includes:

- database models for users and tasks
- Pydantic schemas for payload validation
- hashing and JWT utilities for authentication
- routers for auth and task operations

The app automatically creates required tables at startup for the demo application.

## CI/CD

The repository includes a GitLab CI pipeline in `.gitlab-ci.yml` that helps validate the project by building the frontend and checking backend integrity. The pipeline is designed to support container image publishing for deployment workflows.

## Notes

This project is useful for learning or demonstrating:

- full-stack application structure
- containerized deployment
- Docker networking and Compose orchestration
- JWT-based authentication
- API-driven frontend integration

## License

This project does not currently declare a license file. If you plan to share or distribute it publicly, consider adding an appropriate open-source license.

## Contributing

Contributions are welcome. If you want to improve the app, consider:

- adding automated tests
- adding Alembic migrations
- tightening security for deployed environments
- improving UI/UX and error handling

---

If you want, I can also help you create a more polished version of this README specifically for GitHub, including badges, screenshots, and a deployment section.
