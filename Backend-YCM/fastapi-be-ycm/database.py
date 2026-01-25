from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
#
# over all this fine database is used to create the connection to the database
DATABASE_URL = "sqlite:///./data/content.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# engine is used to create the connection to the database
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base() 


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()