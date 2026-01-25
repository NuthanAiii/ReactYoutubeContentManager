from pydantic import BaseModel
from typing import Optional



#this is used to define the type of data we are accepting into api or passing form api 
#i mean to say format 
class User(BaseModel):
    name:str
    email:str
    password:str

class GetUser(BaseModel):
    name:str
    email:str
    
    class Config():
        from_attributes = True

class Content(BaseModel):
    title =str
    description=str
    type=str
    category=str
    uploaded=bool
    script=str
    hashtags=str
    thumbnailUrl=str
    platform=str
    videoUrl=str
    publishDate=str

class GetContent(Content):
    class Config():
        from_attributes=True

class Login(BaseModel):
    email:str
    password:str

    
