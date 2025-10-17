# 🚀 Servidor Local com Banco Online

## ✅ Configuração Completa

O projeto está configurado para rodar localmente usando o banco de dados online do Vercel.

### 📋 Pré-requisitos

- ✅ Node.js instalado
- ✅ Arquivo `.env` com `DATABASE_URL` configurado
- ✅ Dependências instaladas (`npm install`)

### 🔧 Serviços Configurados

1. **Servidor API Local**: `http://localhost:3002`
   - Conecta com banco PostgreSQL online
   - Simula ambiente Vercel localmente
   - Hot reload para desenvolvimento

2. **Frontend React**: `http://localhost:3000`
   - Proxy configurado para API local
   - Hot reload automático

### 🚀 Como Iniciar

#### Opção 1: Serviços Separados

**Terminal 1 - API Backend:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend React:**
```bash
npm start
```

#### Opção 2: Tudo Junto (Recomendado)
```bash
npm run dev:full
```

### 🔍 Verificar se Está Funcionando

1. **API Status**: http://localhost:3002/status
2. **API Dashboard**: http://localhost:3002/api/?route=dashboard
3. **Frontend**: http://localhost:3000

### 📊 Dados Disponíveis

Com o banco online conectado, você tem acesso a:
- ✅ **5 promoções** cadastradas
- ✅ **105 participantes** registrados
- ✅ **Usuários admin** configurados
- ✅ **Configurações da emissora**

### 🔧 Logs de Debug

O servidor local mostra logs detalhados:
```
🔍 GET /api/?route=dashboard - Query: { route: 'dashboard' }
📋 Headers: Bearer [TOKEN]
✅ Resposta 200: success,data,source,timestamp
```

### 🐛 Solução de Problemas

#### Erro "DATABASE_URL environment variable is required"
```bash
# Verificar se .env existe
ls -la .env

# Iniciar com dotenv-cli
npx dotenv-cli npm run dev:api
```

#### Porta 3002 em uso
```bash
# Verificar processo usando a porta
netstat -ano | findstr :3002

# Matar processo se necessário
taskkill /PID [NUMERO_PID] /F
```

#### Frontend não conecta com API
- ✅ Verificar se proxy está configurado no `package.json`
- ✅ Confirmar que API está rodando em `localhost:3002`
- ✅ Verificar logs do console do navegador

### 📝 Comandos Disponíveis

```bash
# Iniciar apenas API
npm run dev:api

# Iniciar frontend e API juntos
npm run dev:full

# Testar conexão com banco
npx dotenv-cli node test-api.js

# Build para produção
npm run build

# Executar testes
npm test
```

### 🌐 URLs Importantes

- **Frontend**: http://localhost:3000
- **API Local**: http://localhost:3002/api
- **Status API**: http://localhost:3002/status
- **Dashboard API**: http://localhost:3002/api/?route=dashboard
- **Promoções API**: http://localhost:3002/api/?route=promocoes

### 🎯 Vantagens do Setup Local

1. **Desenvolvimento rápido** - Hot reload em ambos serviços
2. **Debug fácil** - Logs detalhados no terminal
3. **Banco real** - Dados idênticos ao ambiente de produção
4. **Teste completo** - API e frontend funcionando juntos
5. **Sem limites** - Sem restrições de requests por minuto

### 🔄 Sincronização com Produção

Os dados são compartilhados com o ambiente do Vercel:
- ✅ Mesmo banco PostgreSQL
- ✅ Mesma estrutura de dados
- ✅ Mesmos usuários e tokens
- ✅ Configurações idênticas

### 📈 Próximos Passos

1. **Abrir frontend**: http://localhost:3000
2. **Fazer login** com credenciais admin
3. **Verificar dashboard** funcionando
4. **Desenvolver novas features** localmente
5. **Deploy** quando pronto