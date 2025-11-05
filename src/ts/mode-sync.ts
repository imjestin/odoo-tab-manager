/// <reference types="chrome"/>

// Type definitions
type OdooMode = 'developer' | 'consultant' | 'user' | 'news';

// Mode display mappings
const modeDisplay: Record<OdooMode, string> = {
  developer: 'Developer',
  consultant: 'Consultant', 
  user: 'User',
  news: 'News'
};

const badgeText: Record<OdooMode, string> = {
  developer: 'DEV',
  consultant: 'CONS',
  user: 'USER', 
  news: 'NEWS'
};

// Common mode synchronization class
class ModeSync {
  private currentMode: OdooMode = 'developer';
  private listeners: Array<(mode: OdooMode) => void> = [];

  constructor() {
    this.loadMode();
    this.setupStorageListener();
  }

  // Load mode from localStorage
  private loadMode(): OdooMode {
    const savedMode = localStorage.getItem('odooMode') as OdooMode;
    this.currentMode = savedMode || 'developer';
    return this.currentMode;
  }

  // Get current mode
  getCurrentMode(): OdooMode {
    return this.currentMode;
  }

  // Set mode and notify all listeners
  setMode(mode: OdooMode): void {
    console.log('ModeSync: Setting mode to:', mode);
    this.currentMode = mode;
    localStorage.setItem('odooMode', mode);
    this.updateBrowserAction(mode);
    this.notifyListeners(mode);
  }

  // Add listener for mode changes
  addListener(callback: (mode: OdooMode) => void): void {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback: (mode: OdooMode) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners(mode: OdooMode): void {
    console.log('ModeSync: Notifying listeners, mode:', mode);
    this.listeners.forEach(listener => {
      try {
        listener(mode);
      } catch (error) {
        console.error('ModeSync: Error in listener:', error);
      }
    });
  }

  // Listen for storage changes from other tabs/windows
  private setupStorageListener(): void {
    window.addEventListener('storage', (e) => {
      if (e.key === 'odooMode' && e.newValue) {
        const newMode = e.newValue as OdooMode;
        console.log('ModeSync: Storage changed, new mode:', newMode);
        this.currentMode = newMode;
        this.updateBrowserAction(newMode);
        this.notifyListeners(newMode);
      }
    });
  }

  // Update browser action
  private updateBrowserAction(mode: OdooMode): void {
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
  getModeDisplay(mode: OdooMode): string {
    return modeDisplay[mode] || 'Developer';
  }

  // Get badge text
  getBadgeText(mode: OdooMode): string {
    return badgeText[mode] || 'DEV';
  }
}

// Create global instance
const modeSync = new ModeSync();

// Export for use in other files
if (typeof window !== 'undefined') {
  (window as any).modeSync = modeSync;
}
