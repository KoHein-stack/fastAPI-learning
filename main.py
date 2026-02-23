from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlmodel import select
from models import User, Document
from database import init_db, get_session

app = FastAPI(default_response_class=ORJSONResponse)

init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/users")
def read_users(session :Session =Depends(get_session)):
    from crud import get_users
    users = get_users(session)
    return users

@app.post("/users")
def create_user(user: User,  session: Session = Depends(get_session)):
    from crud import create_user
    new_user = create_user(session, user)
    return new_user