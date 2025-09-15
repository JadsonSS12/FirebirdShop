// frontend/src/pages/StoreroomPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Armazem {
  id: number;
  nome: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
}

const initialFormState = {
  nome: "",
  pais: "Brasil",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  cep: "",
};

const StoreroomPage: React.FC = () => {
  const [armazems, setArmazems] = useState<Armazem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArmazem, setEditingArmazem] = useState<Armazem | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: number) => {
    const armazem = armazems.find(a => a.id === id);
    if (armazem) {
      setEditingArmazem(armazem);
      setFormData({
        nome: armazem.nome,
        pais: armazem.pais,
        estado: armazem.estado,
        cidade: armazem.cidade,
        bairro: armazem.bairro,
        rua: armazem.rua,
        numero: armazem.numero,
        cep: armazem.cep,
      });
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este armazém?')) {
      axios.delete(`http://127.0.0.1:8000/armazem/${id}`)
        .then(() => {
          setArmazems(armazems.filter(armazem => armazem.id !== id));
        })
        .catch(error => console.error("Erro ao deletar armazém:", error));
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/armazem/');
      setArmazems(response.data);
    } catch (error) {
      console.error("Erro ao buscar armazéns:", error);
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
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.nome.trim()) {
      alert("Por favor, informe o nome do armazém");
      return;
    }

    if (!formData.cep.trim()) {
      alert("Por favor, informe o CEP");
      return;
    }

    try {
      if (editingArmazem) {
        // Update existing armazem
        await axios.put(`http://127.0.0.1:8000/armazem/${editingArmazem.id}`, formData);
        alert("Armazém atualizado com sucesso!");
      } else {
        // Create new armazem
        await axios.post("http://127.0.0.1:8000/armazem/", formData);
        alert("Armazém criado com sucesso!");
      }
      
      // Reset form and hide it
      setFormData(initialFormState);
      setEditingArmazem(null);
      setShowForm(false);
      
      // Refresh the data
      fetchData();
      
    } catch (error: any) {
      alert(
        `Erro ao ${editingArmazem ? 'atualizar' : 'criar'} armazém: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingArmazem(null);
    setShowForm(false);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'País', accessor: 'pais' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Cidade', accessor: 'cidade' },
    { header: 'Bairro', accessor: 'bairro' },
    { header: 'Rua', accessor: 'rua' },
    { header: 'Número', accessor: 'numero' },
    { header: 'CEP', accessor: 'cep' }
  ];

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando armazéns...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Armazéns</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Adicionar Armazém'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingArmazem ? 'Editar Armazém' : 'Criar Novo Armazém'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">Nome do Armazém</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleFormChange}
                  placeholder="Ex: Armazém Central"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  id="pais"
                  name="pais"
                  type="text"
                  value={formData.pais}
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
                  placeholder="Ex: São Paulo"
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
                  placeholder="Ex: São Paulo"
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
                  placeholder="Ex: Vila Olímpia"
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
                  placeholder="Ex: Rua das Flores"
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
                  placeholder="Ex: 123"
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
                  placeholder="Ex: 01234-567"
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
                {editingArmazem ? 'Atualizar Armazém' : 'Criar Armazém'}
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
          data={armazems} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default StoreroomPage;
