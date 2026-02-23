# Frontend (React + TypeScript)

This frontend is built with React, TypeScript, and Vite for the FastAPI backend in the parent folder.

## Features

- Create and list users
- Create and list documents
- Document filtering and pagination using backend query params:
  - `skip`
  - `limit`
  - `title`
  - `user_id`

## Prerequisites

- Node.js 18+ (recommended)
- Backend running on `http://127.0.0.1:8000`

## Setup

From the `frontend` folder:

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Vite will start on `http://localhost:5173`.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Project structure

```text
frontend/
  src/
    api.ts        # API calls and shared types
    App.tsx       # Main dashboard UI
    main.tsx      # App entry point
    styles.css    # Basic styles
  index.html
  package.json
  tsconfig.json
  vite.config.js
```

## Backend notes

- CORS is enabled in backend `main.py` for:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Make sure FastAPI is running before using the UI.

## API mapping used by frontend

- `GET /users`
- `POST /users`
- `GET /documents`
- `POST /documents`
