# S.L.M. Asri Portfolio

This repository contains two independent applications:

- `frontend/` — the React portfolio and admin UI, built with Vite.
- `backend/` — the Express REST API, MySQL persistence, and admin authentication.

The existing portfolio pages, assets, styling, and animations are kept in the
frontend. The frontend calls the backend API under `/api`; in development, Vite
proxies those requests to `http://localhost:5000`.

## Requirements

- Node.js and npm
- MySQL for database-backed content and admin features

## Start the frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:3000`. Set `VITE_API_URL` in `frontend/.env` to the
backend API URL when the API is hosted separately. The default development
proxy expects the backend at `http://localhost:5000`.

## Start the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Configure `backend/.env` with MySQL credentials, an `ADMIN_EMAIL`,
`ADMIN_PASSWORD`, and a random `JWT_SECRET` of at least 32 characters. Then run:

```powershell
npm run db:seed
npm run dev
```

The API listens on `http://localhost:5000`. The backend automatically ensures
the database schema on startup. See [backend/README.md](./backend/README.md) for
database and admin setup details.

## Project structure

```text
frontend/
  src/
  index.html
  vite.config.js
backend/
  database/
  src/
```

Each application has its own `package.json`, lockfile, environment files, and
startup commands. Install dependencies from the corresponding folder.
