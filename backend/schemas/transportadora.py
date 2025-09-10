from pydantic import BaseModel
from decimal import Decimal

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
