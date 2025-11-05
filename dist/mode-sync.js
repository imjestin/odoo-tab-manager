"use strict";
/// <reference types="chrome"/>
// Mode display mappings
const modeDisplay = {
    developer: 'Developer',
    consultant: 'Consultant',
    user: 'User',
    news: 'News'
};
const badgeText = {
    developer: 'DEV',
    consultant: 'CONS',
    user: 'USER',
    news: 'NEWS'
};
// Common mode synchronization class
class ModeSync {
    constructor() {
        this.currentMode = 'developer';
        this.listeners = [];
        this.loadMode();
        this.setupStorageListener();
    }
    // Load mode from localStorage
    loadMode() {
        const savedMode = localStorage.getItem('odooMode');
        this.currentMode = savedMode || 'developer';
        return this.currentMode;
    }
    // Get current mode
    getCurrentMode() {
        return this.currentMode;
    }
    // Set mode and notify all listeners
    setMode(mode) {
        console.log('ModeSync: Setting mode to:', mode);
        this.currentMode = mode;
        localStorage.setItem('odooMode', mode);
        this.updateBrowserAction(mode);
        this.notifyListeners(mode);
    }
    // Add listener for mode changes
    addListener(callback) {
        this.listeners.push(callback);
    }
    // Remove listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }
    // Notify all listeners
    notifyListeners(mode) {
        console.log('ModeSync: Notifying listeners, mode:', mode);
        this.listeners.forEach(listener => {
            try {
                listener(mode);
            }
            catch (error) {
                console.error('ModeSync: Error in listener:', error);
            }
        });
    }
    // Listen for storage changes from other tabs/windows
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'odooMode' && e.newValue) {
                const newMode = e.newValue;
                console.log('ModeSync: Storage changed, new mode:', newMode);
                this.currentMode = newMode;
                this.updateBrowserAction(newMode);
                this.notifyListeners(newMode);
            }
        });
    }
    // Update browser action
    updateBrowserAction(mode) {
        if (chrome.action) {
            const display = modeDisplay[mode] || 'Developer';
            const badge = badgeText[mode] || 'DEV';
            // Update title
            chrome.action.setTitle({
                title: `New Tab - ${display} Mode`
            });
            // Update badge
            chrome.action.setBadgeText({
                text: badge
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#714B67'
            });
        }
    }
    // Get mode display text
    getModeDisplay(mode) {
        return modeDisplay[mode] || 'Developer';
    }
    // Get badge text
    getBadgeText(mode) {
        return badgeText[mode] || 'DEV';
    }
}
// Create global instance
const modeSync = new ModeSync();
// Export for use in other files
if (typeof window !== 'undefined') {
    window.modeSync = modeSync;
}
