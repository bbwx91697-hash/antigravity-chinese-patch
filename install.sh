#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "============================================================"
echo "  Antigravity 主题与深度汉化补丁 - macOS/Linux 一键安装脚本"
echo "============================================================"

if ! command -v node >/dev/null 2>&1; then
  echo "[错误] 未检测到 Node.js，请先安装 Node.js >= 22.0.0（推荐 22.13+）"
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "[错误] 当前 Node.js 主版本为 v$NODE_MAJOR，补丁要求 >= 22.0.0"
  exit 1
fi

if [ -d "./fonts" ]; then
  echo "[1/4] 检测到本地 ./fonts 目录，正在安装字体..."
  node install.mjs install-fonts --from "./fonts"
fi

echo "[2/4] 环境与字体检查..."
node install.mjs doctor || true

echo "[3/4] 安装补丁与后台守护服务..."
node install.mjs install

echo "[4/4] 实机注入验收..."
node install.mjs verify

echo "============================================================"
echo "  部署完成！若首次开启调试端口未连通，请重启一次 Antigravity。"
echo "============================================================"
