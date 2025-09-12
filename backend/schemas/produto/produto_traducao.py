from pydantic import BaseModel
from typing import Optional

class ProdutoTraducaoBase(BaseModel):
    produto_id: int
    nome: str
    descricao: str
    idioma: str


class ProdutoTraducaoCreate(ProdutoTraducaoBase):
    pass


class ProdutoTraducaoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    idioma: Optional[str] = None


class ProdutoTraducao(ProdutoTraducaoBase):
    id: int

    class Config:
        from_attributes = True