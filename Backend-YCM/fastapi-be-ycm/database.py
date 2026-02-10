from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
#
# over all this fine database is used to create the connection to the database
#if we get database url from environment variable then we use that otherwise we use sqlite database
DATABASE_URL = os.getenv("DATABASE_URL")  # Set the environment variable for the database URL

engine = create_engine(DATABASE_URL)
# engine is used to create the connection to the database
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base() 


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()