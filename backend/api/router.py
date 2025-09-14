from fastapi import APIRouter

from .endpoints.armazem.armazem import router as armazem_router
from .endpoints.categoria.categoria import router as categoria_router
from .endpoints.categoria.categoria_produto import router as categoria_produto_router
from .endpoints.cliente.cliente import router as cliente_router
from .endpoints.cliente.cliente_telefone import router as cliente_telefone_router
from .endpoints.cliente.cliente_email import router as cliente_email_router
from .endpoints.entrega.entrega import router as entrega_router
from .endpoints.estoque.estoque import router as estoque_router
from .endpoints.fornecedor.fornecedor import router as fornecedor_router
from .endpoints.pedido.pedido import router as pedido_router 
from .endpoints.pedido.pedido_produto import router as pedido_produto_router
from .endpoints.produto.produto import router as produto_router
from .endpoints.produto.produto_traducao import router as produto_traducao_router
from .endpoints.transportadora.transportadora import router as transportadora_router
from .endpoints.transportadora.transportadora_telefone import router as transportadora_telefone_router
from .endpoints.transportadora.transportadora_email import router as transportadora_email_router
from .endpoints.dashboard.dashboard import router as dashboard_router

api_router = APIRouter()

# Registrando as rotas
api_router.include_router(armazem_router)
api_router.include_router(categoria_router)
api_router.include_router(categoria_produto_router)
api_router.include_router(entrega_router)
api_router.include_router(estoque_router)
api_router.include_router(fornecedor_router)
api_router.include_router(pedido_router)
api_router.include_router(pedido_produto_router)
api_router.include_router(produto_router)
api_router.include_router(cliente_router)
api_router.include_router(produto_traducao_router)
api_router.include_router(cliente_telefone_router)
api_router.include_router(cliente_email_router)
api_router.include_router(transportadora_router)
api_router.include_router(transportadora_email_router)
api_router.include_router(transportadora_telefone_router)
api_router.include_router(dashboard_router)