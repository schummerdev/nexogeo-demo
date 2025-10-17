# 📱 Migração de Normalização de Telefones

**Data**: 04/10/2025
**Objetivo**: Padronizar formato de telefones na tabela `public_participants` (apenas dígitos)

## ✅ Correções Aplicadas no Código

As seguintes correções foram aplicadas para **prevenir** problemas futuros:

### 1. `api/caixa-misteriosa.js` - função `registerPublicParticipant`
- ✅ Adicionado limpeza de telefone: `cleanPhone = phone.replace(/\D/g, '')`
- ✅ Validação de 10-11 dígitos
- ✅ Todas queries UPDATE/INSERT usam `cleanPhone`

### 2. `api/caixa-misteriosa.js` - função `submitGuess`
- ✅ Limpeza de telefone no início da função
- ✅ Remove caracteres não numéricos antes de salvar

## 🔧 Migração do Banco de Dados

### Opção 1: Via Neon SQL Editor (Recomendado)

1. Acesse o console Neon: https://console.neon.tech/
2. Selecione o projeto `nexogeo`
3. Abra o SQL Editor
4. Execute as queries abaixo **uma por vez**:

#### Passo 1: Verificar registros que serão alterados
```sql
SELECT
    id,
    name,
    phone AS phone_antes,
    REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS phone_depois,
    LENGTH(phone) AS tamanho_antes,
    LENGTH(REGEXP_REPLACE(phone, '[^0-9]', '', 'g')) AS tamanho_depois
FROM public_participants
WHERE phone ~ '[^0-9]'
ORDER BY id;
```

#### Passo 2: Atualizar os registros
```sql
UPDATE public_participants
SET phone = REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
WHERE phone ~ '[^0-9]';
```
*Essa query retornará o número de registros atualizados.*

#### Passo 3: Verificar se há telefones inválidos
```sql
SELECT
    id,
    name,
    phone,
    LENGTH(phone) AS tamanho
FROM public_participants
WHERE LENGTH(phone) NOT IN (10, 11)
ORDER BY id;
```

#### Passo 4: Ver resumo final
```sql
SELECT
    COUNT(*) AS total_registros,
    COUNT(CASE WHEN LENGTH(phone) = 10 THEN 1 END) AS telefones_10_digitos,
    COUNT(CASE WHEN LENGTH(phone) = 11 THEN 1 END) AS telefones_11_digitos,
    COUNT(CASE WHEN LENGTH(phone) NOT IN (10, 11) THEN 1 END) AS telefones_invalidos
FROM public_participants;
```

### Opção 2: Via Script Node.js (Requer credenciais válidas)

Se preferir executar via script:

```bash
# Certifique-se de que .env contém DATABASE_URL válido
node api/migrations/run-fix-phone-formatting.js
```

## 📊 Antes vs Depois

### Antes (Inconsistente):
```
id | phone
---|-------------------
1  | 11987654321        ✅ OK (11 dígitos)
2  | 11888888888        ✅ OK (11 dígitos)
3  | 69984053577        ✅ OK (11 dígitos)
4  | 69984053578        ✅ OK (11 dígitos)
5  | 11999999999        ✅ OK (11 dígitos)
6  | 69984053575        ✅ OK (11 dígitos)
7  | (11) 77777-7777    ❌ ERRO (formatado)
8  | 11555555555        ✅ OK (11 dígitos)
9  | (11) 98888-7777    ❌ ERRO (formatado)
10 | (89) 99998-8877    ❌ ERRO (formatado)
```

### Depois (Padronizado):
```
id | phone
---|-------------------
1  | 11987654321        ✅ 11 dígitos
2  | 11888888888        ✅ 11 dígitos
3  | 69984053577        ✅ 11 dígitos
4  | 69984053578        ✅ 11 dígitos
5  | 11999999999        ✅ 11 dígitos
6  | 69984053575        ✅ 11 dígitos
7  | 1177777777         ✅ 10 dígitos (fixo)
8  | 11555555555        ✅ 11 dígitos
9  | 1198888777         ✅ 10 dígitos
10 | 8999998887         ✅ 10 dígitos
```

## ⚠️ Observações

1. **Telefones fixos**: Números de 10 dígitos (DDD + 8 dígitos) permanecerão com 10 dígitos
2. **Telefones celulares**: Números de 11 dígitos (DDD + 9 + 8 dígitos) permanecerão com 11 dígitos
3. **Validação**: O código agora rejeita telefones fora do padrão 10-11 dígitos
4. **Formatação na UI**: Se necessário formatar para exibição, faça apenas no frontend

## ✅ Checklist de Execução

- [ ] Fazer backup do banco de dados (opcional mas recomendado)
- [ ] Executar Passo 1 (verificar registros)
- [ ] Anotar quantos registros serão alterados
- [ ] Executar Passo 2 (UPDATE)
- [ ] Verificar que o número de registros atualizados está correto
- [ ] Executar Passo 3 (verificar inválidos)
- [ ] Executar Passo 4 (resumo final)
- [ ] Testar cadastro de novo participante
- [ ] Testar envio de palpite

## 🧪 Teste Pós-Migração

Após executar a migração, teste:

1. **Cadastro com telefone formatado**:
```bash
curl -X POST https://nexogeo2.vercel.app/api/?route=caixa-misteriosa&endpoint=register-public-participant \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Formatação",
    "phone": "(11) 98765-4321",
    "neighborhood": "Centro",
    "city": "São Paulo"
  }'
```

Verifique no banco que foi salvo como: `11987654321`

2. **Cadastro com telefone sem formatação**:
```bash
curl -X POST https://nexogeo2.vercel.app/api/?route=caixa-misteriosa&endpoint=register-public-participant \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Sem Formatação",
    "phone": "11987654322",
    "neighborhood": "Centro",
    "city": "São Paulo"
  }'
```

Verifique no banco que foi salvo como: `11987654322`

---

**Status**: Código atualizado ✅ | Migração do banco pendente ⏳
