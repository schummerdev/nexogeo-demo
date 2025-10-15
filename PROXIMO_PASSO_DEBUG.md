# 🔍 Próximo Passo - Debug do Erro 500 ao Salvar Patrocinador

**Data**: 08/10/2025 19:26
**Status**: 🟡 Aguardando verificação do deploy e testes

---

## ✅ O Que Já Foi Feito

1. ✅ **Migração executada** - Campos existem no banco de dados
2. ✅ **Logs detalhados adicionados** no backend (`updateSponsor`)
3. ✅ **Commit e push** realizados (commit: `1a1ac61`)
4. ✅ **Deploy automático** acionado (GitHub → Vercel)

---

## 🎯 Próximos Passos para o Usuário

### Passo 1: Verificar se Deploy Foi Concluído ⏱️

1. Acessar: **https://vercel.com/schummerdev/nexogeo**
2. Clicar na aba "**Deployments**"
3. Ver o deploy mais recente (deve ter a mensagem do commit: "debug: Adiciona logs detalhados...")
4. Aguardar status mudar para: ✅ **Ready**

**Tempo estimado**: 2-3 minutos

---

### Passo 2: Fazer Hard Refresh no Navegador 🔄

**Importante**: O navegador pode estar com cache da versão antiga!

#### Windows/Linux:
```
Ctrl + Shift + R
```

#### Mac:
```
Cmd + Shift + R
```

Ou alternativamente:
1. Abrir DevTools (F12)
2. Clicar com botão direito no ícone de "Reload"
3. Selecionar "**Empty Cache and Hard Reload**"

---

### Passo 3: Testar Salvar Patrocinador Novamente 🧪

1. Acessar: **https://nexogeo.vercel.app/dashboard/caixa-misteriosa**
2. Ir na aba "**Configuração**"
3. Clicar em "**Editar**" no patrocinador "Refrio"
4. Preencher os campos:
   - Nome: **Refrio Ar Condicionado**
   - Logo URL: **https://encrypted-tbn0.gstatic.com/images/...** (URL completa)
   - WhatsApp: **69984053577**
   - Endereço: **Av. Recife, 442 - Novo Cacoal - Cacoal - RO**
5. Clicar em "**Salvar Patrocinador**"

---

### Passo 4A: Se Funcionar ✅

**Resultado esperado**:
- ✅ Mensagem de sucesso: "Patrocinador atualizado com sucesso"
- ✅ Modal fecha automaticamente
- ✅ Lista de patrocinadores atualiza

**Ação**: Problema resolvido! 🎉

---

### Passo 4B: Se Erro Persistir ❌

**Se ainda receber erro 500**, siga para o **Passo 5**.

---

## Passo 5: Verificar Logs na Vercel (Se Erro Persistir) 📋

### 5.1. Acessar Logs da Função

1. Ir em: **https://vercel.com/schummerdev/nexogeo**
2. Clicar em "**Deployments**" → Último deploy ✅ Ready
3. Clicar na aba "**Functions**"
4. Procurar por: `api/caixa-misteriosa.js`
5. Clicar para expandir e ver os logs

---

### 5.2. Procurar Logs com Emojis

Os logs que adicionei têm emojis para facilitar a busca:

#### **Logs de Sucesso** (se funcionou):
```
🔍 [UPDATE SPONSOR] Iniciando atualização: {id: 1, name: "Refrio...", ...}
✅ [UPDATE SPONSOR] Autenticação OK
🔍 [UPDATE SPONSOR] Executando query SQL...
✅ [UPDATE SPONSOR] Query executada. Rows: 1
✅ [UPDATE SPONSOR] Patrocinador atualizado: {...}
```

#### **Logs de Erro** (se deu erro):
```
🔍 [UPDATE SPONSOR] Iniciando atualização: {id: 1, name: "Refrio...", ...}
❌ [UPDATE SPONSOR] Erro capturado: {
    message: "MENSAGEM DO ERRO EXATA",
    code: "CÓDIGO DO ERRO",
    detail: "DETALHES DO POSTGRESQL",
    stack: "..."
}
```

---

### 5.3. Enviar Logs para Análise

Se encontrar logs de erro (com ❌), copiar e enviar para análise:

1. Copiar **TODO o bloco** que começa com `🔍 [UPDATE SPONSOR]`
2. Copiar até o final do `❌ [UPDATE SPONSOR] Erro capturado`
3. Incluir também os logs de entrada:
   ```
   --- NEW REQUEST --- Method: PUT, URL: /api/caixa-misteriosa/sponsors/1
   --- REQUEST BODY --- {...}
   ```

---

## 🔍 Possíveis Causas do Erro (Para Análise dos Logs)

### Causa 1: Erro de Autenticação
**Log esperado**:
```json
{
  "message": "Token inválido" | "Token expirado" | "Unauthorized"
}
```

**Solução**: Fazer logout e login novamente.

---

### Causa 2: Erro de Permissão (Não é Admin)
**Log esperado**:
```json
{
  "message": "Acesso negado" | "Você não tem permissão"
}
```

**Solução**: Verificar papel do usuário no banco (deve ser 'admin').

---

### Causa 3: Erro de Constraint no Banco
**Log esperado**:
```json
{
  "code": "23505",
  "detail": "Key (name)=(Refrio) already exists"
}
```

**Solução**: Verificar se não há patrocinador duplicado com mesmo nome.

---

### Causa 4: Erro de Conexão com Banco
**Log esperado**:
```json
{
  "code": "ECONNREFUSED" | "ETIMEDOUT",
  "message": "Connection refused" | "timeout"
}
```

**Solução**: Verificar variável `DATABASE_URL` na Vercel e status do banco Neon.

---

### Causa 5: Req.Body Vazio (Parsing Error)
**Log esperado**:
```json
{
  "message": "Nome do patrocinador é obrigatório"
}
```

**Logs esperados ANTES do erro**:
```
--- REQUEST BODY --- {}
```
ou
```
(sem log de REQUEST BODY)
```

**Solução**: Problema com parsing do body. Verificar Content-Type do request.

---

## 🛠️ Teste Alternativo: Usar CURL (Opcional)

Se quiser testar diretamente via terminal (após login no sistema):

```bash
# 1. Primeiro fazer login e copiar o token JWT do localStorage
# 2. Substituir SEU_TOKEN_JWT_AQUI pelo token copiado

curl -X PUT https://nexogeo.vercel.app/api/caixa-misteriosa/sponsors/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "name": "Refrio Ar Condicionado",
    "logo_url": "https://encrypted-tbn0.gstatic.com/images/...",
    "facebook_url": "",
    "instagram_url": "",
    "whatsapp": "69984053577",
    "address": "Av. Recife, 442 - Novo Cacoal - Cacoal - RO"
  }'
```

**Resultado esperado**:
```json
{
  "success": true,
  "message": "Patrocinador atualizado com sucesso",
  "sponsor": {
    "id": 1,
    "name": "Refrio Ar Condicionado",
    ...
  }
}
```

---

## 📊 Resumo Técnico

| Item | Status | Detalhes |
|------|--------|----------|
| Migração SQL | ✅ Executada | Campos logo_url, facebook_url, etc existem |
| Backend atualizado | ✅ Sim | Função `updateSponsor` usa novos campos |
| Logs detalhados | ✅ Adicionados | Commit 1a1ac61 |
| Deploy | 🟡 Em andamento | GitHub → Vercel (automático) |
| Hard refresh | ⏳ Pendente | Usuário precisa fazer |
| Teste | ⏳ Pendente | Aguardando deploy + hard refresh |

---

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/schummerdev/nexogeo
- **Neon Console**: https://console.neon.tech/
- **App em Produção**: https://nexogeo.vercel.app/dashboard/caixa-misteriosa

---

**Status Atual**: ⏳ Aguardando deploy completar e usuário fazer hard refresh para testar.

**Próxima Ação**: Se erro persistir após hard refresh, enviar logs da Vercel para análise.
