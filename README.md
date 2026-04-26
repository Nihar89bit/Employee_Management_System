# Employee Management System

This repo contains:

- `server`: Express backend
- `EmployeeMS`: Vite React frontend

## Backend deployment

Required environment variables for [`server/.env.example`](/d:/emp_management/server/.env.example):

- `PORT`
- `NODE_ENV=production`
- `JWT_SECRET`
- `CLIENT_URLS`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `OPENROUTER_API_KEY`

Install and start:

```bash
cd server
npm install
npm start
```

Health check:

```text
/health
```

## Frontend deployment

Required environment variable for [`EmployeeMS/.env.example`](/d:/emp_management/EmployeeMS/.env.example):

- `VITE_API_BASE_URL=https://your-backend-domain.onrender.com`

Build:

```bash
cd EmployeeMS
npm install
npm run build
```

## What was fixed

- Frontend API host is now env-driven instead of hardcoded to one Render URL.
- Backend CORS is now env-driven through `CLIENT_URLS`.
- Admin and employee JWT validation now use the same `JWT_SECRET`.
- Production uses `node index.js` instead of `nodemon`.
- Image URLs now use `/images/...`, which matches Linux deployment path casing.
