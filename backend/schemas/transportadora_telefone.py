from pydantic import BaseModel

class TransportadoraTelefoneBase(BaseModel):
    telefone: str
    transportadora_id: int


class TransportadoraTelefoneCreate(TransportadoraTelefoneBase):
    pass


class TransportadoraTelefone(TransportadoraTelefoneBase):
    id: int

    class Config:
        from_attributes = True 