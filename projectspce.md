# Backend Project Space

## Overview

Backend API built with FastAPI + SQLModel for managing users and documents.

## Stack

- FastAPI
- SQLModel / SQLAlchemy
- SQLite (`test.db`)
- Uvicorn

## Run

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## URLs

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Main Files

- `main.py` - FastAPI routes
- `models.py` - SQLModel entities
- `crud.py` - database operations
- `database.py` - engine/session/init/seed
- `requirements.txt` - Python dependencies

## API Groups

- Users: `GET/POST /users`, `GET/PUT/DELETE /users/{user_id}`
- Documents: `GET/POST /documents`, `GET/PUT/DELETE /documents/{document_id}`

## Notes

- Tables are auto-created at startup.
- Seed data is inserted idempotently.
