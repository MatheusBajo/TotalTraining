@echo off
echo Starting TotalTraining - Server + Ngrok + Expo Tunnel
echo =====================================================

:: Start the server
start "TotalTraining Server" cmd /k "cd /d %~dp0server && node index.js"

:: Wait a bit for server to be ready
timeout /t 2 /nobreak >nul

:: Start ngrok
start "Ngrok Tunnel" cmd /k "ngrok http 3001"

:: Wait for ngrok to establish
timeout /t 3 /nobreak >nul

:: Start Expo with tunnel
start "Expo Tunnel" cmd /k "cd /d %~dp0 && npx expo start --tunnel"

echo.
echo All services started! Check the opened windows.
echo - Server: http://localhost:3001
echo - Ngrok: http://localhost:4040 (dashboard)
echo - Expo: Scan the QR code in the Expo window
echo.
echo Close this window or press any key to exit.
pause >nul
