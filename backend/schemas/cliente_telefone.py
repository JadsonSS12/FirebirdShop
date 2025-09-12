from pydantic import BaseModel
from typing import Optional


class ClienteTelefoneBase(BaseModel):
    telefone: str
    cliente_id: int


class ClienteTelefoneCreate(ClienteTelefoneBase):
    pass


class ClienteTelefoneUpdate(BaseModel):
    telefone: Optional[str] = None


class ClienteTelefone(ClienteTelefoneBase):
    id: int

    class Config:
        from_attributes = True 