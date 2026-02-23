from sqlmodel import Session, select
from models import User, Document

def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_users(session: Session) -> list[User]:
    statement = select(User)
    return session.exec(statement).all()