@echo off
echo.
echo [!] Iniciando limpeza de portas para Smart Recommender...
echo.

:: Porta 8082 (Node.js / Carrinho)
echo Limpando porta 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8082') do taskkill /F /PID %%a 2>nul

:: Porta 8083 (Java / IA e Interacoes)
echo Limpando porta 8083...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8083') do taskkill /F /PID %%a 2>nul

:: Porta 8000 (Python / Motor de IA)
echo Limpando porta 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a 2>nul

echo.
echo [+] Portas liberadas com sucesso! 
echo.
pause