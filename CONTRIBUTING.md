# Contributing to Claude Extension Tools

## How to Add New Features

This guide explains how to extend the Claude Extension Tools with new functionality.

## Architecture Overview

The extension consists of three main components:

1. **Background Service Worker** (`src/background.js`)
   - Handles storage operations
   - Manages settings
   - Processes messages from content scripts

2. **Content Script** (`src/content.js`)
   - Runs on Claude AI pages
   - Provides UI enhancements
   - Handles user interactions

3. **Popup UI** (`src/popup/`)
   - Extension settings interface
   - Quick actions menu
   - Statistics display

## Adding a New Feature

### Step 1: Add UI Controls (if needed)

Edit `src/popup/popup.html` to add new settings or buttons:

```html
<div class="setting-item">
  <label>
    <input type="checkbox" id="myNewFeature" checked>
    <span>Enable My New Feature</span>
  </label>
</div>
```

### Step 2: Handle Settings

Update `src/popup/popup.js` to save/load the new setting:

```javascript
// In loadSettings()
document.getElementById('myNewFeature').checked = features.myNewFeature;

// Add event listener in setupEventListeners()
document.getElementById('myNewFeature').addEventListener('change', updateSettings);
```

### Step 3: Implement Feature Logic

Add your feature implementation in `src/content.js`:

```javascript
function myNewFeature() {
  // Your feature code here
  console.log('My new feature is running!');
}

// Call it from setup() when feature is enabled
if (settings.features.myNewFeature) {
  myNewFeature();
}
```

### Step 4: Add Background Processing (if needed)

If your feature needs background processing, add it to `src/background.js`:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'myNewAction':
      handleMyNewAction(request.data)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

async function handleMyNewAction(data) {
  // Process the action
  return { status: 'completed' };
}
```

## Example: Adding a "Copy Conversation" Feature

Here's a complete example of adding a new feature:

### 1. Add Button to Toolbar

In `src/content.js`, modify `createToolBar()`:

```javascript
// Add copy button
const copyBtn = createButton('📋', 'Copy to clipboard', handleCopy);
toolbar.appendChild(copyBtn);
```

### 2. Implement Copy Handler

In `src/content.js`:

```javascript
function handleCopy() {
  const conversation = extractConversation();
  const text = formatAsText(conversation);
  
  navigator.clipboard.writeText(text)
    .then(() => showNotification('Copied to clipboard!', 'success'))
    .catch(() => showNotification('Failed to copy', 'error'));
}

function formatAsText(conversation) {
  let text = `${conversation.title}\n\n`;
  conversation.messages.forEach(msg => {
    text += `[${msg.role.toUpperCase()}]\n${msg.content}\n\n`;
  });
  return text;
}
```

### 3. Test Your Feature

1. Build the extension: `npm run build`
2. Reload the extension in your browser
3. Navigate to Claude AI
4. Test your new feature

## Best Practices

- **Error Handling**: Always add proper error handling for async operations
- **User Feedback**: Show notifications to inform users about actions
- **Settings**: Make features configurable when possible
- **Performance**: Avoid heavy operations on the main thread
- **Privacy**: Never send user data to external servers without permission

## Debugging

### Console Logs

- Content script logs appear in the page console
- Background script logs appear in the extension's service worker console
- Popup script logs appear in the popup's developer tools

### Chrome DevTools

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Inspect views: service worker" for background script
4. Right-click popup and select "Inspect" for popup script
5. Open regular DevTools (F12) for content script

## File Structure

```
src/
├── background.js       # Background service worker
├── content.js          # Content script (main logic)
├── popup/
│   ├── popup.html     # Popup UI structure
│   ├── popup.css      # Popup styles
│   └── popup.js       # Popup logic
└── utils/
    └── helpers.js      # Utility functions (optional)
```

## Testing Checklist

Before submitting changes:

- [ ] Extension loads without errors
- [ ] Build script runs successfully
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] No console errors
- [ ] Settings are saved correctly
- [ ] Code follows existing style

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Web Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
