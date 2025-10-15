# 🚨 CORREÇÃO URGENTE - Erro ao Salvar Patrocinador

**Data**: 08/10/2025
**Problema**: Erro 500 ao tentar salvar/atualizar patrocinador no painel admin
**Causa**: Colunas não existem na tabela `sponsors` do banco de dados
**Impacto**: 🔴 CRÍTICO - Impossível editar patrocinadores

---

## 📋 Diagnóstico do Erro

### Erro Observado:
```
PUT https://nexogeo.vercel.app/api/caixa-misteriosa/sponsors/1 500 (Internal Server Error)
Erro ao atualizar patrocinador
```

### Causa Raiz:
A migração `add-sponsor-fields.sql` **nunca foi executada** no banco de dados Neon.

O código backend tenta atualizar campos que não existem:
```sql
UPDATE sponsors
SET name = $1, logo_url = $2, facebook_url = $3, instagram_url = $4, whatsapp = $5, address = $6
WHERE id = $7
```

Resultado: PostgreSQL retorna erro porque `logo_url`, `facebook_url`, `instagram_url`, `whatsapp` e `address` **não existem** na tabela.

---

## ✅ SOLUÇÃO - Executar Migration SQL

### **Passo 1: Acessar Neon Console**

URL: https://console.neon.tech/

---

### **Passo 2: Selecionar Projeto NexoGeo**

Clicar no projeto correto na lista de projetos.

---

### **Passo 3: Abrir SQL Editor**

No menu lateral esquerdo: **SQL Editor**

---

### **Passo 4: Copiar e Colar o SQL Abaixo**

```sql
-- Migration: Adicionar campos adicionais à tabela sponsors
-- Data: 08/10/2025
-- Descrição: Corrige erro 500 ao salvar patrocinador

-- Adicionar novos campos à tabela sponsors
ALTER TABLE sponsors
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT;

-- Comentários sobre os campos
COMMENT ON COLUMN sponsors.logo_url IS 'URL da logo/marca do patrocinador';
COMMENT ON COLUMN sponsors.facebook_url IS 'URL da página do Facebook do patrocinador';
COMMENT ON COLUMN sponsors.instagram_url IS 'URL do perfil do Instagram do patrocinador';
COMMENT ON COLUMN sponsors.whatsapp IS 'Número de WhatsApp do patrocinador (formato: 5569999999999)';
COMMENT ON COLUMN sponsors.address IS 'Endereço completo do patrocinador';
```

---

### **Passo 5: Clicar em "Run" (▶️)**

Aguardar execução (deve ser instantâneo - menos de 1 segundo).

---

### **Passo 6: Verificar Sucesso**

Mensagem esperada no console:
```
ALTER TABLE
COMMENT
COMMENT
COMMENT
COMMENT
COMMENT
```

---

## ✅ Verificar Se Migration Foi Aplicada (Opcional)

Execute este SQL no Neon Console para confirmar:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'sponsors'
ORDER BY ordinal_position;
```

**Resultado Esperado**:
```
column_name     | data_type         | is_nullable
----------------|-------------------|-------------
id              | integer           | NO
name            | text              | NO
created_at      | timestamp         | NO
logo_url        | text              | YES
facebook_url    | text              | YES
instagram_url   | text              | YES
whatsapp        | character varying | YES
address         | text              | YES
```

---

## 🎯 O Que Esta Migration Faz?

Adiciona 5 novos campos **opcionais** à tabela `sponsors`:

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `logo_url` | TEXT | URL da logo/marca do patrocinador | Não |
| `facebook_url` | TEXT | URL da página do Facebook | Não |
| `instagram_url` | TEXT | URL do perfil do Instagram | Não |
| `whatsapp` | VARCHAR(20) | Número WhatsApp (formato: 5569999999999) | Não |
| `address` | TEXT | Endereço completo do patrocinador | Não |

**Importante**: Todos os campos são **opcionais** (aceitam NULL).

---

## 🔄 Após Executar a Migration

### 1. **Fazer Hard Refresh no Dashboard**

- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 2. **Testar Salvar Patrocinador**

1. Acessar: https://nexogeo.vercel.app/dashboard/caixa-misteriosa
2. Clicar em aba "Configuração"
3. Editar qualquer patrocinador
4. Preencher campos (nome, logo, redes sociais, etc)
5. Clicar em "Salvar Patrocinador"

### 3. **Resultado Esperado**

✅ Mensagem de sucesso: "Patrocinador atualizado com sucesso"
✅ Modal fecha automaticamente
✅ Lista de patrocinadores atualiza com novos dados

---

## 📝 Arquivos Relacionados

- **Migration SQL**: `api/migrations/add-sponsor-fields.sql`
- **Backend API**: `api/caixa-misteriosa.js` (função `updateSponsor` na linha 1913)
- **Frontend Hook**: `src/hooks/useCaixaMisteriosa.js` (linha 196)
- **Componente Admin**: `src/components/caixa-misteriosa/admin/SetupView.jsx`

---

## ⚠️ Por Que Este Erro Aconteceu?

1. **Código foi atualizado** para usar novos campos (logo, redes sociais, etc)
2. **Migration foi criada** (`api/migrations/add-sponsor-fields.sql`)
3. **Migration NUNCA foi executada** no banco de dados Neon
4. **Resultado**: Backend tenta usar campos que não existem → Erro 500

---

## 🔍 Benefícios Após Correção

Após executar a migration, os patrocinadores terão:

✅ **Logo personalizada** na página pública
✅ **Links para redes sociais** (Facebook, Instagram)
✅ **Contato via WhatsApp**
✅ **Endereço completo** para referência

**Exemplo de patrocinador completo**:
```json
{
  "id": 1,
  "name": "Refrio Ar Condicionado",
  "logo_url": "https://encrypted-tbn0.gstatic.com/images/...",
  "facebook_url": "https://facebook.com/refrio",
  "instagram_url": "https://instagram.com/refrio",
  "whatsapp": "5569999999999",
  "address": "Av. Recife, 442 - Novo Cacoal - Cacoal - RO",
  "created_at": "2025-10-08T..."
}
```

---

**Status**: ⏳ Aguardando execução no Neon Console
**Urgência**: 🔴 CRÍTICO - Bloqueia edição de patrocinadores
**Tempo estimado**: 2 minutos (incluindo verificação)
