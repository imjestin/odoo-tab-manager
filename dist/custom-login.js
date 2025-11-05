/// <reference types="chrome"/>
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const enabledToggle = document.getElementById('customLoginEnabled');
    const expandToggle = document.getElementById('customLoginToggle');
    const content = document.getElementById('customLoginContent');
    const arrow = document.getElementById('customLoginArrow');
    const userInput = document.getElementById('customUser');
    const passInput = document.getElementById('customPass');
    const saveBtn = document.getElementById('saveCustom');
    console.log('Custom login elements:', {
        enabledToggle: !!enabledToggle,
        expandToggle: !!expandToggle,
        content: !!content,
        arrow: !!arrow,
        userInput: !!userInput,
        passInput: !!passInput,
        saveBtn: !!saveBtn
    });
    if (!enabledToggle || !expandToggle || !content || !arrow || !userInput || !passInput || !saveBtn) {
        console.error('❌ Custom login elements not found');
        return;
    }
    // Helper function to refresh content script
    function refreshContentScript() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshQuickLogin' }).then(() => {
                    console.log('✅ Refresh message sent successfully');
                }).catch((error) => {
                    console.log('⚠️ Content script not available:', error);
                });
            }
        });
    }
    // Load saved state
    chrome.storage.local.get(['customLogin', 'customLoginEnabled'], (result) => {
        console.log('Loaded storage:', result);
        // Set toggle state
        if (result.customLoginEnabled) {
            enabledToggle.checked = true;
            expandToggle.classList.remove('hidden');
        }
        // Load credentials if exist
        if (result.customLogin) {
            userInput.value = result.customLogin.user || '';
            passInput.value = result.customLogin.pass || '';
        }
    });
    // Handle enable/disable toggle
    // Handle enable/disable toggle
    enabledToggle.addEventListener('change', () => {
        const isEnabled = enabledToggle.checked;
        console.log('Toggle changed to:', isEnabled);
        if (isEnabled) {
            // Show arrow button
            expandToggle.classList.remove('hidden');
            // Save enabled state and refresh immediately
            chrome.storage.local.set({ customLoginEnabled: isEnabled }, () => {
                console.log('Saved customLoginEnabled:', isEnabled);
                // Refresh content script immediately after saving
                setTimeout(() => {
                    refreshContentScript();
                }, 100);
            });
        }
        else {
            // Hide arrow and content
            expandToggle.classList.add('hidden');
            content.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            // Save disabled state and refresh
            chrome.storage.local.set({ customLoginEnabled: false }, () => {
                console.log('Saved customLoginEnabled: false');
                // Refresh to remove custom button
                setTimeout(() => {
                    refreshContentScript();
                }, 100);
            });
        }
    });
    // Handle expand/collapse toggle
    expandToggle.addEventListener('click', () => {
        const isHidden = content.classList.contains('hidden');
        console.log('Arrow clicked, content hidden:', isHidden);
        if (isHidden) {
            content.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
        }
        else {
            content.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
        }
    });
    // Save button
    saveBtn.addEventListener('click', () => {
        const user = userInput.value.trim();
        const pass = passInput.value.trim();
        console.log('Save clicked, user:', user);
        if (!user || !pass) {
            alert('Please enter both username and password');
            return;
        }
        // Save to chrome.storage
        chrome.storage.local.set({
            customLogin: { user, pass },
            customLoginEnabled: true
        }, () => {
            console.log('Saved credentials and enabled custom login');
            // Visual feedback
            const originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Saved!
        </span>
      `;
            saveBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
            setTimeout(() => {
                saveBtn.innerHTML = originalHTML;
                saveBtn.style.background = '';
            }, 2000);
            // Enable toggle if not already
            enabledToggle.checked = true;
            expandToggle.classList.remove('hidden');
            // Refresh content script after a short delay
            setTimeout(() => {
                refreshContentScript();
            }, 100);
        });
    });
    console.log('✅ Custom login initialized');
});
