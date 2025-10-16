require('dotenv').config();
const db = require('./lib/db');
const bcrypt = require('bcrypt');

async function testAuth() {
  try {
    // 1. Verificar hash no banco
    const result = await db.query('SELECT id, usuario, senha_hash, role FROM usuarios WHERE usuario = $1', ['admin']);

    if (result.rows.length === 0) {
      console.log('❌ Usuário admin não encontrado!');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('\n📊 Informações do usuário:');
    console.log('  ID:', user.id);
    console.log('  Usuário:', user.usuario);
    console.log('  Role:', user.role);
    console.log('  Hash existe:', !!user.senha_hash);
    console.log('  Hash length:', user.senha_hash ? user.senha_hash.length : 0);
    console.log('  Hash preview:', user.senha_hash ? user.senha_hash.substring(0, 30) + '...' : 'N/A');

    // 2. Testar senha atual
    const senhaAtual = '90864c11739ecc18';
    console.log('\n🔑 Testando senha:', senhaAtual);

    const isValid = await bcrypt.compare(senhaAtual, user.senha_hash);
    console.log('  Senha válida:', isValid ? '✅ SIM' : '❌ NÃO');

    if (!isValid) {
      console.log('\n⚠️  A senha no banco NÃO corresponde à senha esperada!');
      console.log('  Isso pode indicar que o hash não foi atualizado corretamente.');
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testAuth();
