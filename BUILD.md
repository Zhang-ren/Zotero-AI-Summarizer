# 编译与安装指南

本文档详细说明如何从源代码编译 Zotero AI Summarizer 并生成可安装的插件包。

## 系统要求

- **Node.js**: 版本 >= 18.0.0（推荐使用 LTS 版本，当前测试版本: v20.19.6）
- **npm**: 版本 >= 9.0.0（随 Node.js 一起安装）
- **Git**: 用于克隆仓库
- **Zotero**: 版本 7.x（用于测试安装）

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Zhang-ren/Zotero-AI-Summarizer.git
cd Zotero-AI-Summarizer
```

### 2. 安装依赖

```bash
npm install
```

**注意事项：**

- 如果在 macOS 上遇到权限问题，可以使用临时缓存：
  ```bash
  npm install --cache /tmp/.npm
  ```
- 安装过程中可能会看到一些警告（如 EBADENGINE），这些警告不会影响编译过程

### 3. 编译项目

```bash
npm run build
```

编译成功后，你会看到类似以下输出：

```
✔ Build finished in 0.093 s.
```

### 4. 获取安装包

编译完成后，安装包（XPI 文件）会生成在以下位置：

```
.scaffold/build/zotero-ai-summarizer.xpi
```

文件大小约为 65KB。

### 5. 验证构建（可选）

运行验证脚本来确认构建是否成功：

```bash
./verify-build.sh
```

此脚本会检查：

- Node.js 和 npm 版本
- 依赖是否已安装
- XPI 文件是否存在且完整
- XPI 文件内容是否包含必需文件

## 安装到 Zotero

### 方法一：直接安装

1. 打开 Zotero 7
2. 点击菜单：**工具** → **插件**
3. 点击右上角的齿轮图标 ⚙️
4. 选择 **从文件安装附加组件…**
5. 浏览并选择 `.scaffold/build/zotero-ai-summarizer.xpi`
6. 点击 **打开** 并重启 Zotero

### 方法二：拖放安装

1. 打开 Zotero 7
2. 点击菜单：**工具** → **插件**
3. 将 `zotero-ai-summarizer.xpi` 文件直接拖放到插件窗口
4. 重启 Zotero

## 开发模式

### 热重载开发

如果你需要修改代码并实时测试，可以使用开发模式：

```bash
npm start
```

此命令会：

- 自动监控源代码变化
- 实时重新编译
- 自动重新加载插件（需要 Zotero 配合）

### 代码检查

运行代码格式和语法检查：

```bash
npm run lint:check
```

自动修复代码格式问题：

```bash
npm run lint:fix
```

### 运行测试

```bash
npm test
```

## 项目结构

```
Zotero-AI-Summarizer/
├── src/                    # 源代码目录
│   ├── index.ts           # 入口文件
│   ├── modules/           # 功能模块
│   └── utils/             # 工具函数
├── addon/                 # 插件资源
│   ├── manifest.json      # 插件清单
│   ├── prefs.js          # 默认偏好设置
│   ├── bootstrap.js      # 引导脚本
│   ├── content/          # 内容脚本
│   └── locale/           # 多语言支持
├── .scaffold/build/       # 编译输出目录（不提交到 Git）
│   └── zotero-ai-summarizer.xpi  # 生成的安装包
├── package.json           # 项目配置
├── tsconfig.json         # TypeScript 配置
└── zotero-plugin.config.ts  # 插件构建配置
```

## 配置说明

### 修改插件信息

编辑 `package.json` 中的配置：

```json
{
  "config": {
    "addonName": "Zotero AI Summarizer",
    "addonID": "zotero-ai-summarizer@local",
    "addonRef": "zoteroaisummarizer",
    "addonInstance": "ZoteroAISummarizer",
    "prefsPrefix": "extensions.zotero.zoteroaisummarizer"
  }
}
```

### 修改默认设置

编辑 `addon/prefs.js` 来修改插件的默认配置：

```javascript
pref("apiBase", "https://api.openai.com/v1");
pref("apiKey", "");
pref("model", "gpt-4o-mini");
pref("temperature", 0.2);
pref("maxChars", 800000);
```

## 故障排查

### 问题：npm install 失败

**解决方案：**

1. 确保 Node.js 版本正确：`node --version`
2. 清除 npm 缓存：`npm cache clean --force`
3. 删除 `node_modules` 和 `package-lock.json`，重新安装：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 问题：编译时出现 TypeScript 错误

**解决方案：**

1. 确保所有依赖已正确安装
2. 检查 TypeScript 版本：`npx tsc --version`
3. 运行 `npm run lint:fix` 自动修复格式问题

### 问题：生成的 XPI 文件无法安装

**解决方案：**

1. 确认 Zotero 版本为 7.x
2. 检查 XPI 文件是否损坏：
   ```bash
   unzip -t .scaffold/build/zotero-ai-summarizer.xpi
   ```
3. 重新编译：
   ```bash
   rm -rf .scaffold/build
   npm run build
   ```

### 问题：编译警告 "Pref key 'temperature' is a number..."

**说明：** 这是一个非关键警告，不影响插件功能。如果需要消除警告，可以：

1. 将 `temperature` 的类型改为字符串
2. 或者接受此警告（推荐，因为浮点数类型更符合语义）

### 问题：EBADENGINE 警告

**说明：** 这表示 `zotero-plugin-scaffold` 要求 Node.js >= 22.8.0，但当前版本较低。这不会阻止编译，项目在 Node.js 18+ 上可以正常工作。

**可选解决方案：**

- 升级到 Node.js 22+ 以消除警告
- 或者忽略此警告继续使用当前版本

## 发布流程

### 创建 Release

1. 更新版本号（`package.json`）：

   ```bash
   npm version patch  # 或 minor/major
   ```

2. 编译项目：

   ```bash
   npm run build
   ```

3. 提交并推送：

   ```bash
   git add .
   git commit -m "Release v0.1.x"
   git push
   ```

4. 在 GitHub 上创建 Release：
   - 进入仓库的 **Releases** 页面
   - 点击 **Draft a new release**
   - 填写版本标签（如 `v0.1.0`）
   - 上传 `.scaffold/build/zotero-ai-summarizer.xpi`
   - 发布 Release

### 自动发布（使用 GitHub Actions）

如果配置了 CI/CD，可以使用：

```bash
npm run release
```

## 验证安装

安装插件后，验证是否成功：

1. **检查插件列表**：
   - 在 Zotero 中打开 **工具** → **插件**
   - 确认 "Zotero AI Summarizer" 出现在列表中
   - 状态应为 "已启用"

2. **检查右键菜单**：
   - 在 Zotero 文献库中选择一篇文献
   - 右键点击，查看是否有 "AI 总结到子笔记" 选项

3. **检查偏好设置**：
   - 打开 **编辑** → **首选项** → **扩展**
   - 应该能看到 "AI-Summarizer" 标签页

## 技术栈

- **TypeScript**: 主要编程语言
- **zotero-plugin-toolkit**: Zotero 插件开发工具包
- **marked**: Markdown 渲染库
- **ESLint + Prettier**: 代码质量工具
- **esbuild**: 快速的 JavaScript 打包工具

## 获取帮助

如果遇到问题：

1. 查看 [Issues](https://github.com/Zhang-ren/Zotero-AI-Summarizer/issues)
2. 阅读 [README-zhCN.md](./README-zhCN.md)
3. 提交新的 Issue

## 许可证

本项目使用 AGPL-3.0-or-later 许可证。详见 [LICENSE](./LICENSE) 文件。
