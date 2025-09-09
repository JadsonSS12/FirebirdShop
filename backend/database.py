# database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Obtém variáveis de ambiente
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_PATH = os.getenv("DB_PATH")  
DB_CHARSET = os.getenv("DB_CHARSET")

# STRING DE CONEXÃO para Firebird 5.0
SQLALCHEMY_DATABASE_URL = f"firebird+fdb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_PATH}?charset={DB_CHARSET}"

# Cria a engine de conexão com o banco de dados
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Cria uma fábrica de sessões (SessionLocal) que será usada para criar sessões individuais com o banco
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos declarativos do SQLAlchemy
# Nossas classes de modelo herdarão desta classe
Base = declarative_base()

# Função de dependência para obter uma sessão do banco de dados em cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()