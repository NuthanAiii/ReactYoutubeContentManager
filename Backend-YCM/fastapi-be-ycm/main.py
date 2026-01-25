from fastapi import FastAPI
from routers import content, authentication

import models
from database import engine, SessionLocal

app = FastAPI()
app.include_router(content.router)
app.include_router(authentication.router)


models.Base.metadata.create_all(bind=engine)