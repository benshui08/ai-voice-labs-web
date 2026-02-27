@echo off
setlocal enabledelayedexpansion

REM ============================================
REM Step 2: 将导出的 SQL 文件逐表导入 D1
REM
REM 用法:
REM   import-to-d1.bat              -- 导入所有表
REM   import-to-d1.bat users        -- 只导入 users 表
REM   import-to-d1.bat users voices -- 导入指定的多张表
REM ============================================

set D1_DB=voicica-db
set SQL_DIR=scripts\d1-migration-temp
set MAX_RETRIES=5
set RETRY_DELAY=5

if not exist "%SQL_DIR%" (
    echo [ERROR] %SQL_DIR% not found! Run export-neon-tables.ts first.
    exit /b 1
)

echo.
echo ========================================
echo  D1 Import: %D1_DB%
echo  Time: %date% %time%
echo ========================================
echo.

REM 先合并一个清空所有表的 SQL，一次执行（减少进程启动次数）
echo [PREP] Disabling foreign keys + clearing tables...
echo PRAGMA foreign_keys = OFF; > "%SQL_DIR%\_prepare.sql"

REM 如果指定了表名参数，只清空这些表
if not "%~1"=="" (
    for %%t in (%*) do (
        echo DELETE FROM %%t; >> "%SQL_DIR%\_prepare.sql"
    )
) else (
    for %%f in (%SQL_DIR%\*.sql) do (
        if not "%%~nf"=="_prepare" (
            echo DELETE FROM %%~nf; >> "%SQL_DIR%\_prepare.sql"
        )
    )
)

call npx wrangler d1 execute %D1_DB% --remote --yes --file="%SQL_DIR%\_prepare.sql"
if !errorlevel! neq 0 (
    echo [ERROR] Prepare step failed!
    exit /b 1
)
echo [PREP] Done. %time%
echo.

REM 如果指定了表名参数，只处理这些表
if not "%~1"=="" (
    :loop_args
    if "%~1"=="" goto :done
    call :import_table "%~1"
    shift
    goto :loop_args
)

REM 否则处理所有 SQL 文件
for %%f in (%SQL_DIR%\*.sql) do (
    if not "%%~nf"=="_prepare" (
        call :import_table "%%~nf"
    )
)

:done
echo.
echo ========================================
echo  Import complete! %time%
echo ========================================
del "%SQL_DIR%\_prepare.sql" 2>nul
endlocal
exit /b 0

REM ---- 导入单张表的函数 ----
:import_table
set TABLE=%~1
set SQL_FILE=%SQL_DIR%\%TABLE%.sql

if not exist "%SQL_FILE%" (
    echo [SKIP] %TABLE% - no SQL file
    exit /b 0
)

REM 获取文件大小
for %%a in ("%SQL_FILE%") do set FSIZE=%%~za
set /a FSIZE_KB=!FSIZE! / 1024

echo [%time%] %TABLE% (%FSIZE_KB% KB) importing...

set /a ATTEMPT=0
:retry
set /a ATTEMPT+=1

call npx wrangler d1 execute %D1_DB% --remote --yes --file="%SQL_FILE%"
if !errorlevel! equ 0 (
    echo [%time%] %TABLE% OK
    echo.
    exit /b 0
)

if !ATTEMPT! lss %MAX_RETRIES% (
    echo [%time%] %TABLE% failed ^(attempt !ATTEMPT!/%MAX_RETRIES%^), retry in %RETRY_DELAY%s...
    timeout /t %RETRY_DELAY% /nobreak >nul
    goto :retry
)

echo [%time%] %TABLE% FAILED after %MAX_RETRIES% attempts
echo.
exit /b 1
