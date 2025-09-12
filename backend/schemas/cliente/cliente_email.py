from pydantic import BaseModel
from typing import Optional

class ClienteEmailBase(BaseModel):
    email: str
    cliente_id: int


class ClienteEmailCreate(ClienteEmailBase):
    pass


class ClienteEmailUpdate(BaseModel):
    email: Optional[str] = None
    
    
class ClienteEmail(ClienteEmailBase):
    id: int

    class Config:
        from_attributes = True 