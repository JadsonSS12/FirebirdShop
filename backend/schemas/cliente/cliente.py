from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

# Schema base com os campos comuns
class ClienteBase(BaseModel):
    nome: str
    cpf_cnpj: str
    limite_de_credito: Decimal
    cep: str
    estado: str
    cidade: str
    bairro: str
    rua: str
    numero: str

# Schema para criação (usado no endpoint POST)
class ClienteCreate(ClienteBase):
    pass

# Schema para atualização (usado no endpoint PUT/PATCH)
class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf_cnpj: Optional[str] = None
    limite_de_credito: Optional[Decimal] = None
    cep: Optional[str] = None
    estado: Optional[str] = None
    cidade: Optional[str] = None
    bairro: Optional[str] = None
    rua: Optional[str] = None
    numero: Optional[str] = None

# Schema para leitura (usado nos endpoints GET)
class Cliente(ClienteBase):
    id: int

    class Config:
        from_attributes = True # Antigo orm_mode = True

