# 🔐 Credenciais de Acesso - Nexogeo Demo

## Banco de Dados
- **Nome:** neondb
- **Host:** ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech
- **Região:** sa-east-1 (São Paulo)
- **SSL:** Habilitado

## Usuário Administrador

### Login Web
```
URL: http://localhost:3000
Usuário: admin
Senha: 42d884f7b7e37fe8
```

⚠️ **IMPORTANTE:** Altere esta senha após o primeiro login!

## Tabelas Criadas

### Sistema Principal
- ✅ usuarios
- ✅ configuracoes_emissora
- ✅ promocoes
- ✅ participantes

### Caixa Misteriosa
- ✅ sponsors
- ✅ products
- ✅ games
- ✅ submissions

### Sistema de Referência
- ✅ public_participants
- ✅ referral_rewards

## Status do Sistema
- ✅ Banco de dados: Configurado
- ✅ Tabelas: Criadas
- ✅ Usuário admin: Ativo
- ✅ Build frontend: Compilado
- ✅ Servidor: Rodando na porta 3000

## Scripts Úteis
```bash
# Testar login
node test-login.js

# Resetar senha do admin
node create-admin.js

# Reinicializar banco de dados
node init-db.js

# Iniciar aplicação
npm start                # Frontend (porta 3000)
npm run dev:api         # API Backend (porta 3002)
npm run dev:full        # Frontend + Backend
```

---
**Data:** 2025-10-17
**Versão:** 2.1.0
