from sqlalchemy import Column, Integer, String, CheckConstraint, func
from ...database import Base

class Categoria(Base):
    __tablename__ = "CATEGORIAS"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False) 
    descricao = Column(String(200), nullable=False)
   
    __table_args__ = (
        CheckConstraint(func.char_length(nome) >= 3, name="ck_categoria_nome_min_length"),
    )
    