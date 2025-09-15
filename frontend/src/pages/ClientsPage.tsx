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

interface ClientWithDetails extends Client {
  email?: string; // Email é opcional
}

const ClientsPage: React.FC = () => {
  const [clientsWithDetails, setClientsWithDetails] = useState<ClientWithDetails[]>([]);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/cliente/editar/${id}`);
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
  axios.delete(`http://127.0.0.1:8000/cliente/${id}`)
    .then(() => {
      setClientsWithDetails(clientsWithDetails.filter(client => client.id !== id));
    })
    .catch(error => console.error("Erro ao deletar cliente:", error));
    }
  };


 useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, emailsResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/cliente/'), // Endpoint de clientes
          axios.get('http://127.0.0.1:8000/cliente-email/') // Endpoint de emails
        ]);

        const clients = clientsResponse.data;
        const emails = emailsResponse.data;

        // Cria um mapa para acesso rápido aos emails por cliente_id
        const emailMap = new Map<number, string>();
        emails.forEach((emailEntry: { cliente_id: number; email: string }) => {
          // Se um cliente tiver múltiplos emails, pegará o último da lista
          emailMap.set(emailEntry.cliente_id, emailEntry.email);
        });

        // Combina os dados
        const combinedData = clients.map((client: Client) => ({
          ...client,
          email: emailMap.get(client.id) || 'N/A',
        }));

        setClientsWithDetails(combinedData);
      } catch (error) {
        console.error("Erro ao buscar clientes ou emails:", error);
      }
    };

    fetchData();
  }, []);

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
        <DataTable columns={columns} data={clientsWithDetails} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ClientsPage;