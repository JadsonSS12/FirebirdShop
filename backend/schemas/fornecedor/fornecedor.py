from pydantic import BaseModel
from typing import Optional

class FornecedorBase(BaseModel):
    nome : str
    cpf_cnpj : str
    pais : str
    estado : str
    cidade : str
    bairro : str
    rua : str
    numero : str
    cep : str


class FornecedorCreate(FornecedorBase):
    pass


class FornecedorUpdate(BaseModel):
    nome : Optional[str] = None
    pais : Optional[str] = None
    estado : Optional[str] = None
    cidade : Optional[str] = None
    bairro : Optional[str] = None
    rua : Optional[str] = None
    numero : Optional[str] = None
    cep : Optional[str] = None


class Fornecedor(FornecedorBase):
    id: int

    class Config:
        from_attributes = True