@echo off
setlocal enabledelayedexpansion

echo ========================================================================
echo   ATUALIZACAO DE VARIAVEIS DE AMBIENTE - VERCEL
echo ========================================================================
echo.

REM Ler DATABASE_URL do .env
for /f "tokens=1,* delims==" %%a in ('findstr /b "DATABASE_URL=" .env') do set DATABASE_URL=%%b

echo DATABASE_URL encontrada: %DATABASE_URL:~0,50%...
echo.

echo ========================================================================
echo   Atualizando variaveis na Vercel...
echo ========================================================================
echo.

REM DATABASE_URL
echo [1/5] Atualizando DATABASE_URL...
echo %DATABASE_URL% | vercel env add DATABASE_URL production
echo %DATABASE_URL% | vercel env add DATABASE_URL preview
echo %DATABASE_URL% | vercel env add DATABASE_URL development
echo    ✓ DATABASE_URL atualizada
echo.

REM POSTGRES_URL
echo [2/5] Atualizando POSTGRES_URL...
echo %DATABASE_URL% | vercel env add POSTGRES_URL production
echo %DATABASE_URL% | vercel env add POSTGRES_URL preview
echo %DATABASE_URL% | vercel env add POSTGRES_URL development
echo    ✓ POSTGRES_URL atualizada
echo.

REM Outras variáveis do PostgreSQL...
for /f "tokens=1,* delims==" %%a in ('findstr /b "PGHOST=" .env') do set PGHOST=%%b
for /f "tokens=1,* delims==" %%a in ('findstr /b "PGUSER=" .env') do set PGUSER=%%b
for /f "tokens=1,* delims==" %%a in ('findstr /b "PGDATABASE=" .env') do set PGDATABASE=%%b
for /f "tokens=1,* delims==" %%a in ('findstr /b "PGPASSWORD=" .env') do set PGPASSWORD=%%b

echo [3/5] Atualizando PGHOST...
echo %PGHOST% | vercel env add PGHOST production
echo    ✓ PGHOST atualizada
echo.

echo [4/5] Atualizando PGUSER...
echo %PGUSER% | vercel env add PGUSER production
echo    ✓ PGUSER atualizada
echo.

echo [5/5] Atualizando PGDATABASE...
echo %PGDATABASE% | vercel env add PGDATABASE production
echo    ✓ PGDATABASE atualizada
echo.

echo ========================================================================
echo   ✓ Variaveis atualizadas com sucesso!
echo ========================================================================
echo.
echo Proximo passo: Executar redeploy
echo   vercel --prod
echo.

pause
