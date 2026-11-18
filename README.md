# S.L.M. Asri Portfolio

This portfolio keeps the original React frontend intact while adding a separate Express.js + MySQL backend and an isolated admin dashboard.

## Frontend development

```sh
npm install
npm run dev
```

Open `http://localhost:3000` for the public portfolio.

## Full-stack development

```sh
npm install
npm run dev:all
```

The frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:5000`.

## Backend setup

```powershell
cd backend
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

```sh
npm install
```

Set `JWT_SECRET` to at least 32 random characters and configure `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `backend/.env` before initializing the database. The initial
admin password must be 12–72 UTF-8 bytes. For example, generate a JWT secret with:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then run:

```sh
npm run db:seed
npm run dev
```

The public APIs are exposed under `/api`, and the private admin login lives at `/admin`.

## Admin access

- Admin login page: `http://localhost:3000/admin`
- Authenticated dashboard: `http://localhost:3000/admin/dashboard`

The seeder creates an admin only when the `admins` table is empty. Login verifies
the email and bcrypt password hash in MySQL. The JWT is held in an HTTP-only cookie
for 24 hours, with server-side session state revoked on logout; expired tokens are
not refreshed, and protected API requests redirect an unauthenticated dashboard
browser to `/admin`. There is no public registration.

## Projects showcase

- Public showcase: `http://localhost:3000/projects`
- Project details use database slugs under `/projects/:slug`.
- The existing cybersecurity chatbot and knowledge assessment pages keep their original routes and content.
- `npm run db:seed` adds those two documented projects if they are not already in MySQL.
- In the admin dashboard, the Projects tab supports creating, editing, publishing, and deleting projects. Enter technologies, objectives, features, and screenshot URLs one per line; optional detail sections are shown only when populated.

## Notes

- The public portfolio UI is preserved and no admin navigation was added to the public site.
- The backend is structured under `backend/` and keeps the existing React architecture unchanged.
- MySQL is required for persistence and admin authentication; the public portfolio can still render when it is unavailable.
