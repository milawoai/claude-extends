// Popup script
document.addEventListener('DOMContentLoaded', init);

function init() {
  loadSettings();
  loadStats();
  setupEventListeners();
}

// Load current settings
function loadSettings() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (response.success) {
      const { enabled, features } = response.data;
      
      document.getElementById('enabled').checked = enabled;
      document.getElementById('autoSave').checked = features.autoSave;
      document.getElementById('shortcuts').checked = features.shortcuts;
      document.getElementById('enhancedUI').checked = features.enhancedUI;
    }
  });
}

// Load statistics
function loadStats() {
  chrome.storage.local.get(['conversations'], (data) => {
    const conversations = data.conversations || [];
    const statsDiv = document.getElementById('stats');
    
    chrome.storage.local.getBytesInUse(null, (bytes) => {
      const mbUsed = (bytes / 1024 / 1024).toFixed(2);
      
      statsDiv.innerHTML = `
        <p><strong>Saved Conversations:</strong> ${conversations.length}</p>
        <p><strong>Storage Used:</strong> ${mbUsed} MB</p>
      `;
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  // Settings checkboxes
  document.getElementById('enabled').addEventListener('change', updateSettings);
  document.getElementById('autoSave').addEventListener('change', updateSettings);
  document.getElementById('shortcuts').addEventListener('change', updateSettings);
  document.getElementById('enhancedUI').addEventListener('change', updateSettings);
  
  // Action buttons
  document.getElementById('saveBtn').addEventListener('click', saveConversation);
  document.getElementById('exportBtn').addEventListener('click', exportConversations);
  document.getElementById('clearBtn').addEventListener('click', clearData);
}

// Update settings
function updateSettings() {
  const settings = {
    enabled: document.getElementById('enabled').checked,
    features: {
      autoSave: document.getElementById('autoSave').checked,
      shortcuts: document.getElementById('shortcuts').checked,
      enhancedUI: document.getElementById('enhancedUI').checked
    }
  };
  
  chrome.runtime.sendMessage({ 
    action: 'updateSettings', 
    data: settings 
  }, (response) => {
    if (response.success) {
      showNotification('Settings updated!');
    }
  });
}

// Save current conversation
function saveConversation() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'saveConversation' }, (response) => {
        if (response && response.success) {
          showNotification('Conversation saved!');
          loadStats();
        } else {
          showNotification('Failed to save conversation', 'error');
        }
      });
    }
  });
}

// Export conversations
function exportConversations() {
  chrome.storage.local.get(['conversations'], (data) => {
    const conversations = data.conversations || [];
    
    if (conversations.length === 0) {
      showNotification('No conversations to export', 'warning');
      return;
    }
    
    const json = JSON.stringify(conversations, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `claude-conversations-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    showNotification('Conversations exported!');
  });
}

// Clear saved data
function clearData() {
  if (confirm('Are you sure you want to clear all saved data?')) {
    chrome.storage.local.clear(() => {
      showNotification('Data cleared!');
      loadStats();
    });
  }
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  if (type === 'error') {
    notification.style.background = '#ef4444';
  } else if (type === 'warning') {
    notification.style.background = '#f59e0b';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
