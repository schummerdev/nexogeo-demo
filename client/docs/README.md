# 🚀 NexoGeo Manus - Sistema de Gerenciamento de Promoções

Sistema web completo para emissoras de TV/Rádio gerenciarem promoções e sorteios, com captura de participantes, geolocalização e painel administrativo.

## 📋 Índice

- [🚀 Funcionalidades](#-funcionalidades)
- [🏗️ Arquitetura](#️-arquitetura)
- [⚡ Quick Start](#-quick-start)
- [🔧 Configuração](#-configuração)
- [📱 Telas Implementadas](#-telas-implementadas)
- [🔐 Segurança](#-segurança)
- [📚 Documentação](#-documentação)
- [🔄 Próximos Passos](#-próximos-passos)

## 🚀 Funcionalidades

### ✅ Implementadas (MVP)
- **Captura de Participantes**: Formulário responsivo com geolocalização
- **Sistema de Login**: Autenticação segura para administradores
- **API RESTful**: Endpoints para participantes e autenticação
- **Geolocalização**: Rastreamento da localização dos participantes
- **Validação Robusta**: Validação tanto no frontend quanto no backend
- **Banco PostgreSQL**: Com extensão PostGIS para dados geoespaciais

### 🔄 Em Desenvolvimento
- **Painel Administrativo**: Dashboard com KPIs e gráficos
- **CRUD de Promoções**: Gerenciamento completo de campanhas
- **Sistema de Sorteio**: Ferramenta interativa para sorteios
- **Relatórios**: Análises e exportação de dados

## 🏗️ Arquitetura

```
Frontend (React) ←→ Backend (Node.js/Express) ←→ PostgreSQL (PostGIS)
```

### Stack Tecnológica
- **Frontend**: React.js com hooks e componentes funcionais
- **Backend**: Node.js + Express.js + JWT + bcrypt
- **Banco**: PostgreSQL + PostGIS (extensão geoespacial)
- **Validação**: Express-validator
- **Autenticação**: JWT com expiração configurável

## ⚡ Quick Start

### 1. Clone e Configure
```bash
git clone [url-do-repositorio]
cd NexoGeo-manus/src
npm install
```

### 2. Configure o Banco
```bash
# Execute o script SQL para criar as tabelas
# (veja criar tabelas sql postgres.txt)
```

### 3. Configure as Variáveis
```bash
# Copie o arquivo de exemplo
copy config-example.txt .env
# Edite o .env com suas configurações
```

### 4. Crie o Usuário Admin
```bash
node scripts/criarAdmin.js
# Credenciais: admin@nexogeo.com / admin123
```

### 5. Inicie o Servidor
```bash
npm start
# Servidor rodando em http://localhost:3001
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
# Banco de Dados
DB_USER=seu_usuario
DB_HOST=localhost
DB_DATABASE=nexogeo_manus
DB_PASSWORD=sua_senha
DB_PORT=5432

# JWT
JWT_SECRET=sua-chave-secreta-super-longa

# Servidor
PORT=3001
```

### Banco de Dados
- PostgreSQL 12+ com extensão PostGIS
- Execute os scripts em `criar tabelas sql postgres.txt`
- Configure as credenciais no arquivo `.env`

## 📱 Telas Implementadas

### 🎯 Tela 1: Captura de Participantes
- **Componente**: `CapturaForm/CapturaForm.jsx`
- **Funcionalidades**: 
  - Formulário responsivo
  - Captura automática de geolocalização
  - Leitura de parâmetros UTM da URL
  - Validação em tempo real
  - Estados de loading e sucesso

### 🔐 Tela 2: Login Administrativo
- **Componente**: `LoginForm/LoginForm.jsx`
- **Funcionalidades**:
  - Autenticação segura com JWT
  - Validação de credenciais
  - Tratamento de erros
  - Armazenamento local do token

## 🔐 Segurança

- **Senhas**: Criptografadas com bcrypt (10 salt rounds)
- **Autenticação**: JWT com expiração de 8 horas
- **Validação**: Express-validator para sanitização de entrada
- **CORS**: Configurado para desenvolvimento (configurar adequadamente para produção)
- **Mensagens de Erro**: Genéricas para não revelar informações sensíveis

## 📚 Documentação

- **[ESTRUTURA-ATUAL.md](ESTRUTURA-ATUAL.md)**: Estrutura detalhada do projeto
- **[README-LOGIN.md](README-LOGIN.md)**: Sistema de autenticação
- **[pranejamento.txt](../pranejamento.txt)**: Planejamento completo
- **[config-example.txt](config-example.txt)**: Modelo de configuração

## 🔄 Próximos Passos

### Fase 2: Painel Administrativo
1. **Middleware de Autenticação**: Proteger rotas administrativas
2. **Layout do Dashboard**: Menu lateral e área de conteúdo
3. **CRUD de Promoções**: Criar, editar, listar promoções
4. **Gerenciamento de Participantes**: Listar, filtrar, exportar dados

### Fase 3: Funcionalidades Avançadas
1. **Sistema de Sorteio**: Ferramenta interativa
2. **Geração de QR Codes**: Links rastreáveis
3. **Relatórios**: Gráficos e análises
4. **Configurações**: Personalização do sistema

## 🧪 Testando

### API Endpoints
```bash
# Login
POST /api/auth/login
# Criar participante
POST /api/participantes
# Status da API
GET /
```

### Teste com cURL
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexogeo.com","senha":"admin123"}'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas, problemas ou sugestões:
- Abra uma issue no repositório
- Consulte a documentação disponível
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ pela equipe NexoGeo** 