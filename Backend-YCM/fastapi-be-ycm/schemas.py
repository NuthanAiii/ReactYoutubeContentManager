from pydantic import BaseModel
from typing import Optional
from typing import List



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
    title: str
    description: Optional[str]=""
    type: str
    uploaded: bool
    script: str
    thumbnailUrl: Optional[str]=""
    platform: str
    videoUrl: Optional[str]=""
    publishDate: str
    publishTime: Optional[str] = ""

class GetContent(Content):
    id: int
    

    class Config():
        from_attributes=True
class fetchContetOnPageReq(BaseModel):
    page: int
    total: int  
    data: List[GetContent]

    class Config():
        from_attributes = True      

class deleteContentReq(BaseModel):
    id: int
class editContentReq(Content):
    id: int

class Login(BaseModel):
    email:str
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None