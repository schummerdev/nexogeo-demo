# 🔍 Relatório de Auditoria de Código - NexoGeo
**Data:** 13/10/2025
**Revisor:** Claude Code AI
**Versão do Projeto:** 1.0.1

---

## 📊 Resumo Executivo

### Estatísticas Gerais
- **Total de arquivos backend:** 24 arquivos JavaScript
- **Total de arquivos frontend:** 90 arquivos JS/JSX
- **Console.logs no backend:** 294 ocorrências
- **Arquivos de teste/debug não removidos:** 5 arquivos
- **Maior arquivo:** `api/caixa-misteriosa.js` (144KB, 43 funções)

### Classificação de Segurança: 🟡 MÉDIA-ALTA
**Pontos fortes:**
- ✅ Proteção contra SQL Injection (queries parametrizadas)
- ✅ Rate limiting implementado
- ✅ Headers de segurança configurados
- ✅ SSL com validação de certificado
- ✅ Bcrypt para hash de senhas
- ✅ JWT para autenticação

**Pontos de atenção:**
- ⚠️ Arquivos .env presentes no projeto (risco de commit acidental)
- ⚠️ 294 console.logs em produção (vazamento de informações)
- ⚠️ Arquivos de teste em produção
- ⚠️ Arquivo muito grande precisa de refatoração

---

## 🚨 CRÍTICO - Ação Imediata Necessária

### 1. **Arquivos Sensíveis Expostos**
**Severidade:** 🔴 CRÍTICA

**Problema:**
```bash
# Arquivos .env detectados:
./api/.env
./.env
```

**Risco:**
- Credenciais de banco de dados
- JWT_SECRET exposto
- Chaves de API do Google

**Solução Imediata:**
```bash
# Verificar se foram commitados
git log --all --full-history -- "*.env"

# Se foram commitados, limpar histórico:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env api/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push (CUIDADO!)
git push origin --force --all
```

**Prevenção:**
- ✅ `.gitignore` já está configurado corretamente
- ⚠️ Nunca commitar arquivos .env
- ⚠️ Rotacionar todas as credenciais se foram expostas

### 2. **Console.logs em Produção (294 ocorrências)**
**Severidade:** 🟡 MÉDIA-ALTA

**Problema:**
Console.logs podem vazar:
- Informações de usuários (telefones, emails)
- Estrutura do banco de dados
- Lógica de negócio
- Tokens e sessões

**Locais principais:**
- `api/caixa-misteriosa.js`: ~100 logs
- `api/index.js`: ~50 logs
- `api/dashboard.js`: ~30 logs

**Solução:**
```javascript
// Criar logger centralizado
// api/_lib/logger.js
const logger = {
  info: (msg, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`ℹ️ ${msg}`, data);
    }
  },
  error: (msg, error) => {
    console.error(`❌ ${msg}`, error.message); // Apenas message, não stack completa
  },
  debug: (msg, data) => {
    if (process.env.DEBUG === 'true') {
      console.log(`🐛 ${msg}`, data);
    }
  }
};
```

**Substituir:**
```javascript
// ❌ ANTES
console.log('🔍 Dados do usuário:', user);

// ✅ DEPOIS
logger.debug('Usuário autenticado', { userId: user.id });
```

---

## 🗑️ Arquivos Desnecessários (Devem ser Removidos)

### Arquivos de Teste/Debug em Produção
**Severidade:** 🟡 MÉDIA

```bash
# Arquivos que devem ser DELETADOS:
api/auth_backup.js          # Backup antigo (160 bytes)
api/authtest.js             # Arquivo de teste (690 bytes)
api/test-auth.js            # Teste de autenticação (1.3KB)
api/debug-tables.js         # Debug de tabelas (2.8KB)
api/hello.js                # Endpoint de teste (145 bytes)
api/inspect-db.js           # Inspeção de banco (8KB)
```

**Comando para remover:**
```bash
cd api
rm auth_backup.js authtest.js test-auth.js debug-tables.js hello.js inspect-db.js
git add -A
git commit -m "chore: Remove arquivos de teste e debug da produção"
git push
```

**Impacto:**
- Reduz superfície de ataque
- Remove endpoints não documentados
- Diminui tamanho do deploy
- Melhora segurança geral

---

## ⚡ Performance e Eficiência

### 1. **Arquivo Muito Grande**
**Problema:** `api/caixa-misteriosa.js` (144KB, 43 funções)

**Impacto:**
- Difícil manutenção
- Cold start lento no Vercel
- Risco de erros

**Solução Recomendada:**
Refatorar em módulos menores:
```
api/
├── caixa-misteriosa/
│   ├── index.js              # Handler principal
│   ├── game-controller.js    # Lógica de jogo
│   ├── submission-service.js # Gerenciamento de palpites
│   ├── winner-service.js     # Lógica de ganhadores
│   ├── referral-service.js   # Sistema de referência
│   └── validation.js         # Validações
```

### 2. **Queries N+1 Detectadas**

**Problema em `api/dashboard.js`:**
```javascript
// ❌ N+1 Query Problem
for (const promocao of promocoes) {
  const participantes = await query('SELECT COUNT(*) FROM participantes WHERE promocao_id = $1', [promocao.id]);
}
```

**Solução:**
```javascript
// ✅ Single Query com JOIN
const result = await query(`
  SELECT
    p.id, p.nome, p.status,
    COUNT(pt.id) as participantes_count
  FROM promocoes p
  LEFT JOIN participantes pt ON p.id = pt.promocao_id
  GROUP BY p.id
`);
```

### 3. **Falta de Cache**

**Oportunidades de Cache:**
- Configurações da emissora (raramente mudam)
- Lista de patrocinadores
- Produtos da caixa misteriosa

**Implementação Sugerida:**
```javascript
// api/_lib/cache.js já existe mas não é usado!
const { getCache, setCache } = require('./_lib/cache');

// Exemplo de uso:
async function getConfig() {
  const cached = getCache('config');
  if (cached) return cached;

  const result = await query('SELECT * FROM configuracoes_emissora LIMIT 1');
  setCache('config', result.rows[0], 300000); // 5 min
  return result.rows[0];
}
```

### 4. **Índices de Banco Faltando**

**Análise de queries frequentes:**
```sql
-- Adicionar índices para melhor performance:
CREATE INDEX IF NOT EXISTS idx_participantes_promocao_data
  ON participantes(promocao_id, data_cadastro DESC);

CREATE INDEX IF NOT EXISTS idx_participantes_telefone_hash
  ON participantes USING hash(telefone);

CREATE INDEX IF NOT EXISTS idx_submissions_phone_game
  ON submissions(user_phone, game_id);

CREATE INDEX IF NOT EXISTS idx_games_created_status
  ON games(created_at DESC, status);
```

---

## 🔒 Segurança - Vulnerabilidades e Recomendações

### ✅ Pontos Fortes (Já Implementados)

1. **Proteção SQL Injection**
   - ✅ Todas as queries usam parâmetros (`$1, $2`)
   - ✅ Nenhum uso de `eval()` ou `Function()`
   - ✅ Nenhuma concatenação direta em SQL

2. **Autenticação JWT**
   - ✅ Tokens com expiração
   - ✅ Verificação de secret forte (>32 caracteres)
   - ✅ Bcrypt com salt rounds adequado

3. **Headers de Segurança**
   - ✅ X-Content-Type-Options: nosniff
   - ✅ X-Frame-Options: DENY
   - ✅ Strict-Transport-Security (HSTS)
   - ✅ Content-Security-Policy
   - ✅ Referrer-Policy

4. **Rate Limiting**
   - ✅ 60 requests/minuto global
   - ✅ Por IP

### ⚠️ Vulnerabilidades e Melhorias

#### 1. **CORS Muito Permissivo**
**Arquivo:** `api/index.js:33-44`

**Problema:**
```javascript
const allowedOrigins = [
  'https://tvsurui.com.br',
  'https://nexogeo2.vercel.app',
  'http://localhost:3000',      // ⚠️ OK apenas em dev
  'http://localhost:3001',      // ⚠️ OK apenas em dev
  'http://localhost:3002'       // ⚠️ OK apenas em dev
];
```

**Solução:**
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://tvsurui.com.br',
      'https://nexogeo.vercel.app', // ⚠️ Verificar domínio correto
      'https://nexogeo2.vercel.app'
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002'
    ];
```

#### 2. **Falta de Validação de Input**

**Problema:** Campos não validados antes de salvar no banco

**Exemplo em `api/caixa-misteriosa.js`:**
```javascript
// ❌ ANTES - Sem validação
const { userName, userPhone, userNeighborhood, guess } = req.body;
await query('INSERT INTO submissions ...', [userName, userPhone, ...]);
```

**Solução:**
```javascript
// ✅ DEPOIS - Com validação
const { userName, userPhone, userNeighborhood, guess } = req.body;

// Validações
if (!userName || userName.length < 3 || userName.length > 255) {
  return res.status(400).json({ error: 'Nome inválido' });
}

if (!userPhone || !/^\d{10,11}$/.test(userPhone.replace(/\D/g, ''))) {
  return res.status(400).json({ error: 'Telefone inválido' });
}

if (!guess || guess.length < 2 || guess.length > 255) {
  return res.status(400).json({ error: 'Palpite inválido' });
}

// Sanitização
const sanitizedName = userName.trim().substring(0, 255);
const sanitizedPhone = userPhone.replace(/\D/g, '');
```

**Biblioteca Recomendada:**
```bash
npm install joi
```

```javascript
const Joi = require('joi');

const submissionSchema = Joi.object({
  userName: Joi.string().min(3).max(255).required(),
  userPhone: Joi.string().pattern(/^\d{10,11}$/).required(),
  userNeighborhood: Joi.string().max(255).required(),
  userCity: Joi.string().max(255).required(),
  guess: Joi.string().min(2).max(255).required()
});

// Uso:
const { error, value } = submissionSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

#### 3. **Exposição de Informações Sensíveis**

**Problema:** Respostas de erro muito verbosas

**Exemplo:**
```javascript
// ❌ ANTES
} catch (error) {
  return res.status(500).json({
    success: false,
    error: error.message,        // ⚠️ Pode vazar stack trace
    stack: error.stack,          // ⚠️ NUNCA expor em produção!
    query: sqlQuery              // ⚠️ Vaza estrutura do banco
  });
}
```

**Solução:**
```javascript
// ✅ DEPOIS
} catch (error) {
  console.error('Erro interno:', error); // Log apenas no servidor

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'  // Genérico em produção
      : error.message                // Detalhado em dev
  });
}
```

#### 4. **Falta de Proteção CSRF**

**Problema:** Endpoints de modificação sem proteção CSRF

**Solução:**
```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Aplicar em rotas de mutação:
app.post('/api/sorteio', csrfProtection, async (req, res) => {
  // ... handler
});

// Frontend precisa enviar token:
<meta name="csrf-token" content="{{ csrfToken }}">
```

#### 5. **Rate Limiting Pode Ser Burlado**

**Problema:** Rate limiting baseado apenas em IP

**Vulnerabilidades:**
- IP compartilhado (NAT, proxies)
- IP spoofing via headers
- Bypass com Tor/VPN

**Solução:**
```javascript
// Múltiplos fatores para rate limiting
const getRateLimitKey = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userId = req.user?.id || 'anonymous';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Combinar fatores
  return `${ip}-${userId}-${crypto.createHash('md5').update(userAgent).digest('hex')}`;
};
```

---

## 🐛 Bugs e Code Smells

### 1. **TODOs Não Resolvidos**

**Encontrados:**
```javascript
// src/index.js:13
// TODO: Reabilitar após corrigir bundle no Vercel

// src/pages/AuditLogsPage.jsx:45
// TODO: Reativar controle de acesso após configurar roles corretamente
```

**Ação:** Criar issues no GitHub para rastrear

### 2. **Código Morto**

**Arquivo:** `api/_lib/cache.js`
- ✅ Implementação completa de cache
- ❌ **NUNCA É USADO** em nenhum lugar do projeto!

**Ação:** Implementar ou remover

### 3. **Duplicação de Código**

**Padrão repetido ~15 vezes:**
```javascript
// Validação de autenticação duplicada
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ error: 'Token não fornecido' });
}
const token = authHeader.split(' ')[1];
// ... verificação JWT
```

**Solução:** Criar middleware
```javascript
// api/_lib/auth-middleware.js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Não autorizado' });
  }
};
```

### 4. **Inconsistência de Nomenclatura**

**Problema:** Mistura de português e inglês
```javascript
// api/caixa-misteriosa.js
const gameStatus = 'ativo';           // Português
const participanteName = 'João';      // Português
const submissionCount = 5;            // Inglês
```

**Recomendação:** Padronizar para **inglês** no código, português na UI

---

## 📦 Dependências e Bibliotecas

### Dependências Principais (Atualizadas ✅)
```json
{
  "bcrypt": "6.0.0",        // ✅ Atualizado
  "express": "5.1.0",       // ✅ Atualizado (versão 5!)
  "jsonwebtoken": "9.0.2",  // ✅ Atualizado
  "pg": "8.16.3"            // ✅ Atualizado
}
```

### Bibliotecas Recomendadas (Faltando)

```bash
# Validação de input
npm install joi

# Sanitização de HTML (se houver rich text)
npm install dompurify

# Helmet para headers de segurança automáticos
npm install helmet

# Rate limiting robusto
npm install express-rate-limit

# Proteção CSRF
npm install csurf

# Logging estruturado
npm install winston
```

---

## 🏗️ Arquitetura e Organização

### Pontos Fortes ✅
- Separação clara frontend/backend
- Uso de contextos no React
- Lazy loading de componentes
- Migrations de banco organizadas

### Áreas de Melhoria ⚠️

#### 1. **Falta de Testes**
```bash
# Nenhum teste detectado!
find . -name "*.test.js" -o -name "*.spec.js" | wc -l
# 0
```

**Recomendação:** Implementar testes
```bash
npm install --save-dev jest supertest @testing-library/react

# Estrutura sugerida:
tests/
├── unit/
│   ├── auth.test.js
│   ├── validation.test.js
│   └── services/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── caixa-misteriosa.test.js
```

#### 2. **Falta de Documentação da API**

**Problema:** Nenhum arquivo de documentação OpenAPI/Swagger

**Solução:**
```bash
npm install swagger-ui-express swagger-jsdoc

# api/docs/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NexoGeo API',
      version: '1.0.0',
    },
  },
  apis: ['./api/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
```

#### 3. **Falta de CI/CD**

**Recomendação:** Adicionar GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm audit
```

---

## 📋 Checklist de Ações Prioritárias

### 🔴 URGENTE (Fazer Hoje)
- [ ] Verificar se .env foi commitado no Git
- [ ] Se sim, rotacionar TODAS as credenciais
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] GOOGLE_API_KEY
  - [ ] Outras chaves de API
- [ ] Remover arquivos de teste da produção
- [ ] Implementar logger centralizado
- [ ] Remover console.logs com dados sensíveis

### 🟡 IMPORTANTE (Esta Semana)
- [ ] Implementar validação de input (Joi)
- [ ] Adicionar proteção CSRF
- [ ] Refatorar caixa-misteriosa.js em módulos menores
- [ ] Implementar cache (já existe lib, só usar)
- [ ] Adicionar índices de banco recomendados
- [ ] Corrigir CORS para produção
- [ ] Padronizar mensagens de erro

### 🟢 DESEJÁVEL (Este Mês)
- [ ] Implementar testes unitários
- [ ] Implementar testes de integração
- [ ] Criar documentação Swagger
- [ ] Adicionar CI/CD (GitHub Actions)
- [ ] Implementar rate limiting por múltiplos fatores
- [ ] Resolver TODOs do código
- [ ] Padronizar nomenclatura (inglês)

---

## 📊 Métricas de Qualidade

### Antes da Auditoria
- **Segurança:** 🟡 6/10
- **Performance:** 🟡 5/10
- **Manutenibilidade:** 🟡 6/10
- **Testabilidade:** 🔴 2/10

### Após Implementar Recomendações
- **Segurança:** 🟢 9/10
- **Performance:** 🟢 8/10
- **Manutenibilidade:** 🟢 8/10
- **Testabilidade:** 🟢 8/10

---

## 🎯 Conclusão

O projeto **NexoGeo** possui uma **base sólida de segurança** com boas práticas implementadas (SQL injection prevention, JWT, bcrypt, rate limiting). No entanto, existem **riscos significativos** que precisam ser endereçados:

### Principais Riscos:
1. **Exposição de credenciais** (.env commitado?)
2. **Vazamento de informações** (console.logs em produção)
3. **Arquivos de teste em produção**
4. **Falta de validação de input**
5. **Falta de testes**

### Principais Oportunidades:
1. **Performance** (cache, índices, refatoração)
2. **Manutenibilidade** (documentação, testes, CI/CD)
3. **Segurança** (CSRF, validação, melhor rate limiting)

**Recomendação Final:** Priorizar as ações URGENTES imediatamente, seguidas pelas IMPORTANTES dentro de 7 dias.

---

**Auditoria realizada por:** Claude Code AI
**Contato para dúvidas:** Revisar com equipe de desenvolvimento
