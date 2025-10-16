#!/usr/bin/env node

/**
 * Script para copiar banco de dados PostgreSQL
 *
 * Uso:
 * 1. Configure as variáveis de ambiente SOURCE_DATABASE_URL e TARGET_DATABASE_URL
 * 2. Execute: node copy-database.js
 *
 * Ou execute diretamente passando as URLs:
 * node copy-database.js "postgresql://user:pass@host:5432/source_db" "postgresql://user:pass@host:5432/target_db"
 */

const { Client } = require('pg');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function copyDatabase() {
  // Obter URLs de conexão
  const sourceUrl = process.argv[2] || process.env.SOURCE_DATABASE_URL;
  const targetUrl = process.argv[3] || process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL;

  if (!sourceUrl) {
    log('❌ ERRO: SOURCE_DATABASE_URL não fornecida!', 'red');
    log('\nUso:', 'yellow');
    log('  node copy-database.js "postgresql://user:pass@host:5432/source_db" "postgresql://user:pass@host:5432/target_db"', 'cyan');
    log('  ou configure SOURCE_DATABASE_URL e TARGET_DATABASE_URL como variáveis de ambiente', 'cyan');
    process.exit(1);
  }

  if (!targetUrl) {
    log('❌ ERRO: TARGET_DATABASE_URL não fornecida!', 'red');
    log('\nUso:', 'yellow');
    log('  node copy-database.js "postgresql://user:pass@host:5432/source_db" "postgresql://user:pass@host:5432/target_db"', 'cyan');
    log('  ou configure TARGET_DATABASE_URL ou DATABASE_URL como variáveis de ambiente', 'cyan');
    process.exit(1);
  }

  log('\n' + '='.repeat(70), 'blue');
  log('🗄️  CÓPIA DE BANCO DE DADOS POSTGRESQL', 'blue');
  log('='.repeat(70), 'blue');

  // Mascarar senhas nas URLs para exibição
  const maskUrl = (url) => {
    return url.replace(/:[^:@]+@/, ':****@');
  };

  log(`\n📍 Origem:  ${maskUrl(sourceUrl)}`, 'cyan');
  log(`📍 Destino: ${maskUrl(targetUrl)}`, 'cyan');

  // Conexões
  const sourceClient = new Client({ connectionString: sourceUrl });
  const targetClient = new Client({ connectionString: targetUrl });

  try {
    // Conectar aos bancos
    log('\n🔌 Conectando ao banco de origem...', 'yellow');
    await sourceClient.connect();
    log('✅ Conectado ao banco de origem', 'green');

    log('🔌 Conectando ao banco de destino...', 'yellow');
    await targetClient.connect();
    log('✅ Conectado ao banco de destino', 'green');

    // Listar tabelas do banco de origem
    log('\n📋 Obtendo lista de tabelas...', 'yellow');
    const tablesResult = await sourceClient.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    log(`✅ Encontradas ${tables.length} tabelas: ${tables.join(', ')}`, 'green');

    // Desabilitar constraints temporariamente no destino
    log('\n🔓 Desabilitando constraints temporariamente...', 'yellow');
    await targetClient.query('SET session_replication_role = replica;');

    // Copiar cada tabela
    for (const table of tables) {
      log(`\n📦 Copiando tabela: ${table}`, 'cyan');

      // Verificar se tabela existe no destino
      const tableExists = await targetClient.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `, [table]);

      if (!tableExists.rows[0].exists) {
        log(`  ⚠️  Tabela ${table} não existe no destino - pulando...`, 'yellow');
        continue;
      }

      // Limpar tabela de destino
      log(`  🧹 Limpando tabela ${table} no destino...`, 'yellow');
      await targetClient.query(`TRUNCATE TABLE "${table}" CASCADE;`);

      // Obter dados da origem
      log(`  📥 Lendo dados da origem...`, 'yellow');
      const dataResult = await sourceClient.query(`SELECT * FROM "${table}";`);
      const rows = dataResult.rows;

      if (rows.length === 0) {
        log(`  ℹ️  Tabela ${table} está vazia - nenhum dado para copiar`, 'cyan');
        continue;
      }

      log(`  📊 Encontrados ${rows.length} registros`, 'cyan');

      // Inserir dados no destino
      log(`  📤 Inserindo dados no destino...`, 'yellow');

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const columns = Object.keys(row);
        const values = Object.values(row);
        const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ');

        const insertQuery = `
          INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')})
          VALUES (${placeholders})
        `;

        await targetClient.query(insertQuery, values);

        // Progresso
        if ((i + 1) % 100 === 0 || i === rows.length - 1) {
          process.stdout.write(`\r  ⏳ Progresso: ${i + 1}/${rows.length} registros`);
        }
      }

      log(`\n  ✅ Tabela ${table} copiada com sucesso!`, 'green');
    }

    // Reabilitar constraints
    log('\n🔒 Reabilitando constraints...', 'yellow');
    await targetClient.query('SET session_replication_role = DEFAULT;');

    // Resetar sequences
    log('\n🔄 Resetando sequences...', 'yellow');
    for (const table of tables) {
      try {
        const seqResult = await targetClient.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = $1
          AND column_default LIKE 'nextval%';
        `, [table]);

        if (seqResult.rows.length > 0) {
          const column = seqResult.rows[0].column_name;
          await targetClient.query(`
            SELECT setval(
              pg_get_serial_sequence('${table}', '${column}'),
              COALESCE((SELECT MAX(${column}) FROM "${table}"), 1)
            );
          `);
          log(`  ✅ Sequence de ${table}.${column} resetada`, 'green');
        }
      } catch (err) {
        log(`  ⚠️  Não foi possível resetar sequence para ${table}: ${err.message}`, 'yellow');
      }
    }

    log('\n' + '='.repeat(70), 'green');
    log('✅ CÓPIA CONCLUÍDA COM SUCESSO!', 'green');
    log('='.repeat(70), 'green');
    log(`\n📊 Total de tabelas copiadas: ${tables.length}`, 'cyan');

  } catch (error) {
    log('\n' + '='.repeat(70), 'red');
    log('❌ ERRO DURANTE A CÓPIA', 'red');
    log('='.repeat(70), 'red');
    log(`\n${error.message}`, 'red');
    log(`\nStack trace:`, 'yellow');
    console.error(error);
    process.exit(1);
  } finally {
    // Fechar conexões
    log('\n🔌 Fechando conexões...', 'yellow');
    await sourceClient.end();
    await targetClient.end();
    log('✅ Conexões fechadas', 'green');
  }
}

// Executar
copyDatabase().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
