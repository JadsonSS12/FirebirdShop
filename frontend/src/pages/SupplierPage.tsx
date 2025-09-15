import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';
import './CrudPage.css';

interface Fornecedor {
  id?: number;
  nome: string;
  cpf_cnpj: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
}

const initialFormState: Fornecedor = {
  nome: '',
  cpf_cnpj: '',
  pais: 'Brasil',
  estado: '',
  cidade: '',
  bairro: '',
  rua: '',
  numero: '',
  cep: '',
};

const SupplierPage: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Fornecedor>(initialFormState);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/fornecedor/');
      setFornecedores(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/fornecedor/editar/${id}`);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) return;
    axios
      .delete(`http://127.0.0.1:8000/fornecedor/${id}`)
      .then(() => {
        setFornecedores(prev => prev.filter(f => f.id !== id));
      })
      .catch(err => console.error('Erro ao deletar fornecedor:', err));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Por favor, informe o nome do fornecedor.');
      return;
    }
    if (!formData.cpf_cnpj.trim()) {
      alert('Por favor, informe CPF/CNPJ.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/fornecedor/', formData);
      setFormData(initialFormState);
      setShowForm(false);
      // Opcional: adicionar ao estado local para evitar refetch
      setFornecedores(prev => [...prev, response.data]);
      alert('Fornecedor criado com sucesso!');
    } catch (error: any) {
      alert(`Erro ao criar fornecedor: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setShowForm(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'CPF/CNPJ', accessor: 'cpf_cnpj' },
    { header: 'País', accessor: 'pais' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Cidade', accessor: 'cidade' },
    { header: 'Bairro', accessor: 'bairro' },
    { header: 'Rua', accessor: 'rua' },
    { header: 'Número', accessor: 'numero' },
    { header: 'CEP', accessor: 'cep' },
  ];

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando fornecedores...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Fornecedores</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : 'Adicionar Fornecedor'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>Criar Novo Fornecedor</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input id="nome" name="nome" value={formData.nome} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="cpf_cnpj">CPF / CNPJ</label>
                <input id="cpf_cnpj" name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input id="pais" name="pais" value={formData.pais} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input id="estado" name="estado" value={formData.estado} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input id="cidade" name="cidade" value={formData.cidade} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input id="bairro" name="bairro" value={formData.bairro} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="rua">Rua</label>
                <input id="rua" name="rua" value={formData.rua} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="numero">Número</label>
                <input id="numero" name="numero" value={formData.numero} onChange={handleFormChange} />
              </div>

              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input id="cep" name="cep" value={formData.cep} onChange={handleFormChange} />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelForm}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Criar Fornecedor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="action-bar">
        <input type="text" placeholder="Pesquisa rápida por palavras-chave..." />
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={fornecedores} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default SupplierPage;