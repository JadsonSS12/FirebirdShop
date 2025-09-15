// frontend/src/pages/SupplyPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Estoque {
  id: number;
  armazem_id: number;
  produto_id: number;
  quantidade: number;
  codigo: string;
}

interface Armazem {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
}

interface EstoqueWithDetails extends Estoque {
  armazem_nome: string;
  produto_nome: string;
}

const initialFormState = {
  armazem_id: 0,
  produto_id: 0,
  quantidade: 0,
  codigo: "",
};

const SupplyPage: React.FC = () => {
  const [estoquesWithDetails, setEstoquesWithDetails] = useState<EstoqueWithDetails[]>([]);
  const [armazems, setArmazems] = useState<Armazem[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEstoque, setEditingEstoque] = useState<Estoque | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: number) => {
    const estoque = estoquesWithDetails.find(e => e.id === id);
    if (estoque) {
      setEditingEstoque(estoque);
      setFormData({
        armazem_id: estoque.armazem_id,
        produto_id: estoque.produto_id,
        quantidade: estoque.quantidade,
        codigo: estoque.codigo,
      });
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este estoque?')) {
      axios.delete(`http://127.0.0.1:8000/estoque/${id}`)
        .then(() => {
          setEstoquesWithDetails(estoquesWithDetails.filter(estoque => estoque.id !== id));
        })
        .catch(error => console.error("Erro ao deletar estoque:", error));
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [estoquesResponse, armazemsResponse, produtosResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/estoque/'), // Endpoint de estoques
        axios.get('http://127.0.0.1:8000/armazem/'), // Endpoint de armazéns
        axios.get('http://127.0.0.1:8000/produto/') // Endpoint de produtos
      ]);

      const estoques = estoquesResponse.data;
      const armazemsData = armazemsResponse.data;
      const produtosData = produtosResponse.data;
      
      setArmazems(armazemsData);
      setProdutos(produtosData);

      // Cria mapas para acesso rápido aos nomes
      const armazemMap = new Map<number, string>();
      armazemsData.forEach((armazem: Armazem) => {
        armazemMap.set(armazem.id, armazem.nome);
      });

      const produtoMap = new Map<number, string>();
      produtosData.forEach((produto: Produto) => {
        produtoMap.set(produto.id, produto.nome);
      });

      // Combina os dados
      const combinedData = estoques.map((estoque: Estoque) => ({
        ...estoque,
        armazem_nome: armazemMap.get(estoque.armazem_id) || 'Armazém não encontrado',
        produto_nome: produtoMap.get(estoque.produto_id) || 'Produto não encontrado',
      }));

      setEstoquesWithDetails(combinedData);
    } catch (error) {
      console.error("Erro ao buscar estoques, armazéns ou produtos:", error);
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
      [name]: name === "armazem_id" || name === "produto_id" || name === "quantidade" 
        ? Number(value) 
        : value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.armazem_id || formData.armazem_id === 0) {
      alert("Por favor, selecione um armazém");
      return;
    }

    if (!formData.produto_id || formData.produto_id === 0) {
      alert("Por favor, selecione um produto");
      return;
    }

    if (!formData.codigo.trim()) {
      alert("Por favor, informe o código do estoque");
      return;
    }

    if (formData.quantidade < 0) {
      alert("A quantidade não pode ser negativa");
      return;
    }

    try {
      if (editingEstoque) {
        // Update existing estoque
        await axios.put(`http://127.0.0.1:8000/estoque/${editingEstoque.id}`, formData);
        alert("Estoque atualizado com sucesso!");
      } else {
        // Create new estoque
        await axios.post("http://127.0.0.1:8000/estoque/", formData);
        alert("Estoque criado com sucesso!");
      }
      
      // Reset form and hide it
      setFormData(initialFormState);
      setEditingEstoque(null);
      setShowForm(false);
      
      // Refresh the data
      fetchData();
      
    } catch (error: any) {
      alert(
        `Erro ao ${editingEstoque ? 'atualizar' : 'criar'} estoque: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingEstoque(null);
    setShowForm(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Armazém', accessor: 'armazem_nome' },
    { header: 'Produto', accessor: 'produto_nome' },
    { header: 'Quantidade', accessor: 'quantidade' },
    { header: 'Código', accessor: 'codigo' }
  ];

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando estoques...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Estoque</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Adicionar Estoque'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingEstoque ? 'Editar Estoque' : 'Criar Novo Estoque'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="armazem_id">Armazém</label>
                <select
                  id="armazem_id"
                  name="armazem_id"
                  value={formData.armazem_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione um armazém</option>
                  {armazems.map((armazem) => (
                    <option key={armazem.id} value={armazem.id}>
                      {armazem.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="produto_id">Produto</label>
                <select
                  id="produto_id"
                  name="produto_id"
                  value={formData.produto_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="0"
                  value={formData.quantidade}
                  onChange={handleFormChange}
                  placeholder="Ex: 100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                  id="codigo"
                  name="codigo"
                  type="text"
                  value={formData.codigo}
                  onChange={handleFormChange}
                  placeholder="Ex: EST-001"
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
                {editingEstoque ? 'Atualizar Estoque' : 'Criar Estoque'}
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
          data={estoquesWithDetails} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default SupplyPage;
