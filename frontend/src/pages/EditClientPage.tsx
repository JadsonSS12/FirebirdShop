import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CrudPage.css';

const EditClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os dados atuais do cliente para preencher o formulário
    axios.get(`http://127.0.0.1:8000/cliente/${id}`)
      .then(response => {
        setNome(response.data.nome);
        setEmail(response.data.email);
      });
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.put(`http://127.0.0.1:8000/cliente/${id}`, { nome, email })
      .then(() => navigate('/cliente'))
      .catch(error => console.error("Erro ao editar cliente:", error));
  };

  return (
    <div className="crud-page">
      <header className="page-header"><h1>Editar Cliente</h1></header>
      <form className="crud-form" onSubmit={handleSubmit}>
        {/* Formulário similar ao de Adicionar */}
        <div className="form-group"><label>Nome</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} /></div>
        <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <button type="submit" className="btn-primary">Atualizar</button>
      </form>
    </div>
  );
};

export default EditClientPage;