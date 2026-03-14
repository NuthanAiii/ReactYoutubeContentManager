from dotenv import load_dotenv
import os
from langchain_google_genai import GoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

llm = GoogleGenerativeAI(api_key=GOOGLE_API_KEY,temperature=0.2,model="gemini-1.5-flash",max_output_tokens=512)
embeddings = GoogleGenerativeAIEmbeddings(api_key=GOOGLE_API_KEY,model="models/gemini-embedding-001")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

