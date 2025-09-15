// frontend/src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../components/DataTable';
import './CrudPage.css';

interface Product {
  id: number;
  nome: string;
  preco_venda: number;
  preco_minimo: number;
  status: string;
  data_garantia: string;
  fornecedor_id: number;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

interface ProdutoCategoriaForm {
  categoria_nome: string;
  categoria_id?: number; // Will be set after finding/creating
}

interface ProdutoTraducao {
  id?: number;
  produto_id?: number;
  idioma: string;
  nome: string;
  descricao: string;
}

const initialFormState = {
  nome: "",
  preco_venda: 0,
  preco_minimo: 0,
  status: "",
  data_garantia: "",
  fornecedor_id: 0,
  categorias: [] as ProdutoCategoriaForm[],
  traducoes: [] as ProdutoTraducao[],
};

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleEdit = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        preco_venda: product.preco_venda,
        preco_minimo: product.preco_minimo,
        status: product.status,
        data_garantia: product.data_garantia,
        fornecedor_id: product.fornecedor_id,
        categorias: [], // We'll need to fetch these separately for editing
        traducoes: [], // We'll need to fetch these separately for editing
      });
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      axios.delete(`http://127.0.0.1:8000/produto/${id}`)
        .then(() => {
          setProducts(products.filter(product => product.id !== id));
        })
        .catch(error => console.error("Erro ao deletar produto:", error));
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, fornecedoresResponse, categoriasResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/produto/'),
        axios.get('http://127.0.0.1:8000/fornecedor/'),
        axios.get('http://127.0.0.1:8000/categoria/')
      ]);
      setProducts(productsResponse.data);
      setFornecedores(fornecedoresResponse.data);
      setCategorias(categoriasResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
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
      [name]: name === "preco_venda" || name === "preco_minimo" || name === "fornecedor_id"
        ? Number(value)
        : value,
    }));
  };

  // Category management functions
  const addCategoria = () => {
    setFormData(prevState => ({
      ...prevState,
      categorias: [...prevState.categorias, {
        categoria_nome: '',
        categoria_id: undefined
      }]
    }));
  };

  const removeCategoria = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      categorias: prevState.categorias.filter((_, i) => i !== index)
    }));
  };

  const updateCategoria = async (index: number, nomeCategoria: string) => {
    setFormData(prevState => {
      const updatedCategorias = [...prevState.categorias];
      updatedCategorias[index] = {
        categoria_nome: nomeCategoria,
        categoria_id: undefined // Will be resolved later
      };
      return {
        ...prevState,
        categorias: updatedCategorias
      };
    });
  };

  const findOrCreateCategoria = async (nomeCategoria: string): Promise<number> => {
    const nomeTrimmed = nomeCategoria.trim();
    
    // First, try to find existing category (case-insensitive)
    const existingCategoria = categorias.find(c => 
      c.nome.toLowerCase() === nomeTrimmed.toLowerCase()
    );
    
    if (existingCategoria) {
      return existingCategoria.id;
    }

    // If not found, create new category
    try {
      const response = await axios.post('http://127.0.0.1:8000/categoria/', {
        nome: nomeTrimmed,
        descricao: `Categoria criada automaticamente: ${nomeTrimmed}`
      });
      
      // Add to local state so it's available for other selections
      setCategorias(prev => [...prev, response.data]);
      
      return response.data.id;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw new Error(`Não foi possível criar a categoria: ${nomeTrimmed}`);
    }
  };

  // Translation management functions
  const addTraducao = () => {
    setFormData(prevState => ({
      ...prevState,
      traducoes: [...prevState.traducoes, {
        idioma: '',
        nome: '',
        descricao: ''
      }]
    }));
  };

  const removeTraducao = (index: number) => {
    setFormData(prevState => ({
      ...prevState,
      traducoes: prevState.traducoes.filter((_, i) => i !== index)
    }));
  };

  const updateTraducao = (index: number, field: keyof ProdutoTraducao, value: string) => {
    setFormData(prevState => {
      const updatedTraducoes = [...prevState.traducoes];
      updatedTraducoes[index] = {
        ...updatedTraducoes[index],
        [field]: value
      };
      return {
        ...prevState,
        traducoes: updatedTraducoes
      };
    });
  };

  const validateCategorias = () => {
    // Check for empty category names
    const emptyCategorias = formData.categorias.filter(categoria => !categoria.categoria_nome.trim());
    if (emptyCategorias.length > 0) {
      alert('Por favor, preencha todos os nomes das categorias ou remova as vazias.');
      return false;
    }

    // Check for duplicate categories (case-insensitive)
    const categoriaNames = new Set();
    for (let i = 0; i < formData.categorias.length; i++) {
      const nomeCategoria = formData.categorias[i].categoria_nome.trim().toLowerCase();
      if (categoriaNames.has(nomeCategoria)) {
        alert(`Categoria duplicada encontrada: ${formData.categorias[i].categoria_nome}. Por favor, remova as categorias duplicadas.`);
        return false;
      }
      categoriaNames.add(nomeCategoria);
    }

    return true;
  };

  const validateTraducoes = () => {
    // Check for empty fields
    for (let i = 0; i < formData.traducoes.length; i++) {
      const traducao = formData.traducoes[i];
      if (!traducao.idioma.trim() || !traducao.nome.trim()) {
        alert(`Por favor, preencha todos os campos obrigatórios da tradução ${i + 1}.`);
        return false;
      }
    }

    // Check for duplicate languages
    const idiomaSet = new Set();
    for (let i = 0; i < formData.traducoes.length; i++) {
      const idioma = formData.traducoes[i].idioma.trim().toLowerCase();
      if (idiomaSet.has(idioma)) {
        alert(`Idioma duplicado encontrado: ${formData.traducoes[i].idioma}. Por favor, remova os idiomas duplicados.`);
        return false;
      }
      idiomaSet.add(idioma);
    }

    return true;
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate required fields
    if (!formData.nome.trim()) {
      alert("Por favor, informe o nome do produto");
      return;
    }

    if (formData.preco_venda <= 0) {
      alert("Por favor, informe um preço de venda válido");
      return;
    }

    if (formData.preco_minimo <= 0) {
      alert("Por favor, informe um preço mínimo válido");
      return;
    }

    // Validate categories if any are provided
    if (formData.categorias.length > 0 && !validateCategorias()) {
      return;
    }

    // Validate translations if any are provided
    if (formData.traducoes.length > 0 && !validateTraducoes()) {
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product - only basic info for now
        const productData = {
          nome: formData.nome,
          preco_venda: formData.preco_venda,
          preco_minimo: formData.preco_minimo,
          status: formData.status,
          data_garantia: formData.data_garantia,
          fornecedor_id: formData.fornecedor_id
        };
        
        await axios.patch(`http://127.0.0.1:8000/produto/${editingProduct.id}`, productData);
        alert("Produto atualizado com sucesso!");
      } else {
        // Create new product
        const productData = {
          nome: formData.nome,
          preco_venda: formData.preco_venda,
          preco_minimo: formData.preco_minimo,
          status: formData.status,
          data_garantia: formData.data_garantia,
          fornecedor_id: formData.fornecedor_id
        };

        const productResponse = await axios.post("http://127.0.0.1:8000/produto/", productData);
        const novoProdutoId = productResponse.data.id;

        // Create categories if they exist
        for (const categoriaForm of formData.categorias) {
          if (categoriaForm.categoria_nome.trim()) {
            try {
              const categoriaId = await findOrCreateCategoria(categoriaForm.categoria_nome);
              await axios.post('http://127.0.0.1:8000/categoria_produto/', {
                categoria_id: categoriaId,
                produto_id: novoProdutoId,
              });
            } catch (error) {
              console.error('Erro ao processar categoria:', error);
              alert(`Erro ao processar categoria "${categoriaForm.categoria_nome}": ${error}`);
            }
          }
        }

        // Create translations if they exist
        for (const traducao of formData.traducoes) {
          if (traducao.idioma.trim() && traducao.nome.trim()) {
            await axios.post('http://127.0.0.1:8000/produto-traducao/', {
              idioma: traducao.idioma.trim(),
              nome: traducao.nome.trim(),
              descricao: traducao.descricao.trim(),
              produto_id: novoProdutoId,
            });
          }
        }
        
        alert("Produto criado com sucesso!");
      }
      
      // Reset form and hide it
      setFormData(initialFormState);
      setEditingProduct(null);
      setShowForm(false);
      
      // Refresh the data
      fetchData();
      
    } catch (error: any) {
      alert(
        `Erro ao ${editingProduct ? 'atualizar' : 'criar'} produto: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  const handleCancelForm = () => {
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getFornecedorName = (fornecedorId: number) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nome : `ID: ${fornecedorId}`;
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: "Nome", accessor: "nome" },
    { 
      header: "Preço Venda", 
      accessor: "preco_venda_formatted",
      render: (product: Product) => formatCurrency(product.preco_venda)
    },
    { 
      header: "Preço Mínimo", 
      accessor: "preco_minimo_formatted",
      render: (product: Product) => formatCurrency(product.preco_minimo)
    },
    { header: "Status", accessor: "status" },
    { 
      header: "Data Garantia", 
      accessor: "data_garantia_formatted",
      render: (product: Product) => formatDate(product.data_garantia)
    },
    { 
      header: "Fornecedor", 
      accessor: "fornecedor_nome",
      render: (product: Product) => getFornecedorName(product.fornecedor_id)
    },
  ];

  // Format data for display
  const formattedProducts = products.map(product => ({
    ...product,
    preco_venda_formatted: formatCurrency(product.preco_venda),
    preco_minimo_formatted: formatCurrency(product.preco_minimo),
    data_garantia_formatted: formatDate(product.data_garantia),
    fornecedor_nome: getFornecedorName(product.fornecedor_id),
  }));

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Produtos</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Adicionar Produto'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="form-section">
          <h2>{editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}</h2>
          <form className="crud-form" onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleFormChange}
                  placeholder="Ex: Smartphone XYZ"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preco_venda">Preço de Venda</label>
                <input
                  id="preco_venda"
                  name="preco_venda"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco_venda}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preco_minimo">Preço Mínimo</label>
                <input
                  id="preco_minimo"
                  name="preco_minimo"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco_minimo}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecione o status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Descontinuado">Descontinuado</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="data_garantia">Data da Garantia</label>
                <input
                  id="data_garantia"
                  name="data_garantia"
                  type="date"
                  value={formData.data_garantia}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fornecedor_id">Fornecedor</label>
                <select
                  id="fornecedor_id"
                  name="fornecedor_id"
                  value={formData.fornecedor_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value={0}>Selecione um fornecedor</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categories Section - Only shown for new products */}
            {!editingProduct && (
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Categorias do Produto</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={addCategoria}
                  >
                    + Adicionar Categoria
                  </button>
                </div>

                {formData.categorias.length === 0 && (
                  <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                    Nenhuma categoria adicionada. Clique em "Adicionar Categoria" para começar.
                  </p>
                )}

                {formData.categorias.map((categoriaForm, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #dee2e6', 
                    borderRadius: '5px', 
                    padding: '15px', 
                    marginBottom: '10px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: '0', color: '#495057' }}>Categoria {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCategoria(index)}
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
                      <label>Nome da Categoria</label>
                      <input
                        type="text"
                        value={categoriaForm.categoria_nome}
                        onChange={(e) => updateCategoria(index, e.target.value)}
                        placeholder="Digite o nome da categoria (será criada se não existir)"
                        list={`categorias-list-${index}`}
                        required
                        style={{ width: '100%' }}
                      />
                      <datalist id={`categorias-list-${index}`}>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.nome} />
                        ))}
                      </datalist>
                      <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        Se a categoria já existir, ela será reutilizada. Caso contrário, uma nova será criada automaticamente.
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Translations Section - Only shown for new products */}
            {!editingProduct && (
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Traduções do Produto</h3>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={addTraducao}
                  >
                    + Adicionar Tradução
                  </button>
                </div>

                {formData.traducoes.length === 0 && (
                  <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                    Nenhuma tradução adicionada. Clique em "Adicionar Tradução" para começar.
                  </p>
                )}

                {formData.traducoes.map((traducao, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #dee2e6', 
                    borderRadius: '5px', 
                    padding: '15px', 
                    marginBottom: '10px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: '0', color: '#495057' }}>Tradução {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTraducao(index)}
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
                    
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                      <div className="form-group">
                        <label>Idioma</label>
                        <select
                          value={traducao.idioma}
                          onChange={(e) => updateTraducao(index, 'idioma', e.target.value)}
                          required
                        >
                          <option value="">Selecione um idioma</option>
                          <option value="en">Inglês</option>
                          <option value="es">Espanhol</option>
                          <option value="fr">Francês</option>
                          <option value="de">Alemão</option>
                          <option value="it">Italiano</option>
                          <option value="ja">Japonês</option>
                          <option value="ko">Coreano</option>
                          <option value="zh">Chinês</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Nome Traduzido</label>
                        <input
                          type="text"
                          value={traducao.nome}
                          onChange={(e) => updateTraducao(index, 'nome', e.target.value)}
                          placeholder="Nome do produto no idioma selecionado"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Descrição Traduzida</label>
                        <input
                          type="text"
                          value={traducao.descricao}
                          onChange={(e) => updateTraducao(index, 'descricao', e.target.value)}
                          placeholder="Descrição do produto no idioma selecionado"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Note for editing products */}
            {editingProduct && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '15px', 
                marginBottom: '20px' 
              }}>
                <strong>Nota:</strong> Para editar as categorias e traduções deste produto, use as funcionalidades específicas de gestão.
                Esta tela permite apenas editar as informações básicas do produto.
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleCancelForm}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
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
          data={formattedProducts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default ProductPage;
