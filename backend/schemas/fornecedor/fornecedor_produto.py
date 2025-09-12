from pydantic import BaseModel
from typing import Optional

class FornecedorProdutoBase(BaseModel):
    fornecedor_id : int
    produto_id : int


class FornecedorProdutoCreate(FornecedorProdutoBase):
    pass


class FornecedorProdutoUpdate(BaseModel):
    fornecedor_id: Optional[int] = None
    produto_id: Optional[int] = None


class FornecedorProduto(FornecedorProdutoBase):
    id: int

    class Config:
        from_attributes = True