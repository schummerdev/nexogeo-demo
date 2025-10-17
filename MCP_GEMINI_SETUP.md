# 🔧 MCP Gemini CLI - Configuração e Troubleshooting

## 📋 **Status Atual**
- **Gemini CLI Instalado:** ✅ `@google/gemini-cli@0.1.7`
- **MCP Configurado:** ⚠️ Erro de spawn ENOENT
- **Problema:** Falha na inicialização do servidor MCP

## 🛠️ **Configuração Tentada**

### **Arquivo .mcp.json:**
```json
{
  "mcpServers": {
    "gemini-cli": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "--package=@google/gemini-cli",
        "gemini-cli",
        "mcp"
      ],
      "env": {
        "GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
      }
    }
  }
}
```

## ❌ **Problemas Identificados**

1. **Comando spawn echo ENOENT:** Indica problema de PATH ou comando inexistente
2. **MCP Command:** `gemini-cli mcp` pode não estar implementado nesta versão
3. **Environment Variables:** GOOGLE_API_KEY pode não estar configurada

## 🔍 **Diagnóstico Realizado**

### **Comandos Testados:**
```bash
# ✅ Funciona
npx @google/gemini-cli --help

# ✅ Funciona
npx @google/gemini-cli mcp --help

# ❌ Não funciona no MCP
gemini-cli (command not found no PATH)
```

### **Versão Instalada:**
- `@google/gemini-cli@0.1.7`
- Localização: `C:\Users\Refrio\AppData\Roaming\npm`

## 🚧 **Próximos Passos para Correção**

### **1. Verificar Documentação MCP:**
- Consultar documentação oficial do `@google/gemini-cli`
- Verificar se MCP está suportado nesta versão

### **2. Configuração de API Key:**
```bash
# Definir variável de ambiente
export GOOGLE_API_KEY="sua_chave_aqui"

# Ou criar arquivo .env
echo "GOOGLE_API_KEY=sua_chave_aqui" >> .env
```

### **3. Configuração Alternativa:**
```json
{
  "gemini-cli": {
    "type": "stdio",
    "command": "node",
    "args": [
      "C:/Users/Refrio/AppData/Roaming/npm/node_modules/@google/gemini-cli/bin/gemini-cli.js",
      "mcp"
    ],
    "env": {
      "GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY_HERE"
    }
  }
}
```

## 📊 **Status dos Outros MCPs**

### **✅ Funcionando:**
- **TestSprite:** Testes automatizados
- **Playwright:** Automação web
- **Context7:** Documentação de bibliotecas
- **Task Master AI:** Gerenciamento de tarefas

### **⚠️ Com Problemas:**
- **Gemini CLI:** Configuração MCP incorreta

## 💡 **Recomendação Temporária**

Enquanto o MCP Gemini CLI não estiver funcionando, usar:
1. **TestSprite** para análise de código
2. **Context7** para documentação
3. **Task Master AI** para gerenciamento de tarefas

## 🔄 **Atualização Necessária**

Este documento será atualizado quando:
1. Gemini CLI MCP for corrigido
2. Documentação oficial for encontrada
3. Configuração funcional for estabelecida

---

**Data:** 20/09/2025
**Status:** 🔄 Em investigação
**Prioridade:** Baixa (outros MCPs funcionais)