#!/bin/bash

# 验证构建脚本 / Build Verification Script
# 用于验证 Zotero AI Summarizer 是否成功编译
# Used to verify that Zotero AI Summarizer compiled successfully

set -e

echo "================================"
echo "Zotero AI Summarizer 构建验证"
echo "Build Verification"
echo "================================"
echo ""

# 检查 Node.js / Check Node.js
echo "检查 Node.js 版本 / Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "✓ Node.js: $NODE_VERSION"
echo ""

# 检查 npm / Check npm
echo "检查 npm 版本 / Checking npm version..."
NPM_VERSION=$(npm --version)
echo "✓ npm: $NPM_VERSION"
echo ""

# 检查依赖 / Check dependencies
echo "检查 node_modules / Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "✓ node_modules 目录存在 / node_modules directory exists"
else
    echo "✗ node_modules 目录不存在 / node_modules directory not found"
    echo "请运行: npm install / Please run: npm install"
    exit 1
fi
echo ""

# 检查构建输出 / Check build output
echo "检查构建输出 / Checking build output..."
XPI_PATH=".scaffold/build/zotero-ai-summarizer.xpi"

if [ -f "$XPI_PATH" ]; then
    XPI_SIZE=$(du -h "$XPI_PATH" | cut -f1)
    echo "✓ XPI 文件已生成 / XPI file generated"
    echo "  位置 / Location: $XPI_PATH"
    echo "  大小 / Size: $XPI_SIZE"
    
    # 验证 XPI 文件完整性 / Verify XPI integrity
    if unzip -t "$XPI_PATH" > /dev/null 2>&1; then
        echo "✓ XPI 文件完整性验证通过 / XPI file integrity verified"
    else
        echo "✗ XPI 文件可能已损坏 / XPI file may be corrupted"
        exit 1
    fi
else
    echo "✗ XPI 文件不存在 / XPI file not found"
    echo "请运行: npm run build / Please run: npm run build"
    exit 1
fi
echo ""

# 检查 XPI 内容 / Check XPI contents
echo "检查 XPI 内容 / Checking XPI contents..."
REQUIRED_FILES=(
    "manifest.json"
    "bootstrap.js"
    "prefs.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if unzip -l "$XPI_PATH" | grep -q "$file"; then
        echo "✓ $file 存在 / exists"
    else
        echo "✗ $file 缺失 / missing"
        exit 1
    fi
done
echo ""

echo "================================"
echo "✓ 所有检查通过！/ All checks passed!"
echo "================================"
echo ""
echo "安装包已准备好，位于:"
echo "Installation package is ready at:"
echo "  $XPI_PATH"
echo ""
echo "安装步骤 / Installation steps:"
echo "1. 打开 Zotero 7 / Open Zotero 7"
echo "2. 工具 → 插件 / Tools → Add-ons"
echo "3. 齿轮图标 → 从文件安装附加组件"
echo "   Gear icon → Install Add-on From File"
echo "4. 选择 XPI 文件并重启 Zotero"
echo "   Select XPI file and restart Zotero"
echo ""
