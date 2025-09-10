from pydantic import BaseModel
from decimal import Decimal

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
# Não precisa de ID, pois o banco irá gerar
class ClienteCreate(ClienteBase):
    pass

# Schema para leitura (usado nos endpoints GET)
# Inclui o ID e permite que o Pydantic leia dados do ORM
class Cliente(ClienteBase):
    id: int

    class Config:
        from_attributes = True # Antigo orm_mode = True