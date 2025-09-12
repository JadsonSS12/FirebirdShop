from sqlalchemy import Column, Integer, String, ForeignKey, PrimaryKeyConstraint
from ...database import Base

class Estoque(Base):
    __tablename__ = "ESTOQUES"
   
    id = Column(Integer, primary_key=True, index=True)
    armazem_id = Column(
        Integer,
        ForeignKey("ARMAZENS.id", ondelete="CASCADE"),
        nullable=False,
    )
    produto_id = Column(
        Integer,
        ForeignKey("PRODUTOS.id", ondelete="CASCADE"),
        nullable=False,
    )
    quantidade = Column(Integer, nullable=False, unique=True)
    codigo = Column(String(10), nullable=False, unique=True)
