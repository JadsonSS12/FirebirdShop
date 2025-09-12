from pydantic import BaseModel

class ArmazemBase(BaseModel):
    nome: str
    pais: str
    estado: str
    cidade: str
    bairro: str
    rua: str
    numero: str
    cep: str
    
    
class ArmazemCreate(ArmazemBase):
    pass


class ArmazemUpdate(BaseModel):
    nome: str | None = None
    pais: str | None = None
    estado: str | None = None
    cidade: str | None = None
    bairro: str | None = None
    rua: str | None = None
    numero: str | None = None
    cep: str | None = None
    
    
class Armazem(ArmazemBase):
    id: int

    class Config:
        from_attributes = True