# 📦 Sistema de Migração de Dados - NexoGeo

## 🎯 Objetivo
Migrar dados do banco antigo **nexogeo_manus** para o novo banco **neondb** (nexogeo-demo) com compatibilidade de schema.

---

## 📁 Arquivos Criados

### 1. Scripts de Exportação/Importação
- **`export-nexogeo-manus.sql`** - Script SQL básico para executar no Neon SQL Editor
  - Exporta dados com mapeamento automático de schema
  - Gera comandos INSERT compatíveis com o banco novo
  - Executa no banco origem (nexogeo_manus)

- **`export-nexogeo-manus-safe.sql`** - ⭐ Versão RECOMENDADA com tratamento defensivo
  - Verifica tipos de dados antes de converter (resolve erro "Sep")
  - Usa valores padrão para dados NULL ou inválidos
  - Trata datas armazenadas como texto
  - Arredonda coordenadas geográficas

### 2. Documentação
- **`GUIA_MIGRACAO_NEON.md`** - Guia passo-a-passo completo
  - Instruções detalhadas para usar o Neon SQL Editor
  - Solução de problemas comuns
  - Checklist de validação

- **`MIGRACAO_README.md`** - Este arquivo (visão geral)

### 3. Scripts de Validação
- **`verify-migration.js`** - Verifica se a migração foi bem-sucedida
  - Conta registros em cada tabela
  - Lista usuários, promoções e participantes
  - Verifica integridade referencial

### 4. Scripts de Backup (já existentes)
- **`backup-database.js`** - Gera backup SQL local
- **`restore-backup.js`** - Restaura backup SQL local

---

## 🚀 Como Usar

### Método 1: Neon SQL Editor (RECOMENDADO)

#### Passo 1: Exportar
1. Acesse o Neon SQL Editor
2. Conecte ao banco **nexogeo_manus**
3. Execute o conteúdo de `export-nexogeo-manus-safe.sql` ⭐ (RECOMENDADO)
   - Ou use `export-nexogeo-manus.sql` se não houver problemas com tipos
4. Copie os comandos INSERT gerados

#### Passo 2: Importar
1. No mesmo SQL Editor, conecte ao banco **neondb**
2. Execute os TRUNCATEs para limpar tabelas:
   ```sql
   TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;
   TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;
   TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;
   TRUNCATE TABLE configuracoes_emissora RESTART IDENTITY CASCADE;
   ```
3. Cole e execute os INSERTs copiados

#### Passo 3: Verificar
```bash
node verify-migration.js
```

### Método 2: Backup Local (ALTERNATIVO)

Usar apenas se o Neon SQL Editor não funcionar:

1. **Gerar backup no banco antigo**:
   ```bash
   # No projeto nexogeo (antigo)
   cd C:\schummerdev\nexogeo
   node backup-database-fix.js
   ```

2. **Copiar backup para projeto novo**:
   ```bash
   copy C:\schummerdev\nexogeo\backups\*.sql C:\schummerdev\nexogeo-demo\backups\
   ```

3. **Restaurar no banco novo**:
   ```bash
   # No projeto nexogeo-demo (novo)
   cd C:\schummerdev\nexogeo-demo
   node restore-backup.js backups/backup-nexogeo-2025-10-18T03-59-48.sql
   ```

---

## 📊 Mapeamento de Schema

### Tabela: usuarios
| Campo Antigo | Campo Novo | Tipo |
|--------------|------------|------|
| senha | senha_hash | string |
| criado_em | created_at | timestamp |

### Tabela: promocoes
| Campo Antigo | Campo Novo | Tipo |
|--------------|------------|------|
| criado_em | created_at | timestamp |

### Tabela: participantes
| Campo Antigo | Campo Novo | Tipo |
|--------------|------------|------|
| participou_em | data_cadastro | timestamp |

### Tabela: configuracoes_emissora
| Campo Antigo | Campo Novo | Tipo |
|--------------|------------|------|
| criado_em | created_at | timestamp |
| atualizado_em | updated_at | timestamp |

---

## ✅ Validação da Migração

Após a migração, execute:

```bash
node verify-migration.js
```

**Saída esperada**:
```
📊 Totais de registros:
   Usuários: 4
   Promoções: 7
   Participantes: 107
   Configurações: 1

👥 Usuários encontrados:
   1. admin (admin) - ✅ Ativo
   ...

🎁 Promoções:
   1. Nome da Promoção ✅ (2025-01-01 → 2025-12-31)
   ...

✅ Migração verificada com sucesso!
```

---

## 🔧 Solução de Problemas

### Problema 1: Erro "duplicate key"
**Solução**: Execute os comandos TRUNCATE antes de importar

### Problema 2: Erro "column does not exist"
**Solução**: Use o arquivo `export-nexogeo-manus.sql` (não o antigo)

### Problema 3: Dados importados mas login não funciona
**Solução**: Recriar senha do admin:
```bash
node create-admin.js
```

### Problema 4: Participantes sem promoções válidas
**Solução**: Verificar IDs de promoções no banco antigo

---

## 📝 Comandos Úteis

### Verificar dados atuais
```bash
node verify-migration.js
```

### Fazer backup do banco novo
```bash
node backup-database.js
```

### Ver logs do servidor
```bash
# Terminal com o servidor rodando
# Ctrl+C para parar
# npm run dev:full para reiniciar
```

### Acessar sistema
```
Frontend: http://localhost:3000
API: http://localhost:3002/api
```

---

## 📊 Estrutura de Diretórios

```
nexogeo-demo/
├── export-nexogeo-manus.sql      # Script de exportação
├── verify-migration.js            # Script de verificação
├── GUIA_MIGRACAO_NEON.md         # Guia detalhado
├── MIGRACAO_README.md            # Este arquivo
├── backup-database.js            # Backup local
├── restore-backup.js             # Restore local
├── backups/                      # Backups SQL
└── lib/db.js                     # Conexão PostgreSQL
```

---

## 🎉 Resultado Final

Após seguir o guia:
- ✅ Dados migrados do banco antigo para o novo
- ✅ Schema compatibilizado automaticamente
- ✅ Sistema funcionando com dados importados
- ✅ 4 usuários + 7 promoções + 107 participantes

---

**Data de criação**: 2025-10-18
**Banco origem**: nexogeo_manus (PostgreSQL Neon)
**Banco destino**: neondb (PostgreSQL Neon)
**Método**: Neon SQL Editor com mapeamento automático
