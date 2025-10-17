# Setup: Criar e Copiar Banco de Dados no Neon para nexogeo-demo

## 📋 Passo a Passo

### Passo 1: Criar novo banco de dados no Neon

1. **Acesse o Neon Console:** https://console.neon.tech
2. **Opção A - Criar novo projeto:**
   - Clique em "New Project"
   - Nome: `nexogeo-demo`
   - Região: Escolha a mesma do banco original (para melhor performance)
   - PostgreSQL version: 15 ou 16 (compatível com o original)

3. **Opção B - Adicionar banco no projeto existente:**
   - Selecione o projeto existente
   - Vá em "Databases"
   - Clique em "New Database"
   - Nome: `nexogeo_demo`

4. **Copiar a Connection String:**
   - No dashboard do novo banco, clique em "Connection Details"
   - Copie a string completa: `postgresql://user:password@ep-xxx.region.aws.neon.tech/nexogeo_demo?sslmode=require`

### Passo 2: Obter Connection String do banco original

1. No Neon Console, vá para o projeto/banco original
2. Copie a Connection String do banco de origem
3. Salve ambas as strings em local seguro

### Passo 3: Executar a cópia

#### Método 1: Usando pg_dump (Recomendado para Neon)

```bash
# 1. Exportar do banco original
pg_dump "postgresql://user:pass@ep-original.region.aws.neon.tech/nexogeo?sslmode=require" \
  -Fc -f nexogeo_backup.dump

# 2. Importar para nexogeo-demo
pg_restore -d "postgresql://user:pass@ep-demo.region.aws.neon.tech/nexogeo_demo?sslmode=require" \
  --clean --if-exists --no-owner --no-acl nexogeo_backup.dump
```

#### Método 2: Usando o script Node.js

```bash
# Criar arquivo .env.copy
cat > .env.copy << EOF
SOURCE_DATABASE_URL=postgresql://user:pass@ep-original.region.aws.neon.tech/nexogeo?sslmode=require
TARGET_DATABASE_URL=postgresql://user:pass@ep-demo.region.aws.neon.tech/nexogeo_demo?sslmode=require
EOF

# Executar cópia
node copy-database.js
```

#### Método 3: SQL direto (mais rápido, mas requer psql)

```bash
# Exportar
pg_dump "postgresql://user:pass@ep-original.region.aws.neon.tech/nexogeo?sslmode=require" \
  > nexogeo_backup.sql

# Importar
psql "postgresql://user:pass@ep-demo.region.aws.neon.tech/nexogeo_demo?sslmode=require" \
  < nexogeo_backup.sql
```

### Passo 4: Configurar variáveis de ambiente

Adicione a nova connection string no projeto:

**Local (.env):**
```env
DATABASE_URL=postgresql://user:pass@ep-demo.region.aws.neon.tech/nexogeo_demo?sslmode=require
```

**Vercel (Dashboard):**
1. Vá em Settings → Environment Variables
2. Edite `DATABASE_URL`
3. Cole a nova connection string
4. Redeploy o projeto

### Passo 5: Verificar a cópia

```bash
# Executar verificação
DATABASE_URL="postgresql://user:pass@ep-demo.region.aws.neon.tech/nexogeo_demo?sslmode=require" \
  node -e "require('./lib/db').testConnection().then(r => console.log(r))"
```

## 🔧 Instalação do PostgreSQL Client (se necessário)

### Windows
```powershell
# Instalar via Chocolatey
choco install postgresql

# Ou baixar instalador oficial
# https://www.postgresql.org/download/windows/
```

### Linux/Mac
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql
```

## 📊 Checklist de Verificação

Após a cópia, verifique:

- [ ] Tabelas copiadas (15 tabelas esperadas)
- [ ] Dados copiados (contar registros)
- [ ] Usuário admin existe
- [ ] Configurações da emissora copiadas
- [ ] Promoções e participantes preservados
- [ ] Dados da Caixa Misteriosa completos

## 🔍 Script de Verificação Rápida

```javascript
// quick-verify.js
const { Pool } = require('pg');

async function verify() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });

  const tables = [
    'usuarios', 'configuracoes_emissora', 'promocoes', 'participantes',
    'sponsors', 'products', 'games', 'submissions',
    'public_participants', 'referral_rewards'
  ];

  console.log('\n🔍 VERIFICAÇÃO DO BANCO nexogeo-demo\n');

  for (const table of tables) {
    try {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = result.rows[0].count;
      console.log(`✅ ${table.padEnd(25)} ${count.padStart(6)} registros`);
    } catch (err) {
      console.log(`❌ ${table.padEnd(25)} ERRO: ${err.message}`);
    }
  }

  await pool.end();
}

verify();
```

Execute:
```bash
DATABASE_URL="sua_connection_string" node quick-verify.js
```

## 🚨 Troubleshooting

### "pg_dump: command not found"
Instale o PostgreSQL client (veja seção de instalação acima)

### "SSL connection is required"
Sempre adicione `?sslmode=require` na connection string do Neon

### "permission denied"
Use `--no-owner --no-acl` no pg_restore

### Timeout na conexão
- Verifique se seu IP está na allowlist do Neon
- Neon free tier: vá em Settings → IP Allow → Add 0.0.0.0/0 (qualquer IP)

### Dados não aparecem
```bash
# Resetar sequences
psql "$DATABASE_URL" -c "SELECT setval(pg_get_serial_sequence('usuarios', 'id'), COALESCE(MAX(id), 1)) FROM usuarios;"
```

## 🎯 Próximos Passos

Após copiar com sucesso:

1. **Atualizar .env local:**
   ```env
   DATABASE_URL=postgresql://...nexogeo_demo...
   ```

2. **Atualizar Vercel:**
   - Dashboard → Settings → Environment Variables
   - Atualizar `DATABASE_URL`
   - Redeploy

3. **Testar aplicação:**
   ```bash
   npm start
   ```

4. **Fazer login:**
   - Usuário: `admin`
   - Senha: (a mesma do banco original)

## 💾 Backup Regular

Configure backups automáticos no Neon:
1. Project Settings → Backups
2. Enable automatic backups
3. Retention period: 7 days (free tier)

---

**Importante:** Nunca commite connection strings no Git! Use sempre variáveis de ambiente.
