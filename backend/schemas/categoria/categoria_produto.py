from pydantic import BaseModel
from typing import Optional

class CategoriaProdutoBase(BaseModel):
    categoria_id : int
    produto_id : int


class CategoriaProdutoCreate(CategoriaProdutoBase):
    pass


class CategoriaProdutoUpdate(BaseModel):
    categoria_id : Optional[int] = None
    produto_id : Optional[int] = None


class CategoriaProduto(CategoriaProdutoBase):
    id: int

    class Config:
        from_attributes = True