@echo off
echo Setting up Holiday Home Host assets...

:: Create assets directory
if not exist "assets\" mkdir assets

:: Copy generated images from Antigravity brain folder
set BRAIN=C:\Users\Lenovo\.gemini\antigravity\brain\c1519246-342d-40ee-87d5-ba09c3a10e5f

copy "%BRAIN%\hero_hero_image_1773504582421.png" "assets\hero.jpg" >nul 2>&1
if exist "assets\hero.jpg" (echo [OK] hero.jpg) else (echo [MISSING] hero.jpg)

copy "%BRAIN%\property_interior_1773504627268.png" "assets\property.jpg" >nul 2>&1
if exist "assets\property.jpg" (echo [OK] property.jpg) else (echo [MISSING] property.jpg)

copy "%BRAIN%\property_interior_1773504627268.png" "assets\interior.jpg" >nul 2>&1
if exist "assets\interior.jpg" (echo [OK] interior.jpg) else (echo [MISSING] interior.jpg)

copy "%BRAIN%\jebel_jais_1773504652596.png" "assets\jebel.jpg" >nul 2>&1
if exist "assets\jebel.jpg" (echo [OK] jebel.jpg) else (echo [MISSING] jebel.jpg)

copy "%BRAIN%\al_marjan_island_1773504956015.png" "assets\island.jpg" >nul 2>&1
if exist "assets\island.jpg" (echo [OK] island.jpg) else (echo [MISSING] island.jpg)

echo.
echo Assets setup complete! Open index.html in your browser.
echo.
pause
