# 快速参考 / Quick Reference

## 常用命令 / Common Commands

### 安装和构建 / Install and Build

```bash
# 安装依赖 / Install dependencies
npm install

# 构建生产版本 / Build for production
npm run build

# 验证构建 / Verify build
./verify-build.sh

# 开发模式（热重载）/ Development mode (hot reload)
npm start
```

### 代码质量 / Code Quality

```bash
# 检查代码格式 / Check code formatting
npm run lint:check

# 自动修复代码格式 / Auto-fix code formatting
npm run lint:fix

# 运行测试 / Run tests
npm test
```

### 输出位置 / Output Location

```
.scaffold/build/zotero-ai-summarizer.xpi
```

## 快速故障排查 / Quick Troubleshooting

### 依赖问题 / Dependency Issues

```bash
# 清除并重新安装 / Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 构建问题 / Build Issues

```bash
# 清除构建缓存 / Clear build cache
rm -rf .scaffold/build
npm run build
```

### macOS 权限问题 / macOS Permission Issues

```bash
npm install --cache /tmp/.npm
```

## 版本要求 / Version Requirements

- Node.js: >= 18.0.0 (推荐 LTS / Recommended LTS)
- npm: >= 9.0.0
- Zotero: 7.x

## 更多信息 / More Information

- 📖 中文详细文档: [BUILD.md](./BUILD.md)
- 📖 English Documentation: [BUILD-EN.md](./BUILD-EN.md)
- 🇨🇳 中文说明: [README-zhCN.md](./README-zhCN.md)
- 🇬🇧 English README: [README.md](./README.md)
