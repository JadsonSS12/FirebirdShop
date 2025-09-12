from pydantic import BaseModel
from typing import Optional

class TransportadoraBase(BaseModel):
    nome: str
    nome_fantasia: str
    cnpj: str
    cep: str
    estado: str
    cidade: str
    bairro: str
    rua: str
    numero: str
    
class TransportadoraCreate(TransportadoraBase):
    pass

class Transportadora(TransportadoraBase):
    id: int
    
    class Config:
        from_attributes = True 


class TransportadoraUpdate(BaseModel):
    nome: Optional[str] = None
    nome_fantasia: Optional[str] = None
    cnpj: Optional[str] = None
    cep: Optional[str] = None
    estado: Optional[str] = None
    cidade: Optional[str] = None
    bairro: Optional[str] = None
    rua: Optional[str] = None
    numero: Optional[str] = None