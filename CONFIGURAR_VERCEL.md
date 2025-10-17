# Configurar Variáveis de Ambiente na Vercel

## 🎯 Variáveis que precisam ser atualizadas:

### 1. DATABASE_URL (Principal)
```
postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. DATABASE_URL_UNPOOLED (Sem pgbouncer)
```
postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3. POSTGRES_URL (Compatibilidade Vercel)
```
postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. POSTGRES_URL_NON_POOLING
```
postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### 5. POSTGRES_PRISMA_URL
```
postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require
```

### 6. Variáveis adicionais:
```
PGHOST=ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_T53ljWIDEqQJ
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_T53ljWIDEqQJ
POSTGRES_DATABASE=neondb
```

### 7. Outras variáveis importantes (já existentes):
```
JWT_SECRET=f3d66f17f4cc0e9629a75d86ebccdfd7d7881135116e403f15ea0b1ecf14f5597680f82ddfb38091fee9b43070fdfec28608a042ba1c9a6d1433d60b44f7ab282025
GOOGLE_API_KEY=AIzaSyBxFsDb0lGl5zUhtw_keTSgz6q3xhDYwNU
NODE_ENV=production
```

---

## 📋 Passo a passo para atualizar na Vercel:

### Método 1: Via Dashboard Web (Recomendado)

1. **Acesse o dashboard da Vercel:**
   - URL: https://vercel.com/dashboard
   - Faça login com sua conta

2. **Selecione o projeto:**
   - Clique em "nexogeo-demo" ou o nome do seu projeto

3. **Acesse as configurações:**
   - Clique em "Settings" (⚙️) no menu superior

4. **Vá para Environment Variables:**
   - No menu lateral, clique em "Environment Variables"

5. **Atualizar cada variável:**
   Para cada variável listada acima:

   a) **Se a variável JÁ EXISTE:**
      - Clique nos 3 pontinhos (...) ao lado da variável
      - Clique em "Edit"
      - Cole o novo valor
      - Selecione os ambientes: Production, Preview, Development
      - Clique em "Save"

   b) **Se a variável NÃO EXISTE:**
      - Clique em "Add New"
      - Name: Nome da variável (ex: DATABASE_URL)
      - Value: Cole o valor
      - Environments: Marque Production, Preview, Development
      - Clique em "Save"

6. **Redeploy o projeto:**
   - Volte para "Deployments"
   - Clique nos 3 pontinhos (...) do último deployment
   - Clique em "Redeploy"
   - Ou faça um novo push para o GitHub (automático)

---

### Método 2: Via Vercel CLI

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Login
vercel login

# 3. Link ao projeto (execute na pasta do projeto)
vercel link

# 4. Adicionar variáveis (uma por vez)
vercel env add DATABASE_URL production
# Cole o valor quando solicitado

# Repita para cada variável...

# 5. Deploy
vercel --prod
```

---

### Método 3: Script automatizado

Crie um arquivo `.vercel-env-update.sh`:

```bash
#!/bin/bash

# Adicionar todas as variáveis de uma vez
vercel env add DATABASE_URL production < <(echo "postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require")

vercel env add POSTGRES_URL production < <(echo "postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require")

# ... adicione outras variáveis

echo "✅ Variáveis atualizadas!"
echo "🚀 Executando deploy..."
vercel --prod
```

Execute:
```bash
chmod +x .vercel-env-update.sh
./.vercel-env-update.sh
```

---

## ✅ Checklist de verificação:

Após atualizar as variáveis:

- [ ] DATABASE_URL atualizada
- [ ] POSTGRES_URL atualizada
- [ ] JWT_SECRET mantido (não mudar!)
- [ ] GOOGLE_API_KEY mantida
- [ ] Todas as variáveis aplicadas em Production, Preview e Development
- [ ] Redeploy executado
- [ ] Deploy concluído sem erros
- [ ] Aplicação acessível (teste o login)

---

## 🔍 Verificar após deploy:

1. **Acesse a aplicação:**
   ```
   https://nexogeo-demo.vercel.app
   ```

2. **Teste o login:**
   - Usuário: `admin`
   - Senha: `1a8fa029516db249274331febf642b58`

3. **Verifique os logs:**
   ```bash
   vercel logs
   ```

4. **Em caso de erro:**
   - Vá em Vercel Dashboard → Deployments → Ver logs do deployment
   - Procure por erros relacionados a DATABASE_URL

---

## 🆘 Troubleshooting:

### Erro: "Cannot find module 'pg'"
- O Vercel instala automaticamente dependências do package.json
- Verifique se `pg` está em `dependencies` (não devDependencies)

### Erro: "Connection timeout"
- Verifique se a URL tem `?sslmode=require`
- Verifique se o IP da Vercel está na allowlist do Neon (geralmente não precisa)

### Erro: "Password authentication failed"
- Copie novamente a connection string do Neon
- Certifique-se de não ter espaços extras

### Deploy não atualiza:
- Force redeploy: Dashboard → Deployments → Redeploy
- Ou: `vercel --prod --force`

---

## 📊 Monitoramento:

Após deploy bem-sucedido, monitore:

1. **Logs da Vercel:**
   ```bash
   vercel logs --follow
   ```

2. **Status do Neon:**
   - Dashboard Neon → Monitoring
   - Veja conexões ativas

3. **Performance:**
   - Vercel Analytics
   - Tempo de resposta das APIs

---

## 🔐 Segurança:

**IMPORTANTE:**
- Nunca commite arquivos .env no Git
- `.env` já está no .gitignore
- CREDENCIAIS_ADMIN.txt deve ser deletado após uso
- Mude a senha do admin após primeiro acesso

---

## 📞 Suporte:

Em caso de problemas:
1. Verifique logs da Vercel
2. Verifique logs do Neon
3. Teste conexão local primeiro: `npm start`
