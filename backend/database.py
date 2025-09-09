# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# STRING DE CONEXÃO para Firebird 5.0
SQLALCHEMY_DATABASE_URL = "firebird+fdb://SYSDBA:masterkey@localhost:3050//opt/firebird/data/shop.fdb?charset=UTF8"

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