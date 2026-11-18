# Portfolio frontend

The React and Vite application is self-contained in this folder. Pages,
components, assets, styles, animations, routes, and API integration are under
`src/`.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The app is served at `http://localhost:3000`. The development server proxies
`/api` requests to `http://localhost:5000`. Set `VITE_API_URL` in `.env` to
override the API base URL.

## Other commands

```sh
npm run build
npm run preview
```

The backend is independent and is documented in [../backend/README.md](../backend/README.md).
