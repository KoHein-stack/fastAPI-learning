# Backend (FastAPI + SQLModel)

This is the backend API for managing `users` and `documents` with FastAPI, SQLModel, and SQLite.

## Features

- CRUD for users
- CRUD for documents
- Document filtering and pagination (`skip`, `limit`, `title`, `user_id`)
- SQLite database initialization on startup
- Auto-seeding of sample users and documents

## Tech Stack

- FastAPI
- SQLModel / SQLAlchemy
- SQLite (`test.db`)
- Uvicorn

## Prerequisites

- Python 3.10+ recommended

## Setup

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the API

```bash
uvicorn main:app --reload
```

Server URL:

- `http://127.0.0.1:8000`

Interactive docs:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Database

- SQLite file: `test.db`
- Tables are created automatically when the app starts.
- Seed data is inserted automatically in an idempotent way (no duplicate insert on repeated startups).

## API Endpoints

### Root

- `GET /`

### Users

- `GET /users`
- `POST /users`
- `GET /users/{user_id}`
- `PUT /users/{user_id}`
- `DELETE /users/{user_id}`

### Documents

- `GET /documents`
- `GET /documents/{document_id}`
- `POST /documents`
- `PUT /documents/{document_id}`
- `DELETE /documents/{document_id}`

Supported query parameters for `GET /documents`:

- `skip` (default `0`)
- `limit` (default `10`, max `100`)
- `title` (optional exact title filter)
- `user_id` (optional owner filter)

## CORS

Backend allows frontend origins:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
