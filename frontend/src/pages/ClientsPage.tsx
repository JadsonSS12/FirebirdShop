// frontend/src/pages/ClientsPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import { Link, useNavigate } from 'react-router-dom';
import './CrudPage.css';

interface Client {
  id: number;
  nome: string;
    cpf_cnpj: string;
    limite_de_credito: number;
    pais: string;
    data_cadastro: Date;
    cep: string;
    estado: string
    cidade: string
    bairro: string
    rua: string
    numero: string
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/clientes/editar/${id}`);
  }

  const handleDelete = (id: number) => {
    // Pede confirmação antes de deletar
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      axios.delete(`http://127.0.0.1:8000/cliente/${id}`)
        .then(() => {
          // Remove o cliente da lista na tela sem precisar recarregar a página
          setClients(clients.filter(client => client.id !== id));
        })
        .catch(error => console.error("Erro ao deletar cliente:", error));
    }
  };


  useEffect(() => {
    // Busca os dados dos clientes do seu backend FastAPI
    axios.get<Client[]>('http://127.0.0.1:8000/cliente/')
      .then(response => setClients(response.data));
  }, []);

  // Defina as colunas para a tabela
  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'CPF/CNPJ', accessor: 'cpf_cnpj' },
    { header: 'País', accessor: 'pais' },
    { header: 'Cadastro', accessor: 'data_cadastro' },
    { header: 'Email', accessor: 'email' },
    { header: 'CEP', accessor: 'cep' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Cidade', accessor: 'cidade' },
    { header: 'Bairro', accessor: 'bairro' },
    { header: 'Rua', accessor: 'rua' },
    { header: 'Número', accessor: 'numero' }
  ];

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Clientes</h1>
        <div className="header-actions">
            <Link to="/cliente/novo">
          <button className="btn-primary">Adicionar Cliente</button>
          </Link>
        </div>
      </header>

      <div className="action-bar">
        <input type="text" placeholder="Pesquisa rápida por palavras-chave..." />
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={clients} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ClientsPage;