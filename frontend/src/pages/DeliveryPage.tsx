import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Entrega {
    id: number;
    pedido_id: number;
    transportadora_id: number;
    prazo: Date;
    preco: number;
    status: string;
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
}

interface Pedido {
  id: number;
  cliente_id: number;
  data_pedido: string;
  data_prazo_entrega: string;
  modo_encomenda: string;
  status: string;
  preco_total: number;
}

interface Transportadora {
  id: number;
  nome: string;
  cliente_id: number;
  data_pedido: string;
  data_prazo_entrega: string;
  modo_encomenda: string;
  status: string;
  preco_total: number;
}

interface EntregaWithOrderInfo extends Entrega {
  pedido_info: string; // e.g., "Pedido #123 - Cliente: João"
}

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const initialFormState = {
  pedido_id: 0,
  transportadora_id: 0,
  prazo: "",
  preco: 0,
  status: "",
  cep: "",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
};

const DeliveryPage: React.FC = () => {
  const [entregasWithOrderInfo, setEntregasWithOrderInfo] = useState<EntregaWithOrderInfo[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntrega, setEditingEntrega] = useState<Entrega | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: number) => {
    const entrega = entregasWithOrderInfo.find(e => e.id === id);
    if (entrega) {
      setEditingEntrega(entrega);
      setFormData({
        pedido_id: entrega.pedido_id,
        transportadora_id: entrega.transportadora_id,
        prazo: new Date(entrega.prazo).toISOString().split('T')[0],
        preco: entrega.preco,
        status: entrega.status,
        cep: entrega.cep,
        estado: entrega.estado,
        cidade: entrega.cidade,
        bairro: entrega.bairro,
        rua: entrega.rua,
        numero: entrega.numero,
      });
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      axios.delete(`http://127.0.0.1:8000/entrega/${id}`)
        .then(() => {
          setEntregasWithOrderInfo(entregasWithOrderInfo.filter(entrega => entrega.id !== id));
        })
        .catch(error => console.error("Erro ao deletar entrega:", error));
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
      const [entregasResponse, pedidosResponse, transportadorasResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/entrega/'),
        axios.get('http://127.0.0.1:8000/pedido/'),
        axios.get('http://127.0.0.1:8000/transportadora/')

      ]);

      const entregas = entregasResponse.data;
      const pedidosData = pedidosResponse.data;
      const transportadorasData = transportadorasResponse.data;

      setPedidos(pedidosData);
      setTransportadoras(transportadorasData);

      // Cria um mapa para acesso rápido aos pedidos por ID
      const pedidoMap = new Map<number, Pedido>();
      pedidosData.forEach((pedido: Pedido) => {
        pedidoMap.set(pedido.id, pedido);
      });

      const transportadoraMap = new Map<number, Transportadora>();
      transportadorasData.forEach((transportadora: Transportadora) => {
        transportadoraMap.set(transportadora.id, transportadora);
      });

      // Combina os dados
      const combinedData = entregas.map((entrega: Entrega) => {
        const pedido = pedidoMap.get(entrega.pedido_id);
        const transportadora = transportadoraMap.get(entrega.transportadora_id);
        return {
          ...entrega,
          pedido_info: pedido ? `Pedido #${pedido.id} - Status: ${pedido.status}` : 'Pedido não encontrado',
          transportadora_info: transportadora ? `Transportadora: ${transportadora.nome}` : 'Transportadora não encontrada',
          prazo_formatted: formatDate(entrega.prazo.toString()),
          preco_formatted: formatCurrency(entrega.preco),
        };
      });

      setEntregasWithOrderInfo(combinedData);
    } catch (error) {
      console.error("Erro ao buscar entregas ou pedidos:", error);
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
        name === "pedido_id" || name === "preco"
          ? Number(value)
          : value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.pedido_id || formData.pedido_id === 0) {
      alert("Por favor, selecione um pedido");
      return;
    }

    if (!formData.transportadora_id) {
      alert("Por favor, informe a transportadora");
      return;
    }

    // Validar data de prazo
    const today = new Date();
    const prazo = new Date(formData.prazo);
    today.setHours(0,0,0,0);
    prazo.setHours(0,0,0,0);

    if (prazo < today) {
      alert("A data de prazo não pode ser anterior à data de hoje.");
      return;
    }

    try {
      if (editingEntrega) {
        // Update existing delivery
        const entregaData = {
          pedido_id: formData.pedido_id,
          transportadora_id: formData.transportadora_id,
          prazo: formData.prazo,
          preco: formData.preco,
          status: formData.status,
          cep: formData.cep,
          estado: formData.estado,
          cidade: formData.cidade,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero,
        };

        await axios.put(`http://127.0.0.1:8000/entrega/${editingEntrega.id}`, entregaData);
        alert("Entrega atualizada com sucesso!");
      } else {
        // Create new delivery
        const entregaData = {
          pedido_id: formData.pedido_id,
          transportadora_id: formData.transportadora_id,
          prazo: formData.prazo,
          preco: formData.preco,
          status: formData.status,
          cep: formData.cep,
          estado: formData.estado,
          cidade: formData.cidade,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero,
        };

        await axios.post("http://127.0.0.1:8000/entrega/", entregaData);
        alert("Entrega criada com sucesso!");
      }
      
      // Reset form and hide it
      setFormData(initialFormState);
      setEditingEntrega(null);
      setShowForm(false);
      
      // Refresh the data
      fetchData();
      
    } catch (error: any) {
      alert(
        `Erro ao ${editingEntrega ? 'atualizar' : 'criar'} entrega: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingEntrega(null);
    setShowForm(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pedido', accessor: 'pedido_info' },
    { header: 'Transportadora', accessor: 'transportadora_info' },
    { header: 'Prazo', accessor: 'prazo_formatted' },
    { header: 'Preço', accessor: 'preco_formatted' },
    { header: 'Status', accessor: 'status' },
    { header: 'CEP', accessor: 'cep' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Cidade', accessor: 'cidade' },
    { header: 'Bairro', accessor: 'bairro' },
    { header: 'Rua', accessor: 'rua' },
    { header: 'Número', accessor: 'numero' }
  ];

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando entregas...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Entregas</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              setFormData(initialFormState)
              setEditingEntrega(null)
              setShowForm(!showForm)
            }}
          >
            {showForm ? 'Cancelar' : 'Adicionar Entrega'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingEntrega ? 'Editar Entrega' : 'Criar Nova Entrega'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pedido_id">Pedido</label>
                <select
                  id="pedido_id"
                  name="pedido_id"
                  value={formData.pedido_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione um pedido</option>
                  {pedidos.map((pedido) => (
                    <option key={pedido.id} value={pedido.id}>
                      Pedido #{pedido.id} - {formatCurrency(pedido.preco_total)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="transportadora_id">Transportadora</label>
                <select
                  id="transportadora_id"
                  name="transportadora_id"
                  value={formData.transportadora_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione uma transportadora</option>
                  {transportadoras.map((transportadora) => (
                    <option key={transportadora.id} value={transportadora.id}>
                      {transportadora.nome}
                    </option>
                  ))}
                </select>                  
              </div>
              
              <div className="form-group">
                <label htmlFor="prazo">Prazo</label>
                <input
                  id="prazo"
                  name="prazo"
                  type="date"
                  value={formData.prazo}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preco">Preço</label>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleFormChange}
                  placeholder="Ex: Pendente, Em Trânsito, Entregue"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  name="cep"
                  type="text"
                  value={formData.cep}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  value={formData.estado}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  value={formData.cidade}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  value={formData.bairro}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rua">Rua</label>
                <input
                  id="rua"
                  name="rua"
                  type="text"
                  value={formData.rua}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="numero">Número</label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  value={formData.numero}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCancelForm}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingEntrega ? 'Atualizar Entrega' : 'Criar Entrega'}
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
          data={entregasWithOrderInfo} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default DeliveryPage;