// Background service worker for Claude extension
console.log('Claude extension background service worker loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Initialize default settings
  chrome.storage.sync.set({
    enabled: true,
    features: {
      autoSave: true,
      shortcuts: true,
      enhancedUI: true
    }
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.action) {
    case 'saveConversation':
      handleSaveConversation(request.data)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response
      
    case 'getSettings':
      chrome.storage.sync.get(['enabled', 'features'], (data) => {
        sendResponse({ success: true, data });
      });
      return true;
      
    case 'updateSettings':
      chrome.storage.sync.set(request.data, () => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle conversation saving
async function handleSaveConversation(data) {
  const timestamp = new Date().toISOString();
  const conversationId = `conv_${Date.now()}`;
  
  const conversation = {
    id: conversationId,
    timestamp,
    ...data
  };
  
  // Store in local storage
  const stored = await chrome.storage.local.get(['conversations']);
  stored.conversations = stored.conversations || [];
  stored.conversations.push(conversation);
  
  await chrome.storage.local.set({ conversations: stored.conversations });
  
  return { id: conversationId, timestamp };
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  switch (command) {
    case 'save-conversation':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'saveConversation' });
        }
      });
      break;
  }
});
