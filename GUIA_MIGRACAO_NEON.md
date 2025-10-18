# 🔄 Guia de Migração: nexogeo_manus → neondb

## 📋 Visão Geral
Este guia mostra como migrar dados do banco antigo (`nexogeo_manus`) para o novo banco (`neondb`) usando o Neon SQL Editor com mapeamento automático de schema.

---

## ⚙️ Pré-requisitos
- ✅ Acesso ao Neon Console (https://console.neon.tech)
- ✅ Credenciais de ambos os bancos de dados
- ✅ Arquivo `export-nexogeo-manus.sql` neste diretório

---

## 🎯 PASSO 1: Exportar Dados do Banco Antigo

### 1.1 Acessar o Neon SQL Editor
1. Acesse: https://console.neon.tech
2. Selecione o projeto com o banco **nexogeo_manus**
3. Clique em **"SQL Editor"** no menu lateral

### 1.2 Conectar ao Banco Antigo
1. No SQL Editor, selecione o banco **nexogeo_manus** no dropdown
2. Verifique se a conexão está ativa (ícone verde)

### 1.3 Executar Script de Exportação
1. Abra o arquivo: `export-nexogeo-manus.sql`
2. **Copie TODO o conteúdo do arquivo**
3. **Cole no SQL Editor do Neon**
4. Clique em **"Run"** (ou pressione Ctrl+Enter)

### 1.4 Copiar Resultado
1. Aguarde a execução (pode demorar alguns segundos)
2. **Role até o final dos resultados**
3. Você verá vários INSERTs como:
   ```sql
   INSERT INTO usuarios (id, usuario, senha_hash, papel, ativo, created_at) VALUES (1, 'admin', '$2a$10$...', 'admin', true, '2025-01-15 10:30:00');
   INSERT INTO participantes (id, nome, telefone, ...) VALUES (1, 'João Silva', '11999999999', ...);
   ```
4. **Selecione e copie TODOS os comandos INSERT gerados**
   - Dica: Use Ctrl+A para selecionar tudo, depois Ctrl+C

### 1.5 Salvar em Arquivo Local (Opcional)
1. Cole os INSERTs em um novo arquivo: `dados-exportados.sql`
2. Isso serve como backup caso precise repetir a importação

---

## 🎯 PASSO 2: Importar Dados para o Banco Novo

### 2.1 Trocar de Banco no Neon
1. No mesmo SQL Editor, clique no dropdown de banco de dados
2. **Selecione o projeto/banco: neondb** (nexogeo-demo)
3. Aguarde a conexão ativa

### 2.2 Limpar Dados Existentes (CUIDADO!)
⚠️ **ATENÇÃO**: Este comando apaga todos os dados atuais!

Execute primeiro:
```sql
-- Ver dados atuais
SELECT 'usuarios' as tabela, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'promocoes', COUNT(*) FROM promocoes
UNION ALL
SELECT 'participantes', COUNT(*) FROM participantes;
```

Se estiver OK em apagar, execute:
```sql
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;
TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;
TRUNCATE TABLE configuracoes_emissora RESTART IDENTITY CASCADE;
```

### 2.3 Importar Dados
1. **Cole os comandos INSERT** que você copiou no Passo 1.4
2. Clique em **"Run"** (Ctrl+Enter)
3. Aguarde a execução

### 2.4 Verificar Importação
Execute para conferir:
```sql
-- Verificar dados importados
SELECT 'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'promocoes', COUNT(*) FROM promocoes
UNION ALL
SELECT 'participantes', COUNT(*) FROM participantes;

-- Ver alguns registros
SELECT * FROM usuarios LIMIT 5;
SELECT * FROM promocoes LIMIT 5;
SELECT * FROM participantes LIMIT 5;
```

---

## ✅ PASSO 3: Validar Migração

### 3.1 Comparar Totais
Compare os totais entre os dois bancos:

**nexogeo_manus** (antigo):
```sql
SELECT COUNT(*) FROM usuarios;     -- Esperado: 4
SELECT COUNT(*) FROM promocoes;    -- Esperado: 7
SELECT COUNT(*) FROM participantes; -- Esperado: 107
```

**neondb** (novo):
```sql
SELECT COUNT(*) FROM usuarios;     -- Deve ser: 4
SELECT COUNT(*) FROM promocoes;    -- Deve ser: 7
SELECT COUNT(*) FROM participantes; -- Deve ser: 107
```

### 3.2 Testar Login no Sistema
1. Acesse: http://localhost:3000
2. Faça login com:
   - **Usuário**: admin
   - **Senha**: (a senha do banco antigo)
3. Verifique se as promoções e participantes aparecem no dashboard

### 3.3 Verificar Dados Específicos
```sql
-- Ver usuários migrados
SELECT id, usuario, papel, ativo, created_at FROM usuarios ORDER BY id;

-- Ver promoções ativas
SELECT id, titulo, ativa, data_inicio, data_fim FROM promocoes ORDER BY id;

-- Ver participantes recentes
SELECT id, nome, telefone, cidade, data_cadastro
FROM participantes
ORDER BY data_cadastro DESC
LIMIT 10;
```

---

## 🔧 Solução de Problemas

### Erro: "duplicate key value violates unique constraint"
**Causa**: Já existem registros com os mesmos IDs

**Solução**:
```sql
-- Limpar tabelas antes de importar
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;
TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;
```

### Erro: "column does not exist"
**Causa**: Script de exportação não mapeou corretamente

**Solução**: Verifique se usou o arquivo `export-nexogeo-manus.sql` correto (não o antigo `neon-export-script.sql`)

### Erro: "relation does not exist"
**Causa**: Tabelas não foram criadas no banco novo

**Solução**:
```bash
cd C:\schummerdev\nexogeo-demo
node init-db.js
```

### Dados importados mas login não funciona
**Causa**: Senhas podem estar com hash diferente

**Solução**: Recriar usuário admin:
```bash
node create-admin.js
```

---

## 📊 Mapeamento de Schema

O script faz os seguintes mapeamentos automaticamente:

| Banco Antigo (nexogeo_manus) | Banco Novo (neondb) |
|------------------------------|---------------------|
| `usuarios.senha` | `usuarios.senha_hash` |
| `usuarios.criado_em` | `usuarios.created_at` |
| `promocoes.criado_em` | `promocoes.created_at` |
| `participantes.participou_em` | `participantes.data_cadastro` |
| `configuracoes_emissora.criado_em` | `configuracoes_emissora.created_at` |
| `configuracoes_emissora.atualizado_em` | `configuracoes_emissora.updated_at` |

---

## 🎉 Conclusão

Após seguir todos os passos:
1. ✅ Dados migrados do banco antigo para o novo
2. ✅ Schema compatibilizado automaticamente
3. ✅ Sistema funcionando com dados importados

**Próximos passos**:
- Fazer backup do banco novo: `node backup-database.js`
- Testar todas as funcionalidades no dashboard
- Validar relatórios e mapas

---

## 📝 Notas Importantes

- ⚠️ **Backup**: Sempre faça backup antes de migrar
- 🔒 **Senhas**: Senhas são migradas com os hashes originais
- 📅 **Datas**: Convertidas automaticamente para formato SQL
- 🔑 **IDs**: Preservados do banco original
- 🔗 **Relações**: Chaves estrangeiras mantidas (promocao_id, etc.)

---

**Criado em**: 2025-10-18
**Banco origem**: nexogeo_manus
**Banco destino**: neondb (nexogeo-demo)
