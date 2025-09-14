# FirebirdShop

Uma API moderna de e-commerce construída com backend FastAPI e banco de dados Firebird.

## Estrutura do Projeto

```
FirebirdShop/
├── backend/          # Aplicação backend FastAPI
│   ├── main.py      # Ponto de entrada principal da aplicação
│   ├── models.py    # Modelos de banco de dados (SQLAlchemy)
│   ├── schemas.py   # Schemas Pydantic para a API
│   ├── crud.py      # Operações de banco de dados
│   ├── database.py  # Configuração do banco de dados
│   └── __pycache__/ # Arquivos de cache do Python
├── venv/            # Ambiente virtual
├── shop.fdb         # Arquivo do banco de dados Firebird
├── LICENSE          # Licença do projeto
└── README.md        # Este arquivo
```

## Pré-requisitos

- Python 3.8 ou superior
- Servidor Firebird 5.0 instalado e executando
- pip (instalador de pacotes Python)

## Configuração do Banco de Dados Firebird

### Instalando o Firebird 5.0

1. **Baixe e instale o Firebird 5.0** do site oficial
2. **Para instalação Linux em /opt/firebird**, certifique-se de que o serviço está executando:

   ```bash
   # Iniciar serviço Firebird
   sudo /opt/firebird/bin/firebird start
   
   # Ou se usando systemd
   sudo systemctl start firebird
   sudo systemctl enable firebird
   ```

3. **Criar o diretório do banco de dados**:

   ```bash
   sudo mkdir -p /opt/firebird/data
   sudo chown firebird:firebird /opt/firebird/data
   ```

4. **Criar o banco de dados**:

   ```bash
   sudo /opt/firebird/bin/isql -user SYSDBA -password masterkey
   ```

   No isql, execute:
   ```sql
   CREATE DATABASE '/opt/firebird/data/shop.fdb';
   QUIT;
   ```

5. **Definir as permissões adequadas**:

   ```bash
   sudo chown firebird:firebird /opt/firebird/data/shop.fdb
   sudo chmod 660 /opt/firebird/data/shop.fdb
   ```

## Configuração do Backend

### Configuração de Ambiente (.env)

O projeto usa um arquivo `.env` para configurações de conexão com o banco de dados, tornando-o compatível com diferentes sistemas operacionais:

1. **Copie o arquivo de exemplo para criar seu arquivo de configuração**:

   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env` com suas configurações locais**:

   No Linux:
   ```
   DB_USER=SYSDBA
   DB_PASSWORD=masterkey
   DB_HOST=localhost
   DB_PORT=3050
   DB_PATH=/opt/firebird/data/shop.fdb
   DB_CHARSET=UTF8
   ```

   No Windows:
   ```
   DB_USER=SYSDBA
   DB_PASSWORD=masterkey
   DB_HOST=localhost
   DB_PORT=3050
   DB_PATH=C:/firebird/data/shop.fdb
   DB_CHARSET=UTF8
   ```
   
3. **Crie um arquivo chamado database.py com o código a baixo e coloque ele dentro da pasta backend**

   ```
   import os
   from dotenv import load_dotenv
   from sqlalchemy import create_engine
   from sqlalchemy.ext.declarative import declarative_base
   from sqlalchemy.orm import sessionmaker

   load_dotenv()
   
   # Database configuration, adjust according to your setup
   DB_USER = os.getenv("DB_USER", "SYSDBA")                    
   DB_PASSWORD = os.getenv("DB_PASSWORD", "masterkey")
   DB_HOST = os.getenv("DB_HOST", "localhost")
   DB_PORT = os.getenv("DB_PORT", "3050")
   DB_PATH = os.getenv("DB_PATH", "/opt/firebird/data/shop.fdb")
   DB_CHARSET = os.getenv("DB_CHARSET", "UTF8")

   SQLALCHEMY_DATABASE_URL = f"firebird+fdb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_PATH}?charset={DB_CHARSET}"

   engine = create_engine(SQLALCHEMY_DATABASE_URL)
   
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

   Base = declarative_base()

   def get_db():
       db = SessionLocal()
       try:
           yield db
       finally:
          db.close()
   ```


## Configuração do Frontend

### Execute os seguintes comandos dentro da pasta frontend:

1. **npm install**

2. **npm install axios**

3. **npm run dev**

4. **npm install react-icons**

### Instalação e Configuração

1. **Clone o repositório** (se ainda não o fez):

   ```bash
   git clone https://github.com/Raylandson/FirebirdShop.git
   cd FirebirdShop
   ```

2. **Crie um ambiente virtual**:

   ```bash
   python -m venv venv
   ```

3. **Ative o ambiente virtual**:

   No Linux/macOS:

   ```bash
   source venv/bin/activate
   ```

   No Windows:

   ```bash
   venv\Scripts\activate
   ```

4. **Instale todas as dependências necessárias**:

   ```bash
   pip install fastapi uvicorn sqlalchemy sqlalchemy-firebird==0.8.0 fdb firebird-driver pydantic python-multipart
   ```

### Lista Completa de Dependências

O projeto requer os seguintes pacotes Python:

```text
fastapi>=0.68.0          # Framework web moderno para construção de APIs
uvicorn[standard]>=0.15.0 # Servidor ASGI para executar FastAPI
sqlalchemy>=1.4.0        # Toolkit SQL Python e ORM
sqlalchemy-firebird==0.8.0 # Dialeto Firebird para SQLAlchemy
fdb>=2.0.0              # Driver Python para Firebird
firebird-driver>=1.10.0 # Driver Firebird moderno
pydantic>=1.8.0         # Validação de dados usando anotações de tipo Python
python-multipart>=0.0.5 # Para análise de dados de formulário
python-dotenv>=1.0.0    # Para carregar variáveis de ambiente do arquivo .env
```

### Métodos Alternativos de Instalação

**Opção 1 - Instalar tudo de uma vez**:
```bash
pip install fastapi uvicorn sqlalchemy sqlalchemy-firebird==0.8.0 fdb firebird-driver pydantic python-multipart python-dotenv
```

**Opção 2 - Usando requirements.txt** (crie este arquivo):
```bash
# Criar arquivo requirements.txt
cat > requirements.txt << EOF
fastapi>=0.68.0
uvicorn[standard]>=0.15.0
sqlalchemy>=1.4.0
sqlalchemy-firebird==0.8.0
fdb>=2.0.0
firebird-driver>=1.10.0
pydantic>=1.8.0
python-multipart>=0.0.5
python-dotenv>=1.0.0
EOF

# Instalar do requirements.txt
pip install -r requirements.txt
```

5. **Verificar a instalação**:

   ```bash
   # Verificar se todos os pacotes estão instalados
   pip list | grep -E "(fastapi|uvicorn|sqlalchemy|firebird|fdb|pydantic)"
   ```

6. **Testar a conexão com o banco de dados**:

   ```bash
   python -c "
   import fdb
   try:
       con = fdb.connect(dsn='localhost:3050/opt/firebird/data/shop.fdb', user='SYSDBA', password='masterkey')
       print('✅ Conexão com banco de dados bem-sucedida!')
       con.close()
   except Exception as e:
       print('❌ Falha na conexão com o banco de dados:', e)
   "
   ```

7. **Execute o servidor de desenvolvimento**:

   ```bash
   python -m uvicorn backend.main:app --reload
   ```

   A API estará disponível em: `http://127.0.0.1:8000`

8. **Acesse a documentação interativa da API**:
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

### Comandos de Início Rápido

Para uma configuração completa do zero, execute estes comandos em sequência:

```bash
# Clone e configure o projeto
git clone https://github.com/Raylandson/FirebirdShop.git
cd FirebirdShop

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate  # No Linux/macOS (ou venv\Scripts\activate no Windows)

# Instale todas as dependências
pip install fastapi uvicorn sqlalchemy sqlalchemy-firebird==0.8.0 fdb firebird-driver pydantic python-multipart

# Execute a aplicação
python -m uvicorn backend.main:app --reload
```

## Endpoints da API

A API fornece os seguintes endpoints para gerenciamento de produtos:

### Produtos
- `GET /` - Mensagem de boas-vindas e status da API
- `GET /produtos/` - Listar todos os produtos (com paginação)
- `POST /produtos/` - Criar um novo produto
- `GET /produtos/{produto_id}` - Obter um produto específico por ID

### Exemplo de Uso

**Criar um produto**:
```bash
curl -X POST "http://127.0.0.1:8000/produtos/" \
     -H "Content-Type: application/json" \
     -d '{
       "nome": "Notebook Dell",
       "descricao": "Notebook para desenvolvimento",
       "preco": 2500.99,
       "estoque": 10
     }'
```

**Listar produtos**:
```bash
curl "http://127.0.0.1:8000/produtos/"
```

**Obter produto específico**:
```bash
curl "http://127.0.0.1:8000/produtos/1"
```

## Esquema do Banco de Dados

A aplicação cria automaticamente a seguinte estrutura de tabela:

```sql
CREATE TABLE PRODUTOS (
    ID INTEGER NOT NULL PRIMARY KEY,
    NOME VARCHAR(100) NOT NULL,
    DESCRICAO VARCHAR(500),
    PRECO NUMERIC(10,2) NOT NULL,
    ESTOQUE INTEGER
);

CREATE INDEX ix_PRODUTOS_nome ON PRODUTOS(NOME);
CREATE INDEX ix_PRODUTOS_id ON PRODUTOS(ID);
```

## Desenvolvimento

- O backend usa o framework FastAPI com ORM SQLAlchemy
- Hot reload está habilitado com a flag `--reload`
- As tabelas do banco de dados são criadas automaticamente na primeira execução
- Certifique-se de ativar o ambiente virtual antes de executar qualquer comando Python
- Instale pacotes adicionais usando `pip install <nome-do-pacote>` enquanto o ambiente virtual estiver ativado

## Solução de Problemas

### Problemas Comuns

1. **Erros de conexão com banco de dados**: 
   - Certifique-se de que o serviço Firebird está executando
   - Verifique as permissões do arquivo de banco de dados
   - Verifique o caminho do banco de dados em `backend/database.py`

2. **Erros de importação**: 
   - Certifique-se de que o ambiente virtual está ativado
   - Reinstale as dependências se necessário

3. **Porta já em uso**: 
   - Use uma porta diferente: `uvicorn backend.main:app --reload --port 8001`

### Desativando o Ambiente Virtual

Quando terminar de trabalhar, você pode desativar o ambiente virtual:

```bash
deactivate
```

## Licença

Este projeto está licenciado sob os termos especificados no arquivo LICENSE.
