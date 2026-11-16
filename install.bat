@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ============================================================
echo   Antigravity 主题与深度汉化补丁 - Windows 一键安装脚本
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装 Node.js ^>= 22.0.0（推荐 22.13+）：
  echo        https://nodejs.org/
  pause
  exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 22 (
  echo [错误] 当前 Node.js 主版本为 v%NODE_MAJOR%，补丁要求 ^>= 22.0.0。
  echo        请先升级 Node.js 后重试：https://nodejs.org/
  pause
  exit /b 1
)

if exist "%~dp0fonts" (
  echo [1/4] 检测到本地 fonts 目录，正在注册字体到 Windows...
  node install.mjs install-fonts --from "%~dp0fonts"
  echo.
)

echo [2/4] 环境与字体检查...
node install.mjs doctor
echo.

echo [3/4] 安装补丁与后台守护服务...
node install.mjs install
if errorlevel 1 (
  echo.
  echo [失败] 安装过程中出现错误，请检查上方输出。
  pause
  exit /b 1
)
echo.

echo [4/4] 实机注入验收...
node install.mjs verify
echo.
echo ============================================================
echo   部署完成！如未生效，请完全退出并重新打开一次 Antigravity。
echo   若提示缺少字体，请先下载字体放到本目录 fonts\ 文件夹后再运行本脚本，
echo   或查看 README.md 让 AI Agent 自动拉取安装。
echo ============================================================
pause
