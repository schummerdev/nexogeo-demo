# Guia: Copiar Banco de Dados para nexogeo-demo

## 📋 Pré-requisitos

1. Ter acesso às credenciais do banco de dados de origem
2. Ter o banco de dados de destino (nexogeo-demo) já criado
3. Node.js e PostgreSQL instalados

## 🚀 Opções de Cópia

### Opção 1: Usando o Script Node.js (Recomendado)

#### 1. Configurar variáveis de ambiente

Crie um arquivo `.env.copy` na raiz do projeto:

```env
# Banco de ORIGEM (de onde copiar)
SOURCE_DATABASE_URL=postgresql://usuario:senha@host:5432/nexogeo_original

# Banco de DESTINO (para onde copiar)
TARGET_DATABASE_URL=postgresql://usuario:senha@host:5432/nexogeo_demo
```

#### 2. Executar o script

```bash
# Opção A: Usando variáveis de ambiente
node copy-database.js

# Opção B: Passando URLs diretamente
node copy-database.js "postgresql://user:pass@host:5432/source" "postgresql://user:pass@host:5432/target"

# Opção C: Usando arquivo .env.copy
source .env.copy  # Linux/Mac
# OU
set -a && . .env.copy && set +a  # Linux/Mac alternativo
# OU no Windows CMD:
for /f "tokens=*" %i in (.env.copy) do set %i
node copy-database.js
```

### Opção 2: Usando pg_dump e pg_restore (PostgreSQL Nativo)

#### 1. Exportar banco de origem

```bash
# Dump completo (schema + dados)
pg_dump -h HOST_ORIGEM -U USUARIO_ORIGEM -d nexogeo_original -f nexogeo_backup.sql

# Ou apenas dados (sem schema)
pg_dump -h HOST_ORIGEM -U USUARIO_ORIGEM -d nexogeo_original --data-only -f nexogeo_data.sql
```

#### 2. Importar para banco de destino

```bash
# Se você fez dump completo
psql -h HOST_DESTINO -U USUARIO_DESTINO -d nexogeo_demo -f nexogeo_backup.sql

# Se você fez dump apenas de dados
psql -h HOST_DESTINO -U USUARIO_DESTINO -d nexogeo_demo -f nexogeo_data.sql
```

### Opção 3: Usando pg_dump com formato customizado (Mais rápido)

```bash
# 1. Exportar
pg_dump -h HOST_ORIGEM -U USUARIO_ORIGEM -d nexogeo_original -Fc -f nexogeo_backup.dump

# 2. Importar
pg_restore -h HOST_DESTINO -U USUARIO_DESTINO -d nexogeo_demo --clean --if-exists nexogeo_backup.dump
```

### Opção 4: Copiar apenas estrutura (sem dados)

```bash
# Exportar apenas schema
pg_dump -h HOST_ORIGEM -U USUARIO_ORIGEM -d nexogeo_original --schema-only -f nexogeo_schema.sql

# Importar schema
psql -h HOST_DESTINO -U USUARIO_DESTINO -d nexogeo_demo -f nexogeo_schema.sql
```

## ⚙️ Usando Neon/Vercel Postgres

### Se o banco está no Neon.tech

```bash
# 1. Obter string de conexão do Neon
# Dashboard → Project → Connection String

# 2. Exportar
pg_dump "postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require" -f backup.sql

# 3. Importar para novo banco
psql "postgresql://user:pass@ep-yyy.region.aws.neon.tech/nexogeo_demo?sslmode=require" -f backup.sql
```

### Se o banco está no Vercel Postgres

```bash
# 1. No dashboard Vercel, copie POSTGRES_URL

# 2. Exportar
pg_dump "$POSTGRES_URL_ORIGEM" -f backup.sql

# 3. Criar novo banco no Vercel (nexogeo-demo project)

# 4. Importar
psql "$POSTGRES_URL_DESTINO" -f backup.sql
```

## 🔍 Verificação pós-cópia

Execute este script para verificar:

```javascript
// verify-database.js
const { Pool } = require('pg');

async function verify() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Listar tabelas
    const tables = await pool.query(`
      SELECT tablename, (
        SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = tablename
      ) as column_count
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log('\n📋 Tabelas no banco:');
    for (const table of tables.rows) {
      const count = await pool.query(`SELECT COUNT(*) FROM "${table.tablename}"`);
      console.log(`  ✅ ${table.tablename}: ${count.rows[0].count} registros (${table.column_count} colunas)`);
    }

    console.log('\n✅ Verificação concluída!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verify();
```

Execute:
```bash
DATABASE_URL="postgresql://..." node verify-database.js
```

## 🛡️ Segurança

**IMPORTANTE:**
- Nunca commite arquivos `.sql` ou `.dump` com dados sensíveis
- Adicione ao `.gitignore`:
  ```
  *.sql
  *.dump
  .env.copy
  ```

## 📊 Tabelas esperadas no nexogeo

- `usuarios` - Usuários administrativos
- `configuracoes_emissora` - Configurações da emissora
- `promocoes` - Promoções/campanhas
- `participantes` - Participantes das promoções
- `sponsors` - Patrocinadores (Caixa Misteriosa)
- `products` - Produtos (Caixa Misteriosa)
- `games` - Jogos/sorteios (Caixa Misteriosa)
- `submissions` - Palpites dos participantes
- `public_participants` - Participantes públicos
- `referral_rewards` - Sistema de referência

## 🆘 Troubleshooting

### Erro: "relation does not exist"
```bash
# Execute primeiro a inicialização do schema
node -e "require('./lib/db').initDatabase()"
```

### Erro: "password authentication failed"
- Verifique usuário e senha
- Verifique se o IP está na whitelist (Neon/Vercel)

### Erro: "SSL connection required"
Adicione `?sslmode=require` na string de conexão

### Dados não aparecem após importar
```bash
# Resetar sequences
psql DATABASE_URL << EOF
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), COALESCE(MAX(id), 1)) FROM usuarios;
SELECT setval(pg_get_serial_sequence('promocoes', 'id'), COALESCE(MAX(id), 1)) FROM promocoes;
-- Repita para outras tabelas...
EOF
```

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do PostgreSQL
2. Permissões do usuário do banco
3. Conectividade de rede/firewall
4. Versão do PostgreSQL (deve ser compatível)
