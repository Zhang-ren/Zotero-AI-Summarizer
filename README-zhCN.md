# Zotero AI Summarizer（中文）

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

[English README](./README.md)

一个适用于 Zotero 7 的插件。它可调用大模型根据提示词为选中文献生成结构化摘要，并将结果作为“子笔记”保存。内置专业 Markdown→HTML 渲染（使用 `marked`），在 Zotero 笔记中正确显示表格、列表、标题、粗体、斜体、代码块等。

## 功能

- 右键一键“生成 AI 摘要到子笔记”
- 可配置 API Base、API Key、模型、温度、提示词模板
- 偏好面板提供“测试 API”按钮，快速验证连通性
- Markdown→HTML 渲染，完美呈现常见格式
- 支持多选条目批量处理

## 安装

1. 在 Releases 页面下载最新 `.xpi`
2. Zotero → 工具 → 插件 → 右上角齿轮 → 从文件安装附加组件…
3. 选择 `zotero-ai-summarizer.xpi` 并重启 Zotero

## 快速上手

- 在中间列表选中文献条目（非笔记/附件）
- 右键 → “AI 总结到子笔记”
- 插件会读取 PDF/HTML 附件（在最大截取字符数限制内），生成结构化摘要并保存在对应条目的子笔记里

## 偏好设置

路径：Zotero → 首选项 → 扩展 → “AI-Summarizer”

- API Base：OpenAI 兼容 Chat Completions 接口（例如 `https://api.openai.com/v1`）
- API Key：你的密钥
- 模型：例如 `gpt-4o-mini`（或你的服务端模型名）
- 温度：默认 `0.2`
- 截取最大字符数：从附件中抽取的最大字符数
- 提示词模板：可使用变量 `{title}`、`{abstract}`、`{content}`
- 测试 API：验证接口连通性与凭据

### 默认值位置

- 运行时可直接在偏好面板修改
- 安装后的初始默认值来自 `addon/prefs.js`：
  - `pref("prompt", "...")`
  - `pref("temperature", 0.2)`
- 当偏好为空时，代码 fallback 默认提示词在 `src/modules/aiSummary.ts` 的 `defaultTpl`


## 从源码编译

前置：Node.js（LTS）、Git、Zotero 7

```bash
# 安装依赖
npm install

# 开发热重载
npm start

# 生产构建（生成 XPI 到 .scaffold/build）
npm run build
```

生成的 XPI 路径：

```
.scaffold/build/zotero-ai-summarizer.xpi
```

若在 macOS 上 `npm install` 出现权限问题，可用临时缓存：

```bash
npm install --cache /tmp/.npm
```
## 常见问题

- 右键菜单没有显示？重启 Zotero 并确认插件已启用
- 模型调用失败？检查 API Base/Key/Model，并用“测试 API”按钮验证
- 名称/图标没更新？先卸载旧版本，再安装新 XPI

## 许可

AGPL-3.0-or-later 