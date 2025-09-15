import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Client {
  id?: number;
  nome: string;
  cpf_cnpj: string;
  limite_de_credito: number;
  pais: string;
  data_cadastro: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}

interface ClientWithDetails extends Client {
  emails: string[];
  telefones: string[];
  emails_formatted: string;
  telefones_formatted: string;
}

const initialFormState: Client & { emails: string[]; telefones: string[] } = {
  nome: '',
  cpf_cnpj: '',
  limite_de_credito: 0,
  pais: 'Brasil',
  data_cadastro: new Date().toISOString().split('T')[0],
  cep: '',
  estado: '',
  cidade: '',
  bairro: '',
  rua: '',
  numero: '',
  complemento: '',
  emails: [],
  telefones: [],
};

const ClientsPage: React.FC = () => {
  const [clientsWithDetails, setClientsWithDetails] = useState<ClientWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithDetails | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  // Funções de emails
  const addEmail = () => setFormData(prev => ({ ...prev, emails: [...prev.emails, ''] }));
  const removeEmail = (index: number) => setFormData(prev => ({
    ...prev,
    emails: prev.emails.filter((_, i) => i !== index)
  }));
  const updateEmail = (index: number, value: string) => setFormData(prev => {
    const updated = [...prev.emails];
    updated[index] = value;
    return { ...prev, emails: updated };
  });

  // Funções de telefones
  const addTelefone = () => setFormData(prev => ({ ...prev, telefones: [...prev.telefones, ''] }));
  const removeTelefone = (index: number) => setFormData(prev => ({
    ...prev,
    telefones: prev.telefones.filter((_, i) => i !== index)
  }));
  const updateTelefone = (index: number, value: string) => setFormData(prev => {
    const updated = [...prev.telefones];
    updated[index] = value;
    return { ...prev, telefones: updated };
  });

  // Validações
  const validateEmails = () => {
    const emptyEmails = formData.emails.filter(email => email.trim() === '');
    if (emptyEmails.length > 0) {
      alert('Preencha todos os campos de email ou remova os vazios.');
      return false;
    }
    const emailSet = new Set();
    for (const email of formData.emails) {
      const lower = email.trim().toLowerCase();
      if (emailSet.has(lower)) {
        alert(`Email duplicado: ${email}`);
        return false;
      }
      emailSet.add(lower);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of formData.emails) {
      if (!emailRegex.test(email.trim())) {
        alert(`Email inválido: ${email}`);
        return false;
      }
    }
    return true;
  };

  const validateTelefones = () => {
    const emptyTelefones = formData.telefones.filter(t => t.trim() === '');
    if (emptyTelefones.length > 0) {
      alert('Preencha todos os campos de telefone ou remova os vazios.');
      return false;
    }
    const telefoneSet = new Set();
    for (const telefone of formData.telefones) {
      const num = telefone.trim().replace(/\D/g, '');
      if (telefoneSet.has(num)) {
        alert(`Telefone duplicado: ${telefone}`);
        return false;
      }
      telefoneSet.add(num);
      if (num.length < 8) {
        alert(`Telefone inválido: ${telefone}`);
        return false;
      }
    }
    return true;
  };

  // Carregar clientes
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
          if (!emailMap.has(emailEntry.cliente_id)) emailMap.set(emailEntry.cliente_id, []);
          emailMap.get(emailEntry.cliente_id)?.push(emailEntry.email);
        });

        const telefoneMap = new Map<number, string[]>();
        telefones.forEach((telefoneEntry: { cliente_id: number; telefone: string }) => {
          if (!telefoneMap.has(telefoneEntry.cliente_id)) telefoneMap.set(telefoneEntry.cliente_id, []);
          telefoneMap.get(telefoneEntry.cliente_id)?.push(telefoneEntry.telefone);
        });

        const combinedData = clients.map((client: Client) => ({
          ...client,
          emails: emailMap.get(client.id!) || [],
          telefones: telefoneMap.get(client.id!) || [],
          emails_formatted: (emailMap.get(client.id!) || []).join(', ') || 'N/A',
          telefones_formatted: (telefoneMap.get(client.id!) || []).join(', ') || 'N/A',
        }));

        setClientsWithDetails(combinedData);
      } catch (error) {
        console.error("Erro ao buscar clientes, emails ou telefones:", error);
      }
    };
    fetchData();
  }, []);

  // Editar cliente
  const handleEdit = (id: number) => {
    const client = clientsWithDetails.find(c => c.id === id);
    if (client) {
      setEditingClient(client);
      setFormData({
        ...client,
        emails: [...client.emails],
        telefones: [...client.telefones],
        data_cadastro: typeof client.data_cadastro === 'string'
          ? client.data_cadastro
          : new Date(client.data_cadastro).toISOString().split('T')[0],
      });
      setShowForm(true);
    }
  };

  // Excluir cliente
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/cliente/${id}`);
        setClientsWithDetails(clientsWithDetails.filter(client => client.id !== id));
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      }
    }
  };

  // Cancelar formulário
  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingClient(null);
    setShowForm(false);
  };

  // Alteração dos campos
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'limite_de_credito' ? Number(value) : value
    }));
  };

  // Salvar cliente (add/edit)
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.emails.length > 0 && !validateEmails()) return;
    if (formData.telefones.length > 0 && !validateTelefones()) return;

    try {
      let clienteId = editingClient?.id;
      if (editingClient) {
        // Atualizar cliente
        await axios.put(`http://127.0.0.1:8000/cliente/${clienteId}`, {
          ...formData,
        });
          const emailsResponse = await axios.get(`http://127.0.0.1:8000/cliente-email-cliente/${clienteId}`);
          for (const emailObj of emailsResponse.data) {
            await axios.delete(`http://127.0.0.1:8000/cliente-email/${emailObj.id}`);
          }

          const telefonesResponse = await axios.get(`http://127.0.0.1:8000/cliente-telefone-cliente/${clienteId}`);
          for (const telefoneObj of telefonesResponse.data) {
            await axios.delete(`http://127.0.0.1:8000/cliente-telefone/${telefoneObj.id}`);
  }
      } else {
        // Criar cliente
        const clienteResponse = await axios.post('http://127.0.0.1:8000/cliente/', {
          ...formData,
        });
        clienteId = clienteResponse.data.id;
      }

      // Salvar emails
      for (const email of formData.emails) {
        if (email.trim()) {
          await axios.post('http://127.0.0.1:8000/cliente-email/', {
            email: email.trim(),
            cliente_id: clienteId,
          });
        }
      }
      // Salvar telefones
      for (const telefone of formData.telefones) {
        if (telefone.trim()) {
          await axios.post('http://127.0.0.1:8000/cliente-telefone/', {
            telefone: telefone.trim(),
            cliente_id: clienteId,
          });
        }
      }

      alert(editingClient ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!");
      setFormData(initialFormState);
      setEditingClient(null);
      setShowForm(false);

      // Atualiza lista
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
        if (!emailMap.has(emailEntry.cliente_id)) emailMap.set(emailEntry.cliente_id, []);
        emailMap.get(emailEntry.cliente_id)?.push(emailEntry.email);
      });

      const telefoneMap = new Map<number, string[]>();
      telefones.forEach((telefoneEntry: { cliente_id: number; telefone: string }) => {
        if (!telefoneMap.has(telefoneEntry.cliente_id)) telefoneMap.set(telefoneEntry.cliente_id, []);
        telefoneMap.get(telefoneEntry.cliente_id)?.push(telefoneEntry.telefone);
      });

      const combinedData = clients.map((client: Client) => ({
        ...client,
        emails: emailMap.get(client.id!) || [],
        telefones: telefoneMap.get(client.id!) || [],
        emails_formatted: (emailMap.get(client.id!) || []).join(', ') || 'N/A',
        telefones_formatted: (telefoneMap.get(client.id!) || []).join(', ') || 'N/A',
      }));

      setClientsWithDetails(combinedData);

    } catch (error: any) {
      alert(`Erro ao ${editingClient ? 'atualizar' : 'criar'} cliente: ${error.response?.data?.detail || error.message}`);
    }
  };

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

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clientsWithDetails;
    const lowercasedFilter = searchTerm.toLowerCase();
    return clientsWithDetails.filter((client) =>
      client.nome.toLowerCase().includes(lowercasedFilter) ||
      client.cpf_cnpj.includes(lowercasedFilter) ||
      client.emails_formatted.toLowerCase().includes(lowercasedFilter) ||
      client.cidade.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, clientsWithDetails]);

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Clientes</h1>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={() => {
              setFormData(initialFormState);
              setEditingClient(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancelar' : 'Adicionar Cliente'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
                <input id="cpf_cnpj" name="cpf_cnpj" type="text" value={formData.cpf_cnpj} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="limite_de_credito">Limite de Crédito</label>
                <input id="limite_de_credito" name="limite_de_credito" type="number" step="0.01" value={formData.limite_de_credito} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="rua">Rua</label>
                <input id="rua" name="rua" type="text" value={formData.rua} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="numero">Número</label>
                <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input id="estado" name="estado" type="text" value={formData.estado} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input id="pais" name="pais" type="text" value={formData.pais} onChange={handleFormChange} required />
              </div>
              <div className="form-group full-width">
                <label htmlFor="complemento">Complemento</label>
                <input id="complemento" name="complemento" type="text" value={formData.complemento || ''} onChange={handleFormChange} />
              </div>
            </div>

            {/* Emails */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Emails do Cliente</h3>
                <button type="button" className="btn-primary" onClick={addEmail}>+ Adicionar Email</button>
              </div>
              {formData.emails.length === 0 && (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                  Nenhum email adicionado. Clique em "Adicionar Email" para começar.
                </p>
              )}
              {formData.emails.map((email, index) => (
                <div key={index} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '5px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0', color: '#495057' }}>Email {index + 1}</h4>
                    <button type="button" onClick={() => removeEmail(index)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}>
                      Remover
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Endereço de Email</label>
                    <input type="email" value={email} onChange={e => updateEmail(index, e.target.value)}
                      placeholder="exemplo@email.com" required={formData.emails.length > 0} />
                  </div>
                </div>
              ))}
            </div>

            {/* Telefones */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Telefones do Cliente</h3>
                <button type="button" className="btn-primary" onClick={addTelefone}>+ Adicionar Telefone</button>
              </div>
              {formData.telefones.length === 0 && (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                  Nenhum telefone adicionado. Clique em "Adicionar Telefone" para começar.
                </p>
              )}
              {formData.telefones.map((telefone, index) => (
                <div key={index} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '5px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: '0', color: '#495057' }}>Telefone {index + 1}</h4>
                    <button type="button" onClick={() => removeTelefone(index)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}>
                      Remover
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Número de Telefone</label>
                    <input type="tel" value={telefone} onChange={e => updateTelefone(index, e.target.value)}
                      placeholder="(11) 99999-9999" required={formData.telefones.length > 0} />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelForm}>Cancelar</button>
              <button type="submit" className="btn-primary">
                {editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="action-bar">
        <input
          type="text"
          placeholder="Pesquisa rápida por palavras-chave..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={filteredClients} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ClientsPage;