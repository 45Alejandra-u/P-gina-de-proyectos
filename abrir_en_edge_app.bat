@echo off
title EnglishQuest 180 - Modo Aplicacion de Escritorio
echo ========================================================
echo   Abriendo EnglishQuest 180 como Aplicacion de Escritorio
echo ========================================================
start msedge --app="file:///%~dp0index.html"
if %errorlevel% neq 0 (
    start "" "%~dp0index.html"
)
