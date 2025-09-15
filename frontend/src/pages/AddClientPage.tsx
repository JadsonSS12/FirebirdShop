import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrudPage.css';

const initialFormState = {
    nome: '',
    cpf_cnpj: '',
    limite_de_credito: 0,
    pais: 'Brasil', // Valor padrão
    data_cadastro: new Date().toISOString().split('T')[0],
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
    emails: [] as string[],
    telefones: [] as string[],
};

const AddClientPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  // Função genérica para a mudança em qualquer input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addEmail = () => {
    setFormData(prevState => ({
      ...prevState,
      emails: [...prevState.emails, '']
    }));
  };

  const removeEmail = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      emails: prevState.emails.filter((_, i) => i !== index)
    }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData(prevState => {
      const updatedEmails = [...prevState.emails];
      updatedEmails[index] = value;
      return {
        ...prevState,
        emails: updatedEmails
      };
    });
  };

  const validateEmails = () => {
    // Check for empty emails
    const emptyEmails = formData.emails.filter(email => email.trim() === '');
    if (emptyEmails.length > 0) {
      alert('Por favor, preencha todos os campos de email ou remova os vazios.');
      return false;
    }

    // Check for duplicate emails
    const emailSet = new Set();
    for (let i = 0; i < formData.emails.length; i++) {
      const email = formData.emails[i].trim().toLowerCase();
      if (emailSet.has(email)) {
        alert(`Email duplicado encontrado: ${formData.emails[i]}. Por favor, remova os emails duplicados.`);
        return false;
      }
      emailSet.add(email);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let i = 0; i < formData.emails.length; i++) {
      const email = formData.emails[i].trim();
      if (!emailRegex.test(email)) {
        alert(`Email inválido: ${email}. Por favor, digite um email válido.`);
        return false;
      }
    }

    return true;
  };

  const addTelefone = () => {
    setFormData(prevState => ({
      ...prevState,
      telefones: [...prevState.telefones, '']
    }));
  };

  const removeTelefone = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      telefones: prevState.telefones.filter((_, i) => i !== index)
    }));
  };

  const updateTelefone = (index: number, value: string) => {
    setFormData(prevState => {
      const updatedTelefones = [...prevState.telefones];
      updatedTelefones[index] = value;
      return {
        ...prevState,
        telefones: updatedTelefones
      };
    });
  };

  const validateTelefones = () => {
    // Check for empty phones
    const emptyTelefones = formData.telefones.filter(telefone => telefone.trim() === '');
    if (emptyTelefones.length > 0) {
      alert('Por favor, preencha todos os campos de telefone ou remova os vazios.');
      return false;
    }

    // Check for duplicate phones
    const telefoneSet = new Set();
    for (let i = 0; i < formData.telefones.length; i++) {
      const telefone = formData.telefones[i].trim().replace(/\D/g, ''); // Remove non-digits for comparison
      if (telefoneSet.has(telefone)) {
        alert(`Telefone duplicado encontrado: ${formData.telefones[i]}. Por favor, remova os telefones duplicados.`);
        return false;
      }
      telefoneSet.add(telefone);
    }

    // Validate phone format (basic validation - at least 8 digits)
    for (let i = 0; i < formData.telefones.length; i++) {
      const telefone = formData.telefones[i].trim().replace(/\D/g, '');
      if (telefone.length < 8) {
        alert(`Telefone inválido: ${formData.telefones[i]}. Por favor, digite um telefone válido com pelo menos 8 dígitos.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate emails if any are provided
    if (formData.emails.length > 0 && !validateEmails()) {
      return;
    }

    // Validate phones if any are provided
    if (formData.telefones.length > 0 && !validateTelefones()) {
      return;
    }

     try {
      // 1. Cria o cliente principal (sem os emails e telefones)
      const clienteResponse = await axios.post('http://127.0.0.1:8000/cliente/', {
        // Enviamos todos os dados, exceto os emails e telefones
        nome: formData.nome,
        cpf_cnpj: formData.cpf_cnpj,
        limite_de_credito: formData.limite_de_credito,
        pais: formData.pais,
        data_cadastro: formData.data_cadastro,
        cep: formData.cep,
        estado: formData.estado,
        cidade: formData.cidade,
        bairro: formData.bairro,
        rua: formData.rua,
        numero: formData.numero,
        complemento: formData.complemento,
      });

      const novoClienteId = clienteResponse.data.id;

      for (const email of formData.emails) {
        if (email.trim()) {
          await axios.post('http://127.0.0.1:8000/cliente-email/', {
            email: email.trim(),
            cliente_id: novoClienteId, 
          });
        }
      }

      // 3. Cria os telefones se existirem
      for (const telefone of formData.telefones) {
        if (telefone.trim()) {
          await axios.post('http://127.0.0.1:8000/cliente-telefone/', {
            telefone: telefone.trim(),
            cliente_id: novoClienteId, 
          });
        }
      }

      navigate('/cliente');

    } catch (error) {
      console.error("Erro ao adicionar cliente, emails ou telefones:", error);
      alert("Ocorreu um erro. Verifique o console para mais detalhes.");
    };
  };

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Adicionar Novo Cliente</h1>
      </header>
      
      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
            <input id="cpf_cnpj" name="cpf_cnpj" type="text" value={formData.cpf_cnpj} onChange={handleChange} required />
          </div>
        </div>

        {/* Emails Section */}
        

        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="limite_de_credito">Limite de Crédito</label>
            <input id="limite_de_credito" name="limite_de_credito" type="number" step="0.01" value={formData.limite_de_credito} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="rua">Rua</label>
            <input id="rua" name="rua" type="text" value={formData.rua} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <input id="estado" name="estado" type="text" value={formData.estado} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="pais">País</label>
            <input id="pais" name="pais" type="text" value={formData.pais} onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label htmlFor="complemento">Complemento</label>
            <input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} />
          </div>

          <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Emails do Cliente</h3>
            <button
              type="button"
              className="btn-primary"
              onClick={addEmail}
            >
              + Adicionar Email
            </button>
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
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
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
              
              <div className="form-group">
                <label>Endereço de Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="exemplo@email.com"
                  required={formData.emails.length > 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Telefones Section */}
        <div className="form-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Telefones do Cliente</h3>
            <button
              type="button"
              className="btn-primary"
              onClick={addTelefone}
            >
              + Adicionar Telefone
            </button>
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
                <button
                  type="button"
                  onClick={() => removeTelefone(index)}
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
              
              <div className="form-group">
                <label>Número de Telefone</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => updateTelefone(index, e.target.value)}
                  placeholder="(11) 99999-9999"
                  required={formData.telefones.length > 0}
                />
              </div>
            </div>
          ))}
        </div>
        </div>
        
        <button type="submit" className="btn-primary">Salvar Cliente</button>
      </form>
    </div>
  );
};

export default AddClientPage;