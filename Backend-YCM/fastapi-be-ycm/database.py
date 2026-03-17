from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()
#
# over all this fine database is used to create the connection to the database
#if we get database url from environment variable then we use that otherwise we use sqlite database
DATABASE_URL = os.getenv("DATABASE_URL")  # Set the environment variable for the database URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # test connection before using it, reconnects if dropped
    pool_recycle=300,         # recycle connections every 5 minutes to avoid stale SSL
    pool_size=5,
    max_overflow=10,
)
# engine is used to create the connection to the database
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base() 


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()