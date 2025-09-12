from pydantic import BaseModel
from typing import Optional

class TransportadoraTelefoneBase(BaseModel):
    telefone: str
    transportadora_id: int


class TransportadoraTelefoneCreate(TransportadoraTelefoneBase):
    pass


class TransportadoraTelefoneUpdate(BaseModel):
    telefone: Optional[str] = None
    
    
class TransportadoraTelefone(TransportadoraTelefoneBase):
    id: int

    class Config:
        from_attributes = True 