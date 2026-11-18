# Portfolio backend

The backend is an independent Express.js REST API with MySQL persistence,
project and portfolio content CRUD, and protected admin endpoints. Admin login
uses an HTTP-only cookie containing a JWT that expires after 24 hours; there is
no public registration.

## Setup

1. Install MySQL and create a database, or use an account allowed to create
   databases.
2. Copy `.env.example` to `.env`.
3. Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
   `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Set `JWT_SECRET` to a random value of at least 32 characters. For example:

   ```sh
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

5. Install and start the API:

   ```sh
   npm install
   npm run db:seed
   npm run dev
   ```

The API listens on port `5000` by default. Configure `PORT` and `CLIENT_URL` in
`.env` to change the server port or the allowed frontend origin. The schema is
ensured at server startup; `npm run db:seed` creates the initial admin and
default portfolio data. Admin credentials must be configured before seeding.

## Commands

```sh
npm run dev       # Start with Node's watch mode
npm start         # Start the server
npm run db:init   # Ensure the schema
npm run db:seed   # Seed default data and initial admin
```

The health endpoint is `GET /api/health`. Public endpoints use `/api`; protected
admin endpoints use `/api/admin`. The frontend and its API configuration are
documented in [../frontend/README.md](../frontend/README.md).
