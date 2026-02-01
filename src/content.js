// Content script for Claude AI pages
console.log('Claude extension content script loaded');

// Import utilities
import { extractConversation, enhanceUI, addShortcuts } from './utils/helpers.js';

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
    if (response.success) {
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
function setupAutoSave() {
  // Auto-save every 5 minutes
  setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response.success && response.data.features.autoSave) {
        handleSaveConversation();
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
