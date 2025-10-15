# 🎯 Análise HAR - Erro 500 ao Salvar Patrocinador

**Data**: 08/10/2025 19:45
**Arquivo Analisado**: `nexogeo.vercel.app.har`
**Status**: ✅ Problema Identificado

---

## 🔍 Problema Identificado

### Requisição PUT Analisada:

```
URL: https://nexogeo.vercel.app/api/caixa-misteriosa/sponsors/1
Method: PUT
Status: 500 (Internal Server Error)
```

### Headers Enviados:

```
:authority: nexogeo.vercel.app
:method: PUT
:path: /api/caixa-misteriosa/sponsors/1
:scheme: https
accept: */*
accept-encoding: gzip, deflate, br, zstd
accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7
content-length: 262
content-type: application/json  ✅
origin: https://nexogeo.vercel.app
referer: https://nexogeo.vercel.app/dashboard/caixa-misteriosa
```

### ❌ PROBLEMA CRÍTICO:

**FALTA O HEADER `Authorization`!**

O header `Authorization: Bearer <token>` **NÃO está sendo enviado** na requisição.

---

## 🧩 Por Que Isso Causa Erro 500?

### Backend esperaautorização:

```javascript
// api/caixa-misteriosa.js - linha 1919
await getAuthenticatedUser(req, ['admin']);
```

### Fluxo do Erro:

1. Frontend envia requisição **SEM** token JWT
2. Backend tenta validar autenticação
3. `getAuthenticatedUser` não encontra token
4. Lança exceção
5. Retorna 500 Internal Server Error

---

## 🔧 Correções Aplicadas

### 1. **Backend** - Logs Detalhados (Commit: `1a1ac61`)

Adicionados logs em `api/caixa-misteriosa.js` função `updateSponsor`:

```javascript
console.log('🔍 [UPDATE SPONSOR] Iniciando atualização:', { id, name, ... });
console.log('✅ [UPDATE SPONSOR] Autenticação OK');
console.log('🔍 [UPDATE SPONSOR] Executando query SQL...');
// ...
console.error('❌ [UPDATE SPONSOR] Erro capturado:', { message, code, detail, ... });
```

**Objetivo**: Identificar a causa exata do erro 500 nos logs da Vercel.

---

### 2. **Frontend** - Logs de Autenticação (Commit: `ad7a254`)

Adicionados logs em `src/hooks/useCaixaMisteriosa.js` função `apiFetch`:

```javascript
console.log('🔐 [apiFetch DEBUG] URL:', url, 'isPublicRoute:', isPublicRoute);
console.log('🔐 [apiFetch DEBUG] Token obtido:', token ? `${token.substring(0, 20)}...` : 'NULL');
console.log('✅ [apiFetch DEBUG] Header Authorization adicionado');
console.log('🔐 [apiFetch DEBUG] Headers finais:', Object.keys(headers));
```

**Objetivo**: Rastrear se o token JWT está sendo obtido do localStorage e adicionado ao header.

---

## 🎯 Próximos Passos para Diagnóstico

### Passo 1: Aguardar Deploy (2-3 minutos)

- Acessar: https://vercel.com/schummerdev/nexogeo
- Ver aba "Deployments"
- Aguardar status: ✅ **Ready**

---

### Passo 2: Hard Refresh

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

---

### Passo 3: Abrir DevTools Console

1. Pressionar `F12`
2. Ir na aba "Console"
3. Limpar console (ícone 🚫)

---

### Passo 4: Tentar Salvar Patrocinador

1. Ir em https://nexogeo.vercel.app/dashboard/caixa-misteriosa
2. Aba "Configuração"
3. Editar patrocinador
4. Clicar em "Salvar"

---

### Passo 5: Analisar Logs no Console

#### Logs Esperados (SE TOKEN EXISTE):

```
🔐 [apiFetch DEBUG] URL: /sponsors/1 isPublicRoute: false
🔐 [apiFetch DEBUG] Token obtido: eyJhbGciOiJIUzI1NiIs...
✅ [apiFetch DEBUG] Header Authorization adicionado
🔐 [apiFetch DEBUG] Headers finais: ["Content-Type", "Authorization"]
```

**Resultado**: Deve funcionar! ✅

---

#### Logs Esperados (SE TOKEN NÃO EXISTE):

```
🔐 [apiFetch DEBUG] URL: /sponsors/1 isPublicRoute: false
🔐 [apiFetch DEBUG] Token obtido: NULL
❌ [apiFetch DEBUG] Token não encontrado no localStorage!
🔐 [apiFetch DEBUG] Headers finais: ["Content-Type"]
```

**Resultado**: Erro 500 persiste ❌

**Solução**: Fazer logout e login novamente para gerar novo token.

---

## 🔍 Possíveis Causas

### Causa 1: Token Expirado ou Inválido

**Sintoma**: Logs mostram "Token obtido: NULL"

**Solução**:
1. Fazer logout
2. Fazer login novamente
3. Tentar salvar patrocinador

---

### Causa 2: localStorage Limpo por Navegador

**Sintoma**: Logs mostram "Token obtido: NULL"

**Verificar**:
```javascript
// No console do navegador:
localStorage.getItem('authToken')
```

**Se retornar `null`**: Fazer login novamente.

---

### Causa 3: Bug no Código de Autenticação

**Sintoma**: Logs não aparecem no console

**Solução**: Verificar se hard refresh foi feito corretamente.

---

## 📊 Dados da Requisição (do HAR)

### Body Enviado:

```json
{
  "name": "Refrio Ar Condicionado",
  "logo_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREMzkbI66sElxOtweiHsmUKCK3o7TkNm_dmA&s",
  "facebook_url": null,
  "instagram_url": null,
  "whatsapp": "69984053577",
  "address": "Av. Recife, 442 - Novo Cacoal - Cacoal - RO "
}
```

✅ Body está correto - todos os campos esperados estão presentes.

---

### Resposta do Servidor:

```json
{
  "success": false,
  "message": "Erro ao atualizar patrocinador"
}
```

❌ Erro genérico - sem detalhes da causa.

**Logs adicionados no backend vão fornecer mais detalhes.**

---

## 📝 Commits Realizados

| Commit | Descrição | Arquivo Modificado |
|--------|-----------|-------------------|
| `1a1ac61` | Logs detalhados backend | `api/caixa-misteriosa.js` |
| `ad7a254` | Logs autenticação frontend | `src/hooks/useCaixaMisteriosa.js` |

---

## ✅ Resumo

| Item | Status | Detalhes |
|------|--------|----------|
| Problema Identificado | ✅ | Header `Authorization` faltando |
| Backend com logs | ✅ | Commit `1a1ac61` |
| Frontend com logs | ✅ | Commit `ad7a254` |
| Deploy | 🟡 Em andamento | GitHub → Vercel |
| Teste | ⏳ Aguardando | Após deploy completar |

---

## 🎯 Ação Imediata

**Após deploy completar**:

1. ✅ Hard refresh (`Ctrl + Shift + R`)
2. ✅ Abrir DevTools Console (`F12`)
3. ✅ Tentar salvar patrocinador
4. ✅ Verificar logs com `🔐 [apiFetch DEBUG]`
5. ⚠️ Se "Token obtido: NULL" → **Fazer logout e login**
6. ✅ Testar novamente

---

**Status Atual**: ⏳ Aguardando deploy completar para testes com logs detalhados.
