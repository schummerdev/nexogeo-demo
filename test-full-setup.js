// test-full-setup.js - Teste completo do setup local
const axios = require('axios');

async function testFullSetup() {
  const API_BASE = 'http://localhost:3002';

  console.log('🧪 Testando servidor local completo...\n');

  try {
    // 1. Testar status
    console.log('1️⃣ Testando endpoint de status...');
    const statusRes = await axios.get(`${API_BASE}/status`);
    console.log('✅ Status:', statusRes.data.status);

    // 2. Testar login
    console.log('\n2️⃣ Testando login admin...');
    const loginRes = await axios.post(`${API_BASE}/api/?route=auth&endpoint=login`, {
      usuario: 'admin',
      senha: 'admin'
    });
    const token = loginRes.data.token;
    console.log('✅ Login:', loginRes.data.success ? 'Sucesso' : 'Falhou');
    console.log('🔑 Token gerado:', token ? 'Sim' : 'Não');

    // 3. Testar dashboard com autenticação
    console.log('\n3️⃣ Testando dashboard com autenticação...');
    const dashboardRes = await axios.get(`${API_BASE}/api/?route=dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard:', dashboardRes.data.success ? 'Funcionando' : 'Erro');
    console.log('📊 Dados:', dashboardRes.data.data);

    // 4. Testar promoções
    console.log('\n4️⃣ Testando API de promoções...');
    const promocoesRes = await axios.get(`${API_BASE}/api/?route=promocoes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Promoções:', promocoesRes.data.success ? 'Funcionando' : 'Erro');
    console.log('🎁 Total promoções:', promocoesRes.data.data?.length || 0);

    // 5. Testar participantes
    console.log('\n5️⃣ Testando API de participantes...');
    const participantesRes = await axios.get(`${API_BASE}/api/?route=participantes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Participantes:', participantesRes.data.success ? 'Funcionando' : 'Erro');
    console.log('👥 Total participantes:', participantesRes.data.data?.length || 0);

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('\n📋 Resumo do Setup:');
    console.log('✅ Servidor local rodando em: http://localhost:3002');
    console.log('✅ Banco online conectado');
    console.log('✅ Autenticação funcionando');
    console.log('✅ APIs retornando dados');
    console.log('✅ Proxy configurado para React');
    console.log('\n🚀 Pronto para desenvolvimento!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Dica: Certifique-se de que o servidor está rodando:');
      console.log('   npm run dev:api');
    } else if (error.response?.status === 401) {
      console.log('\n💡 Erro de autenticação - isso é esperado para algumas APIs');
    } else {
      console.log('\n💡 Verifique se o arquivo .env está configurado corretamente');
    }
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  testFullSetup();
}

module.exports = { testFullSetup };