from pydantic import BaseModel
from typing import Optional

class EstoqueBase(BaseModel):
    armazem_id : int
    produto_id : int
    quantidade : int
    codigo : str


class EstoqueCreate(EstoqueBase):
    pass


class EstoqueUpdate(BaseModel):
    armazem_id: Optional[int] = None
    produto_id: Optional[int] = None
    quantidade: Optional[int] = None
    codigo: Optional[str] = None


class Estoque(EstoqueBase):
    id: int

    class Config:
        from_attributes = True