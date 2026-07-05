@echo off
echo ==============================================
echo    INICIANDO SERVIDOR DE DESARROLLO VETCARE
echo ==============================================
echo.

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias por primera vez...
    echo Esto puede tomar unos minutos...
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo ==============================================
echo    Servidor iniciando en: http://localhost:5173
echo ==============================================
echo.
echo NO CIERRES ESTA VENTANA MIENTRAS TRABAJES
echo.

:loop
node keep-alive.js
if errorlevel 1 (
    echo.
    echo Servidor cerrado. Reiniciando en 5 segundos...
    timeout /t 5 /nobreak >nul
    goto loop
)