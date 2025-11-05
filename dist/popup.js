"use strict";
/// <reference types="chrome"/>
class PopupApp {
    constructor() {
        this.currentMode = 'developer';
        this.currentPageInfo = null;
        // Mode display mappings
        this.modeDisplay = {
            developer: 'Developer',
            consultant: 'Consultant',
            user: 'User',
            news: 'News'
        };
        this.badgeText = {
            developer: 'DEV',
            consultant: 'CON',
            user: 'USER',
            news: 'NEWS'
        };
        // Initialize DOM elements
        this.currentModeEl = document.getElementById('currentMode');
        this.badgeTextEl = document.getElementById('badgeText');
        this.devBtn = document.getElementById('devBtn');
        this.consultantBtn = document.getElementById('consultantBtn');
        this.userBtn = document.getElementById('userBtn');
        this.newsBtn = document.getElementById('newsBtn');
        this.addBookmarkBtn = document.getElementById('addBookmarkBtn');
        this.bookmarksList = document.getElementById('bookmarksList');
        this.odooStatusEl = document.getElementById('odooStatus');
        this.odooIndicatorEl = document.getElementById('odooIndicator');
        this.odooStatusTextEl = document.getElementById('odooStatusText');
        this.odooMetadataEl = document.getElementById('odooMetadata');
        this.odooGeneratorEl = document.getElementById('odooGenerator');
        this.odooGeneratorValueEl = document.getElementById('odooGeneratorValue');
        this.odooDescriptionEl = document.getElementById('odooDescription');
        this.odooDescriptionValueEl = document.getElementById('odooDescriptionValue');
        this.odooKeywordsEl = document.getElementById('odooKeywords');
        this.odooKeywordsValueEl = document.getElementById('odooKeywordsValue');
        this.odooAuthorEl = document.getElementById('odooAuthor');
        this.odooAuthorValueEl = document.getElementById('odooAuthorValue');
        this.odooScriptsEl = document.getElementById('odooScripts');
        this.odooScriptsValueEl = document.getElementById('odooScriptsValue');
        this.odooLinksEl = document.getElementById('odooLinks');
        this.odooLinksValueEl = document.getElementById('odooLinksValue');
        // Load current mode
        this.currentMode = localStorage.getItem('odooMode') || 'developer';
        // Initialize
        this.init();
    }
    init() {
        console.log('PopupApp initializing...');
        console.log('Current mode from localStorage:', this.currentMode);
        this.setupEventListeners();
        this.setupMessageListener();
        this.updateUI();
        this.loadBookmarks();
        this.updateBrowserAction(this.currentMode);
        this.checkOdooStatus();
        this.debugElements();
    }
    setupEventListeners() {
        // Mode buttons
        this.devBtn?.addEventListener('click', () => this.switchMode('developer'));
        this.consultantBtn?.addEventListener('click', () => this.switchMode('consultant'));
        this.userBtn?.addEventListener('click', () => this.switchMode('user'));
        this.newsBtn?.addEventListener('click', () => this.switchMode('news'));
        // Bookmark button
        this.addBookmarkBtn?.addEventListener('click', () => this.addCurrentBookmark());
    }
    setupMessageListener() {
        // Use common mode sync instead of message passing
        if (window.modeSync) {
            window.modeSync.addListener((mode) => {
                console.log('Received mode change from modeSync:', mode);
                this.currentMode = mode;
                this.updateUI();
                this.loadBookmarks();
            });
        }
    }
    updateBrowserAction(mode) {
        if (chrome.action) {
            const modeDisplay = this.modeDisplay[mode] || 'Developer';
            const badgeText = this.badgeText[mode] || 'DEV';
            // Update title
            chrome.action.setTitle({
                title: `New Tab - ${modeDisplay} Mode`
            });
            // Update badge
            chrome.action.setBadgeText({
                text: badgeText
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#714B67'
            });
        }
    }
    updateUI() {
        console.log('Updating UI for mode:', this.currentMode);
        // Update mode display
        if (this.currentModeEl) {
            const modeText = this.modeDisplay[this.currentMode] || 'Developer';
            console.log('Setting mode display to:', modeText);
            this.currentModeEl.textContent = modeText;
        }
        else {
            console.error('currentModeEl not found');
        }
        if (this.badgeTextEl) {
            const badgeText = this.badgeText[this.currentMode] || 'DEV';
            console.log('Setting badge text to:', badgeText);
            this.badgeTextEl.textContent = badgeText;
        }
        else {
            console.error('badgeTextEl not found');
        }
        // Update browser action
        if (chrome.action) {
            chrome.action.setTitle({
                title: `New Tab - ${this.modeDisplay[this.currentMode]} Mode`
            });
            chrome.action.setBadgeText({
                text: this.badgeText[this.currentMode] || 'DEV'
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#714B67'
            });
        }
        // Update button states
        this.updateButtonStates();
    }
    updateButtonStates() {
        const buttons = [this.devBtn, this.consultantBtn, this.userBtn, this.newsBtn];
        const modes = ['developer', 'consultant', 'user', 'news'];
        buttons.forEach((btn, index) => {
            if (btn) {
                if (modes[index] === this.currentMode) {
                    // Active button - blue icon color
                    btn.className = 'mode-btn p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors';
                }
                else {
                    // Inactive button - gray icon color
                    btn.className = 'mode-btn p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors';
                }
            }
        });
    }
    switchMode(mode) {
        console.log('Switching mode to:', mode);
        // Use common mode sync
        if (window.modeSync) {
            window.modeSync.setMode(mode);
        }
        else {
            // Fallback if modeSync not available
            this.currentMode = mode;
            localStorage.setItem('odooMode', mode);
            this.updateUI();
            this.loadBookmarks();
            this.updateBrowserAction(mode);
        }
    }
    loadBookmarks() {
        if (!this.bookmarksList)
            return;
        const bookmarks = this.getBookmarks();
        this.bookmarksList.innerHTML = '';
        if (bookmarks.length === 0) {
            this.bookmarksList.innerHTML = '<p class="text-xs text-slate-500 dark:text-gray-500 text-center py-2">No bookmarks for this mode</p>';
            return;
        }
        bookmarks.forEach((bookmark, index) => {
            const bookmarkEl = this.createBookmarkElement(bookmark, index);
            this.bookmarksList.appendChild(bookmarkEl);
        });
    }
    createBookmarkElement(bookmark, index) {
        const bookmarkEl = document.createElement('div');
        bookmarkEl.className = 'bg-gray-50 dark:bg-gray-100 rounded-lg p-2 mb-2 hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-300';
        const domain = new URL(bookmark.url).hostname;
        const title = bookmark.title || domain;
        const timeAgo = this.getTimeAgo(bookmark.timestamp);
        // Get favicon URL
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        bookmarkEl.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0 mr-4">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-300 rounded-lg flex items-center justify-center">
            <img src="${faviconUrl}" alt="${domain}" class="w-8 h-8 rounded" onerror="this.style.display='none'">
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <a href="${bookmark.url}" target="_blank" class="text-sm font-medium text-gray-900 dark:text-gray-800 hover:text-blue-600 dark:hover:text-blue-700 truncate block transition-colors" title="${title}">
                ${domain}
              </a>
              <p class="text-xs text-gray-500 dark:text-gray-600 truncate">${timeAgo}</p>
            </div>
            <button class="delete-bookmark ml-3 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" data-index="${index}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
        // Add delete event listener
        const deleteBtn = bookmarkEl.querySelector('.delete-bookmark');
        deleteBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteBookmark(index);
        });
        return bookmarkEl;
    }
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return 'just now';
        if (minutes < 60)
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24)
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem(`bookmarks_${this.currentMode}`) || '[]');
        }
        catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    }
    saveBookmarks(bookmarks) {
        localStorage.setItem(`bookmarks_${this.currentMode}`, JSON.stringify(bookmarks));
    }
    deleteBookmark(index) {
        const bookmarks = this.getBookmarks();
        bookmarks.splice(index, 1);
        this.saveBookmarks(bookmarks);
        this.loadBookmarks();
    }
    addCurrentBookmark() {
        console.log('addCurrentBookmark called');
        this.showMessage('Getting current page...', 'info');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (chrome.runtime.lastError) {
                console.error('Chrome runtime error:', chrome.runtime.lastError);
                this.showMessage('Error accessing tabs. Please try again.', 'error');
                return;
            }
            if (!tabs || tabs.length === 0) {
                this.showMessage('No active tab found. Please navigate to a website and try again.', 'error');
                return;
            }
            const activeTab = tabs[0];
            // Try to inject content script and get page info
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['content.js']
            }, () => {
                chrome.tabs.sendMessage(activeTab.id, { action: 'getCurrentPageInfo' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message to content script:', chrome.runtime.lastError);
                        // Fallback: use tab information directly
                        if (activeTab.url && activeTab.title) {
                            const fallbackInfo = {
                                url: activeTab.url,
                                title: activeTab.title,
                                timestamp: Date.now()
                            };
                            this.saveBookmark(fallbackInfo);
                        }
                        else {
                            this.showMessage('Cannot access this page. Please try on a regular website.', 'error');
                        }
                        return;
                    }
                    if (!response) {
                        // Fallback: use tab information directly
                        if (activeTab.url && activeTab.title) {
                            const fallbackInfo = {
                                url: activeTab.url,
                                title: activeTab.title,
                                timestamp: Date.now()
                            };
                            this.saveBookmark(fallbackInfo);
                        }
                        else {
                            this.showMessage('No response from page. Please try again.', 'error');
                        }
                        return;
                    }
                    this.saveBookmark(response);
                });
            });
        });
    }
    saveBookmark(pageInfo) {
        const bookmark = {
            url: pageInfo.url,
            title: pageInfo.title,
            timestamp: pageInfo.timestamp || Date.now()
        };
        const bookmarks = this.getBookmarks();
        // Check if bookmark already exists
        const exists = bookmarks.some(b => b.url === bookmark.url);
        if (exists) {
            this.showMessage('Bookmark already exists for this mode', 'warning');
            return;
        }
        bookmarks.push(bookmark);
        this.saveBookmarks(bookmarks);
        this.loadBookmarks();
        this.showMessage('Bookmark added successfully!', 'success');
    }
    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.getElementById('bookmarkMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        // Create new message
        const messageEl = document.createElement('div');
        messageEl.id = 'bookmarkMessage';
        messageEl.className = `text-sm p-3 rounded-lg mb-3 border ${type === 'error' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
            type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'}`;
        messageEl.textContent = message;
        // Insert after the add button
        if (this.addBookmarkBtn) {
            this.addBookmarkBtn.parentNode?.insertBefore(messageEl, this.addBookmarkBtn.nextSibling);
        }
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
    checkOdooStatus() {
        if (!this.odooStatusEl || !this.odooIndicatorEl || !this.odooStatusTextEl) {
            console.log('Odoo status elements not found');
            return;
        }
        // Hide the status section initially - only show if Odoo is detected
        this.odooStatusEl.classList.add('hidden');
        // Get current tab info
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                console.log('Checking Odoo status for tab:', tabs[0].url);
                // For InterFlag.com, use basic detection immediately since we know it's Odoo
                if (tabs[0].url && tabs[0].url.includes('interflag.com')) {
                    console.log('InterFlag.com detected, using known Odoo status');
                    this.updateOdooStatus(true, 'Odoo website detected!', {
                        generator: 'Odoo',
                        description: 'InterFlag.com - Known Odoo website',
                        scripts: ['web.assets_frontend_lazy.min.js'],
                        links: ['/web/assets/', '/web/static/']
                    });
                    return;
                }
                // First try to get page info from content script
                console.log('Sending message to content script for tab:', tabs[0].id);
                // Use a promise-based approach for better error handling
                const sendMessagePromise = new Promise((resolve, reject) => {
                    if (!tabs[0].id) {
                        reject(new Error('No tab ID available'));
                        return;
                    }
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'getCurrentPageInfo' }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        }
                        else {
                            resolve(response);
                        }
                    });
                });
                sendMessagePromise.then((response) => {
                    console.log('Content script response received:', response);
                    console.log('Response type:', typeof response);
                    console.log('Response keys:', response ? Object.keys(response) : 'null');
                    console.log('isOdoo property:', response?.isOdoo);
                    console.log('isOdoo type:', typeof response?.isOdoo);
                    if (response && response.isOdoo !== undefined) {
                        console.log('Valid response from content script, updating UI');
                        this.updateOdooStatus(response.isOdoo, response.isOdoo ? 'Odoo website detected!' : 'Not an Odoo website', response.odooMetadata);
                        // Also try to update the badge via background script (optional)
                        chrome.runtime.sendMessage({
                            action: 'updateBadge',
                            tabId: tabs[0].id,
                            isOdoo: response.isOdoo
                        }).catch(error => {
                            console.log('Could not update badge via background script:', error);
                        });
                    }
                    else {
                        console.log('Invalid response from content script, trying basic detection');
                        console.log('Response isOdoo undefined, response:', response);
                        this.performBasicOdooDetection(tabs[0].url || '', tabs[0].title || '');
                    }
                }).catch((error) => {
                    console.log('Content script not available, trying basic detection:', error);
                    this.performBasicOdooDetection(tabs[0].url || '', tabs[0].title || '');
                });
                // Set a timeout in case content script doesn't respond
                setTimeout(() => {
                    if (this.odooStatusTextEl?.textContent === 'Checking...') {
                        console.log('Content script timeout, using basic detection');
                        this.performBasicOdooDetection(tabs[0].url || '', tabs[0].title || '');
                    }
                }, 2000);
            }
            else {
                this.updateOdooStatus(false, 'No active tab');
            }
        });
    }
    performBasicOdooDetection(url, title) {
        console.log('Performing basic Odoo detection for:', url);
        // Try to inject content script manually if it's not responding
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['dist/content.js']
                }).then(() => {
                    console.log('Content script injected manually');
                    // Wait a bit for the script to run, then try again
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'getCurrentPageInfo' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.log('Still no response after manual injection, using basic detection');
                                const isOdoo = this.isOdooWebsite(url, title);
                                console.log('Basic detection result:', isOdoo);
                                this.updateOdooStatus(isOdoo, isOdoo ? 'Odoo website detected!' : 'Not an Odoo website');
                            }
                            else if (response && response.isOdoo !== undefined) {
                                console.log('Got response after manual injection:', response);
                                this.updateOdooStatus(response.isOdoo, response.isOdoo ? 'Odoo website detected!' : 'Not an Odoo website', response.odooMetadata);
                            }
                        });
                    }, 1000);
                }).catch(error => {
                    console.log('Could not inject content script manually:', error);
                    const isOdoo = this.isOdooWebsite(url, title);
                    console.log('Basic detection result:', isOdoo);
                    this.updateOdooStatus(isOdoo, isOdoo ? 'Odoo website detected!' : 'Not an Odoo website');
                });
            }
        });
    }
    isOdooWebsite(url, title) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            const titleLower = title.toLowerCase();
            console.log('Basic detection for:', hostname, 'title:', titleLower);
            // 1. FIRST PRIORITY: Check for Odoo generator meta tag (most reliable)
            // Note: This is a basic check - the content script will do the actual meta tag detection
            // But we can check for known Odoo sites that have this meta tag
            const knownOdooSites = [
                'odoo.com',
                'odoo.sh',
                'interflag.com',
                'runbot181.odoo.com',
                'runbot.odoo.com'
            ];
            const isKnownOdooSite = knownOdooSites.some(site => hostname.includes(site));
            if (isKnownOdooSite) {
                console.log('✓ Known Odoo site detected:', hostname);
                return true;
            }
            // 2. SECOND PRIORITY: Check for common Odoo indicators
            const odooIndicators = [
                // Direct Odoo domains
                hostname.includes('odoo.com'),
                hostname.includes('odoo.sh'),
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
            ];
            console.log('Odoo indicators check:', odooIndicators);
            const hasBasicIndicators = odooIndicators.some(indicator => indicator);
            console.log('Has basic indicators:', hasBasicIndicators);
            // For InterFlag specifically, we know it's Odoo from our curl test
            if (hostname.includes('interflag.com')) {
                console.log('InterFlag.com detected - known Odoo website');
                return true;
            }
            // Only return true if we have strong Odoo indicators
            if (hasBasicIndicators) {
                console.log('Basic indicators found, likely Odoo website');
                return true;
            }
            console.log('No Odoo indicators found, not an Odoo website');
            return false;
        }
        catch (error) {
            console.error('Error in basic Odoo detection:', error);
            return false;
        }
    }
    updateOdooStatus(isOdoo, message, metadata) {
        if (!this.odooIndicatorEl || !this.odooStatusTextEl || !this.odooStatusEl)
            return;
        if (isOdoo) {
            // Show the Odoo status section for Odoo websites
            this.odooStatusEl.classList.remove('hidden');
            this.odooIndicatorEl.className = 'w-3 h-3 rounded-full bg-green-500';
            this.odooStatusTextEl.textContent = message;
            // Show metadata if available
            if (metadata && this.odooMetadataEl) {
                this.displayOdooMetadata(metadata);
            }
        }
        else {
            // Hide the entire Odoo status section for non-Odoo websites
            this.odooStatusEl.classList.add('hidden');
        }
    }
    displayOdooMetadata(metadata) {
        if (!this.odooMetadataEl)
            return;
        // Show the metadata section
        this.odooMetadataEl.classList.remove('hidden');
        // Display generator meta tag (most important indicator)
        if (metadata.generator && this.odooGeneratorEl && this.odooGeneratorValueEl) {
            this.odooGeneratorEl.classList.remove('hidden');
            this.odooGeneratorValueEl.textContent = metadata.generator;
        }
        else if (this.odooGeneratorEl) {
            this.odooGeneratorEl.classList.add('hidden');
        }
        // Display description
        if (metadata.description && this.odooDescriptionEl && this.odooDescriptionValueEl) {
            this.odooDescriptionEl.classList.remove('hidden');
            this.odooDescriptionValueEl.textContent = metadata.description;
        }
        else if (this.odooDescriptionEl) {
            this.odooDescriptionEl.classList.add('hidden');
        }
        // Display keywords
        if (metadata.keywords && this.odooKeywordsEl && this.odooKeywordsValueEl) {
            this.odooKeywordsEl.classList.remove('hidden');
            this.odooKeywordsValueEl.textContent = metadata.keywords;
        }
        else if (this.odooKeywordsEl) {
            this.odooKeywordsEl.classList.add('hidden');
        }
        // Display author
        if (metadata.author && this.odooAuthorEl && this.odooAuthorValueEl) {
            this.odooAuthorEl.classList.remove('hidden');
            this.odooAuthorValueEl.textContent = metadata.author;
        }
        else if (this.odooAuthorEl) {
            this.odooAuthorEl.classList.add('hidden');
        }
        // Display Odoo scripts
        if (metadata.scripts && metadata.scripts.length > 0 && this.odooScriptsEl && this.odooScriptsValueEl) {
            this.odooScriptsEl.classList.remove('hidden');
            this.odooScriptsValueEl.textContent = metadata.scripts.slice(0, 3).join(', ') + (metadata.scripts.length > 3 ? '...' : '');
        }
        else if (this.odooScriptsEl) {
            this.odooScriptsEl.classList.add('hidden');
        }
        // Display Odoo links
        if (metadata.links && metadata.links.length > 0 && this.odooLinksEl && this.odooLinksValueEl) {
            this.odooLinksEl.classList.remove('hidden');
            this.odooLinksValueEl.textContent = metadata.links.slice(0, 3).join(', ') + (metadata.links.length > 3 ? '...' : '');
        }
        else if (this.odooLinksEl) {
            this.odooLinksEl.classList.add('hidden');
        }
    }
    debugElements() {
        console.log('Elements found:', {
            addBookmarkBtn: !!this.addBookmarkBtn,
            bookmarksList: !!this.bookmarksList,
            currentModeEl: !!this.currentModeEl,
            badgeTextEl: !!this.badgeTextEl
        });
    }
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupApp();
});
