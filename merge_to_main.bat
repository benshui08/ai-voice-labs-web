@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   Feature → Main 自动合并脚本
echo ========================================
echo.

REM 保存当前目录
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM 1. 检查工作区干净
echo [1/5] 检查工作区状态...
for /f %%i in ('git status --porcelain ^| find /c /v ""') do set CHANGES=%%i
if !CHANGES! GTR 0 (
    echo ❌ 工作区有未提交的修改:
    git status --short
    pause
    exit /b 1
)
echo ✅ 工作区干净
echo.

REM 2. 更新远程
echo [2/5] 拉取最新远程分支信息...
git fetch origin
if errorlevel 1 (
    echo ❌ 拉取远程信息失败
    pause
    exit /b 1
)
echo ✅ fetch 成功
echo.

REM 3. 切换到 main 并拉取
echo [3/5] 切换到 main...
git checkout main
if errorlevel 1 (
    echo ❌ 切换到 main 分支失败
    pause
    exit /b 1
)

echo 拉取 main 最新代码...
git pull origin main
if errorlevel 1 (
    echo ❌ 拉取 main 失败
    pause
    exit /b 1
)
echo ✅ main 已更新
echo.

REM 4. 合并 feature
echo [4/5] 合并 feature → main...
git merge feature --no-edit
if errorlevel 1 (
    echo ❌ 合并失败，存在冲突
    pause
    exit /b 1
)
echo ✅ 合并成功
echo.

REM 5. 推送 main
echo [5/5] 推送 main 到远程...
git push origin main
if errorlevel 1 (
    echo ❌ 推送失败
    pause
    exit /b 1
)
echo ✅ 推送成功
echo.

echo ========================================
echo 🎉 完成！main 已更新并上线 Cloudflare
echo ========================================
pause
