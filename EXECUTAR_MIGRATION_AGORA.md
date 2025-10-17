# 🚨 EXECUTAR MIGRATION URGENTE - Corrigir Erro 500

**Problema**: Erro 500 ao iniciar jogo porque colunas `logo_url`, `facebook_url`, etc não existem no banco.

**Solução**: Executar SQL abaixo no Neon Console.

---

## 📋 Passo a Passo

### **1. Acessar Neon Console**

URL: https://console.neon.tech/

---

### **2. Selecionar Projeto NexoGeo**

Clicar no projeto correto na lista.

---

### **3. Abrir SQL Editor**

No menu lateral: **SQL Editor**

---

### **4. Copiar e Colar o SQL Abaixo**

```sql
-- Migration: Adicionar campos adicionais à tabela sponsors
-- Data: 05/10/2025

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
COMMENT ON COLUMN sponsors.whatsapp IS 'Número de WhatsApp do patrocinador (formato: 5511999999999)';
COMMENT ON COLUMN sponsors.address IS 'Endereço completo do patrocinador';
```

---

### **5. Clicar em "Run" (▶️)**

Aguardar execução (deve ser instantâneo).

---

### **6. Verificar Sucesso**

Mensagem esperada:
```
ALTER TABLE
COMMENT
COMMENT
COMMENT
COMMENT
COMMENT
```

---

## ✅ Após Executar

1. **Fazer hard refresh no dashboard**: Ctrl + Shift + R
2. **Tentar iniciar jogo novamente**
3. **Erro 500 deve estar resolvido** ✅

---

## 🔍 Verificar Se Migration Foi Aplicada (Opcional)

Executar este SQL no Neon Console:

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

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `logo_url` | TEXT | URL da logo do patrocinador |
| `facebook_url` | TEXT | URL da página do Facebook |
| `instagram_url` | TEXT | URL do perfil do Instagram |
| `whatsapp` | VARCHAR(20) | Número WhatsApp (ex: 5569999999999) |
| `address` | TEXT | Endereço completo |

**Importante**: Todos os campos são **opcionais** (NULL permitido).

---

## ⚠️ Por Que o Erro 500 Aconteceu?

O código foi atualizado para buscar esses campos no banco:

```sql
SELECT s.logo_url, s.facebook_url, s.instagram_url, ...
FROM sponsors s
```

Mas as colunas ainda **não existiam** no banco, causando erro:

```
column "logo_url" does not exist
```

Após executar a migration, as colunas existirão e o erro será resolvido.

---

**Status**: ⏳ Aguardando execução no Neon Console
**Urgência**: 🔴 CRÍTICO - Bloqueia inicialização de jogos + Logo do patrocinador não aparece

## 🆕 ATUALIZAÇÃO (05/10/2025)

**Novo problema identificado**: A logo do patrocinador não está aparecendo na página pública mesmo com o código correto.

**Causa raiz**: A coluna `logo_url` não existe na tabela `sponsors` no banco de dados.

**Impacto**:
- ❌ Logo não exibe na página pública
- ❌ URLs de redes sociais (Facebook, Instagram) não funcionam
- ❌ WhatsApp e endereço do patrocinador não disponíveis

**Solução**: Executar a migration SQL abaixo para adicionar as colunas.
