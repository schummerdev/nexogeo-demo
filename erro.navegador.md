C:\schummerdev\nexogeo>node backup-database.js
🗄️  Gerando backup do banco de dados...

📁 Diretório de backups criado
👤 Exportando usuários...

❌ Erro ao gerar backup: password authentication failed for user 'neondb_owner'
error: password authentication failed for user 'neondb_owner'
    at C:\schummerdev\nexogeo\node_modules\pg-pool\index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async query (C:\schummerdev\nexogeo\lib\db.js:23:18)
    at async generateBackup (C:\schummerdev\nexogeo\backup-database.js:33:22)

C:\schummerdev\nexogeo>


corrigir os arquivos que esta faltando na pasta para executar
