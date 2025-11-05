// Background script for Odoo detection and badge management

// Function to detect if a website is Odoo-based
function isOdooWebsite(url, title) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Check for common Odoo indicators
    const odooIndicators = [
      // Direct Odoo domains
      'odoo.com',
      'odoo.sh',
      'odoo.community',
      'odoo.enterprise',
      
      // Subdomain patterns
      hostname.includes('.odoo.com'),
      hostname.includes('.odoo.sh'),
      
      // Title indicators
      titleLower.includes('odoo'),
      titleLower.includes('erp'),
      titleLower.includes('crm'),
      
      // URL path indicators
      urlObj.pathname.includes('/web/'),
      urlObj.pathname.includes('/odoo/'),
      urlObj.searchParams.has('db'),
      urlObj.searchParams.has('debug'),
      
      // Check for Odoo-specific meta tags or scripts
      // This will be handled by content script
    ];
    
    return odooIndicators.some(indicator => {
      if (typeof indicator === 'string') {
        return hostname.includes(indicator) || titleLower.includes(indicator);
      }
      return indicator;
    });
  } catch (error) {
    console.error('Error detecting Odoo website:', error);
    return false;
  }
}

// Function to update the extension badge
function updateBadge(tabId, isOdoo) {
  console.log('Updating badge for tab:', tabId, 'isOdoo:', isOdoo);
  
  if (isOdoo) {
    console.log('Setting green badge for Odoo website');
    chrome.action.setBadgeText({
      text: '●',
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#10b981', // Green color
      tabId: tabId
    });
    chrome.action.setTitle({
      title: 'Odoo Website Detected - New Tab Extension',
      tabId: tabId
    });
  } else {
    console.log('Clearing badge for non-Odoo website');
    chrome.action.setBadgeText({
      text: '',
      tabId: tabId
    });
    chrome.action.setTitle({
      title: 'New Tab Extension',
      tabId: tabId
    });
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Basic detection from URL and title
    const isOdoo = isOdooWebsite(tab.url, tab.title);
    updateBadge(tabId, isOdoo);
    
    // If basic detection didn't find Odoo, inject content script for deeper detection
    if (!isOdoo) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(error => {
        // Ignore errors for restricted pages (chrome://, etc.)
        console.log('Could not inject content script:', error);
      });
    }
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request, 'from tab:', sender.tab?.id);
  
  if (request.action === 'odooDetection') {
    console.log('Processing odooDetection:', request.isOdoo, 'for tab:', sender.tab?.id);
    updateBadge(sender.tab.id, request.isOdoo);
    sendResponse({ success: true });
  } else if (request.action === 'updateBadge') {
    console.log('Processing updateBadge from popup:', request.isOdoo, 'for tab:', request.tabId);
    updateBadge(request.tabId, request.isOdoo);
    sendResponse({ success: true });
  } else if (request.action === 'odooDetected') {
    console.log('Processing odooDetected for tab:', sender.tab?.id);
    updateBadge(sender.tab.id, true);
    sendResponse({ success: true });
  } else if (request.action === 'notOdoo') {
    console.log('Processing notOdoo for tab:', sender.tab?.id);
    updateBadge(sender.tab.id, false);
    sendResponse({ success: true });
  }
});

// Update badge when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.url) {
    const isOdoo = isOdooWebsite(tab.url, tab.title);
    updateBadge(tab.id, isOdoo);
  }
});

// Initialize badge for current tab when extension starts
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0] && tabs[0].url) {
    const isOdoo = isOdooWebsite(tabs[0].url, tabs[0].title);
    updateBadge(tabs[0].id, isOdoo);
  }
});