from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey
from ...database import Base

class Entrega(Base):
    __tablename__ = "ENTREGAS"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("PEDIDOS.id", ondelete="CASCADE"), nullable=False)
    transportadora_id = Column(Integer, ForeignKey("TRANSPORTADORAS.id", ondelete="CASCADE"), nullable=False)
    prazo = Column(DateTime, nullable=False)
    preco = Column(Numeric(11, 2), nullable=False)
    status = Column(String(30), nullable=False)
    cep = Column(String(10), nullable=False) 
    estado = Column(String(20), nullable=False) 
    cidade = Column(String(20), nullable=False) 
    bairro = Column(String(20), nullable=False) 
    rua = Column(String(30), nullable=False)
    numero = Column(String(10), nullable=False)
