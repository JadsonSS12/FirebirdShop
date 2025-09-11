from fastapi import APIRouter
from .endpoints import (produto, cliente, cliente_telefone, cliente_email, transportadora, transportadora_telefone, transportadora_email)

api_router = APIRouter()

api_router.include_router(produto.router)
api_router.include_router(cliente.router)
api_router.include_router(cliente_telefone.router)
api_router.include_router(cliente_email.router)
api_router.include_router(transportadora.router)
api_router.include_router(transportadora_email.router)
api_router.include_router(transportadora_telefone.router)
