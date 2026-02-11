from fastapi import FastAPI
from routers import content, authentication
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine, SessionLocal

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:3000", "https://reactyoutubecontentmanager.onrender.com","https://react-youtube-content-manager.vercel.app"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(content.router)
app.include_router(authentication.router)


models.Base.metadata.create_all(bind=engine)