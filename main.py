from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi import Depends
from fastapi import HTTPException
from fastapi import Query
from sqlalchemy.orm import Session
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

@app.get("/users/{user_id}")
def read_user(user_id: int, session: Session = Depends(get_session)):
    from crud import get_user_by_id

    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}")
def update_user_route(user_id: int, user: User, session: Session = Depends(get_session)):
    from crud import update_user

    updated_user = update_user(
        session=session,
        user_id=user_id,
        name=user.name,
        age=user.age,
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.delete("/users/{user_id}")
def delete_user_route(user_id: int, session: Session = Depends(get_session)):
    from crud import delete_user

    deleted = delete_user(session, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}



@app.get("/documents")
def read_documents(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    title: str | None = Query(default=None),
    user_id: int | None = Query(default=None, ge=1),
    session: Session = Depends(get_session),
):
    from crud import get_documents

    documents = get_documents(
        session=session,
        skip=skip,
        limit=limit,
        title=title,
        user_id=user_id,
    )
    return documents


@app.get("/documents/{document_id}")
def read_document(document_id: int, session: Session = Depends(get_session)):
    from crud import get_document_by_id

    document = get_document_by_id(session, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.post("/documents")
def create_document_route(document: Document, session: Session = Depends(get_session)):
    from crud import create_document

    new_document = create_document(session, document)
    return new_document


@app.put("/documents/{document_id}")
def update_document_route(document_id: int, document: Document, session: Session = Depends(get_session)):
    from crud import update_document

    updated_document = update_document(
        session=session,
        document_id=document_id,
        title=document.title,
        content=document.content,
        user_id=document.user_id,
    )
    if not updated_document:
        raise HTTPException(status_code=404, detail="Document not found")
    return updated_document


@app.delete("/documents/{document_id}")
def delete_document_route(document_id: int, session: Session = Depends(get_session)):
    from crud import delete_document

    deleted = delete_document(session, document_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}
