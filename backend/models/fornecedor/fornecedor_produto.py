from sqlalchemy import Column, Integer, UniqueConstraint, ForeignKey
from ...database import Base

class FornecedorProduto(Base):
    __tablename__ = "FORNECEDORES_PRODUTOS"

    id = Column(Integer, primary_key=True, index=True)
    fornecedor_id = Column(Integer, ForeignKey("FORNECEDORES.id", ondelete="CASCADE"), nullable=False, index=True)
    produto_id = Column(Integer, ForeignKey("PRODUTOS.id", ondelete="CASCADE"), nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint('fornecedor_id', 'produto_id', name='uq_fornecedor_produto'),
    )