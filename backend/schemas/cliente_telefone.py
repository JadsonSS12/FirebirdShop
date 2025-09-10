from pydantic import BaseModel
from decimal import Decimal

class ClienteTelefoneBase(BaseModel):
    telefone: str
    cliente_id: int


class ClienteTelefoneCreate(ClienteTelefoneBase):
    pass


class ClienteTelefone(ClienteTelefoneBase):
    id: int

    class Config:
        from_attributes = True 