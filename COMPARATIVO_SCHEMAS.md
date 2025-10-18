# 📊 Comparativo de Estruturas dos Bancos de Dados

## 🎯 Resumo Executivo

**Banco ANTIGO (nexogeo)**: 12 tabelas
**Banco NOVO (neondb)**: 10 tabelas

**❌ CONCLUSÃO**: Migração direta (backup/restore) **NÃO É POSSÍVEL**

**6 tabelas** apresentam incompatibilidades estruturais que impedem a importação direta de dados.

---

## 📋 Comparação de Tabelas

### Tabelas em AMBOS os bancos (10)
✅ configuracoes_emissora
✅ games
✅ participantes
✅ products
✅ promocoes
✅ public_participants
✅ referral_rewards
✅ sponsors
✅ submissions
✅ usuarios

### Tabelas APENAS no Banco ANTIGO (2)
❌ `audit_logs` - Sistema de auditoria (não presente no novo)
❌ `ganhadores` - Tabela de ganhadores (não presente no novo)

---

## 🔍 Incompatibilidades Detalhadas

### 1. ⚠️ Tabela: `usuarios`

#### Colunas APENAS no ANTIGO (faltam no novo):
- **`senha`** (varchar(255)) - Senha em texto plano ou hash antigo
- **`google_id`** (varchar(255)) - ID do Google OAuth

#### Colunas APENAS no NOVO (faltam no antigo):
- **`updated_at`** (timestamp) - Data de última atualização

#### ⚠️ Diferenças de Tipo:
- `usuario`: varchar(255) → varchar(100)
- `senha_hash`: varchar(255) NULL → varchar(255) NOT NULL
- `role`: varchar(50) → varchar(20)

#### 💡 Impacto:
- ❌ Não é possível importar diretamente (campo `google_id` não existe)
- ✅ Pode mapear `senha` → `senha_hash` (já é hash no banco antigo)
- ⚠️ Campo `google_id` será perdido na migração

---

### 2. ⚠️ Tabela: `promocoes`

#### Colunas APENAS no ANTIGO (faltam no novo):
- **`slug`** (varchar(255)) - URL amigável da promoção
- **`link_participacao`** (text) - URL para participação
- **`criado_em`** (timestamp with tz) - Data de criação
- **`emissora_id`** (integer) - ID da emissora
- **`numero_ganhadores`** (integer) - Quantidade de ganhadores

#### Colunas APENAS no NOVO (faltam no antigo):
- **`participantes_count`** (integer) - Contagem de participantes
- **`created_at`** (timestamp) - Data de criação (novo formato)
- **`updated_at`** (timestamp) - Data de atualização

#### ⚠️ Diferenças de Tipo:
- `nome`: varchar(255) → varchar(200)
- `data_inicio`: date NOT NULL → date NULL
- `data_fim`: date NOT NULL → date NULL
- `status`: varchar(50) → varchar(20)

#### 💡 Impacto:
- ❌ Campos `slug`, `link_participacao`, `emissora_id`, `numero_ganhadores` serão perdidos
- ✅ Pode mapear `criado_em` → `created_at`
- ⚠️ Campo `participantes_count` precisará ser recalculado

---

### 3. ⚠️ Tabela: `participantes`

#### Colunas APENAS no ANTIGO (faltam no novo):
- **`latitude`** (numeric) - Coordenada geográfica latitude
- **`longitude`** (numeric) - Coordenada geográfica longitude
- **`participou_em`** (timestamp with tz) - Data de participação
- **`origem`** (varchar(50)) - Origem do cadastro

#### Colunas APENAS no NOVO (faltam no antigo):
- **`data_cadastro`** (timestamp) - Data de cadastro (substitui `participou_em`)

#### ⚠️ Diferenças de Tipo:
- `promocao_id`: integer NOT NULL → integer NULL
- `telefone`: varchar(20) NOT NULL → varchar(50) NULL
- `nome`: varchar(255) → varchar(200)
- `bairro`: varchar(255) → varchar(100)
- `cidade`: varchar(255) → varchar(100)
- `email`: varchar(255) → varchar(200)

#### 💡 Impacto:
- ❌ Coordenadas geográficas (`latitude`, `longitude`) serão perdidas
- ✅ Pode mapear `participou_em` → `data_cadastro`
- ⚠️ Perda de dados geográficos pode afetar funcionalidade de mapas

---

### 4. ⚠️ Tabela: `sponsors`

#### Colunas APENAS no ANTIGO (faltam no novo):
- **`logo_url`** (text) - URL do logotipo
- **`facebook_url`** (text) - URL do Facebook
- **`instagram_url`** (text) - URL do Instagram
- **`whatsapp`** (varchar(20)) - Telefone WhatsApp
- **`address`** (text) - Endereço do patrocinador

#### 💡 Impacto:
- ❌ Informações de contato e redes sociais dos patrocinadores serão perdidas
- ⚠️ Funcionalidade de exibição de patrocinadores pode ser afetada

---

### 5. ⚠️ Tabela: `public_participants`

#### Colunas APENAS no ANTIGO (faltam no novo):
- **`latitude`** (numeric) - Coordenada geográfica
- **`longitude`** (numeric) - Coordenada geográfica

#### 💡 Impacto:
- ❌ Coordenadas geográficas dos participantes públicos serão perdidas
- ⚠️ Pode afetar funcionalidade de geolocalização

---

### 6. ⚠️ Tabela: `configuracoes_emissora`

#### Colunas APENAS no NOVO (faltam no antigo):
- **`updated_at`** (timestamp) - Data de atualização

#### ⚠️ Diferenças de Tipo:
- `nome`: varchar(255) NOT NULL → varchar(200) NULL
- `website`: text → varchar(200) ⚠️
- `telefone`: text → varchar(50) ⚠️
- `instagram`: text → varchar(200) ⚠️
- `facebook`: text → varchar(200) ⚠️
- `youtube`: text → varchar(200) ⚠️
- `linkedin`: text → varchar(200) ⚠️
- `twitter`: text → varchar(200) ⚠️
- `whatsapp`: text → varchar(50) ⚠️
- `email`: text → varchar(200) ⚠️

#### 💡 Impacto:
- ⚠️ Muitos campos `text` (ilimitado) → `varchar(N)` (limitado)
- ⚠️ Dados podem ser truncados se ultrapassarem limites

---

## ✅ Tabelas SEM Incompatibilidades

### `games`
✅ Estrutura idêntica (7 colunas)

### `products`
✅ Estrutura idêntica (5 colunas)

### `referral_rewards`
✅ Estrutura idêntica (5 colunas)

### `submissions`
✅ Estrutura idêntica (11 colunas)

---

## 🚫 Dados Que Serão PERDIDOS na Migração

### Tabelas Completas:
1. ❌ **`audit_logs`** - Todo histórico de auditoria
2. ❌ **`ganhadores`** - Todos os registros de ganhadores

### Campos Perdidos:

#### usuarios:
- ❌ `google_id` - Integração com Google OAuth

#### promocoes:
- ❌ `slug` - URLs amigáveis
- ❌ `link_participacao` - Links de participação
- ❌ `emissora_id` - Associação com emissora
- ❌ `numero_ganhadores` - Configuração de ganhadores

#### participantes:
- ❌ `latitude` / `longitude` - Geolocalização (107 registros)
- ❌ `origem` - Rastreamento de origem

#### public_participants:
- ❌ `latitude` / `longitude` - Geolocalização

#### sponsors:
- ❌ `logo_url` - Logotipos
- ❌ `facebook_url` - Rede social
- ❌ `instagram_url` - Rede social
- ❌ `whatsapp` - Contato
- ❌ `address` - Endereços

---

## 📊 Estatísticas de Incompatibilidade

| Tabela | Colunas Perdidas | Colunas Adicionadas | Tipos Diferentes |
|--------|------------------|---------------------|------------------|
| usuarios | 2 | 1 | 3 |
| promocoes | 5 | 3 | 4 |
| participantes | 4 | 1 | 6 |
| sponsors | 5 | 0 | 0 |
| public_participants | 2 | 0 | 0 |
| configuracoes_emissora | 0 | 1 | 9 |
| **TOTAL** | **18** | **6** | **22** |

---

## 💡 Soluções Possíveis

### ✅ Opção 1: Migração Parcial (RECOMENDADA)

Migrar apenas as tabelas e colunas compatíveis usando `export-nexogeo-manus-safe.sql`:

**Tabelas que podem ser migradas**:
- ✅ usuarios (sem `google_id`)
- ✅ promocoes (sem `slug`, `link_participacao`, etc.)
- ✅ participantes (sem coordenadas geográficas)
- ✅ configuracoes_emissora (com truncamento de textos longos)
- ✅ games, products, referral_rewards, submissions (100%)

**Dados preservados**:
- 4 usuários
- 7 promoções
- 107 participantes (sem geolocalização)
- 1 configuração de emissora

**Dados perdidos**:
- Histórico de auditoria (`audit_logs`)
- Registros de ganhadores (`ganhadores`)
- Coordenadas geográficas (latitude/longitude)
- Informações extras de patrocinadores
- IDs de Google OAuth
- Slugs e links de promoções

---

### ⚠️ Opção 2: Migração Manual Completa

Criar scripts customizados para migrar campo a campo, decidindo o que fazer com dados incompatíveis:

**Vantagens**:
- Controle total sobre mapeamento
- Possibilidade de preservar mais dados

**Desvantagens**:
- Trabalhoso e propenso a erros
- Requer conhecimento profundo de ambos os schemas
- Tempo de desenvolvimento elevado

---

### ❌ Opção 3: Começar do Zero

Aceitar que são projetos diferentes e não migrar dados antigos:

**Quando usar**:
- Se dados antigos não são críticos
- Se banco novo representa refatoração completa
- Se funcionalidades mudaram significativamente

---

## 🎯 Recomendação Final

**Use a Opção 1 (Migração Parcial)** com o script `export-nexogeo-manus-safe.sql` via Neon SQL Editor:

1. ✅ Preserva dados essenciais (usuários, promoções, participantes)
2. ⚠️ Aceita perda de dados secundários (geolocalização, auditoria)
3. ✅ Processo automatizado e documentado
4. ✅ Rápido e com baixo risco de erros

**Impacto aceitável**:
- Perde histórico de auditoria (pode ser recriado)
- Perde coordenadas GPS (pode ser opcional na nova versão)
- Perde informações extras de patrocinadores (pode ser re-cadastrado)

---

## 📝 Notas Importantes

1. **Backup antes de migrar**: Sempre faça backup completo dos dois bancos antes de qualquer operação
2. **Validação após migração**: Use `node verify-migration.js` para conferir dados importados
3. **Testes funcionais**: Teste todas as funcionalidades críticas após migração
4. **Documentação**: Mantenha registro do que foi migrado e do que foi perdido

---

**Data do comparativo**: 2025-10-18
**Método de análise**: Script `compare-schemas.js`
**Banco origem**: nexogeo_manus (12 tabelas)
**Banco destino**: neondb (10 tabelas)
