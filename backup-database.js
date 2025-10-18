// Script para gerar backup SQL completo do banco de dados
require('dotenv').config();
const { query } = require('./lib/db');
const fs = require('fs');
const path = require('path');

async function generateBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = path.join(__dirname, 'backups');
  const backupFile = path.join(backupDir, `backup-neondb-${timestamp}.sql`);

  console.log('🗄️  Gerando backup do banco de dados...\n');

  try {
    // Criar diretório de backups se não existir
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
      console.log('📁 Diretório de backups criado');
    }

    let sql = '';

    // Cabeçalho do arquivo SQL
    sql += `-- Backup do Banco de Dados NexoGeo\n`;
    sql += `-- Data: ${new Date().toISOString()}\n`;
    sql += `-- Banco: neondb\n`;
    sql += `-- Gerado automaticamente por backup-database.js\n\n`;
    sql += `SET client_encoding = 'UTF8';\n`;
    sql += `SET standard_conforming_strings = on;\n\n`;

    // === USUÁRIOS ===
    console.log('👤 Exportando usuários...');
    const usuarios = await query('SELECT * FROM usuarios ORDER BY id');

    if (usuarios.rows.length > 0) {
      sql += `-- Tabela: usuarios (${usuarios.rows.length} registros)\n`;
      sql += `TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;\n`;

      for (const user of usuarios.rows) {
        sql += `INSERT INTO usuarios (usuario, senha_hash, role, created_at, updated_at) VALUES (\n`;
        sql += `  '${user.usuario.replace(/'/g, "''")}',\n`;
        sql += `  '${user.senha_hash}',\n`;
        sql += `  '${user.role}',\n`;
        sql += `  '${user.created_at.toISOString()}',\n`;
        sql += `  '${user.updated_at.toISOString()}'\n`;
        sql += `);\n`;
      }
      sql += `\n`;
      console.log(`   ✅ ${usuarios.rows.length} usuários exportados`);
    }

    // === CONFIGURAÇÕES ===
    console.log('⚙️  Exportando configurações...');
    const configs = await query('SELECT * FROM configuracoes_emissora LIMIT 1');

    if (configs.rows.length > 0) {
      sql += `-- Tabela: configuracoes_emissora\n`;
      sql += `TRUNCATE TABLE configuracoes_emissora RESTART IDENTITY CASCADE;\n`;

      const c = configs.rows[0];
      sql += `INSERT INTO configuracoes_emissora (\n`;
      sql += `  nome, logo_url, tema_cor, website, telefone, endereco,\n`;
      sql += `  instagram, facebook, youtube, linkedin, twitter, whatsapp,\n`;
      sql += `  email, descricao, updated_at\n`;
      sql += `) VALUES (\n`;
      sql += `  ${c.nome ? `'${c.nome.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.logo_url ? `'${c.logo_url.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.tema_cor ? `'${c.tema_cor}'` : 'NULL'},\n`;
      sql += `  ${c.website ? `'${c.website.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.telefone ? `'${c.telefone}'` : 'NULL'},\n`;
      sql += `  ${c.endereco ? `'${c.endereco.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.instagram ? `'${c.instagram.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.facebook ? `'${c.facebook.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.youtube ? `'${c.youtube.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.linkedin ? `'${c.linkedin.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.twitter ? `'${c.twitter.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.whatsapp ? `'${c.whatsapp}'` : 'NULL'},\n`;
      sql += `  ${c.email ? `'${c.email.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  ${c.descricao ? `'${c.descricao.replace(/'/g, "''")}'` : 'NULL'},\n`;
      sql += `  '${c.updated_at.toISOString()}'\n`;
      sql += `);\n\n`;
      console.log('   ✅ Configurações exportadas');
    }

    // === PROMOÇÕES ===
    console.log('🎁 Exportando promoções...');
    const promocoes = await query('SELECT * FROM promocoes ORDER BY id');

    if (promocoes.rows.length > 0) {
      sql += `-- Tabela: promocoes (${promocoes.rows.length} registros)\n`;
      sql += `TRUNCATE TABLE promocoes RESTART IDENTITY CASCADE;\n`;

      for (const p of promocoes.rows) {
        sql += `INSERT INTO promocoes (nome, descricao, status, data_inicio, data_fim, participantes_count, created_at, updated_at) VALUES (\n`;
        sql += `  '${p.nome.replace(/'/g, "''")}',\n`;
        sql += `  ${p.descricao ? `'${p.descricao.replace(/'/g, "''")}'` : 'NULL'},\n`;
        sql += `  '${p.status}',\n`;
        sql += `  ${p.data_inicio ? `'${p.data_inicio.toISOString().split('T')[0]}'` : 'NULL'},\n`;
        sql += `  ${p.data_fim ? `'${p.data_fim.toISOString().split('T')[0]}'` : 'NULL'},\n`;
        sql += `  ${p.participantes_count || 0},\n`;
        sql += `  '${p.created_at.toISOString()}',\n`;
        sql += `  '${p.updated_at.toISOString()}'\n`;
        sql += `);\n`;
      }
      sql += `\n`;
      console.log(`   ✅ ${promocoes.rows.length} promoções exportadas`);
    }

    // === PARTICIPANTES ===
    console.log('👥 Exportando participantes...');
    const participantes = await query('SELECT * FROM participantes ORDER BY id');

    if (participantes.rows.length > 0) {
      sql += `-- Tabela: participantes (${participantes.rows.length} registros)\n`;
      sql += `TRUNCATE TABLE participantes RESTART IDENTITY CASCADE;\n`;

      for (const p of participantes.rows) {
        sql += `INSERT INTO participantes (nome, email, telefone, bairro, cidade, promocao_id, data_cadastro, origem_source, origem_medium) VALUES (\n`;
        sql += `  '${p.nome.replace(/'/g, "''")}',\n`;
        sql += `  ${p.email ? `'${p.email.replace(/'/g, "''")}'` : 'NULL'},\n`;
        sql += `  ${p.telefone ? `'${p.telefone}'` : 'NULL'},\n`;
        sql += `  ${p.bairro ? `'${p.bairro.replace(/'/g, "''")}'` : 'NULL'},\n`;
        sql += `  ${p.cidade ? `'${p.cidade.replace(/'/g, "''")}'` : 'NULL'},\n`;
        sql += `  ${p.promocao_id || 'NULL'},\n`;
        sql += `  '${p.data_cadastro.toISOString()}',\n`;
        sql += `  ${p.origem_source ? `'${p.origem_source.replace(/'/g, "''")}'` : 'NULL'},\n`;
        sql += `  ${p.origem_medium ? `'${p.origem_medium.replace(/'/g, "''")}'` : 'NULL'}\n`;
        sql += `);\n`;
      }
      sql += `\n`;
      console.log(`   ✅ ${participantes.rows.length} participantes exportados`);
    }

    // === PATROCINADORES ===
    console.log('🏢 Exportando patrocinadores...');
    try {
      const sponsors = await query('SELECT * FROM sponsors ORDER BY id');

      if (sponsors.rows.length > 0) {
        sql += `-- Tabela: sponsors (${sponsors.rows.length} registros)\n`;
        sql += `TRUNCATE TABLE sponsors RESTART IDENTITY CASCADE;\n`;

        for (const s of sponsors.rows) {
          sql += `INSERT INTO sponsors (name, created_at) VALUES (\n`;
          sql += `  '${s.name.replace(/'/g, "''")}',\n`;
          sql += `  '${s.created_at.toISOString()}'\n`;
          sql += `);\n`;
        }
        sql += `\n`;
        console.log(`   ✅ ${sponsors.rows.length} patrocinadores exportados`);
      }
    } catch (e) {
      console.log('   ⚠️  Tabela sponsors vazia ou inexistente');
    }

    // === PRODUTOS ===
    console.log('📦 Exportando produtos...');
    try {
      const products = await query('SELECT * FROM products ORDER BY id');

      if (products.rows.length > 0) {
        sql += `-- Tabela: products (${products.rows.length} registros)\n`;
        sql += `TRUNCATE TABLE products RESTART IDENTITY CASCADE;\n`;

        for (const p of products.rows) {
          const cluesArray = p.clues.map(c => `'${c.replace(/'/g, "''")}'`).join(', ');
          sql += `INSERT INTO products (sponsor_id, name, clues, created_at) VALUES (\n`;
          sql += `  ${p.sponsor_id},\n`;
          sql += `  '${p.name.replace(/'/g, "''")}',\n`;
          sql += `  ARRAY[${cluesArray}],\n`;
          sql += `  '${p.created_at.toISOString()}'\n`;
          sql += `);\n`;
        }
        sql += `\n`;
        console.log(`   ✅ ${products.rows.length} produtos exportados`);
      }
    } catch (e) {
      console.log('   ⚠️  Tabela products vazia ou inexistente');
    }

    // === JOGOS ===
    console.log('🎮 Exportando jogos...');
    try {
      const games = await query('SELECT * FROM games ORDER BY id');

      if (games.rows.length > 0) {
        sql += `-- Tabela: games (${games.rows.length} registros)\n`;
        sql += `TRUNCATE TABLE games RESTART IDENTITY CASCADE;\n`;

        for (const g of games.rows) {
          sql += `INSERT INTO games (product_id, status, revealed_clues_count, winner_submission_id, created_at, ended_at) VALUES (\n`;
          sql += `  ${g.product_id},\n`;
          sql += `  '${g.status}',\n`;
          sql += `  ${g.revealed_clues_count},\n`;
          sql += `  ${g.winner_submission_id || 'NULL'},\n`;
          sql += `  '${g.created_at.toISOString()}',\n`;
          sql += `  ${g.ended_at ? `'${g.ended_at.toISOString()}'` : 'NULL'}\n`;
          sql += `);\n`;
        }
        sql += `\n`;
        console.log(`   ✅ ${games.rows.length} jogos exportados`);
      }
    } catch (e) {
      console.log('   ⚠️  Tabela games vazia ou inexistente');
    }

    // === PALPITES ===
    console.log('💭 Exportando palpites...');
    try {
      const submissions = await query('SELECT * FROM submissions ORDER BY id');

      if (submissions.rows.length > 0) {
        sql += `-- Tabela: submissions (${submissions.rows.length} registros)\n`;
        sql += `TRUNCATE TABLE submissions RESTART IDENTITY CASCADE;\n`;

        for (const s of submissions.rows) {
          sql += `INSERT INTO submissions (game_id, user_name, user_phone, user_neighborhood, user_city, guess, is_correct, created_at, public_participant_id, submission_number) VALUES (\n`;
          sql += `  ${s.game_id},\n`;
          sql += `  '${s.user_name.replace(/'/g, "''")}',\n`;
          sql += `  '${s.user_phone}',\n`;
          sql += `  '${s.user_neighborhood.replace(/'/g, "''")}',\n`;
          sql += `  '${s.user_city.replace(/'/g, "''")}',\n`;
          sql += `  '${s.guess.replace(/'/g, "''")}',\n`;
          sql += `  ${s.is_correct},\n`;
          sql += `  '${s.created_at.toISOString()}',\n`;
          sql += `  ${s.public_participant_id || 'NULL'},\n`;
          sql += `  ${s.submission_number || 1}\n`;
          sql += `);\n`;
        }
        sql += `\n`;
        console.log(`   ✅ ${submissions.rows.length} palpites exportados`);
      }
    } catch (e) {
      console.log('   ⚠️  Tabela submissions vazia ou inexistente');
    }

    // === PARTICIPANTES PÚBLICOS ===
    console.log('🌍 Exportando participantes públicos...');
    try {
      const publicParts = await query('SELECT * FROM public_participants ORDER BY id');

      if (publicParts.rows.length > 0) {
        sql += `-- Tabela: public_participants (${publicParts.rows.length} registros)\n`;
        sql += `TRUNCATE TABLE public_participants RESTART IDENTITY CASCADE;\n`;

        for (const pp of publicParts.rows) {
          sql += `INSERT INTO public_participants (name, phone, neighborhood, city, latitude, longitude, referral_code, referred_by_id, own_referral_code, extra_guesses, created_at) VALUES (\n`;
          sql += `  '${pp.name.replace(/'/g, "''")}',\n`;
          sql += `  '${pp.phone}',\n`;
          sql += `  '${pp.neighborhood.replace(/'/g, "''")}',\n`;
          sql += `  '${pp.city.replace(/'/g, "''")}',\n`;
          sql += `  ${pp.latitude || 'NULL'},\n`;
          sql += `  ${pp.longitude || 'NULL'},\n`;
          sql += `  ${pp.referral_code ? `'${pp.referral_code}'` : 'NULL'},\n`;
          sql += `  ${pp.referred_by_id || 'NULL'},\n`;
          sql += `  ${pp.own_referral_code ? `'${pp.own_referral_code}'` : 'NULL'},\n`;
          sql += `  ${pp.extra_guesses || 0},\n`;
          sql += `  '${pp.created_at.toISOString()}'\n`;
          sql += `);\n`;
        }
        sql += `\n`;
        console.log(`   ✅ ${publicParts.rows.length} participantes públicos exportados`);
      }
    } catch (e) {
      console.log('   ⚠️  Tabela public_participants vazia ou inexistente');
    }

    // Rodapé
    sql += `-- Fim do backup\n`;
    sql += `-- Total de comandos SQL gerados\n`;

    // Salvar arquivo
    fs.writeFileSync(backupFile, sql, 'utf8');

    const sizeKB = (fs.statSync(backupFile).size / 1024).toFixed(2);
    console.log(`\n✅ Backup gerado com sucesso!`);
    console.log(`📁 Arquivo: ${backupFile}`);
    console.log(`📊 Tamanho: ${sizeKB} KB`);
    console.log(`\n💡 Para restaurar o backup, execute:`);
    console.log(`   node restore-backup.js ${path.basename(backupFile)}`);

  } catch (error) {
    console.error('\n❌ Erro ao gerar backup:', error.message);
    console.error(error.stack);
  }

  process.exit(0);
}

generateBackup();
