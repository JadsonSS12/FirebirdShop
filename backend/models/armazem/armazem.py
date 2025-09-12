from sqlalchemy import Column, Integer, String, CheckConstraint, func
from ...database import Base

class Armazem(Base):
    __tablename__ = "ARMAZENS"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False) 
    pais = Column(String(20), nullable=False)
    estado = Column(String(20), nullable=False) 
    cidade = Column(String(20), nullable=False) 
    bairro = Column(String(20), nullable=False) 
    rua = Column(String(30), nullable=False)
    numero = Column(String(10), nullable=False)
    cep = Column(String(10), nullable=False) 

    
    __table_args__ = (
        CheckConstraint(func.char_length(nome) >= 3, name="ck_armazem_nome_min_length"),
    )
    