from pydantic import BaseModel
from typing import Optional

class TransportadoraEmailBase(BaseModel):
    email: str
    transportadora_id: int


class TransportadoraEmailCreate(TransportadoraEmailBase):
    pass


class TransportadoraEmailUpdate(BaseModel):
    email: Optional[str] = None


class TransportadoraEmail(TransportadoraEmailBase):
    id: int

    class Config:
        from_attributes = True 