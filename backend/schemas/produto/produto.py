from pydantic import BaseModel
from decimal import Decimal
from datetime import date 
from typing import Optional


class ProdutoBase(BaseModel):
    nome: str
    fornecedor_id: int 
    status: str
    preco_minimo: Decimal
    preco_venda: Decimal
    data_garantia: date

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    fornecedor_id: Optional[int] = None
    status: Optional[str] = None
    preco_minimo: Optional[Decimal] = None
    preco_venda: Optional[Decimal] = None
    data_garantia: Optional[date] = None

class Produto(ProdutoBase):
    id: int

    class Config:
        from_attributes = True