from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from datetime import date

class EntregaBase(BaseModel):
    id: int
    pedido_id : int
    transportadora_id : int
    prazo : date
    preco : Decimal
    status: str
    cep : str
    estado : str
    cidade : str
    bairro : str
    rua : str
    numero : str


class EntregaCreate(EntregaBase):
    pass


class EntregaUpdate(BaseModel):
    id: Optional[int] = None
    pedido_id : Optional[int] = None
    transportadora_id : Optional[int] = None
    prazo : Optional[date] = None
    preco : Optional[Decimal] = None
    status: Optional[str] = None
    cep : Optional[str] = None
    estado : Optional[str] = None
    cidade : Optional[str] = None
    bairro : Optional[str] = None
    rua : Optional[str] = None
    numero : Optional[str] = None


class Entrega(EntregaBase):
    id: int

    class Config:
        from_attributes = True