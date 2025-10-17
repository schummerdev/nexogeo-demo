# 🔍 Diagnóstico - Caixa Misteriosa (Patrocinadores/Produtos Sumidos)

**Data**: 05/10/2025
**Status**: Aguardando diagnóstico do banco de dados

---

## 📋 Problema Reportado

1. **Jogo ativo não aparece** - Continua mostrando tela de configuração
2. **Patrocinadores sumiram** - Dropdown mostra "Selecione um patrocinador" (vazio)
3. **Produtos sumiram** - Dropdown mostra "Selecione patrocinador primeiro" (vazio)

---

## 🛠️ Ferramentas de Diagnóstico Adicionadas

### 1. Endpoint de Status do Banco de Dados

**URL**: https://nexogeo2.vercel.app/api/caixa-misteriosa/debug/database-status

**Como usar**:
1. Abrir o link acima no navegador
2. Verificar o JSON retornado

**Exemplo de resposta**:
```json
{
  "timestamp": "2025-10-05T12:00:00.000Z",
  "games": {
    "byStatus": {
      "accepting": 1,
      "closed": 0,
      "finished": 2
    },
    "total": 3
  },
  "sponsors": 5,
  "products": 10,
  "submissions": 50,
  "participants": 100
}
```

**Interpretação**:

| Campo | Significa | O que verificar |
|-------|-----------|-----------------|
| `sponsors` | Quantidade de patrocinadores | Se for **0**, patrocinadores foram deletados |
| `products` | Quantidade de produtos | Se for **0**, produtos foram deletados |
| `games.total` | Quantidade total de jogos | Se for **0**, não há jogos no banco |
| `games.byStatus.accepting` | Jogos aceitando palpites | Se for **> 0**, há jogo ativo |
| `games.byStatus.closed` | Jogos com palpites fechados | - |
| `games.byStatus.finished` | Jogos finalizados | - |
| `submissions` | Palpites enviados | - |
| `participants` | Participantes públicos | - |

---

### 2. Logs Detalhados da API

**Função**: `getSponsors`

**Logs adicionados**:
```
🏢 [getSponsors] Iniciando busca de patrocinadores...
🏢 [getSponsors] Query executada, resultados: N
⚠️ [getSponsors] NENHUM PATROCINADOR ENCONTRADO NO BANCO!
🏢 [getSponsors] ✅ Retornando N patrocinadores: Nome1, Nome2, Nome3
```

**Onde ver**: Logs do Vercel (https://vercel.com/schummerdev/nexogeo → Logs)

---

## 🔍 Cenários Possíveis e Soluções

### Cenário 1: Dados Deletados do Banco ❌

**Diagnóstico**:
- `sponsors = 0`
- `products = 0`
- `games.total = 0`

**Causa**: Banco de dados foi resetado ou dados foram deletados

**Solução**:
1. **Recriar patrocinadores**:
   - Acessar: Dashboard → Caixa Misteriosa
   - Seção "1. Gerenciar Patrocinadores"
   - Clicar no botão "+" para adicionar

2. **Recriar produtos** para cada patrocinador:
   - Selecionar patrocinador na lista
   - Adicionar produtos (nome + dicas)

3. **Criar novo jogo**:
   - Selecionar patrocinador e produto
   - Clicar "Iniciar Jogo"

---

### Cenário 2: Dados Existem Mas Não Aparecem ⚠️

**Diagnóstico**:
- `sponsors > 0` mas dropdown vazio
- `products > 0` mas dropdown vazio

**Causa**: Problema no frontend (fetch falhando ou cache)

**Solução**:
1. Abrir console do navegador (F12)
2. Ir em Network → Fetch/XHR
3. Recarregar página
4. Verificar se chamada para `/api/caixa-misteriosa/sponsors` retorna dados
5. Se retornar vazio: problema na API
6. Se não chamar: problema no frontend

**Ações**:
- Limpar cache: Ctrl + Shift + Delete
- Limpar localStorage: F12 → Application → Local Storage → Clear All
- Recarregar: Ctrl + F5 (hard refresh)

---

### Cenário 3: Jogo Ativo Existe Mas Não Carrega ⚠️

**Diagnóstico**:
- `games.byStatus.accepting > 0` ou `games.byStatus.closed > 0`
- Mas mostra tela de configuração

**Causa**: API `/game/live` ainda está falhando

**Logs a verificar**:
```
🎮 [getLiveGame] Iniciando busca de jogo ativo...
🎮 [getLiveGame] Query executada, resultados: 1
🎮 [getLiveGame] Jogo encontrado: {...}
❌ [getLiveGame] ERRO FATAL: ...
```

**Solução**:
- Verificar logs do Vercel para ver stack trace completo
- Identificar linha que falha (ex: clues inválidas, produto null, etc.)

---

### Cenário 4: Erro de Conexão com Banco Neon 🔌

**Diagnóstico**:
- Endpoint `/debug/database-status` retorna erro 500
- Logs mostram: `Error: connect ETIMEDOUT`

**Causa**: Banco Neon fora do ar ou credenciais inválidas

**Solução**:
1. Verificar Neon Console: https://console.neon.tech/
2. Verificar se projeto está ativo
3. Verificar variável `DATABASE_URL` no Vercel
4. Regenerar credenciais se necessário

---

## 🧪 Checklist de Diagnóstico

Execute na ordem:

- [ ] **1. Verificar status do banco**
  ```
  Acessar: https://nexogeo2.vercel.app/api/caixa-misteriosa/debug/database-status
  Anotar: sponsors=? products=? games.total=?
  ```

- [ ] **2. Se sponsors = 0**
  - Dados foram deletados
  - Recriar patrocinadores manualmente (seção "1. Gerenciar Patrocinadores")

- [ ] **3. Se sponsors > 0 mas dropdown vazio**
  - Abrir F12 → Console
  - Procurar erros em vermelho
  - Procurar log: `🏢 [getSponsors]`
  - Verificar se chamada `/sponsors` retorna dados

- [ ] **4. Se games.byStatus.accepting > 0 mas não aparece**
  - Abrir F12 → Console
  - Procurar log: `🎮 [getLiveGame]`
  - Verificar onde está falhando

- [ ] **5. Verificar logs do Vercel**
  - https://vercel.com/schummerdev/nexogeo → Logs
  - Filtrar por "getLiveGame" ou "getSponsors"
  - Procurar por ❌ ERRO FATAL

---

## 📊 Exemplo de Diagnóstico Completo

### Passo 1: Acessar endpoint de status
```
https://nexogeo2.vercel.app/api/caixa-misteriosa/debug/database-status
```

### Passo 2: Analisar resposta
```json
{
  "sponsors": 0,          ← ❌ PROBLEMA: Nenhum patrocinador
  "products": 0,          ← ❌ PROBLEMA: Nenhum produto
  "games": {
    "byStatus": {},       ← ❌ PROBLEMA: Nenhum jogo
    "total": 0
  }
}
```

### Passo 3: Conclusão
**DADOS FORAM DELETADOS DO BANCO**

### Passo 4: Solução
1. Recriar patrocinadores (mínimo 1)
2. Adicionar produtos a cada patrocinador (mínimo 1 por patrocinador)
3. Criar novo jogo

---

## 🔥 Ação Imediata

**Para verificar o problema AGORA**:

1. Abrir: https://nexogeo2.vercel.app/api/caixa-misteriosa/debug/database-status
2. Copiar o JSON retornado
3. Me enviar o resultado

Com isso, posso identificar se:
- ✅ Dados existem no banco (precisa fix no código)
- ❌ Dados foram deletados (precisa recriar manualmente)

---

## 📝 Logs Úteis para Análise

Se após verificar `/debug/database-status` o problema persistir, me envie:

1. **Console do navegador** (F12 → Console):
   - Todos os logs que começam com 🎮, 🏢, 🏪, ❌

2. **Network** (F12 → Network):
   - Status code das chamadas:
     - `/api/caixa-misteriosa/sponsors`
     - `/api/caixa-misteriosa/game/live`

3. **Resultado do endpoint de debug**:
   - Copiar JSON completo de `/debug/database-status`

---

**Status**: Deploy concluído ✅ | Aguardando verificação do endpoint de debug ⏳
