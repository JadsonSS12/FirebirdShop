// frontend/src/pages/OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Pedido {
  id: number;
  cliente_id: number;
  data_pedido: string;
  data_prazo_entrega: string;
  modo_encomenda: string;
  status: string;
  preco_total: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco_venda: number;
  preco_minimo: number;
  status: string;
  data_garantia: string;
  fornecedor_id: number;
}

interface PedidoProdutoForm {
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  preco_total: number;
}

interface PedidoWithClientName extends Pedido {
  cliente_nome: string;
}

  const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const initialFormState = {
  cliente_id: 0,
  data_pedido: getTodayDate(),
  data_prazo_entrega: "",
  modo_encomenda: "Presencial" as "Presencial" | "Online",
  status: "",
  preco_total: 0,
  produtos: [] as PedidoProdutoForm[],
};

const OrdersPage: React.FC = () => {
  const [pedidosWithClientName, setPedidosWithClientName] = useState<PedidoWithClientName[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: number) => {
    const pedido = pedidosWithClientName.find(p => p.id === id);
    if (pedido) {
      setEditingPedido(pedido);
      setFormData({
        cliente_id: pedido.cliente_id,
        data_pedido: pedido.data_pedido,
        data_prazo_entrega: pedido.data_prazo_entrega,
        modo_encomenda: pedido.modo_encomenda as "Presencial" | "Online",
        status: pedido.status,
        preco_total: pedido.preco_total,
        produtos: [], // We'll need to fetch products separately for editing
      });
      setShowForm(true);
    }
  };


  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      axios.delete(`http://127.0.0.1:8000/pedido/${id}`)
        .then(() => {
          setPedidosWithClientName(pedidosWithClientName.filter(pedido => pedido.id !== id));
        })
        .catch(error => console.error("Erro ao deletar pedido:", error));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pedidosResponse, clientesResponse, produtosResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/pedido/'), // Endpoint de pedidos
        axios.get('http://127.0.0.1:8000/cliente/'), // Endpoint de clientes
        axios.get('http://127.0.0.1:8000/produto/') // Endpoint de produtos
      ]);

      const pedidos = pedidosResponse.data;
      const clientesData = clientesResponse.data;
      const produtosData = produtosResponse.data;
      
      setClientes(clientesData);
      setProdutos(produtosData);

      // Cria um mapa para acesso rápido aos nomes dos clientes por ID
      const clienteMap = new Map<number, string>();
      clientesData.forEach((cliente: Cliente) => {
        clienteMap.set(cliente.id, cliente.nome);
      });

      // Combina os dados
      const combinedData = pedidos.map((pedido: Pedido) => ({
        ...pedido,
        cliente_nome: clienteMap.get(pedido.cliente_id) || 'Cliente não encontrado',
        data_pedido_formatted: formatDate(pedido.data_pedido),
        data_prazo_entrega_formatted: formatDate(pedido.data_prazo_entrega),
        preco_total_formatted: formatCurrency(pedido.preco_total),
      }));

      setPedidosWithClientName(combinedData);
    } catch (error) {
      console.error("Erro ao buscar pedidos, clientes ou produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "cliente_id" || name === "preco_total"
          ? Number(value)
          : value,
    }));
  };

  const addProduct = () => {
    const newProduct: PedidoProdutoForm = {
      produto_id: 0,
      quantidade: 1,
      preco_unitario: 0,
      preco_total: 0
    };
    
    setFormData(prevState => ({
      ...prevState,
      produtos: [...prevState.produtos, newProduct]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      produtos: prevState.produtos.filter((_, i) => i !== index)
    }));
    calculateTotal();
  };

  const updateProduct = (index: number, field: keyof PedidoProdutoForm, value: number) => {
    setFormData(prevState => {
      const updatedProducts = [...prevState.produtos];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      };

      // Auto-calculate preco_total when quantidade or preco_unitario changes
      if (field === 'quantidade' || field === 'preco_unitario') {
        updatedProducts[index].preco_total = updatedProducts[index].quantidade * updatedProducts[index].preco_unitario;
      }

      // Auto-fill preco_unitario when produto_id changes
      if (field === 'produto_id') {
        const selectedProduct = produtos.find(p => p.id === value);
        if (selectedProduct) {
          updatedProducts[index].preco_unitario = selectedProduct.preco_venda;
          updatedProducts[index].preco_total = updatedProducts[index].quantidade * selectedProduct.preco_venda;
        }
      }

      const newState = {
        ...prevState,
        produtos: updatedProducts
      };

      // Calculate total price for the order
      const totalPrice = updatedProducts.reduce((sum, produto) => sum + produto.preco_total, 0);
      newState.preco_total = totalPrice;

      return newState;
    });
  };

  const calculateTotal = () => {
    const totalPrice = formData.produtos.reduce((sum, produto) => sum + produto.preco_total, 0);
    setFormData(prevState => ({
      ...prevState,
      preco_total: totalPrice
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.cliente_id || formData.cliente_id === 0) {
      alert("Por favor, selecione um cliente");
      return;
    }

    if (!editingPedido && formData.produtos.length === 0) {
      alert("Por favor, adicione pelo menos um produto ao pedido");
      return;
    }

     // Validar data de prazo de entrega
    const today = new Date();
    const prazoEntrega = new Date(formData.data_prazo_entrega);
    today.setHours(0,0,0,0); // Ignora horário
    prazoEntrega.setHours(0,0,0,0);

    if (prazoEntrega < today) {
      alert("A data de prazo de entrega não pode ser anterior à data de hoje.");
      return;
    }

    // Validate all products have valid data (only for new orders)
    if (!editingPedido) {
      for (let i = 0; i < formData.produtos.length; i++) {
        const produto = formData.produtos[i];
        if (!produto.produto_id || produto.produto_id === 0) {
          alert(`Por favor, selecione um produto na linha ${i + 1}`);
          return;
        }
        if (produto.quantidade <= 0) {
          alert(`Por favor, informe uma quantidade válida na linha ${i + 1}`);
          return;
        }
        if (produto.preco_unitario <= 0) {
          alert(`Por favor, informe um preço unitário válido na linha ${i + 1}`);
          return;
        }
      }
    }

    try {
      if (editingPedido) {
        // Update existing order
        const orderData = {
          cliente_id: formData.cliente_id,
          data_pedido: formData.data_pedido,
          data_prazo_entrega: formData.data_prazo_entrega,
          modo_encomenda: formData.modo_encomenda,
          status: formData.status,
          preco_total: formData.preco_total
        };

        await axios.put(`http://127.0.0.1:8000/pedido/${editingPedido.id}`, orderData);
        alert("Pedido atualizado com sucesso!");
      } else {
        // Create the order first
        const orderData = {
          cliente_id: formData.cliente_id,
          data_pedido: formData.data_pedido,
          data_prazo_entrega: formData.data_prazo_entrega,
          modo_encomenda: formData.modo_encomenda,
          status: formData.status,
          preco_total: formData.preco_total
        };

        const orderResponse = await axios.post("http://127.0.0.1:8000/pedido/", orderData);
        const orderId = orderResponse.data.id;

        // Then create the order products
        for (const produto of formData.produtos) {
          const orderProductData = {
            pedido_id: orderId,
            produto_id: produto.produto_id,
            quantidade: produto.quantidade,
            preco_unitario: produto.preco_unitario,
            preco_total: produto.preco_total
          };

          await axios.post("http://127.0.0.1:8000/pedido-produto/", orderProductData);
        }
        
        alert("Pedido criado com sucesso!");
      }
      
      // Reset form and hide it
      setFormData(initialFormState);
      setEditingPedido(null);
      setShowForm(false);
      
      // Refresh the data
      fetchData();
      
    } catch (error: any) {
      alert(
        `Erro ao ${editingPedido ? 'atualizar' : 'criar'} pedido: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingPedido(null);
    setShowForm(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Cliente', accessor: 'cliente_nome' },
    { header: 'Data do Pedido', accessor: 'data_pedido_formatted' },
    { header: 'Prazo de Entrega', accessor: 'data_prazo_entrega_formatted' },
    { header: 'Modo', accessor: 'modo_encomenda' },
    { header: 'Status', accessor: 'status' },
    { header: 'Preço Total', accessor: 'preco_total_formatted' }
  ];

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Pedidos</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              setFormData(initialFormState)
              setEditingPedido(null)
              setShowForm(!showForm)
            }}
          >
            {showForm ? 'Cancelar' : 'Adicionar Pedido'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingPedido ? 'Editar Pedido' : 'Criar Novo Pedido'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="cliente_id">Cliente</label>
                <select
                  id="cliente_id"
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="data_pedido">Data do Pedido</label>
                <input
                  id="data_pedido"
                  name="data_pedido"
                  type="date"
                  value={formData.data_pedido}
                  onChange={handleFormChange}
                  required
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="data_prazo_entrega">Prazo de Entrega</label>
                <input
                  id="data_prazo_entrega"
                  name="data_prazo_entrega"
                  type="date"
                  value={formData.data_prazo_entrega}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="modo_encomenda">Modo da Encomenda</label>
                <select
                  id="modo_encomenda"
                  name="modo_encomenda"
                  value={formData.modo_encomenda}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleFormChange}
                  placeholder="Ex: Pendente, Em Andamento, Concluído"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preco_total">Preço Total</label>
                <input
                  id="preco_total"
                  name="preco_total"
                  type="number"
                  step="0.01"
                  value={formData.preco_total}
                  onChange={handleFormChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>
            </div>

            {/* Products Section - Only shown for new orders */}
            {!editingPedido && (
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Produtos do Pedido</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={addProduct}
                  >
                    + Adicionar Produto
                  </button>
                </div>

                {formData.produtos.length === 0 && (
                  <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                    Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                  </p>
                )}

                {formData.produtos.map((produto, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #dee2e6', 
                    borderRadius: '5px', 
                    padding: '15px', 
                    marginBottom: '10px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: '0', color: '#495057' }}>Produto {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '5px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        Remover
                      </button>
                    </div>
                    
                    <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                      <div className="form-group">
                        <label>Produto</label>
                        <select
                          value={produto.produto_id}
                          onChange={(e) => updateProduct(index, 'produto_id', Number(e.target.value))}
                          required
                        >
                          <option value={0}>Selecione um produto</option>
                          {produtos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Quantidade</label>
                        <input
                          type="number"
                          min="1"
                          value={produto.quantidade}
                          onChange={(e) => updateProduct(index, 'quantidade', Number(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Preço Unitário</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={produto.preco_unitario}
                          onChange={(e) => updateProduct(index, 'preco_unitario', Number(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Total</label>
                        <input
                          type="number"
                          step="0.01"
                          value={produto.preco_total}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Note for editing orders */}
            {editingPedido && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '15px', 
                marginBottom: '20px' 
              }}>
                <strong>Nota:</strong> Para editar os produtos deste pedido, use a funcionalidade específica de gestão de produtos por pedido.
                Esta tela permite apenas editar as informações básicas do pedido.
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCancelForm}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingPedido ? 'Atualizar Pedido' : 'Criar Pedido'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="action-bar">
        <input type="text" placeholder="Pesquisa rápida por palavras-chave..." />
      </div>

      <div className="table-container">
        <DataTable 
          columns={columns} 
          data={pedidosWithClientName} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default OrdersPage;
