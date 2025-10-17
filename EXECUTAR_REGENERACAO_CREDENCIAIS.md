# 🔄 EXECUTAR: Regeneração de Credenciais de Segurança

**URGÊNCIA**: 🚨 **CRÍTICA** - Execute IMEDIATAMENTE antes do próximo deploy

## 🔐 **NOVAS CREDENCIAIS GERADAS**

### ✅ **Novo JWT Secret (128 chars)**
```
JWT_SECRET=f3d66f17f4cc0e9629a75d86ebccdfd7d7881135116e403f15ea0b1ecf14f5597680f82ddfb38091fee9b43070fdfec28608a042ba1c9a6d1433d60b44f7ab28
```

### ✅ **Nova Senha para Banco (Sugestão)**
```
NOVA_SENHA_DB=Wm7TZxYkM2gFrbQtudYhmfUPxlqP9aN7N9IXLY6Cw_g
```

## 📋 **PASSO A PASSO DE EXECUÇÃO**

### **ETAPA 1: Regenerar Banco Neon (5 minutos)**

1. **Acesse**: https://console.neon.tech/
2. **Login** com sua conta
3. **Selecione** o projeto atual: `ep-hidden-fog-ac2jlx9e`
4. **Navegue**: Settings → Reset Password
5. **Gere** nova senha (use a sugerida acima ou gere uma nova)
6. **Copie** a nova string de conexão completa

# Neon Auth environment variables for React (Vite)
VITE_STACK_PROJECT_ID='88d406f9-7f84-446a-b016-f84b0cad47df'
VITE_STACK_PUBLISHABLE_CLIENT_KEY='pck_088masq0x9nxn5s7zgjgzpn0wt2fhthwcfd70zz5hvayr'
STACK_SECRET_SERVER_KEY='ssk_6n54yrehay7h263jztnbm5my2ej3y8jmwywc4d7g38d6g'

# Database owner connection string
DATABASE_URL='postgresql://neondb_owner:npg_7EADUX3QeGaO@ep-hidden-fog-ac2jlx9e-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require'



### **ETAPA 2: Atualizar Vercel (3 minutos)**

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione** projeto: `nexogeo2`
3. **Navegue**: Settings → Environment Variables
4. **Atualize** as seguintes variáveis:

```bash
# Remover a atual DATABASE_URL
# Adicionar nova DATABASE_URL com nova senha

# Remover JWT_SECRET atual
# Adicionar novo JWT_SECRET:
JWT_SECRET=f3d66f17f4cc0e9629a75d86ebccdfd7d7881135116e403f15ea0b1ecf14f5597680f82ddfb38091fee9b43070fdfec28608a042ba1c9a6d1433d60b44f7ab28
```

### **ETAPA 3: Atualizar Ambiente Local (1 minuto)**

Crie novo `.env` para desenvolvimento local:

```bash
# Salvar no arquivo .env
NODE_ENV=development
DATABASE_URL=postgresql://neondb_owner:NOVA_SENHA_AQUI@ep-hidden-fog-ac2jlx9e-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=f3d66f17f4cc0e9629a75d86ebccdfd7d7881135116e403f15ea0b1ecf14f5597680f82ddfb38091fee9b43070fdfec28608a042ba1c9a6d1433d60b44f7ab28
```

### **ETAPA 4: Validar Funcionamento (2 minutos)**

```bash
# 1. Testar conexão local
npm run dev

# 2. Testar login
curl -X POST http://localhost:3000/api/?route=auth&endpoint=login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"admin"}'

# 3. Verificar resposta com novo JWT
```

### **ETAPA 5: Deploy Seguro (1 minuto)**

```bash
# 1. Commit mudanças locais
git add .
git commit -m "security: regenerate credentials and apply security fixes"

# 2. Push para produção
git push origin main

# 3. Verificar deploy na Vercel
```

## ⚠️ **CREDENCIAIS ANTIGAS COMPROMETIDAS**

### 🔴 **REVOGAR IMEDIATAMENTE**:
```
❌ DATABASE_URL antigas:
- User: neondb_owner
- Password: npg_7EADUX3QeGaO
- Host: ep-hidden-fog-ac2jlx9e-pooler.sa-east-1.aws.neon.tech

❌ JWT_SECRET antigo:
- nexogeo-jwt-secret-key-super-secure-2024
```

## 🚀 **EXECUÇÃO RÁPIDA (10 MINUTOS TOTAL)**

### **Opção A: Comando Rápido Neon**
```bash
# Via CLI do Neon (se instalado)
neonctl projects reset-password --project-id nexogeo-project
```

### **Opção B: Interface Web**
1. **Neon Console** → Reset Password (5 min)
2. **Vercel Dashboard** → Update ENV (3 min)
3. **Git Push** (2 min)

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [ ] ✅ Senha do banco regenerada
- [ ] ✅ JWT_SECRET atualizado na Vercel
- [ ] ✅ DATABASE_URL atualizada na Vercel
- [ ] ✅ Arquivo .env local atualizado
- [ ] ✅ Deploy funcionando
- [ ] ✅ Login testado e funcionando
- [ ] ✅ API respondendo corretamente

## 🎯 **RESULTADO ESPERADO**

**ANTES**: 🟡 Médio (credenciais comprometidas)
**DEPOIS**: 🟢 **ALTO** (totalmente seguro para produção)

---

## 🚨 **EXECUTE AGORA - MÁXIMA PRIORIDADE**

**Tempo estimado**: 10 minutos
**Impacto**: Segurança crítica do sistema
**Status após execução**: ✅ **PRODUÇÃO SEGURA**