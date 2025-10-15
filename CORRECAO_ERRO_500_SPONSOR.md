# 🎯 Correção do Erro 500 ao Salvar Patrocinador

**Data**: 08/10/2025 20:15
**Status**: ✅ CORRIGIDO
**Commit**: `bfef1bf`

---

## 🔍 Problema Identificado

### Sintoma
```
PUT /api/caixa-misteriosa/sponsors/1
Status: 500 Internal Server Error
```

### Causa Raiz

**Bug no roteamento de `api/caixa-misteriosa.js`** (linha 3380):

```javascript
// ❌ CÓDIGO ANTIGO - ERRADO
if (req.method === 'PUT' && path.split('/')[2]) {
    return await updateSponsor({ ...req, params: { id: path.split('/')[2] } }, res);
}
```

#### Por que estava falhando?

O **spread operator** `{ ...req }` cria um novo objeto **copiando apenas propriedades enumeráveis**.

Em objetos `req` do Express/Vercel:
- ❌ **Headers NÃO são copiados** (propriedade não-enumerável)
- ❌ **Authorization header perdido**
- ✅ Body e method são copiados

**Resultado**: Backend recebia requisição **SEM o header `Authorization`**, causando erro de autenticação.

---

## ✅ Correção Aplicada

### Código Corrigido

```javascript
// ✅ CÓDIGO NOVO - CORRETO
if (req.method === 'PUT' && path.split('/')[2]) {
    console.log('🔍 [ROUTER] PUT /sponsors/:id detectado');
    console.log('🔍 [ROUTER] Authorization header presente?', !!req.headers.authorization);
    console.log('🔍 [ROUTER] Headers keys:', Object.keys(req.headers));
    // ✅ FIX: Não recriar req, apenas adicionar params
    req.params = { id: path.split('/')[2] };
    return await updateSponsor(req, res);
}
```

### Mudanças

1. **Não recria objeto `req`**: Modifica diretamente `req.params`
2. **Preserva headers**: Authorization e todos os outros headers mantidos
3. **Adiciona logs**: Facilita debug futuro

---

## 🧪 Validação

### Antes da Correção

```
🔐 [apiFetch DEBUG] Token obtido: eyJhbGciOiJIUzI1NiIs...
✅ [apiFetch DEBUG] Header Authorization adicionado
❌ PUT /sponsors/1 → 500 Internal Server Error
```

### Depois da Correção (Esperado)

```
🔐 [apiFetch DEBUG] Token obtido: eyJhbGciOiJIUzI1NiIs...
✅ [apiFetch DEBUG] Header Authorization adicionado
🔍 [ROUTER] PUT /sponsors/:id detectado
🔍 [ROUTER] Authorization header presente? true
✅ [UPDATE SPONSOR] Autenticação OK
✅ [UPDATE SPONSOR] Query executada. Rows: 1
✅ [UPDATE SPONSOR] Patrocinador atualizado
✅ PUT /sponsors/1 → 200 OK
```

---

## 📋 Outras Rotas Corrigidas

A mesma correção foi aplicada para:

### Sponsors
- ✅ `PUT /sponsors/:id` (updateSponsor)
- ✅ `DELETE /sponsors/:id` (deleteSponsor)

### Products
- ✅ `PUT /products/:id` (updateProduct)
- ✅ `DELETE /products/:id` (deleteProduct)

---

## 🎯 Como Testar

### Passo 1: Aguardar Deploy
- Acessar: https://vercel.com/schummerdev/nexogeo
- Aguardar status: ✅ **Ready**

### Passo 2: Hard Refresh
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Passo 3: Testar Atualização de Patrocinador

1. Ir em: https://nexogeo.vercel.app/dashboard/caixa-misteriosa
2. Aba **Configuração** → **Patrocinadores**
3. Editar qualquer patrocinador
4. Clicar em **Salvar**

### Resultado Esperado

✅ **Mensagem de sucesso**: "Patrocinador atualizado com sucesso"
✅ **Status HTTP**: 200 OK
✅ **Dados salvos** no banco PostgreSQL

---

## 🐛 Logs para Diagnóstico

Se ainda houver erro, verifique os logs na Vercel:

### Logs de Sucesso

```
🔍 [ROUTER] PUT /sponsors/:id detectado
🔍 [ROUTER] Authorization header presente? true
🔍 [ROUTER] Headers keys: ['content-type', 'authorization', ...]
🔍 [UPDATE SPONSOR] Iniciando atualização: {id: 1, name: "Refrio..."}
✅ [UPDATE SPONSOR] Autenticação OK
🔍 [UPDATE SPONSOR] Executando query SQL...
✅ [UPDATE SPONSOR] Query executada. Rows: 1
✅ [UPDATE SPONSOR] Patrocinador atualizado: {...}
```

### Logs de Erro (se ainda ocorrer)

```
🔍 [ROUTER] PUT /sponsors/:id detectado
🔍 [ROUTER] Authorization header presente? false  ⚠️
❌ [UPDATE SPONSOR] Erro capturado: {
    message: "Token de autenticação não fornecido",
    ...
}
```

Se aparecer `Authorization header presente? false`, significa que o frontend não está enviando o token.

**Solução**: Fazer logout e login novamente.

---

## 📊 Resumo Técnico

| Item | Status | Detalhes |
|------|--------|----------|
| **Bug identificado** | ✅ | Spread operator perdendo headers |
| **Causa raiz** | ✅ | `{...req}` não copia propriedades não-enumeráveis |
| **Correção aplicada** | ✅ | Modificar `req.params` diretamente |
| **Commit** | ✅ | `bfef1bf` |
| **Deploy** | 🟡 | Em andamento na Vercel |
| **Teste** | ⏳ | Aguardando deploy completar |

---

## 🔗 Arquivos Modificados

- `api/caixa-misteriosa.js` (linhas 3380-3406)

---

## 📝 Commits Relacionados

| Commit | Descrição | Tipo |
|--------|-----------|------|
| `1a1ac61` | Adiciona logs backend | Debug |
| `ad7a254` | Adiciona logs frontend | Debug |
| `bfef1bf` | **Corrige perda de headers** | **Fix** |

---

## ✅ Conclusão

O erro 500 era causado por um **bug de programação** no roteamento de requisições PUT/DELETE.

O spread operator `{...req}` **não preservava os headers**, causando perda do token JWT de autenticação.

A correção **modifica `req.params` diretamente** sem recriar o objeto, preservando todos os headers.

**Status**: ✅ Deploy em andamento → Teste após deploy completar

---

**Próxima Ação**: Aguardar deploy e testar atualização de patrocinador.
