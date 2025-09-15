from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, Numeric, String, Date
from ...database import Base

class Produto(Base):
    __tablename__ = "PRODUTOS"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(40))
    status = Column(String(20))  
    preco_minimo = Column(Numeric(10, 2), nullable=False)
    preco_venda = Column(Numeric(10, 2), nullable=False)
    data_garantia = Column(Date, nullable=True)
    fornecedor_id = Column(Integer, ForeignKey("FORNECEDORES.id"), nullable=False)
    
    __table_args__ = (
        CheckConstraint('preco_venda >= preco_minimo', name='ck_produto_preco_venda_maior_minimo'),
    )

