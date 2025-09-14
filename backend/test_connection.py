import fdb

# --- Ajuste o caminho aqui se for diferente ---
db_path = 'C:/Dados/SHOP.FDB'
db_user = 'SYSDBA'
db_pass = 'masterkey'
db_host = 'localhost:3050'

dsn = f'{db_host}/{db_path}'

try:
    # Tenta conectar ao banco de dados
    con = fdb.connect(dsn=dsn, user=db_user, password=db_pass)
    
    # Se a linha acima não deu erro, a conexão funcionou
    print('✅ Conexão com o banco de dados bem-sucedida!')
    
    # Fecha a conexão
    con.close()

except Exception as e:
    # Se qualquer erro ocorrer, imprime a mensagem de falha e o erro detalhado
    print('❌ Falha na conexão com o banco de dados.')
    print('Erro detalhado:', e)