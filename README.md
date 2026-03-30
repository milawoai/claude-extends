# Claude Extension Tools

一个为 Claude AI 提供扩展功能的浏览器插件工具集。

A browser extension toolkit that provides extended functionality for Claude AI.

## Features

- 💾 **Conversation Saving**: Automatically save your Claude conversations
- 📤 **Export Functionality**: Export conversations to JSON, Markdown, or plain text
- ⌨️ **Keyboard Shortcuts**: Quick actions with keyboard shortcuts
- 🎨 **Enhanced UI**: Improved interface with custom tools
- ⚙️ **Customizable Settings**: Configure the extension to your needs

## Installation

### Development Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/milawoai/claude-extends.git
   cd claude-extends
   ```

2. Install dependencies (if any):
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in your browser:
   - **Chrome/Edge**:
     1. Open `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select the `dist` folder
   
   - **Firefox**:
     1. Open `about:debugging#/runtime/this-firefox`
     2. Click "Load Temporary Add-on"
     3. Select the `manifest.json` file from the `dist` folder

## Project Structure

```
claude-extends/
├── manifest.json           # Extension manifest file
├── package.json           # Node.js package configuration
├── src/
│   ├── background.js      # Background service worker
│   ├── content.js         # Content script for Claude pages
│   ├── popup/             # Extension popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── utils/             # Utility functions
│       └── helpers.js
├── icons/                 # Extension icons
├── scripts/               # Build scripts
│   └── build.js
└── README.md
```

## Usage

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save current conversation
- `Ctrl/Cmd + E`: Export conversation

### Toolbar Actions

Click the extension icon in your browser toolbar to access:
- Save current conversation
- Export conversations
- Clear saved data
- Configure settings

### Settings

- **Enable Extension**: Turn the extension on/off
- **Auto-save Conversations**: Automatically save conversations every 5 minutes
- **Keyboard Shortcuts**: Enable keyboard shortcuts
- **Enhanced UI**: Enable UI enhancements

## Development

### Building

```bash
npm run build
```

### File Structure

- `src/background.js`: Handles background tasks, storage, and message passing
- `src/content.js`: Injected into Claude pages, adds toolbar and features
- `src/utils/helpers.js`: Utility functions for conversation extraction and formatting
- `src/popup/`: Extension popup interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Notes

This is an independent project and is not officially affiliated with Anthropic or Claude AI.
