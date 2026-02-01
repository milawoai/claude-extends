// Content script for Claude AI pages
console.log('Claude extension content script loaded');

// Initialize extension
(function init() {
  console.log('Initializing Claude extension tools...');
  
  // Wait for page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

function setup() {
  // Get settings
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (response && response.success) {
      const settings = response.data;
      
      if (settings.enabled) {
        if (settings.features.enhancedUI) {
          enhanceUI();
        }
        
        if (settings.features.shortcuts) {
          addShortcuts();
        }
        
        if (settings.features.autoSave) {
          setupAutoSave();
        }
      }
    } else {
      console.error('Failed to get settings');
    }
  });
  
  // Add custom tools
  addCustomTools();
}

// Add custom tool buttons
function addCustomTools() {
  const toolBar = createToolBar();
  
  // Try to insert toolbar near the chat interface
  const chatContainer = document.querySelector('[class*="chat"]') || document.body;
  if (chatContainer) {
    chatContainer.insertAdjacentElement('beforebegin', toolBar);
  }
}

// Create toolbar element
function createToolBar() {
  const toolbar = document.createElement('div');
  toolbar.id = 'claude-extension-toolbar';
  toolbar.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    display: flex;
    gap: 8px;
  `;
  
  // Save button
  const saveBtn = createButton('💾', 'Save conversation', handleSaveConversation);
  
  // Export button
  const exportBtn = createButton('📤', 'Export to file', handleExport);
  
  // Settings button
  const settingsBtn = createButton('⚙️', 'Settings', handleSettings);
  
  toolbar.appendChild(saveBtn);
  toolbar.appendChild(exportBtn);
  toolbar.appendChild(settingsBtn);
  
  return toolbar;
}

// Create button helper
function createButton(icon, title, onClick) {
  const button = document.createElement('button');
  button.textContent = icon;
  button.title = title;
  button.style.cssText = `
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  `;
  
  button.addEventListener('mouseover', () => {
    button.style.background = '#f0f0f0';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.background = 'white';
  });
  
  button.addEventListener('click', onClick);
  
  return button;
}

// Handle save conversation
function handleSaveConversation() {
  const conversation = extractConversation();
  
  chrome.runtime.sendMessage({
    action: 'saveConversation',
    data: conversation
  }, (response) => {
    if (response.success) {
      showNotification('Conversation saved!', 'success');
    } else {
      showNotification('Failed to save conversation', 'error');
    }
  });
}

// Handle export
function handleExport() {
  const conversation = extractConversation();
  const json = JSON.stringify(conversation, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `claude-conversation-${Date.now()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification('Conversation exported!', 'success');
}

// Handle settings
function handleSettings() {
  chrome.runtime.sendMessage({ action: 'openSettings' });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 60px;
    right: 10px;
    z-index: 10001;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Setup auto-save
let autoSaveInterval = null;

function setupAutoSave() {
  // Clear existing interval if any
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  // Auto-save every 5 minutes
  autoSaveInterval = setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response && response.success && response.data.features.autoSave) {
        handleSaveConversation();
      } else if (response && response.success && !response.data.features.autoSave) {
        // If auto-save is disabled, clear the interval
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
          autoSaveInterval = null;
        }
      }
    });
  }, 5 * 60 * 1000);
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveConversation') {
    handleSaveConversation();
  }
  sendResponse({ success: true });
});

// Utility Functions
/**
 * Extract conversation from the page
 * @returns {Object} Conversation data
 */
function extractConversation() {
  const messages = [];
  
  // Try to find message elements (adjust selectors based on actual Claude UI)
  const messageElements = document.querySelectorAll('[class*="message"], [data-message]');
  
  messageElements.forEach((element) => {
    const role = element.getAttribute('data-role') || 
                 (element.classList.contains('user') ? 'user' : 'assistant');
    const content = element.textContent.trim();
    
    if (content) {
      messages.push({
        role,
        content
      });
    }
  });
  
  return {
    title: document.title || 'Claude Conversation',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    messages
  };
}

/**
 * Enhance the UI with custom features
 */
function enhanceUI() {
  // Add custom CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    #claude-extension-toolbar button:hover {
      transform: scale(1.05);
    }
    
    #claude-extension-toolbar button:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
  
  console.log('UI enhanced');
}

/**
 * Add keyboard shortcuts
 */
function addShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const event = new CustomEvent('claude-extension-save');
      document.dispatchEvent(event);
    }
    
    // Ctrl+E or Cmd+E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      const event = new CustomEvent('claude-extension-export');
      document.dispatchEvent(event);
    }
  });
  
  console.log('Keyboard shortcuts added');
}
