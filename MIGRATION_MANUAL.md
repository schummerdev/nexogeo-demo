# Migração Manual: Adicionar Latitude/Longitude à Tabela public_participants

## 📋 Contexto

A tabela `public_participants` foi criada originalmente sem as colunas `latitude` e `longitude`, causando erro 500 no endpoint unificado de participantes quando o toggle "Incluir Caixa Misteriosa" era ativado nos mapas.

## 🔧 Correções Aplicadas

### 1. **Código (já commitado em f8e513a)**
- ✅ `lib/db.js` - Tabela agora criada com latitude/longitude desde o início
- ✅ `api/participantes.js` - Tratamento de erro robusto com fallback

### 2. **Banco de Dados (executar manualmente)**

Execute o SQL abaixo diretamente no banco de dados Neon (via console web ou psql):

```sql
-- Adicionar colunas latitude/longitude à tabela public_participants
-- Executar em: https://console.neon.tech/ → Seu Projeto → SQL Editor

-- Adicionar coluna latitude se não existir
ALTER TABLE public_participants
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);

-- Adicionar coluna longitude se não existir
ALTER TABLE public_participants
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Adicionar comentários nas colunas para documentação
COMMENT ON COLUMN public_participants.latitude IS 'Latitude da geolocalização do participante no momento do cadastro';
COMMENT ON COLUMN public_participants.longitude IS 'Longitude da geolocalização do participante no momento do cadastro';

-- Verificar se as colunas foram criadas corretamente
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'public_participants'
AND column_name IN ('latitude', 'longitude')
ORDER BY ordinal_position;
```

## 🎯 Resultado Esperado

Após executar a migração:

```
 column_name |     data_type      | is_nullable | column_default
-------------+--------------------+-------------+----------------
 latitude    | numeric(10,8)      | YES         | NULL
 longitude   | numeric(11,8)      | YES         | NULL
```

## ✅ Validação

Após aplicar a migração, teste no navegador:

1. Acesse `/dashboard/mapas`
2. Ative o toggle "📦 Incluir Caixa Misteriosa"
3. Deve exibir **72 participantes** (67 regulares + 5 públicos)
4. Verifique no console do navegador:
   ```
   ✅ [UNIFIED] 67 participantes regulares encontrados
   ✅ [UNIFIED] 5 participantes públicos encontrados
   🎯 [UNIFIED] Total de 72 participantes
   ```

## 📝 Notas

- **Sem impacto em dados**: `ADD COLUMN IF NOT EXISTS` é seguro
- **Sem downtime**: Colunas nullable não bloqueiam tabela
- **Retrocompatível**: Código com fallback funciona antes e depois da migração

## 🔗 Links Úteis

- **Console Neon**: https://console.neon.tech/
- **Commit da correção**: f8e513a
- **Issue relacionada**: Erro 500 no endpoint unificado de participantes

---

**Data**: 2025-10-16
**Autor**: Claude Code
**Commits relacionados**: f8e513a
