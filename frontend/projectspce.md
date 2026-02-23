# Frontend Project Space

## Overview

Frontend app built with React + TypeScript + Vite for the FastAPI backend.

## Stack

- React
- TypeScript
- Vite

## Run

```bash
npm install
npm run dev
```

## URL

- App: `http://localhost:5173`

## Main Files

- `src/App.tsx` - main UI and interactions
- `src/api.ts` - backend API calls
- `src/styles.css` - styles
- `src/main.tsx` - app entry
- `package.json` - scripts/dependencies

## Backend Dependency

- Expected backend: `http://127.0.0.1:8000`
- Used endpoints:
  - `GET/POST /users`
  - `GET/POST /documents`

## Notes

- CORS is configured in backend for `localhost:5173` and `127.0.0.1:5173`.
