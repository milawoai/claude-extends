// Utility helper functions for Claude extension

/**
 * Extract conversation from the page
 * @returns {Object} Conversation data
 */
export function extractConversation() {
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
        content,
        timestamp: new Date().toISOString()
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
export function enhanceUI() {
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
export function addShortcuts() {
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

/**
 * Format conversation for export
 * @param {Object} conversation - Conversation data
 * @param {string} format - Export format (json, markdown, txt)
 * @returns {string} Formatted content
 */
export function formatConversation(conversation, format = 'json') {
  switch (format) {
    case 'markdown':
      return formatAsMarkdown(conversation);
    case 'txt':
      return formatAsText(conversation);
    case 'json':
    default:
      return JSON.stringify(conversation, null, 2);
  }
}

/**
 * Format conversation as Markdown
 * @param {Object} conversation
 * @returns {string}
 */
function formatAsMarkdown(conversation) {
  let md = `# ${conversation.title}\n\n`;
  md += `**Date:** ${new Date(conversation.timestamp).toLocaleString()}\n`;
  md += `**URL:** ${conversation.url}\n\n`;
  md += `---\n\n`;
  
  conversation.messages.forEach((msg, index) => {
    md += `## ${msg.role === 'user' ? 'User' : 'Assistant'}\n\n`;
    md += `${msg.content}\n\n`;
    if (index < conversation.messages.length - 1) {
      md += `---\n\n`;
    }
  });
  
  return md;
}

/**
 * Format conversation as plain text
 * @param {Object} conversation
 * @returns {string}
 */
function formatAsText(conversation) {
  let txt = `${conversation.title}\n`;
  txt += `Date: ${new Date(conversation.timestamp).toLocaleString()}\n`;
  txt += `URL: ${conversation.url}\n`;
  txt += `\n${'='.repeat(80)}\n\n`;
  
  conversation.messages.forEach((msg, index) => {
    txt += `[${msg.role.toUpperCase()}]\n`;
    txt += `${msg.content}\n\n`;
    if (index < conversation.messages.length - 1) {
      txt += `${'-'.repeat(80)}\n\n`;
    }
  });
  
  return txt;
}

/**
 * Sanitize filename
 * @param {string} filename
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Get storage usage
 * @returns {Promise<Object>}
 */
export async function getStorageUsage() {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse(null, (bytes) => {
      const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default
      resolve({
        used: bytes,
        quota,
        percentage: (bytes / quota) * 100
      });
    });
  });
}
