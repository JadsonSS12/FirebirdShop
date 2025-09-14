from sqlalchemy import Column, Integer, Numeric, Date, String, CheckConstraint, func
from ...database import Base

class Cliente(Base):
    __tablename__ = "CLIENTES"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False) 
    cpf_cnpj = Column(String(14), nullable=False, unique=True) 
    limite_de_credito = Column(Numeric(11, 2), nullable=False)
    data_cadastro = Column(Date, nullable=False, server_default=func.now())
    pais = Column(String(50), nullable=False)
    cep = Column(String(10), nullable=False) 
    estado = Column(String(20), nullable=False) 
    cidade = Column(String(20), nullable=False) 
    bairro = Column(String(20), nullable=False) 
    rua = Column(String(30), nullable=False)
    numero = Column(String(10), nullable=False)
    
    __table_args__ = (
        CheckConstraint(func.char_length(nome) >= 3, name="ck_cliente_nome_min_length"),
        CheckConstraint(func.char_length(cpf_cnpj) >= 11, name="ck_cliente_cpf_cnpj_min_length"),
    )
    