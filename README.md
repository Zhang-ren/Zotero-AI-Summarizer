# Zotero AI Summarizer

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

## Icons

Replace these files with your PNG icons:
- `addon/content/icons/favicon.png` (96×96)
- `addon/content/icons/favicon@0.5x.png` (48×48)

Then rebuild and reinstall the XPI.

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

## Release to GitHub

Two options:

### A) Manual GitHub Release

1. Commit your code and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release"
   git branch -M main
   git remote add origin git@github.com:<your>/<repo>.git
   git push -u origin main
   ```
2. Build XPI:
   ```bash
   npm run build
   ```
3. On GitHub → Releases → Draft a new release
   - Tag e.g. `v0.1.0` (match `package.json` version)
   - Upload `.scaffold/build/zotero-ai-summarizer.xpi`
   - Publish the release

### B) Using `zotero-plugin` Tooling (Optional)

This template ships with `zotero-plugin` scripts. You can integrate CI and auto-release (see the tool repo for details). For most users, manual releases (option A) are simpler.

## Troubleshooting

- No right-click menu? Restart Zotero and ensure the plugin is enabled
- API errors? Check API Base, Key, and Model; try the "Test API" button
- Old icons or names still showing? Uninstall the old plugin first, then install the new XPI

## License

AGPL-3.0-or-later 