from sqlmodel import SQLModel, create_engine, Session, select

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    from models import User, Document
    
    SQLModel.metadata.create_all(engine)
    # seed_db()


def seed_db() -> None:
    from models import User, Document

    users_seed = [
        {"name": "Alice Johnson", "age": 29},
        {"name": "Bob Smith", "age": 34},
        {"name": "Charlie Nguyen", "age": 26},
        {"name": "Diana Lopez", "age": 31},
        {"name": "Diana1", "age": 31},
        {"name": "Diana3", "age": 12},
        {"name": "Diana2", "age": 34},
    ]
    documents_seed = [
        {
            "title": "FastAPI Basics",
            "content": "Quick notes on routing, validation, and response models.",
            "user_name": "Alice Johnson",
        },
        {
            "title": "SQLModel Guide",
            "content": "Relationship mapping and CRUD examples.",
            "user_name": "Bob Smith",
        },
        {
            "title": "Project Roadmap",
            "content": "Milestones for backend and frontend improvements.",
            "user_name": "Charlie Nguyen",
        },
        {
            "title": "API Testing Checklist",
            "content": "Endpoints, error cases, and integration checks.",
            "user_name": "Diana Lopez",
        },
        {
            "title": "Deployment Notes",
            "content": "Uvicorn settings, CORS, and production concerns.",
            "user_name": "Alice Johnson",
        },
    ]

    with Session(engine) as session:
        existing_users = {
            user.name: user
            for user in session.exec(select(User)).all()
        }

        for user_data in users_seed:
            if user_data["name"] not in existing_users:
                new_user = User(name=user_data["name"], age=user_data["age"])
                session.add(new_user)
                session.flush()
                existing_users[new_user.name] = new_user

        existing_document_titles = {
            title for title in session.exec(select(Document.title)).all()
        }

        for document_data in documents_seed:
            if document_data["title"] in existing_document_titles:
                continue

            user = existing_users.get(document_data["user_name"])
            if not user or user.id is None:
                continue

            session.add(
                Document(
                    title=document_data["title"],
                    content=document_data["content"],
                    user_id=user.id,
                )
            )

        session.commit()


def get_session():
    with Session(engine) as session:
        yield session
