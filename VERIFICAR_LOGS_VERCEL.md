# 🔍 Como Verificar Logs na Vercel - Passo a Passo

**Data**: 08/10/2025 19:52
**Status**: ✅ Token sendo enviado corretamente - Erro está no BACKEND

---

## ✅ Confirmado no Frontend

Os logs mostram que o token JWT **ESTÁ sendo enviado**:

```
🔐 [apiFetch DEBUG] URL: /sponsors/1 isPublicRoute: false
🔐 [apiFetch DEBUG] Token obtido: eyJhbGciOiJIUzI1NiIs...
✅ [apiFetch DEBUG] Header Authorization adicionado
🔐 [apiFetch DEBUG] Headers finais: (2) ['Content-Type', 'Authorization']
```

❌ Mas ainda retorna: `PUT /sponsors/1 500 (Internal Server Error)`

**Conclusão**: O problema está no **backend** (servidor).

---

## 📋 Passo a Passo para Ver Logs do Backend

### Passo 1: Acessar Dashboard da Vercel

URL: **https://vercel.com/schummerdev/nexogeo**

---

### Passo 2: Ir na Aba "Deployments"

No menu superior, clicar em "**Deployments**"

---

### Passo 3: Selecionar o Último Deploy

Procurar pelo deploy mais recente:
- Commit message: "**debug: Adiciona logs detalhados em updateSponsor...**"
- Status: ✅ **Ready**
- Data/Hora: Mais recente

Clicar no deploy.

---

### Passo 4: Abrir a Aba "Functions"

No deploy selecionado, clicar na aba "**Functions**" (menu horizontal).

---

### Passo 5: Encontrar a Função api/caixa-misteriosa.js

Na lista de funções, procurar por:
- `api/caixa-misteriosa.js`

Clicar para expandir.

---

### Passo 6: Ver os Logs

Role para baixo até a seção "**Logs**" ou "**Runtime Logs**".

---

### Passo 7: Procurar Pelos Logs com Emojis

#### 🔍 Logs de SUCESSO (se tivesse funcionado):

```
🔍 [UPDATE SPONSOR] Iniciando atualização: {id: 1, name: "Refrio...", ...}
✅ [UPDATE SPONSOR] Autenticação OK
🔍 [UPDATE SPONSOR] Executando query SQL...
✅ [UPDATE SPONSOR] Query executada. Rows: 1
✅ [UPDATE SPONSOR] Patrocinador atualizado: {...}
```

---

#### ❌ Logs de ERRO (o que você deve ver):

```
🔍 [UPDATE SPONSOR] Iniciando atualização: {id: 1, name: "Refrio...", ...}
❌ [UPDATE SPONSOR] Erro capturado: {
    message: "MENSAGEM DO ERRO AQUI",
    code: "CÓDIGO DO ERRO",
    detail: "DETALHES DO POSTGRESQL",
    stack: "..."
}
```

---

### Passo 8: Copiar os Logs Completos

Copiar **TODO** o bloco de logs que contém:
- Começa com: `🔍 [UPDATE SPONSOR] Iniciando atualização`
- Termina com: `❌ [UPDATE SPONSOR] Erro capturado: {...}`

Também copiar os logs de entrada:
```
--- NEW REQUEST --- Method: PUT, URL: /api/caixa-misteriosa/sponsors/1
--- REQUEST BODY --- {...}
```

---

## 🎯 O Que Fazer com os Logs

### Se Não Aparecer Nenhum Log:

**Possível causa**: Logs ainda não propagaram ou função não foi invocada.

**Solução**:
1. Aguardar 1-2 minutos
2. Tentar salvar patrocinador novamente
3. Atualizar página dos logs na Vercel
4. Verificar novamente

---

### Se Aparecer "Token inválido" ou "Unauthorized":

```json
{
  "message": "Token inválido" | "Token expirado" | "Unauthorized"
}
```

**Solução**:
1. Fazer **logout** no sistema
2. Fazer **login** novamente
3. Tentar salvar patrocinador

---

### Se Aparecer Erro de Banco de Dados:

```json
{
  "code": "23505",
  "message": "duplicate key value...",
  "detail": "Key (name)=(Refrio) already exists"
}
```

**Possível causa**: Já existe patrocinador com esse nome.

**Solução**: Tentar com nome diferente.

---

### Se Aparecer "column does not exist":

```json
{
  "code": "42703",
  "message": "column \"logo_url\" does not exist"
}
```

**Possível causa**: Migração não foi executada.

**Solução**: Executar SQL da migração novamente:
```sql
ALTER TABLE sponsors
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT;
```

---

### Se Aparecer "req.body is undefined":

```json
{
  "message": "Nome do patrocinador é obrigatório"
}
```

E os logs mostram:
```
--- REQUEST BODY --- {}
```

**Possível causa**: Body não está sendo parseado.

**Solução**: Problema no middleware do Express.

---

## 📸 Screenshots Úteis

Se possível, tirar screenshots dos logs e enviar para análise.

---

## 🆘 Logs Alternativos

Se não conseguir acessar os logs na Vercel, pode tentar:

### Opção 1: Network Tab do DevTools

1. Abrir DevTools (F12)
2. Ir na aba "**Network**"
3. Filtrar por "**sponsors**"
4. Clicar na requisição PUT
5. Ir na aba "**Response**"
6. Ver o JSON de erro completo

---

### Opção 2: Testar Localmente

```bash
# Terminal 1: Iniciar API local
npm run dev:api

# Terminal 2: Iniciar frontend
npm start
```

Tentar salvar patrocinador e ver logs no terminal do backend.

---

## 🎯 Próxima Ação

**Verificar logs na Vercel** e copiar o erro completo que aparece em:

```
❌ [UPDATE SPONSOR] Erro capturado: {...}
```

Com essa informação, vamos identificar e corrigir o problema definitivamente!

---

**Status**: ⏳ Aguardando logs do backend da Vercel
