# Migration: Adicionar Campos de Patrocinador

**Data**: 05/10/2025
**Arquivo**: `api/migrations/add-sponsor-fields.sql`

---

## 📋 Campos Adicionados

A migration adiciona os seguintes campos à tabela `sponsors`:

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `logo_url` | TEXT | URL da logo/marca do patrocinador | Não |
| `facebook_url` | TEXT | URL da página do Facebook | Não |
| `instagram_url` | TEXT | URL do perfil do Instagram | Não |
| `whatsapp` | VARCHAR(20) | Número WhatsApp (formato: 5511999999999) | Não |
| `address` | TEXT | Endereço completo do patrocinador | Não |

---

## 🚀 Como Executar a Migration

### **Opção 1: Via psql (Linha de Comando)**

```bash
psql $DATABASE_URL -f api/migrations/add-sponsor-fields.sql
```

### **Opção 2: Via Neon Console (Web)**

1. Acessar: https://console.neon.tech/
2. Selecionar o projeto NexoGeo
3. Ir em "SQL Editor"
4. Copiar e colar o conteúdo de `api/migrations/add-sponsor-fields.sql`
5. Clicar em "Run"

### **Opção 3: Via Node.js Script**

Criar arquivo `api/migrations/run-add-sponsor-fields.js`:

```javascript
const { query } = require('../../lib/db.js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('🚀 Executando migration: add-sponsor-fields.sql');

        const sqlPath = path.join(__dirname, 'add-sponsor-fields.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await query(sql);

        console.log('✅ Migration executada com sucesso!');
        console.log('📊 Novos campos adicionados:');
        console.log('   - logo_url');
        console.log('   - facebook_url');
        console.log('   - instagram_url');
        console.log('   - whatsapp');
        console.log('   - address');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao executar migration:', error);
        process.exit(1);
    }
}

runMigration();
```

Executar:
```bash
node api/migrations/run-add-sponsor-fields.js
```

---

## ✅ Verificar Se Migration Foi Aplicada

Executar no SQL Editor:

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

## 🔄 Mudanças Necessárias no Código

### **1. API - createSponsor** (api/caixa-misteriosa.js)

**Antes**:
```javascript
INSERT INTO sponsors (name)
VALUES ($1)
RETURNING id, name, created_at
```

**Depois**:
```javascript
INSERT INTO sponsors (name, logo_url, facebook_url, instagram_url, whatsapp, address)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, name, logo_url, facebook_url, instagram_url, whatsapp, address, created_at
```

### **2. API - updateSponsor** (api/caixa-misteriosa.js)

**Antes**:
```javascript
UPDATE sponsors
SET name = $1
WHERE id = $2
RETURNING id, name, created_at
```

**Depois**:
```javascript
UPDATE sponsors
SET name = $1, logo_url = $2, facebook_url = $3, instagram_url = $4, whatsapp = $5, address = $6
WHERE id = $7
RETURNING id, name, logo_url, facebook_url, instagram_url, whatsapp, address, created_at
```

### **3. API - getSponsors** (api/caixa-misteriosa.js)

**Antes**:
```javascript
SELECT id, name, created_at FROM sponsors
```

**Depois**:
```javascript
SELECT id, name, logo_url, facebook_url, instagram_url, whatsapp, address, created_at
FROM sponsors
ORDER BY created_at DESC
```

### **4. Frontend - SetupView** (src/components/caixa-misteriosa/SetupView.jsx)

Adicionar campos ao formulário de edição:
- Input: URL Logo Marca
- Input: URL Facebook
- Input: URL Instagram
- Input: WhatsApp
- Textarea: Endereço

### **5. Frontend - CaixaMisteriosaPub** (src/pages/CaixaMisteriosaPub.jsx)

Exibir logo do patrocinador quando `logo_url` estiver preenchida:

```jsx
{liveGame.giveaway?.sponsorLogoUrl && (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img
            src={liveGame.giveaway.sponsorLogoUrl}
            alt={liveGame.giveaway.sponsorName}
            style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
        />
    </div>
)}
```

---

## 📝 Ordem de Execução

1. ✅ **Executar migration SQL** (adiciona colunas ao banco)
2. ⏳ **Atualizar API** (createSponsor, updateSponsor, getSponsors)
3. ⏳ **Atualizar formulário do dashboard** (adicionar campos)
4. ⏳ **Atualizar página pública** (exibir logo)
5. ⏳ **Testar criação/edição de patrocinador**
6. ⏳ **Testar exibição na página pública**

---

## 🎯 Exemplo de Uso

Após migration, patrocinadores poderão ter:

```json
{
  "id": 1,
  "name": "Refrio",
  "logo_url": "https://exemplo.com/logo-refrio.png",
  "facebook_url": "https://facebook.com/refrio",
  "instagram_url": "https://instagram.com/refrio",
  "whatsapp": "5569999999999",
  "address": "Rua Exemplo, 123 - Centro, Cacoal - RO",
  "created_at": "2025-09-30T..."
}
```

---

**Status**: Migration SQL criada ✅ | Aguardando execução ⏳
