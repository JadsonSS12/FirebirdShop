from sqlalchemy import Column, Integer, String, ForeignKey
from ...database import Base

class TransportadoraTelefone(Base):
    __tablename__ = "TRANSPORTADORA_TELEFONES"

    id = Column(Integer, primary_key=True, index=True)
    transportadora_id = Column(
        Integer,
        ForeignKey("TRANSPORTADORAS.id", ondelete="CASCADE"),
        nullable=False,
    )
    telefone = Column(String(15), nullable=False, unique=True)

