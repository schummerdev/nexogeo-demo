# Sistema de Login - NexoGeo Manus

## 🚀 Funcionalidades Implementadas

### Backend
- ✅ Controller de autenticação (`authController.js`)
- ✅ Rotas de autenticação (`authRoutes.js`)
- ✅ Integração com o app principal
- ✅ Script para criar usuário administrador
- ✅ Validação de credenciais com bcrypt
- ✅ Geração de tokens JWT

### Frontend
- ✅ Componente React de login (`LoginForm.jsx`)
- ✅ Estilos CSS profissionais (`LoginForm.css`)
- ✅ Estados de loading e erro
- ✅ Armazenamento local do token

## 📋 Pré-requisitos

1. **Banco de dados PostgreSQL** configurado com as tabelas do projeto
2. **Arquivo .env** configurado (veja `config-example.txt`)
3. **Dependências instaladas** (`npm install`)

## 🔧 Configuração

### 1. Criar arquivo .env
Copie o conteúdo de `config-example.txt` para um arquivo `.env` na pasta `src/`

### 2. Configurar banco de dados
Certifique-se de que as tabelas estão criadas (veja `criar tabelas sql postgres.txt`)

### 3. Criar usuário administrador
```bash
cd src
node scripts/criarAdmin.js
```

**Credenciais padrão:**
- Email: `admin@nexogeo.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 🧪 Testando o Sistema

### 1. Iniciar o servidor
```bash
cd src
npm start
```

### 2. Testar o endpoint de login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexogeo.com","senha":"admin123"}'
```

### 3. Usar o componente React
Importe e use o `LoginForm` em sua aplicação React:

```jsx
import LoginForm from './components/LoginForm/LoginForm';

function App() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
```

## 🔐 Segurança

- **Senhas criptografadas** com bcrypt (salt rounds: 10)
- **Tokens JWT** com expiração de 8 horas
- **Mensagens de erro genéricas** para não revelar informações sensíveis
- **Validação de entrada** no backend
- **HTTPS recomendado** para produção

## 📱 Próximos Passos

1. **Middleware de autenticação** para proteger rotas
2. **Painel administrativo** com dashboard
3. **Sistema de logout** e renovação de tokens
4. **Recuperação de senha** por email
5. **Logs de auditoria** para tentativas de login

## 🐛 Solução de Problemas

### Erro de conexão com banco
- Verifique as configurações no arquivo `.env`
- Certifique-se de que o PostgreSQL está rodando
- Teste a conexão manualmente

### Erro de JWT
- Verifique se `JWT_SECRET` está definido no `.env`
- Certifique-se de que a chave é longa e única

### Erro de CORS
- O servidor está configurado para aceitar requisições de qualquer origem
- Para produção, configure CORS adequadamente

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento. 