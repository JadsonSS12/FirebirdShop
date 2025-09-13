from .armazem import get_armazem, get_armazems, create_armazem, update_armazem, delete_armazem
from .categoria import (
    get_categoria, get_categorias, create_categoria, update_categoria, delete_categoria,
    get_categoria_produto, get_categorias_produtos, get_categorias_produto, create_categoria_produto, update_categoria_produto, delete_categoria_produto
)
from .cliente import (
   create_cliente, get_cliente, get_clientes, update_cliente, delete_cliente,
   create_cliente_email, get_cliente_email, get_cliente_emails, get_clientes_email, update_cliente_email, delete_cliente_email,
   create_cliente_telefone, get_cliente_telefone, get_cliente_telefones, update_cliente_telefone, delete_cliente_telefone, get_clientes_telefone
)
from .entrega import (
    get_entrega, get_entregas, create_entrega, update_entrega, delete_entrega
)
from .estoque import (
    get_estoque, get_estoques, create_estoque, update_estoque, delete_estoque
)
from .fornecedor import (
    get_fornecedor, get_fornecedores, create_fornecedor, update_fornecedor, delete_fornecedor,
    get_fornecedor_produto, get_fornecedores_produto, create_fornecedor_produto, update_fornecedor_produto, delete_fornecedor_produto
)
from .pedido import (
    get_pedido, get_pedidos, create_pedido, update_pedido, delete_pedido,
    get_pedido_produtos, create_pedido_produto, delete_pedido_produto, update_pedido_produto
)
from .produto import (
    get_produto, get_produtos, create_produto, update_produto, delete_produto,
    create_produto_traducao, get_produto_traducao, get_produtos_traducoes, update_produto_traducao, delete_produto_traducao
)
from .transportadora import (
    get_transportadora, create_transportadora, update_transportadora, delete_transportadora, get_transportadoras,
    get_transportadora_telefone, get_transportadora_telefones, get_transportadoras_telefone, create_transportadora_telefone, update_transportadora_telefone, delete_transportadora_telefone, 
    get_transportadora_email, get_transportadora_emails, get_transportadoras_email, create_transportadora_email, update_transportadora_email, delete_transportadora_email
)
