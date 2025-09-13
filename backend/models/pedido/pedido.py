from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey
from ...database import Base

class Pedido(Base):
    __tablename__ = "PEDIDOS"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("CLIENTES.id", ondelete="CASCADE"), nullable=False)
    data_pedido = Column(DateTime, nullable=False)
    data_prazo_entrega = Column(DateTime, nullable=False)
    modo_encomenda = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False)
    preco_total = Column(Numeric(10, 2), nullable=False)
