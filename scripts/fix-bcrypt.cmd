@echo off
echo ========================================
echo   FIX BCRYPT ERROR - Vercel Deploy
echo ========================================
echo.
echo Este script vai:
echo 1. Desinstalar bcrypt
echo 2. Instalar bcryptjs
echo 3. Fazer commit das mudancas
echo 4. Fazer push para o GitHub
echo.
pause

cd /d %~dp0..

echo.
echo [1/4] Desinstalando bcrypt...
call npm uninstall bcrypt @types/bcrypt
if %errorlevel% neq 0 (
    echo ERRO: Falha ao desinstalar bcrypt
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando bcryptjs...
call npm install bcryptjs @types/bcryptjs
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar bcryptjs
    pause
    exit /b 1
)

echo.
echo [3/4] Fazendo commit...
git add .
git commit -m "fix: substituir bcrypt por bcryptjs para compatibilidade Vercel"
if %errorlevel% neq 0 (
    echo AVISO: Nada para commitar ou erro no commit
)

echo.
echo [4/4] Fazendo push para GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERRO: Falha no push. Verifique suas credenciais do Git.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo O codigo foi atualizado e enviado ao GitHub.
echo A Vercel vai fazer o deploy automaticamente em alguns minutos.
echo.
echo Acesse o painel da Vercel para acompanhar o deploy:
echo https://vercel.com/dashboard
echo.
pause
