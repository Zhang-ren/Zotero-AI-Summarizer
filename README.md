# Zotero AI Summarizer

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

[简体中文 | Chinese README](./README-zhCN.md)

A Zotero 7 plugin that generates structured summaries for your selected items using an LLM and saves the result as a child note. It supports rich Markdown-to-HTML rendering (via `marked`) so your bold, lists, headings, code blocks, and tables appear correctly in Zotero notes.

## Features

- AI summarization to child notes (right-click → "AI Summarize to Child Note")
- Configurable API endpoint, API key, model, temperature, prompt template
- Built-in "Test API" button in preferences to quickly verify connectivity
- Markdown-to-HTML rendering for notes (tables, lists, headings, links, code blocks, inline code)
- Multi-item support: run on multiple selected regular items
- Simple, privacy-first: your API endpoint is user-configured

## Install

1. Download the latest `.xpi` from Releases (or build locally; see below)
2. Open Zotero → Tools → Add-ons → gear icon → Install Add-on From File…
3. Select `zotero-ai-summarizer.xpi` and restart Zotero

## Quick Start

- In Zotero middle pane, select one or more items (regular items, not notes/attachments)
- Right-click → "AI Summarize to Child Note"
- The plugin will read attachments (PDF/HTML, up to a size cap) and generate a structured summary saved under each item as a child note

## Preferences

Zotero → Preferences → Extensions → AI-Summarizer

- API Base: your OpenAI-compatible Chat Completions endpoint (e.g. https://api.openai.com/v1)
- API Key: your key
- Model: e.g. `gpt-4o-mini` (or your server-side model)
- Temperature: default 0.2
- Max Chars: the maximum characters to extract from attachments
- Prompt Template: use variables `{title}`, `{abstract}`, `{content}`
- Test API: quickly validates connectivity and credentials

### Default Values

- Runtime defaults can be edited in the Preferences pane
- Initial defaults (post-install) are set in `addon/prefs.js`:
  - `pref("prompt", "...")`
  - `pref("temperature", 0.2)`
- Fallback default prompt (if preference is empty) is in `src/modules/aiSummary.ts` (`defaultTpl`)


## Build from Source

Requirements: Node.js (LTS), Git, Zotero 7

```bash
# install deps
npm install

# dev hot reload
npm start

# production build (outputs XPI under .scaffold/build)
npm run build
```

The XPI will be created at:

```
.scaffold/build/zotero-ai-summarizer.xpi
```

If you encounter permission issues on macOS when running `npm install`, you can use a temp cache:

```bash
npm install --cache /tmp/.npm
```
## Troubleshooting

- No right-click menu? Restart Zotero and ensure the plugin is enabled
- API errors? Check API Base, Key, and Model; try the "Test API" button
- Old icons or names still showing? Uninstall the old plugin first, then install the new XPI

## License

AGPL-3.0-or-later 