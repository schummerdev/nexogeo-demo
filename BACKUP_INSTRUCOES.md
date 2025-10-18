# 📦 Sistema de Backup e Restauração Local

## 🎯 Visão Geral

Este sistema permite fazer backup completo do banco de dados PostgreSQL para arquivos SQL locais, que podem ser facilmente transportados, versionados e restaurados.

---

## 🔧 Fazendo Backup

### Opção 1: Backup do Banco Atual (neondb)

```bash
node backup-database.js
```

**O que acontece:**
- ✅ Conecta no banco atual (`DATABASE_URL` do `.env`)
- ✅ Exporta TODAS as tabelas para arquivo SQL
- ✅ Salva em `backups/backup-neondb-YYYY-MM-DD-HH-mm.sql`
- ✅ Arquivo pode ser versionado no Git ou enviado para outras máquinas

**Tabelas exportadas:**
- usuarios
- configuracoes_emissora
- promocoes
- participantes
- sponsors (Caixa Misteriosa)
- products (Caixa Misteriosa)
- games (Caixa Misteriosa)
- submissions (Caixa Misteriosa)
- public_participants
- referral_rewards

---

## 📥 Restaurando Backup

### Opção 1: Listar Backups Disponíveis

```bash
node restore-backup.js
```

Mostra todos os arquivos `.sql` na pasta `backups/`

### Opção 2: Restaurar um Backup Específico

```bash
node restore-backup.js backup-neondb-2025-10-17-22-30.sql
```

**⚠️ ATENÇÃO:** A restauração **SUBSTITUI** todos os dados atuais do banco!

---

## 🔄 Workflow Completo de Migração

### Cenário: Copiar dados de nexogeo_manus para neondb

#### Passo 1: Fazer Backup do Banco de Origem

Se você tem acesso ao banco `nexogeo_manus`, configure temporariamente:

```bash
# No .env, TEMPORARIAMENTE troque DATABASE_URL
DATABASE_URL=postgresql://user:pass@host/nexogeo_manus?sslmode=require

# Gere o backup
node backup-database.js

# Arquivo gerado: backups/backup-neondb-2025-10-17-22-30.sql
```

#### Passo 2: Restaurar no DATABASE_URL Correto

```bash
# Volte o .env para o banco de destino
DATABASE_URL=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

# Restaure o backup
node restore-backup.js backup-neondb-2025-10-17-22-30.sql
```

---

## 📋 Alternativa: Neon Dashboard

O Neon também oferece backup nativo pelo dashboard:

### Criar Backup no Neon:
1. Acesse https://console.neon.tech
2. Selecione seu projeto
3. Vá em **Backups** ou **Branches**
4. Crie um **Branch** (snapshot instantâneo)
5. Ou use **Point-in-Time Recovery** (PITR)

### Exportar Backup do Neon via CLI:
```bash
# Instalar Neon CLI
npm install -g neonctl

# Login
neonctl auth

# Criar branch (snapshot)
neonctl branches create --name backup-$(date +%Y%m%d)

# Ou exportar via pg_dump (se tiver instalado PostgreSQL client)
pg_dump "postgresql://user:pass@host/db?sslmode=require" > backup.sql
```

---

## 🗂️ Estrutura de Arquivos

```
nexogeo-demo/
├── backups/                          # Diretório de backups
│   ├── backup-neondb-2025-10-17.sql # Backup gerado
│   └── backup-nexogeo-manus.sql     # Backup importado
├── backup-database.js                # Script de backup
├── restore-backup.js                 # Script de restauração
└── BACKUP_INSTRUCOES.md             # Este arquivo
```

---

## 💡 Dicas Importantes

### 1. Backup Antes de Mudanças
```bash
# SEMPRE faça backup antes de:
node backup-database.js

# - Atualizar estrutura do banco
# - Importar dados externos
# - Fazer migrações
# - Testar novas funcionalidades
```

### 2. Versionamento de Backups
```bash
# Adicionar backup ao Git (se não for muito grande)
git add backups/backup-neondb-*.sql
git commit -m "backup: Snapshot antes de migração"
```

### 3. Compressão de Backups Grandes
```bash
# Se o backup for > 10MB, comprima:
gzip backups/backup-neondb-2025-10-17.sql

# Para restaurar arquivo comprimido:
gunzip backups/backup-neondb-2025-10-17.sql.gz
node restore-backup.js backup-neondb-2025-10-17.sql
```

---

## 🐛 Troubleshooting

### Erro: "Arquivo não encontrado"
```bash
# Verifique se o arquivo está em backups/
ls backups/

# Use o caminho completo se necessário
node restore-backup.js C:\caminho\completo\backup.sql
```

### Erro: "Permission denied"
```bash
# Verifique permissões do diretório
mkdir backups
chmod 755 backups
```

### Erro: "Syntax error at or near..."
- O arquivo SQL pode estar corrompido
- Gere novo backup do banco de origem
- Verifique encoding (deve ser UTF-8)

---

## 📊 Comparação: Backup Local vs Neon

| Recurso | Backup Local (SQL) | Neon Backup |
|---------|-------------------|-------------|
| Portabilidade | ✅ Excelente | ⚠️ Apenas no Neon |
| Versionamento Git | ✅ Fácil | ❌ Impossível |
| Tamanho | ⚠️ Arquivo grande | ✅ Eficiente |
| Velocidade | ⚠️ Mais lento | ✅ Instantâneo |
| Automação | ✅ Fácil (cron) | ✅ Automático |
| Custo | ✅ Gratuito | 💰 Pode ter custo |

---

## ✅ Checklist de Migração

- [ ] Fazer backup do banco atual (neondb)
- [ ] Obter backup do banco de origem (nexogeo_manus)
- [ ] Testar restauração em banco de teste
- [ ] Validar dados após restauração
- [ ] Fazer commit do backup no Git
- [ ] Documentar versão restaurada

---

**Pronto!** Agora você tem controle total sobre backups locais do banco de dados.
