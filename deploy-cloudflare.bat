@echo off
setlocal

REM ============================================
REM Cloudflare Pages 手动部署脚本
REM
REM 用法:
REM   deploy-cloudflare.bat              -- 完整构建 + 部署
REM   deploy-cloudflare.bat --deploy-only    -- 跳过构建，直接部署
REM
REM 前置条件:
REM   1. npm install -g wrangler
REM   2. wrangler login
REM   3. Cloudflare Dashboard 创建 Pages 项目 (voicica)
REM   4. .env.production 已配置好
REM ============================================

set PROJECT_NAME=voicica
set DEPLOY_ONLY=0

if "%~1"=="--deploy-only" set DEPLOY_ONLY=1

echo.
echo ========================================
echo  Cloudflare Pages Deploy
echo  Project: %PROJECT_NAME%
if "%DEPLOY_ONLY%"=="1" echo  Mode:    deploy-only (skip build)
echo ========================================
echo.

REM --- 检查前置条件 ---
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] wrangler not found!
    echo         Run: npm install -g wrangler
    exit /b 1
)

if "%DEPLOY_ONLY%"=="1" (
    if not exist .next (
        echo [ERROR] .next directory not found! Run without --deploy-only first.
        exit /b 1
    )
    goto :deploy
)

REM --- Step 1: 安装依赖 ---
echo [1/3] Installing dependencies...
call npm install --prefer-offline
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    exit /b 1
)

REM --- Step 2: Prisma generate ---
echo [2/3] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed!
    exit /b 1
)

REM --- Step 3: Next.js build ---
echo [3/3] Building Next.js...
call npx next build
if %errorlevel% neq 0 (
    echo [ERROR] Next.js build failed!
    exit /b 1
)

:deploy
REM --- 清理构建缓存（超过 Cloudflare 25MB 限制）---
echo Cleaning build cache...
if exist .next\cache rd /s /q .next\cache

REM --- 部署到 Cloudflare Pages ---
echo Deploying to Cloudflare Pages...
call wrangler pages deploy .next --project-name=%PROJECT_NAME% --commit-dirty=true

if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed!
    exit /b 1
)

echo.
echo ========================================
echo  Deploy successful!
echo  https://%PROJECT_NAME%.pages.dev
echo ========================================
echo.

endlocal