# Team Leave Manager

A simple web app for managing team leave requests and viewing the on-call rotation schedule.

## Quick Start (Docker)

```bash
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8080  |
| Database | localhost:5432         |

## Features

- View prepopulated team members (Alice, Bob, Charlie, Diana)
- Create leave requests with overlap prevention
- Approve, reject, or leave requests pending
- List and calendar views for leave
- Weekly on-call rotation with conflict highlighting when the on-call person has approved leave

### Optional improvements added
- Calendar month view
- Filtering by team member or status
- Automatic on-call replacement suggestion
- Leave approval workflow
- Comments on leave requests
- Basic automated tests
- Docker setup
- Better visual conflict highlighting

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React, TypeScript, Jotai, MUI |
| Backend  | Java Spring Boot        |
| Database | PostgreSQL (Supabase-compatible) |
| Runtime  | Docker Compose          |

## Local Development

### Database

```bash
docker compose up db -d
```

### Backend

Requires Java 21 and Maven, or use Docker:

```bash
cd backend
./mvnw spring-boot:run
# or: docker compose up backend --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — the Vite dev server proxies `/api` to the backend.

## API

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/api/team-members`             | List team members        |
| GET    | `/api/leave-requests`           | List leave requests      |
| POST   | `/api/leave-requests`           | Create leave request     |
| PATCH  | `/api/leave-requests/{id}/status` | Update request status  |
| GET    | `/api/on-call?weeks=8`          | On-call schedule         |

## Testing

### Frontend tests

```bash
cd frontend
npm test
```

### Backend tests

```bash
cd backend
./mvnw test
```

## CI Workflows

- Backend workflow: [.github/workflows/backend-tests.yml](.github/workflows/backend-tests.yml)
- Frontend workflow: [.github/workflows/frontend-tests.yml](.github/workflows/frontend-tests.yml)

## Supabase

The schema in `db/init.sql` is standard PostgreSQL and works with Supabase. To use a hosted Supabase instance, set `DATABASE_URL` to your Supabase connection string and run the init SQL in the Supabase SQL editor.
