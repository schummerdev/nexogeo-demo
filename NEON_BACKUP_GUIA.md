# 📘 Guia: Backup e Importação via Neon SQL Editor

## 🎯 Objetivo
Exportar dados do banco **nexogeo_manus** e importar no banco **neondb** usando apenas o SQL Editor do Neon.

---

## 📋 Passo a Passo

### PARTE 1: Exportar Dados do Banco ORIGEM (nexogeo_manus)

#### Passo 1: Acessar SQL Editor do Neon
1. Acesse https://console.neon.tech
2. Selecione o projeto **nexogeo_manus**
3. Clique em **SQL Editor** no menu lateral

#### Passo 2: Executar Script de Exportação

**Opção A: Exportar Tabela por Tabela** (Recomendado para bancos grandes)

```sql
-- 1. EXPORTAR USUÁRIOS
SELECT
  'INSERT INTO usuarios (usuario, senha_hash, role, created_at, updated_at) VALUES (' ||
  '''' || usuario || ''', ' ||
  '''' || senha_hash || ''', ' ||
  '''' || role || ''', ' ||
  '''' || created_at || ''', ' ||
  '''' || updated_at || ''');' as sql_command
FROM usuarios
ORDER BY id;
```

**Como usar:**
1. Cole o SQL no editor
2. Clique em **Run**
3. Copie todos os resultados da coluna `sql_command`
4. Cole em um arquivo de texto (ex: `usuarios.sql`)
5. Repita para cada tabela (veja script completo em `neon-export-script.sql`)

**Opção B: Ver Estatísticas Primeiro**

```sql
-- Ver quantidade de registros em cada tabela
SELECT
  'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'promocoes', COUNT(*) FROM promocoes
UNION ALL
SELECT 'participantes', COUNT(*) FROM participantes
UNION ALL
SELECT 'sponsors', COUNT(*) FROM sponsors
UNION ALL
SELECT 'products', COUNT(*) FROM products;
```

#### Passo 3: Salvar Resultados

Crie um arquivo `backup-nexogeo-manus.sql` e organize assim:

```sql
-- Backup gerado via Neon SQL Editor
-- Data: 2025-10-18
-- Origem: nexogeo_manus

-- Limpar tabelas antes de importar
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE configuracoes_emissora RESTART IDENTITY CASCADE;
TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;
TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;

-- Cole aqui os INSERTs gerados pelo script
INSERT INTO usuarios (...) VALUES (...);
INSERT INTO usuarios (...) VALUES (...);
...
```

---

### PARTE 2: Importar Dados no Banco DESTINO (neondb)

#### Passo 1: Acessar SQL Editor do Banco Destino
1. No Neon Console, selecione o projeto **neondb** (ou nome do projeto destino)
2. Clique em **SQL Editor**

#### Passo 2: Executar Comandos TRUNCATE

```sql
-- ATENÇÃO: Isso vai APAGAR todos os dados atuais!
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
TRUNCATE TABLE configuracoes_emissora RESTART IDENTITY CASCADE;
TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;
TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;
TRUNCATE TABLE sponsors RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE games RESTART IDENTITY CASCADE;
TRUNCATE TABLE submissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public_participants RESTART IDENTITY CASCADE;
```

#### Passo 3: Executar Comandos INSERT

Cole e execute os INSERTs em lotes (Neon tem limite de query):

```sql
-- Lote 1: Usuários e Configurações
INSERT INTO usuarios (...) VALUES (...);
INSERT INTO configuracoes_emissora (...) VALUES (...);

-- Executar (Run)
```

```sql
-- Lote 2: Promoções (exemplo: primeiras 100)
INSERT INTO promocoes (...) VALUES (...);
INSERT INTO promocoes (...) VALUES (...);
-- ... até 100 registros

-- Executar (Run)
```

**💡 Dica:** Se tiver muitos registros, divida em blocos de 100-500 INSERTs por vez.

---

## 🚀 Método Alternativo: Usar Script Automatizado

Se preferir automação local, use nosso script:

```bash
# 1. Configure o .env com banco de origem
SOURCE_DATABASE_URL=postgresql://user:pass@host/nexogeo_manus

# 2. Execute o backup
node copy-from-nexogeo-manus.js
```

Isso copia tudo automaticamente sem precisar do SQL Editor.

---

## 📊 Verificar Importação

Após importar, verifique se os dados foram copiados:

```sql
-- Ver total de registros em cada tabela
SELECT
  'usuarios' as tabela, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'promocoes', COUNT(*) FROM promocoes
UNION ALL
SELECT 'participantes', COUNT(*) FROM participantes
UNION ALL
SELECT 'sponsors', COUNT(*) FROM sponsors
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'games', COUNT(*) FROM games
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'public_participants', COUNT(*) FROM public_participants
ORDER BY total DESC;
```

---

## ⚠️ Limitações do Neon SQL Editor

1. **Timeout:** Queries longas (>60s) podem dar timeout
2. **Limite de resultados:** Máximo 1000 linhas na visualização
3. **Tamanho de query:** Limite de ~1MB por query

**Solução:**
- Para bancos grandes (>10k registros), use o script Node.js
- Ou use `pg_dump` via terminal (se tiver PostgreSQL instalado)

---

## 🛠️ Método Profissional: pg_dump + psql

Se tiver PostgreSQL client instalado:

```bash
# Exportar banco origem
pg_dump "postgresql://user:pass@host/nexogeo_manus?sslmode=require" > backup.sql

# Importar no destino
psql "postgresql://neondb_owner:npg_...@host/neondb?sslmode=require" < backup.sql
```

---

## 📁 Arquivos de Referência

- **`neon-export-script.sql`** - Script completo para copiar/colar no SQL Editor
- **`copy-from-nexogeo-manus.js`** - Script Node.js automatizado
- **`backup-database.js`** - Gera backup local do banco atual

---

## ✅ Checklist de Importação

- [ ] Fazer backup do banco destino atual (segurança)
- [ ] Executar script de exportação no banco origem
- [ ] Salvar resultados em arquivo .sql
- [ ] Limpar tabelas do banco destino (TRUNCATE)
- [ ] Executar INSERTs no banco destino
- [ ] Verificar contagem de registros
- [ ] Testar login no sistema
- [ ] Validar dados críticos (promoções, participantes)

---

**Escolha o método que preferir:**
- 🖱️ **SQL Editor**: Mais visual, bom para poucos dados
- 💻 **Script Node.js**: Automático, melhor para muitos dados
- 🔧 **pg_dump**: Profissional, mais rápido, requer PostgreSQL instalado
