from sqlalchemy import Column, Integer, String, ForeignKey, PrimaryKeyConstraint
from ..database import Base

class ClienteEmail(Base):
    __tablename__ = "CLIENTES_EMAIL"
   
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(
        Integer,
        ForeignKey("CLIENTES.id", ondelete="CASCADE"), 
        nullable=False,
    )
    email = Column(String(50), nullable=False, unique=True)
