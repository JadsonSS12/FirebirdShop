# schemas.py

from pydantic import BaseModel
from decimal import Decimal

# Schema base com os campos comuns
class ProdutoBase(BaseModel):
    nome: str
    descricao: str | None = None
    preco: Decimal
    estoque: int | None = 0

# Schema para criação (usado no endpoint POST)
# Não precisa de ID, pois o banco irá gerar
class ProdutoCreate(ProdutoBase):
    pass

# Schema para leitura (usado nos endpoints GET)
# Inclui o ID e permite que o Pydantic leia dados do ORM
class Produto(ProdutoBase):
    id: int

    class Config:
        from_attributes = True # Antigo orm_mode = True