from pydantic import BaseModel

class ClienteEmailBase(BaseModel):
    email: str
    cliente_id: int


class ClienteEmailCreate(ClienteEmailBase):
    pass


class ClienteEmail(ClienteEmailBase):
    id: int

    class Config:
        from_attributes = True 