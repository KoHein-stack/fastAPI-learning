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

def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)

def update_user(
    session: Session,
    user_id: int,  name: str | None = None, age: int | None = None
) -> User | None:
    user = session.get(User, user_id)
    if not user:
        return None

    if name is not None:
        user.name = name
    if age is not None:
        user.age = age

    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def delete_user(session: Session, user_id: int) -> bool:
    user = session.get(User, user_id)
    if not user:
        return False
    session.delete(user)
    session.commit()
    return True


def create_document(session: Session, document: Document) -> Document:
    session.add(document)
    session.commit()
    session.refresh(document)
    return document


def get_documents(
    session: Session,
    skip: int = 0,
    limit: int = 10,
    title: str | None = None,
    user_id: int | None = None,
) -> list[Document]:
    statement = select(Document)

    if title:
        statement = statement.where(Document.title.contains(title))
    if user_id is not None:
        statement = statement.where(Document.user_id == user_id)

    statement = statement.offset(skip).limit(limit)
    return session.exec(statement).all()


def get_document_by_id(session: Session, document_id: int) -> Document | None:
    return session.get(Document, document_id)


def update_document(
    session: Session,
    document_id: int,
    title: str | None = None,
    content: str | None = None,
    user_id: int | None = None,
) -> Document | None:
    document = session.get(Document, document_id)
    if not document:
        return None

    if title is not None:
        document.title = title
    if content is not None:
        document.content = content
    if user_id is not None:
        document.user_id = user_id

    session.add(document)
    session.commit()
    session.refresh(document)
    return document


def delete_document(session: Session, document_id: int) -> bool:
    document = session.get(Document, document_id)
    if not document:
        return False

    session.delete(document)
    session.commit()
    return True
