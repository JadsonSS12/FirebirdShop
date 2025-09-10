from sqlalchemy import Column, Integer, String, ForeignKey
from ..database import Base

class ClienteTelefone(Base):
    __tablename__ = "CLIENTES_TELEFONE"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(
        Integer,
        ForeignKey("CLIENTES.id", ondelete="CASCADE"), 
        nullable=False,
    )
    telefone = Column(String(15), nullable=False, unique=True)

