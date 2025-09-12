from sqlalchemy import Column, Integer, String, ForeignKey, PrimaryKeyConstraint
from ...database import Base

class TransportadoraEmail(Base):
    __tablename__ = "TRANSPORTADORA_EMAILS"
   
    id = Column(Integer, primary_key=True, index=True)
    transportadora_id = Column(
        Integer,
        ForeignKey("TRANSPORTADORAS.id", ondelete="CASCADE"),
        nullable=False,
    )
    email = Column(String(50), nullable=False, unique=True)
