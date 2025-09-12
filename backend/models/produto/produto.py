from sqlalchemy import Column, Integer, Numeric, String
from ...database import Base

class Produto(Base):
    __tablename__ = "PRODUTOS"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False, index=True) 
    descricao = Column(String(500))  
    preco = Column(Numeric(10, 2), nullable=False)
    estoque = Column(Integer)