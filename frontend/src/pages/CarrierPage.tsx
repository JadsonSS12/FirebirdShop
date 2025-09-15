import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Transportadora {
  id: number;
  nome: string;
  nome_fantasia: string;
  cnpj: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
}

interface TransportadoraWithDetails extends Transportadora {
  emails: string[];
  telefones: string[];
  emails_formatted: string;
  telefones_formatted: string;
}

const initialFormState: Omit<TransportadoraWithDetails, 'id' | 'emails_formatted' | 'telefones_formatted'> = {
  nome: '',
  nome_fantasia: '',
  cnpj: '',
  cep: '',
  estado: '',
  cidade: '',
  bairro: '',
  rua: '',
  numero: '',
  emails: [],
  telefones: []
};

const CarrierPage: React.FC = () => {
  const [transportadoras, setTransportadoras] = useState<TransportadoraWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<TransportadoraWithDetails | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const formatEmails = (emails: string[]) => {
    if (!emails || emails.length === 0) return 'N/A';
    return emails.join(', ');
  };

  const formatTelefones = (telefones: string[]) => {
    if (!telefones || telefones.length === 0) return 'N/A';
    return telefones.join(', ');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carriersResp, emailsResp, telefonesResp] = await Promise.all([
        axios.get('http://127.0.0.1:8000/transportadora/'),
        axios.get('http://127.0.0.1:8000/transportadora-email/'),
        axios.get('http://127.0.0.1:8000/transportadora-telefone/')
      ]);

      const carriers = carriersResp.data;
      const emails = emailsResp.data;
      const telefones = telefonesResp.data;

      const emailMap = new Map<number, string[]>();
      emails.forEach((entry: { transportadora_id: number; email: string }) => {
        if (!emailMap.has(entry.transportadora_id)) emailMap.set(entry.transportadora_id, []);
        emailMap.get(entry.transportadora_id)!.push(entry.email);
      });

      const telefoneMap = new Map<number, string[]>();
      telefones.forEach((entry: { transportadora_id: number; telefone: string }) => {
        if (!telefoneMap.has(entry.transportadora_id)) telefoneMap.set(entry.transportadora_id, []);
        telefoneMap.get(entry.transportadora_id)!.push(entry.telefone);
      });

      const combined = carriers.map((c: Transportadora) => ({
        ...c,
        emails: emailMap.get(c.id) || [],
        telefones: telefoneMap.get(c.id) || [],
        emails_formatted: formatEmails(emailMap.get(c.id) || []),
        telefones_formatted: formatTelefones(telefoneMap.get(c.id) || []),
      }));

      setTransportadoras(combined);
    } catch (error) {
      console.error('Erro ao buscar transportadoras, emails ou telefones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    const carrier = transportadoras.find(t => t.id === id);
    if (carrier) {
      setEditingCarrier(carrier);
      setFormData({
        ...carrier,
        emails: [...carrier.emails],
        telefones: [...carrier.telefones],
      });
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transportadora?')) return;
    try {
      // Buscar IDs dos emails para deletar
      const emailsResp = await axios.get(`http://127.0.0.1:8000/transportadora-email/`);
      const emailsToDelete = emailsResp.data.filter((email: any) => email.transportadora_id === id);
      for (const email of emailsToDelete) {
        await axios.delete(`http://127.0.0.1:8000/transportadora-email/${email.id}`);
      }
      // Buscar IDs dos telefones para deletar
      const telefonesResp = await axios.get(`http://127.0.0.1:8000/transportadora-telefone/`);
      const telefonesToDelete = telefonesResp.data.filter((telefone: any) => telefone.transportadora_id === id);
      for (const telefone of telefonesToDelete) {
        await axios.delete(`http://127.0.0.1:8000/transportadora-telefone/${telefone.id}`);
      }
      // Depois deletar a transportadora
      await axios.delete(`http://127.0.0.1:8000/transportadora/${id}`);
      setTransportadoras(prev => prev.filter(t => t.id !== id));
      alert('Transportadora excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar transportadora:', error);
      alert('Erro ao excluir transportadora. Tente novamente.');
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingCarrier(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addEmail = () => {
    setFormData(prev => ({ ...prev, emails: [...prev.emails, ''] }));
  };

  const removeEmail = (index: number) => {
    setFormData(prev => ({ ...prev, emails: prev.emails.filter((_, i) => i !== index) }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev.emails];
      arr[index] = value;
      return { ...prev, emails: arr };
    });
  };

  const addTelefone = () => {
    setFormData(prev => ({ ...prev, telefones: [...prev.telefones, ''] }));
  };

  const removeTelefone = (index: number) => {
    setFormData(prev => ({ ...prev, telefones: prev.telefones.filter((_, i) => i !== index) }));
  };

  const updateTelefone = (index: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev.telefones];
      arr[index] = value;
      return { ...prev, telefones: arr };
    });
  };

  const validateEmails = () => {
    const empty = formData.emails.filter(e => e.trim() === '');
    if (empty.length > 0) {
      alert('Preencha ou remova emails vazios.');
      return false;
    }
    const emailSet = new Set<string>();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const em of formData.emails) {
      const s = em.trim().toLowerCase();
      if (emailSet.has(s)) {
        alert(`Email duplicado: ${em}`);
        return false;
      }
      if (!emailRegex.test(em.trim())) {
        alert(`Email inválido: ${em}`);
        return false;
      }
      emailSet.add(s);
    }
    return true;
  };

  const validateTelefones = () => {
    const empty = formData.telefones.filter(t => t.trim() === '');
    if (empty.length > 0) {
      alert('Preencha ou remova telefones vazios.');
      return false;
    }
    const telSet = new Set<string>();
    for (const t of formData.telefones) {
      const normalized = t.replace(/\D/g, '');
      if (telSet.has(normalized)) {
        alert(`Telefone duplicado: ${t}`);
        return false;
      }
      if (normalized.length < 8) {
        alert(`Telefone inválido: ${t}`);
        return false;
      }
      telSet.add(normalized);
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Por favor, informe o nome da transportadora.');
      return;
    }
    if (formData.emails.length > 0 && !validateEmails()) return;
    if (formData.telefones.length > 0 && !validateTelefones()) return;

    try {
      let carrierId = editingCarrier?.id;
      if (editingCarrier) {
        // Atualizar transportadora
        await axios.put(`http://127.0.0.1:8000/transportadora/${carrierId}`, {
          ...formData,
        });

        // Buscar emails atuais da transportadora
        const emailsResp = await axios.get(`http://127.0.0.1:8000/transportadora-email/`);
        const emailsToDelete = emailsResp.data.filter((email: any) => email.transportadora_id === carrierId);
        for (const emailObj of emailsToDelete) {
          await axios.delete(`http://127.0.0.1:8000/transportadora-email/${emailObj.id}`);
        }

        // Buscar telefones atuais da transportadora
        const telefonesResp = await axios.get(`http://127.0.0.1:8000/transportadora-telefone/`);
        const telefonesToDelete = telefonesResp.data.filter((telefone: any) => telefone.transportadora_id === carrierId);
        for (const telefoneObj of telefonesToDelete) {
          await axios.delete(`http://127.0.0.1:8000/transportadora-telefone/${telefoneObj.id}`);
        }
      } else {
        // Criar transportadora
        const resp = await axios.post('http://127.0.0.1:8000/transportadora/', {
          ...formData,
        });
        carrierId = resp.data.id;
      }

      // Salvar emails
      for (const email of formData.emails) {
        if (email.trim()) {
          await axios.post('http://127.0.0.1:8000/transportadora-email/', {
            transportadora_id: carrierId,
            email: email.trim()
          });
        }
      }

      // Salvar telefones
      for (const telefone of formData.telefones) {
        if (telefone.trim()) {
          await axios.post('http://127.0.0.1:8000/transportadora-telefone/', {
            transportadora_id: carrierId,
            telefone: telefone.trim()
          });
        }
      }

      alert(editingCarrier ? "Transportadora atualizada com sucesso!" : "Transportadora criada com sucesso!");
      setFormData(initialFormState);
      setEditingCarrier(null);
      setShowForm(false);
      await fetchData();
    } catch (error: any) {
      alert(`Erro ao ${editingCarrier ? 'atualizar' : 'criar'} transportadora: ${error.response?.data?.detail || error.message}`);
    }
  };

  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Nome Fantasia', accessor: 'nome_fantasia' },
    { header: 'CNPJ', accessor: 'cnpj' },
    { header: 'Emails', accessor: 'emails_formatted' },
    { header: 'Telefones', accessor: 'telefones_formatted' },
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
        <div>Carregando transportadoras...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Transportadoras</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => {
            setFormData(initialFormState);
            setEditingCarrier(null);
            setShowForm(!showForm);
          }}>
            {showForm ? 'Cancelar' : 'Adicionar Transportadora'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingCarrier ? 'Editar Transportadora' : 'Criar Nova Transportadora'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome</label>
                <input name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nome Fantasia</label>
                <input name="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>CNPJ</label>
                <input name="cnpj" value={formData.cnpj} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>CEP</label>
                <input name="cep" value={formData.cep} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Rua</label>
                <input name="rua" value={formData.rua} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Número</label>
                <input name="numero" value={formData.numero} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bairro</label>
                <input name="bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input name="cidade" value={formData.cidade} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input name="estado" value={formData.estado} onChange={handleChange} />
              </div>
            </div>

            {/* Emails */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Emails</h3>
                <button type="button" className="btn-primary" onClick={addEmail}>+ Adicionar Email</button>
              </div>
              {formData.emails.length === 0 && (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>Nenhum email adicionado.</p>
              )}
              {formData.emails.map((email, idx) => (
                <div key={idx} style={{ border: '1px solid #dee2e6', borderRadius: 5, padding: 15, marginBottom: 10, backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h4 style={{ margin: 0 }}>Email {idx + 1}</h4>
                    <button type="button" onClick={() => removeEmail(idx)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 3, padding: '5px 10px' }}>Remover</button>
                  </div>
                  <div className="form-group">
                    <label>Endereço de Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(idx, e.target.value)}
                      placeholder="exemplo@email.com"
                      required={formData.emails.length > 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Telefones */}
            <div className="form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>Telefones</h3>
                <button type="button" className="btn-primary" onClick={addTelefone}>+ Adicionar Telefone</button>
              </div>
              {formData.telefones.length === 0 && (
                <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>Nenhum telefone adicionado.</p>
              )}
              {formData.telefones.map((tel, idx) => (
                <div key={idx} style={{ border: '1px solid #dee2e6', borderRadius: 5, padding: 15, marginBottom: 10, backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h4 style={{ margin: 0 }}>Telefone {idx + 1}</h4>
                    <button type="button" onClick={() => removeTelefone(idx)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 3, padding: '5px 10px' }}>Remover</button>
                  </div>
                  <div className="form-group">
                    <label>Número</label>
                    <input
                      type="tel"
                      value={tel}
                      onChange={(e) => updateTelefone(idx, e.target.value)}
                      placeholder="(11) 99999-9999"
                      required={formData.telefones.length > 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelForm}>Cancelar</button>
              <button type="submit" className="btn-primary">
                {editingCarrier ? 'Atualizar Transportadora' : 'Criar Transportadora'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="action-bar">
        <input type="text" placeholder="Pesquisa rápida por palavras-chave..." />
      </div>

      <div className="table-container">
        <DataTable columns={columns} data={transportadoras} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default CarrierPage;