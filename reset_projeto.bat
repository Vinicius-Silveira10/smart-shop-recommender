@echo off
cls
echo ====================================================
echo   SMART RECOMMENDER - LIMPANDO PORTAS DO PROJETO
echo ====================================================

echo.
echo [1/3] Finalizando processos na porta 8000 (Python ML)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a 2>nul

echo [2/3] Finalizando processos na porta 8082 (Node.js Cart)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8082') do taskkill /F /PID %%a 2>nul

echo [3/3] Finalizando processos na porta 8083 (Java Spring)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8083') do taskkill /F /PID %%a 2>nul

echo.
echo ====================================================
echo   PORTAS LIVRES! AGORA REINICIE NA ORDEM:
echo   1. Python (8000)
echo   2. Node.js (8082)
echo   3. Java (8083)
echo ====================================================
pause