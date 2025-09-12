from sqlalchemy import Column, Integer, Numeric, ForeignKey
from ...database import Base

class PedidoProduto(Base):
    __tablename__ = "PEDIDOS_PRODUTOS"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("PEDIDOS.id", ondelete="CASCADE"), nullable=False)
    produto_id = Column(Integer, ForeignKey("PRODUTOS.id", ondelete="CASCADE"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Numeric(10, 2), nullable=False)
    preco_total = Column(Numeric(10, 2), nullable=False)
