from pydantic import BaseModel
from decimal import Decimal
from datetime import date 
from typing import Optional

class PedidoProdutoBase(BaseModel):
    pedido_id: int
    produto_id: int
    quantidade: int
    preco_unitario: Decimal
    preco_total: Decimal

class PedidoProdutoCreate(PedidoProdutoBase):
    pass

class PedidoProdutoUpdate(BaseModel):
    quantidade: Optional[int] = None
    preco_unitario: Optional[Decimal] = None
    preco_total: Optional[Decimal] = None

class PedidoProduto(PedidoProdutoBase):
    id: int

    class Config:
        from_attributes = True