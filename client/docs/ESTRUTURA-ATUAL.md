# Estrutura Atual do Projeto NexoGeo-manus

## 📁 Organização das Pastas

```
src/
├── 📁 components/           # Componentes React
│   ├── 📁 CapturaForm/     # Formulário de captura de participantes
│   │   ├── CapturaForm.jsx
│   │   └── CapturaForm.css
│   └── 📁 LoginForm/       # Tela de login do administrador
│       ├── LoginForm.jsx
│       └── LoginForm.css
│
├── 📁 controllers/          # Lógica de negócio da API
│   ├── authController.js    # Autenticação e login
│   └── participanteController.js # Gerenciamento de participantes
│
├── 📁 routes/               # Definição das rotas da API
│   ├── authRoutes.js        # Rotas de autenticação (/api/auth/*)
│   └── participanteRoutes.js # Rotas de participantes (/api/*)
│
├── 📁 services/             # Serviços e configurações
│   └── db.js               # Conexão com banco PostgreSQL
│
├── 📁 scripts/              # Scripts utilitários
│   └── criarAdmin.js       # Script para criar usuário administrador
│
├── 📁 node_modules/         # Dependências npm (gerado automaticamente)
├── app.js                   # Configuração principal do Express
├── server.js                # Ponto de entrada do servidor
├── package.json             # Dependências e scripts do projeto
├── package-lock.json        # Lock das versões das dependências
├── .env                     # Variáveis de ambiente (configurações)
├── config-example.txt       # Modelo para configuração
└── README-LOGIN.md          # Documentação do sistema de login
```

## 🚀 Funcionalidades Implementadas

### ✅ Backend (API)
- **Servidor Express** rodando na porta 3001
- **Sistema de autenticação** com JWT e bcrypt
- **API de participantes** com validação e geolocalização
- **Conexão PostgreSQL** com PostGIS para dados geoespaciais
- **Validação de dados** com express-validator
- **CORS configurado** para requisições cross-origin

### ✅ Frontend (React)
- **Formulário de captura** para participantes
- **Tela de login** para administradores
- **Estilos CSS** profissionais e responsivos
- **Estados de loading** e tratamento de erros

### ✅ Segurança
- **Senhas criptografadas** com bcrypt
- **Tokens JWT** com expiração configurável
- **Validação robusta** de entrada de dados
- **Mensagens de erro** genéricas para segurança

## 🔧 Configuração Necessária

### 1. Banco de Dados
- PostgreSQL com extensão PostGIS
- Tabelas criadas conforme `criar tabelas sql postgres.txt`

### 2. Variáveis de Ambiente (.env)
- Configurações do banco de dados
- Chave secreta para JWT
- Porta do servidor

### 3. Usuário Administrador
- Execute: `node scripts/criarAdmin.js`
- Credenciais padrão: admin@nexogeo.com / admin123

## 📱 Próximas Implementações

### Fase 2: Painel Administrativo
- [ ] Middleware de autenticação
- [ ] Layout do dashboard
- [ ] CRUD de promoções
- [ ] Gerenciamento de participantes

### Fase 3: Funcionalidades Avançadas
- [ ] Sistema de sorteio
- [ ] Geração de QR codes
- [ ] Relatórios e gráficos
- [ ] Configurações do sistema

## 🧪 Como Testar

1. **Configure o .env** com suas credenciais do banco
2. **Instale as dependências**: `npm install`
3. **Crie o usuário admin**: `node scripts/criarAdmin.js`
4. **Inicie o servidor**: `npm start`
5. **Teste a API**: http://localhost:3001/api/auth/login

## 📚 Documentação

- **README-LOGIN.md**: Sistema de autenticação
- **config-example.txt**: Modelo de configuração
- **pranejamento.txt**: Planejamento completo do projeto
- **criar tabelas sql postgres.txt**: Scripts SQL para o banco 