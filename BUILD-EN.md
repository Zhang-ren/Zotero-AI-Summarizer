# Build and Installation Guide

This document provides detailed instructions on how to compile Zotero AI Summarizer from source code and generate an installable plugin package.

## System Requirements

- **Node.js**: Version >= 18.0.0 (LTS recommended, tested with v20.19.6)
- **npm**: Version >= 9.0.0 (comes with Node.js)
- **Git**: For cloning the repository
- **Zotero**: Version 7.x (for testing the installation)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Zhang-ren/Zotero-AI-Summarizer.git
cd Zotero-AI-Summarizer
```

### 2. Install Dependencies

```bash
npm install
```

**Notes:**

- If you encounter permission issues on macOS, use a temporary cache:
  ```bash
  npm install --cache /tmp/.npm
  ```
- You may see some warnings during installation (like EBADENGINE), which don't affect the build process

### 3. Build the Project

```bash
npm run build
```

After successful compilation, you'll see output similar to:

```
✔ Build finished in 0.093 s.
```

### 4. Locate the Installation Package

After building, the XPI file will be generated at:

```
.scaffold/build/zotero-ai-summarizer.xpi
```

The file size is approximately 65KB.

### 5. Verify Build (Optional)

Run the verification script to confirm the build succeeded:

```bash
./verify-build.sh
```

This script checks:

- Node.js and npm versions
- Whether dependencies are installed
- Whether the XPI file exists and is intact
- Whether the XPI file contains required files

## Installing in Zotero

### Method 1: Direct Installation

1. Open Zotero 7
2. Go to **Tools** → **Add-ons**
3. Click the gear icon ⚙️ in the top right
4. Select **Install Add-on From File…**
5. Browse and select `.scaffold/build/zotero-ai-summarizer.xpi`
6. Click **Open** and restart Zotero

### Method 2: Drag and Drop

1. Open Zotero 7
2. Go to **Tools** → **Add-ons**
3. Drag and drop the `zotero-ai-summarizer.xpi` file into the add-ons window
4. Restart Zotero

## Development Mode

### Hot Reload Development

For code modifications with live testing:

```bash
npm start
```

This command will:

- Monitor source code changes
- Automatically recompile
- Auto-reload the plugin (requires Zotero configuration)

### Code Linting

Check code format and syntax:

```bash
npm run lint:check
```

Auto-fix code formatting issues:

```bash
npm run lint:fix
```

### Run Tests

```bash
npm test
```

## Project Structure

```
Zotero-AI-Summarizer/
├── src/                    # Source code directory
│   ├── index.ts           # Entry point
│   ├── modules/           # Feature modules
│   └── utils/             # Utility functions
├── addon/                 # Plugin resources
│   ├── manifest.json      # Plugin manifest
│   ├── prefs.js          # Default preferences
│   ├── bootstrap.js      # Bootstrap script
│   ├── content/          # Content scripts
│   └── locale/           # Internationalization
├── .scaffold/build/       # Build output (not committed to Git)
│   └── zotero-ai-summarizer.xpi  # Generated package
├── package.json           # Project configuration
├── tsconfig.json         # TypeScript configuration
└── zotero-plugin.config.ts  # Plugin build configuration
```

## Configuration

### Modify Plugin Information

Edit the configuration in `package.json`:

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

### Modify Default Settings

Edit `addon/prefs.js` to change plugin defaults:

```javascript
pref("apiBase", "https://api.openai.com/v1");
pref("apiKey", "");
pref("model", "gpt-4o-mini");
pref("temperature", 0.2);
pref("maxChars", 800000);
```

## Troubleshooting

### Issue: npm install fails

**Solution:**

1. Verify Node.js version: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Remove `node_modules` and `package-lock.json`, then reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: TypeScript errors during compilation

**Solution:**

1. Ensure all dependencies are correctly installed
2. Check TypeScript version: `npx tsc --version`
3. Run `npm run lint:fix` to auto-fix formatting issues

### Issue: Generated XPI file cannot be installed

**Solution:**

1. Confirm Zotero version is 7.x
2. Check if XPI file is corrupted:
   ```bash
   unzip -t .scaffold/build/zotero-ai-summarizer.xpi
   ```
3. Rebuild:
   ```bash
   rm -rf .scaffold/build
   npm run build
   ```

### Issue: Build warning "Pref key 'temperature' is a number..."

**Explanation:** This is a non-critical warning that doesn't affect plugin functionality. To eliminate it:

1. Change `temperature` type to string
2. Or accept the warning (recommended, as float type is more semantically correct)

### Issue: EBADENGINE warning

**Explanation:** This indicates `zotero-plugin-scaffold` requires Node.js >= 22.8.0, but the current version is lower. This won't prevent compilation; the project works fine with Node.js 18+.

**Optional solutions:**

- Upgrade to Node.js 22+ to eliminate the warning
- Or ignore the warning and continue with the current version

## Release Process

### Creating a Release

1. Update version number in `package.json`:

   ```bash
   npm version patch  # or minor/major
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Commit and push:

   ```bash
   git add .
   git commit -m "Release v0.1.x"
   git push
   ```

4. Create a Release on GitHub:
   - Go to the repository's **Releases** page
   - Click **Draft a new release**
   - Enter version tag (e.g., `v0.1.0`)
   - Upload `.scaffold/build/zotero-ai-summarizer.xpi`
   - Publish the release

### Automated Release (using GitHub Actions)

If CI/CD is configured, use:

```bash
npm run release
```

## Verify Installation

After installing the plugin, verify success:

1. **Check Plugin List**:
   - Open **Tools** → **Add-ons** in Zotero
   - Confirm "Zotero AI Summarizer" appears in the list
   - Status should be "Enabled"

2. **Check Context Menu**:
   - Select an item in your Zotero library
   - Right-click to see if "AI Summarize to Child Note" option appears

3. **Check Preferences**:
   - Open **Edit** → **Preferences** → **Extensions**
   - You should see an "AI-Summarizer" tab

## Tech Stack

- **TypeScript**: Primary programming language
- **zotero-plugin-toolkit**: Zotero plugin development toolkit
- **marked**: Markdown rendering library
- **ESLint + Prettier**: Code quality tools
- **esbuild**: Fast JavaScript bundler

## Getting Help

If you encounter issues:

1. Check [Issues](https://github.com/Zhang-ren/Zotero-AI-Summarizer/issues)
2. Read [README.md](./README.md)
3. Submit a new Issue

## License

This project is licensed under AGPL-3.0-or-later. See [LICENSE](./LICENSE) file for details.
