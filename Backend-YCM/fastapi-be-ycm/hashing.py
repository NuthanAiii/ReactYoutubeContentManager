from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# over all this fine pwd_context is used to hash the password

class Hash:
    def hash(password:str):
        return pwd_context.hash(password) #bcrypting the password

    
    def verify(plain_password:str, hashed_password:str):
        return pwd_context.verify(plain_password, hashed_password) #verifing the password
    
    
