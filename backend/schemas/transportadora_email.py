from pydantic import BaseModel

class TransportadoraEmailBase(BaseModel):
    email: str
    transportadora_id: int


class TransportadoraEmailCreate(TransportadoraEmailBase):
    pass


class TransportadoraEmail(TransportadoraEmailBase):
    id: int

    class Config:
        from_attributes = True 