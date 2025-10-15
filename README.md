# NexoGeo v2 - Sistema Completo de Gerenciamento de Promoções

> ✨ **Última atualização:** Implementação completa de testes automatizados e melhoria significativa da cobertura

## 🚀 **Novas Funcionalidades:**
- 📊 **Rastreamento de Links:** UTM tracking completo para análise de marketing
- 📈 **Dashboard "Origem dos Links":** Visualize de onde vêm seus participantes  
- 🤖 **Auto-geração de Links:** Links automáticos para redes sociais
- 📱 **QR Codes:** Geração automática para campanhas offline
- 🗺️ **Dados para Mapas:** Geolocalização salva para visualizações futuras
- ✅ **Testes Automatizados:** Cobertura abrangente com Jest e React Testing Library
- 🎯 **Sistema de Sorteios Inteligente:** Gerenciamento automático de status das promoções
- 📱 **Redirecionamento WhatsApp Otimizado:** Experiência aprimorada para usuários do WhatsApp

## 🧪 **Sistema de Testes:**
- **Componentes**: 97 testes cobrindo todos os componentes críticos
- **Serviços**: Testes completos para todas as camadas de serviço
- **Contextos**: Testes de integração para ThemeContext e ToastContext
- **Páginas**: Cobertura para páginas principais como DashboardHomePage
- **Layout**: Testes completos para Header, Sidebar e componentes de layout

## Estrutura do Projeto

- `frontend/`: Aplicação React para interface do usuário
- `backend/`: API Node.js com Express
  - `migrations/`: Migrações do banco de dados
  - `routes/`: Rotas da API
  - `services/`: Serviços e configurações
  - `controllers/`: Controladores da API

## Configuração Inicial

1. Instalar dependências:
   ```bash
   npm run install:all
   ```

2. Configurar variáveis de ambiente:
   - Copiar `.env.example` para `.env` na pasta raiz
   - Copiar `.env.example` para `.env` na pasta `api/`
   - Preencher as variáveis necessárias

3. Criar banco de dados e executar migrações:
   ```bash
   npm run migrate
   ```

## Estrutura Atualizada

- `frontend/`: Aplicação React para interface do usuário
- `api/`: API Node.js com Express  
- `lib/`: Bibliotecas compartilhadas
- `public/`: Arquivos estáticos

## Desenvolvimento Local

```bash
npm start
```

Isso iniciará tanto o frontend quanto o backend simultaneamente.

## Scripts Disponíveis

- `npm start`: Inicia frontend e backend
- `npm run start:frontend`: Inicia apenas o frontend
- `npm run start:backend`: Inicia apenas o backend
- `npm run build`: Build do frontend
- `npm run install:all`: Instala dependências de todos os pacotes
- `npm run migrate`: Executa migrações do banco de dados
- `npm test`: Executa os testes automatizados
- `npm run test:coverage`: Executa testes com relatório de cobertura
- `npm run test:watch`: Executa testes em modo watch

## 🆕 Melhorias Recentes

### Sistema de Sorteios Inteligente
- **Gerenciamento Automático de Status**: Promoções são automaticamente marcadas como "encerrada" após sorteio
- **Reversibilidade**: Ao cancelar um ganhador, a promoção volta para status "ativa"
- **Error Handling Robusto**: Falhas na atualização de status não quebram o sorteio

### Redirecionamento WhatsApp Otimizado
- **Detecção Inteligente**: Sistema detecta quando usuário vem via WhatsApp (utm_source=whatsapp)
- **Experiência Personalizada**: Não exibe modal de WhatsApp para usuários que já vieram do WhatsApp
- **Preservação de Contexto**: Parâmetros UTM são mantidos durante toda a jornada do usuário

Para mais detalhes técnicos, consulte `MELHORIAS_IMPLEMENTADAS.md`.

## 🧪 Executando Testes

### Executar todos os testes:
```bash
npm test
```

### Executar testes com cobertura:
```bash
npm run test:coverage
```

### Executar testes específicos:
```bash
npm test -- --testPathPattern="ComponentName"
```

### Estrutura de Testes
```
src/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.jsx
│   │   └── LoginForm.test.jsx
│   ├── ThemeSelector/
│   │   ├── ThemeSelector.jsx
│   │   └── ThemeSelector.test.jsx
│   └── DashboardLayout/
│       ├── Header.jsx
│       ├── Header.test.jsx
│       ├── Sidebar.jsx
│       └── Sidebar.test.jsx
├── contexts/
│   ├── ThemeContext.jsx
│   ├── ThemeContext.test.jsx
│   ├── ToastContext.js
│   └── ToastContext.test.jsx
├── services/
│   ├── authService.js
│   ├── authService.test.js
│   └── ...outros serviços com testes
└── pages/
    ├── DashboardHomePage.jsx
    └── DashboardHomePage.test.jsx
```

### Principais Testes Implementados:
- **LoginForm**: Testes de autenticação, validação e estados de loading
- **ThemeSelector**: Testes para ambos os modos (dropdown/inline) e funcionalidades
- **Header**: Testes de logout, informações do usuário e acessibilidade
- **Sidebar**: Testes de navegação, seletor de temas e responsividade
- **DashboardHomePage**: Testes de carregamento de dados, gráficos e ações
- **Serviços**: Testes de API, tratamento de erros e validações
- **Contextos**: Testes de estado global e providers

## Migrações de Banco de Dados

Este projeto utiliza `node-pg-migrate` para gerenciar as migrações do banco de dados PostgreSQL. Veja `MIGRATIONS.md` para mais detalhes.

## Deploy na Vercel

1. Configurar as variáveis de ambiente no dashboard da Vercel
2. Executar as migrações após o deploy (ver `MIGRATIONS.md`)