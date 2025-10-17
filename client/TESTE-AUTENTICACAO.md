# 🧪 Guia de Teste do Sistema de Autenticação

## 🔐 O que foi implementado

✅ **Middleware de Autenticação** (`authMiddleware.js`)  
✅ **Rotas Protegidas** para promoções (`/api/promocoes/*`)  
✅ **Controller Completo** para promoções com CRUD  
✅ **Logs de Auditoria** para todas as operações  
✅ **Validação de Tokens** JWT com expiração  

## 🚀 Como Testar

### 1. Pré-requisitos
- Servidor rodando em `http://localhost:3001`
- Usuário administrador criado no banco
- Banco PostgreSQL configurado com as tabelas

### 2. Teste de Login (Obter Token)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nexogeo.com",
    "senha": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "message": "Login bem-sucedido!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@nexogeo.com"
  }
}
```

### 3. Teste de Acesso Negado (Sem Token)

```bash
curl -X GET http://localhost:3001/api/promocoes
```

**Resposta esperada:**
```json
{
  "message": "Token de acesso não fornecido. Faça login para continuar."
}
```

**Status:** `401 Unauthorized`

### 4. Teste de Acesso Concedido (Com Token)

```bash
# Substitua SEU_TOKEN_AQUI pelo token recebido no login
curl -X GET http://localhost:3001/api/promocoes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta esperada:**
```json
{
  "message": "Promoções carregadas com sucesso!",
  "data": [],
  "total": 0
}
```

**Status:** `200 OK`

### 5. Teste de Criação de Promoção

```bash
curl -X POST http://localhost:3001/api/promocoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Promoção de Teste",
    "descricao": "Promoção para testar o sistema",
    "data_inicio": "2025-01-01",
    "data_fim": "2025-12-31"
  }'
```

### 6. Teste de Token Expirado

Para testar tokens expirados, você pode:
1. Aguardar 8 horas (tempo padrão de expiração)
2. Ou modificar o tempo no `authController.js`

### 7. Teste de Token Inválido

```bash
curl -X GET http://localhost:3001/api/promocoes \
  -H "Authorization: Bearer TOKEN_INVALIDO_123"
```

**Resposta esperada:**
```json
{
  "message": "Token inválido. Acesso negado."
}
```

**Status:** `403 Forbidden`

## 📱 Testando com Postman/Insomnia

### 1. Configurar Collection
- **Base URL:** `http://localhost:3001`
- **Headers padrão:** `Content-Type: application/json`

### 2. Login
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "admin@nexogeo.com",
  "senha": "admin123"
}
```

### 3. Usar Token
- Copie o token da resposta do login
- Adicione header: `Authorization: Bearer SEU_TOKEN`

### 4. Testar Rotas Protegidas
- **GET** `/api/promocoes` - Listar promoções
- **POST** `/api/promocoes` - Criar promoção
- **GET** `/api/promocoes/1` - Buscar promoção específica
- **PUT** `/api/promocoes/1` - Atualizar promoção
- **DELETE** `/api/promocoes/1` - Deletar promoção

## 🔍 Logs do Servidor

### Login Bem-sucedido
```
Login bem-sucedido para admin@nexogeo.com
```

### Acesso a Rota Protegida
```
Usuário Administrador (ID: 1) acessou: GET /api/promocoes
```

### Operações de Promoção
```
Promoção "Promoção de Teste" criada com sucesso pelo usuário Administrador
Promoção ID 1 atualizada com sucesso pelo usuário Administrador
```

## 🚨 Cenários de Erro

### 1. Token Ausente
- **Status:** 401
- **Mensagem:** "Token de acesso não fornecido. Faça login para continuar."

### 2. Token Expirado
- **Status:** 401
- **Mensagem:** "Token expirado. Faça login novamente."

### 3. Token Inválido
- **Status:** 403
- **Mensagem:** "Token inválido. Acesso negado."

### 4. Promoção Não Encontrada
- **Status:** 404
- **Mensagem:** "Promoção não encontrada."

### 5. Erro de Validação
- **Status:** 400
- **Mensagem:** "Todos os campos são obrigatórios: nome, descricao, data_inicio, data_fim"

## 🎯 Próximos Passos

1. **Testar todas as rotas** com e sem token
2. **Implementar frontend** para gerenciar promoções
3. **Adicionar validação** mais robusta nos controllers
4. **Implementar refresh tokens** para melhor UX
5. **Adicionar rate limiting** para segurança adicional

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Confirme se o banco está configurado
3. Verifique se o arquivo `.env` está correto
4. Teste com cURL antes de usar Postman 