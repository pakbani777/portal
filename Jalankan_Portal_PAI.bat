@echo off
title Portal PakBani - Pembelajaran PAI SMP/MTs (Kelas 7, 8, 9)
echo =======================================================
echo              PORTAL PAKBANI (SMP/MTs)
echo   Pendidikan Agama Islam ^& Budi Pekerti (Kelas 7, 8, 9)
echo   Presensi Bulanan Guru ^& Modul Interaktif Terintegrasi
echo =======================================================
echo.
echo Memulai server Portal PakBani...
start "" http://localhost:5000
node server/index.js
pause
