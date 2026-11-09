@echo off
setlocal
cd /d "%~dp0"
for /d %%D in ("%~dp0.tools\node-*-win-x64") do set "PATH=%%~fD;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.12+ or 24 LTS is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Open http://127.0.0.1:5173 in your browser.
call npm.cmd run dev -- --port 5173 --strictPort
pause
