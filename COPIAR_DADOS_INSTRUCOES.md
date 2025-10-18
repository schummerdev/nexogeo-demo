# 📋 Instruções para Copiar Dados do Banco nexogeo_manus

## ⚠️ Pré-requisitos

Antes de executar a cópia, você precisa:

1. **String de conexão do banco de origem** (nexogeo_manus)
2. **Acesso ao banco de destino** (neondb - já configurado)

---

## 🔧 Passo 1: Configurar Banco de Origem

Edite o arquivo `.env` e adicione a string de conexão do banco **nexogeo_manus**:

```env
SOURCE_DATABASE_URL=postgresql://usuario:senha@host:porta/nexogeo_manus?sslmode=require
```

### Exemplo de string de conexão:
```env
# Se for Neon
SOURCE_DATABASE_URL=postgresql://nexogeo_owner:SUA_SENHA@ep-xxxxx.sa-east-1.aws.neon.tech/nexogeo_manus?sslmode=require

# Se for PostgreSQL local
SOURCE_DATABASE_URL=postgresql://postgres:senha@localhost:5432/nexogeo_manus

# Se for outro provedor cloud
SOURCE_DATABASE_URL=postgresql://user:pass@host.provider.com:5432/nexogeo_manus?sslmode=require
```

---

## 🚀 Passo 2: Executar Cópia

Após configurar o `.env`, execute:

```bash
node copy-from-nexogeo-manus.js
```

---

## 📊 O Que Será Copiado

O script copiará **TODOS** os dados das seguintes tabelas:

### Sistema Principal
- ✅ **usuarios** - Todos os usuários e credenciais
- ✅ **configuracoes_emissora** - Configurações do sistema
- ✅ **promocoes** - Todas as promoções
- ✅ **participantes** - Todos os participantes cadastrados

### Caixa Misteriosa (se existentes)
- ✅ **sponsors** - Patrocinadores
- ✅ **products** - Produtos
- ✅ **games** - Jogos realizados
- ✅ **submissions** - Palpites dos jogos
- ✅ **public_participants** - Participantes públicos
- ✅ **referral_rewards** - Recompensas de referência

---

## ⚠️ IMPORTANTE

### Backup Automático
- O script **TRUNCA** as tabelas de destino antes de copiar
- Todos os dados atuais no banco `neondb` serão **SUBSTITUÍDOS**
- As chaves primárias (IDs) são **RESETADAS**

### Recomendação
Faça um backup manual do banco de destino antes de executar:
```bash
# Exemplo com pg_dump (se tiver instalado)
pg_dump DATABASE_URL > backup-neondb-antes-copia.sql
```

---

## 🔍 Verificar Conexões

Antes de copiar, teste as conexões:

```bash
# Criar script de teste
node -e "
const { Pool } = require('pg');
require('dotenv').config();

async function test() {
  // Testar ORIGEM
  const source = new Pool({ connectionString: process.env.SOURCE_DATABASE_URL, ssl: { rejectUnauthorized: true } });
  const s = await source.query('SELECT current_database() as db, count(*) as usuarios FROM usuarios');
  console.log('Origem:', s.rows[0]);
  await source.end();

  // Testar DESTINO
  const dest = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
  const d = await dest.query('SELECT current_database() as db, count(*) as usuarios FROM usuarios');
  console.log('Destino:', d.rows[0]);
  await dest.end();
}
test();
"
```

---

## 📝 Saída Esperada

```
🔄 Iniciando cópia de dados...

📡 Testando conexão com banco de ORIGEM...
✅ Origem conectada: nexogeo_manus - 2025-10-17T...

📡 Testando conexão com banco de DESTINO...
✅ Destino conectado: neondb - 2025-10-17T...

👤 Copiando usuários...
   Encontrados: 5 usuários
   ✅ 5 usuários copiados

⚙️  Copiando configurações da emissora...
   ✅ Configurações copiadas

🎁 Copiando promoções...
   Encontradas: 12 promoções
   ✅ 12 promoções copiadas

👥 Copiando participantes...
   Encontrados: 1523 participantes
   ✅ 1523 participantes copiados

...

🎉 Cópia de dados concluída com sucesso!
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique se a `SOURCE_DATABASE_URL` está correta
- Confirme que o banco de origem está acessível

### Erro: "relation does not exist"
- Tabela não existe no banco de origem
- O script continua e pula tabelas inexistentes

### Erro: "SSL required"
- Adicione `?sslmode=require` no final da URL
- Ou configure SSL adequadamente

---

## 📧 Onde Encontrar a String de Conexão?

### Se o banco está no Neon:
1. Acesse https://console.neon.tech
2. Selecione o projeto `nexogeo_manus`
3. Vá em "Connection Details"
4. Copie a "Connection String"

### Se o banco está em outro lugar:
- Verifique arquivos `.env` do projeto antigo
- Consulte dashboard do provedor (Vercel, Railway, etc)
- Verifique variáveis de ambiente da aplicação

---

**Pronto para copiar?** Configure o `.env` e execute o script!
