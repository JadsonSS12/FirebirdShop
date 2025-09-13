from pydantic import BaseModel
from decimal import Decimal
from datetime import date 
from typing import Optional
from enum import Enum

class ModoEncomendaEnum(str, Enum):
    presencial = 'Presencial'
    online = 'Online'

class PedidoBase(BaseModel):
    cliente_id: int
    data_pedido: date 
    data_prazo_entrega: date
    status: str
    preco_total: Decimal

class PedidoCreate(PedidoBase):
    pass

class PedidoUpdate(BaseModel):
    status: Optional[str] = None
    preco_total: Optional[Decimal] = None

class Pedido(PedidoBase):
    id: int

    class Config:
        from_attributes = True