# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_T53ljWIDEqQJ

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x.sa-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_T53ljWIDEqQJ
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=****************************
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=****************************************
STACK_SECRET_SERVER_KEY=***********************


psql "postgresql://neondb_owner:npg_T53ljWIDEqQJ@ep-lucky-base-ac53ya6x-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

