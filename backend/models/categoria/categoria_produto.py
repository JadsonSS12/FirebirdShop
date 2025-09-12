from sqlalchemy import Column, Integer, ForeignKey, func, UniqueConstraint
from ...database import Base

class CategoriaProduto(Base):
    __tablename__ = "CATEGORIAS_PRODUTOS"

    id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("CATEGORIAS.id",  ondelete="CASCADE"), nullable=False)
    produto_id = Column(Integer, ForeignKey("PRODUTOS.id",  ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        UniqueConstraint('categoria_id', 'produto_id', name='uq_categoria_produto'),
        )