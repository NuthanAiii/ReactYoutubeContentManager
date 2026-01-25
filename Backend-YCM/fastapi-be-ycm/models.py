import email
from .database import Base
from sqlalchemy import Boolean, Column, Integer, String, table, true
# over all this fine model is used to create the table
class Data(Base):
    __tablename__ = "Content"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description= Column(String, index=True)
    type= Column(String, index=True)
    category=Column(String, index=True)
    uploaded= Column(Boolean, index=True)
    script=Column(String, index=True)
    hashtags= Column(String, index=True)
    thumbnailUrl=Column(String, index=True)
    platform= Column(String, index=True)
    videoUrl=Column(String, index=True)
    publishDate= Column(String, index=True)
    publishTime=Column(String, index=True)
    
     
class User(Base):
    __tablename__="User"
    id=Column(Integer, primary_key=True, index=True)
    name = Column(String, Index= True)
    email = Column(String, Index= True)
    password = Column(String, Index=True)

          
