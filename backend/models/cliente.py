# models.py

from sqlalchemy import Column, Integer, Numeric, String, UniqueConstraint, CheckConstraint
from ..database import Base

class Cliente(Base):
    __tablename__ = "CLIENTES"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False) 
    cpf_cnpj = Column(String(14), nullable=False, unique=True) 
    limite_de_credito = Column(Numeric(11, 2), nullable=False)
    cep = Column(String(8), nullable=False) 
    estado = Column(String(20), nullable=False) 
    cidade = Column(String(20), nullable=False) 
    bairro = Column(String(20), nullable=False) 
    rua = Column(String(20), nullable=False)
    numero = Column(String(10), nullable=False)
