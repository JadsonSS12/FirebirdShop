from sqlalchemy import Column, Integer, Numeric, String, CheckConstraint, func
from ...database import Base

class Transportadora(Base):
    __tablename__ = "TRANSPORTADORAS"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False, index=True) 
    nome_fantasia = Column(String(50), nullable=False, index=True) 
    cnpj = Column(String(14), nullable=False, unique=True) 
    cep = Column(String(10), nullable=False) 
    estado = Column(String(20), nullable=False) 
    cidade = Column(String(20), nullable=False) 
    bairro = Column(String(20), nullable=False) 
    rua = Column(String(30), nullable=False)
    numero = Column(String(10), nullable=False)
    
    __table_args__ = (
        CheckConstraint(func.char_length(nome) >= 3, name="ck_transportadora_nome_min_length"),
        CheckConstraint(func.char_length(nome_fantasia) >= 3, name="ck_transportadora_nome_fantasia_min_length"),
        CheckConstraint(func.char_length(cnpj) >= 11, name="ck_transportadora_cnpj_min_length"),
    )