from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from ...database import Base

class ProdutoTraducao(Base):
    __tablename__ = "PRODUTOS_TRADUCOES"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("PRODUTOS.id", ondelete="CASCADE"), nullable=False, index=True)
    idioma = Column(String(20), nullable=False, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(500), nullable=False)
    
    __table_args__ = (
        UniqueConstraint('produto_id', 'idioma', name='uq_produto_id_idioma'),
    )