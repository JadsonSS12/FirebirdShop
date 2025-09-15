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
  emails: string[];
  telefones: string[];
  emails_formatted: string;
  telefones_formatted: string;
}

const ClientsPage: React.FC = () => {
  const [clientsWithDetails, setClientsWithDetails] = useState<ClientWithDetails[]>([]);
  const navigate = useNavigate();

  const formatEmails = (emails: string[]) => {
    if (emails.length === 0) return 'N/A';
    if (emails.length === 1) return emails[0];
    return emails.join(', ');
  };

  const formatTelefones = (telefones: string[]) => {
    if (telefones.length === 0) return 'N/A';
    if (telefones.length === 1) return telefones[0];
    return telefones.join(', ');
  };

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
        const [clientsResponse, emailsResponse, telefonesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/cliente/'),
          axios.get('http://127.0.0.1:8000/cliente-email/'),
          axios.get('http://127.0.0.1:8000/cliente-telefone/')
        ]);

        const clients = clientsResponse.data;
        const emails = emailsResponse.data;
        const telefones = telefonesResponse.data;

        const emailMap = new Map<number, string[]>();
        emails.forEach((emailEntry: { cliente_id: number; email: string }) => {
          if (!emailMap.has(emailEntry.cliente_id)) {
            emailMap.set(emailEntry.cliente_id, []);
          }
          emailMap.get(emailEntry.cliente_id)?.push(emailEntry.email);
        });

        const telefoneMap = new Map<number, string[]>();
        telefones.forEach((telefoneEntry: { cliente_id: number; telefone: string }) => {
          if (!telefoneMap.has(telefoneEntry.cliente_id)) {
            telefoneMap.set(telefoneEntry.cliente_id, []);
          }
          telefoneMap.get(telefoneEntry.cliente_id)?.push(telefoneEntry.telefone);
        });

        const combinedData = clients.map((client: Client) => ({
          ...client,
          emails: emailMap.get(client.id) || [],
          telefones: telefoneMap.get(client.id) || [],
          emails_formatted: formatEmails(emailMap.get(client.id) || []),
          telefones_formatted: formatTelefones(telefoneMap.get(client.id) || []),
        }));

        setClientsWithDetails(combinedData);
      } catch (error) {
        console.error("Erro ao buscar clientes, emails ou telefones:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'CPF/CNPJ', accessor: 'cpf_cnpj' },
    { header: 'País', accessor: 'pais' },
    { header: 'Cadastro', accessor: 'data_cadastro' },
    { header: 'Emails', accessor: 'emails_formatted' },
    { header: 'Telefones', accessor: 'telefones_formatted' },
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