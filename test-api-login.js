// Testar API de login
const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 Testando API de login...\n');

  const url = 'http://localhost:3002/api/?route=auth&endpoint=login';
  const payload = {
    usuario: 'admin',
    senha: '42d884f7b7e37fe8'
  };

  console.log('📡 URL:', url);
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📊 Status:', response.status, response.statusText);
    console.log('📋 Headers:', Object.fromEntries(response.headers));
    console.log('');

    const data = await response.json();
    console.log('📥 Resposta:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ Login bem-sucedido!');
      console.log('🔑 Token recebido');
    } else {
      console.log('\n❌ Login falhou:', data.message || data.error);
    }

  } catch (error) {
    console.error('\n❌ Erro na requisição:', error.message);
  }
}

testLogin();
