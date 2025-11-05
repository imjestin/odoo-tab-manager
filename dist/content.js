"use strict";
/// <reference types="chrome"/>
// Odoo website detection - GENERATOR META TAG FIRST VERSION
function detectOdooWebsite() {
    // 1. FIRST PRIORITY: Check for Odoo generator meta tag (most reliable)
    const odooGeneratorMeta = document.querySelector('meta[name="generator"][content*="Odoo"]');
    if (odooGeneratorMeta) {
        return true;
    }
    // 2. SECOND PRIORITY: Check for Odoo global variables (very reliable)
    const hasOdooGlobal = !!window.odoo || !!window.Odoo;
    const hasOpenerpGlobal = !!window.openerp || !!window.OpenERP;
    if (hasOdooGlobal || hasOpenerpGlobal) {
        return true;
    }
    // Check for Odoo-specific CSS classes (very reliable)
    const odooClasses = [
        '.o_web_client',
        '.o_main',
        '.o_action_manager',
        '.o_view_manager',
        '.o_main_navbar',
        '.o_application',
        '.o_website',
        '.oe_website',
        '.oe_website_sale',
        '.oe_website_blog',
        '.oe_website_event',
        '.oe_website_crm',
        '.oe_website_livechat'
    ];
    for (const className of odooClasses) {
        const element = document.querySelector(className);
        if (element) {
            return true;
        }
    }
    // Check for Odoo-specific IDs (very reliable)
    const odooIds = [
        '#oe_main_menu_navbar',
        '#oe_systray',
        '#o_web_client',
        '#o_main',
        '#o_action_manager',
        '#o_view_manager',
        '#oe_website'
    ];
    for (const id of odooIds) {
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            return true;
        }
    }
    // Check for Odoo data attributes (very reliable)
    const odooDataAttributes = [
        '[data-oe-model]',
        '[data-oe-field]',
        '[data-oe-xpath]',
        '[data-oe-context]',
        '[data-oe-id]',
        '[data-oe-type]',
        '[data-oe-name]',
        '[data-oe-value]'
    ];
    for (const attr of odooDataAttributes) {
        const element = document.querySelector(attr);
        if (element) {
            return true;
        }
    }
    // Check for Odoo body classes
    if (document.body) {
        const bodyClasses = ['o_web_client', 'oe_website', 'o_website'];
        for (const className of bodyClasses) {
            if (document.body.classList.contains(className)) {
                return true;
            }
        }
    }
    return false;
}
// Function to check for Odoo metadata specifically
function checkOdooMetadata() {
    const metadata = {
        generator: null,
        description: null,
        keywords: null,
        author: null,
        robots: null,
        viewport: null,
        ogSiteName: null,
        ogDescription: null,
        customMeta: [],
        scripts: [],
        links: [],
        forms: [],
        images: [],
        iframes: []
    };
    // Check meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const name = meta.getAttribute('name');
        const property = meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name === 'generator' && content && content.toLowerCase().includes('odoo')) {
            metadata.generator = content;
        }
        if (name === 'description' && content && content.toLowerCase().includes('odoo')) {
            metadata.description = content;
        }
        if (name === 'keywords' && content && content.toLowerCase().includes('odoo')) {
            metadata.keywords = content;
        }
        if (name === 'author' && content && content.toLowerCase().includes('odoo')) {
            metadata.author = content;
        }
        if (name === 'robots' && content && content.toLowerCase().includes('odoo')) {
            metadata.robots = content;
        }
        if (name === 'viewport' && content && content.toLowerCase().includes('odoo')) {
            metadata.viewport = content;
        }
        if (property === 'og:site_name' && content && content.toLowerCase().includes('odoo')) {
            metadata.ogSiteName = content;
        }
        if (property === 'og:description' && content && content.toLowerCase().includes('odoo')) {
            metadata.ogDescription = content;
        }
        // Check for any custom meta tags with Odoo content
        if (content && content.toLowerCase().includes('odoo')) {
            metadata.customMeta.push({
                name: name,
                property: property,
                content: content
            });
        }
    });
    // Check scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.toLowerCase().includes('odoo')) {
            metadata.scripts.push(src);
        }
    });
    // Check links
    const links = document.querySelectorAll('link[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.toLowerCase().includes('odoo')) {
            metadata.links.push(href);
        }
    });
    // Check forms
    const forms = document.querySelectorAll('form[action]');
    forms.forEach(form => {
        const action = form.getAttribute('action');
        if (action && action.toLowerCase().includes('odoo')) {
            metadata.forms.push(action);
        }
    });
    // Check images
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.toLowerCase().includes('odoo')) {
            metadata.images.push(src);
        }
    });
    // Check iframes
    const iframes = document.querySelectorAll('iframe[src]');
    iframes.forEach(iframe => {
        const src = iframe.getAttribute('src');
        if (src && src.toLowerCase().includes('odoo')) {
            metadata.iframes.push(src);
        }
    });
    return metadata;
}
// Function to perform Odoo detection and send results
function performOdooDetection() {
    const isOdooWebsite = detectOdooWebsite();
    // Try to send Odoo detection result to background script (optional)
    chrome.runtime.sendMessage({
        action: 'odooDetection',
        isOdoo: isOdooWebsite,
        url: window.location.href,
        title: document.title || window.location.hostname
    }).catch(() => {
        // Background script not available
    });
}
// Content script loaded
// Perform detection immediately
performOdooDetection();
// Also perform detection after a delay to catch dynamically loaded content
setTimeout(performOdooDetection, 1000);
// Add a third check after 3 seconds for slow-loading sites
setTimeout(performOdooDetection, 3000);
// Create floating button for Odoo websites
function createFloatingButton() {
    // Check if document.body exists
    if (!document.body) {
        return;
    }
    // Check if button already exists
    if (document.getElementById('odoo-extension-floating-btn')) {
        return;
    }
    // Create floating button
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'odoo-extension-floating-btn';
    floatingBtn.innerHTML = `
    <div class="odoo-floating-button">
      <svg class="odoo-floating-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10H17M3 5H17M3 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <div class="odoo-floating-menu" id="odoo-floating-menu">
        <div class="odoo-menu-item" data-action="frontend">
          <span class="odoo-menu-text">Frontend</span>
        </div>
        <div class="odoo-menu-item" data-action="backend">
          <span class="odoo-menu-text">Backend</span>
        </div>
        <div class="odoo-menu-item" data-action="database">
          <span class="odoo-menu-text">Database Manager</span>
        </div>
        <div class="odoo-menu-divider"></div>
        <div class="odoo-menu-item" data-action="theme">
          <span class="odoo-menu-text">Theme</span>
        </div>
      </div>
    </div>
  `;
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
    #odoo-extension-floating-btn {
      position: fixed;
      bottom: 85px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', sans-serif;
    }
    
    .odoo-floating-button {
      position: relative;
      width: 56px;
      height: 56px;
      background: #ffffff;
      border-radius: 16px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(10px);
    }
    
  
    
    .odoo-floating-icon {
      width: 20px;
      height: 20px;
      color: #1f2937;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    
    
    .odoo-floating-menu {
      position: absolute;
      bottom: 68px;
      right: 0;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 6px;
      min-width: 220px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px) scale(0.96);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(20px);
    }
    
    .odoo-floating-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    
    .odoo-menu-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      color: #1f2937;
      font-size: 14px;
      font-weight: 500;
      margin: 1px 0;
      letter-spacing: -0.01em;
    }
    
    .odoo-menu-item:hover {
      background: #f9fafb;
      color: #111827;
    }
    
    .odoo-menu-item:active {
      background: #f3f4f6;
      transform: scale(0.98);
    }
    
    .odoo-menu-text {
      flex: 1;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    
    .odoo-menu-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 6px 8px;
      border: none;
    }
       
       /* Theme Tab Styles */
       #odoo-theme-tab {
         position: fixed;
         bottom: 0;
         left: 0;
         right: 0;
         background: white;
         border-top: 1px solid #e5e7eb;
         box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
         z-index: 1000000;
         transform: translateY(100%);
         transition: transform 0.3s ease;
         max-height: 50vh;
         overflow-y: auto;
       }
       
       #odoo-theme-tab.show {
         transform: translateY(0);
       }
       
       .odoo-theme-tab-container {
         padding: 20px;
       }
       
       .odoo-theme-tab-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 20px;
         padding-bottom: 15px;
         border-bottom: 1px solid #e5e7eb;
       }
       
       .odoo-theme-tab-title {
         font-size: 18px;
         font-weight: 600;
         color: #374151;
       }
       
       .odoo-theme-tab-close {
         background: none;
         border: none;
         font-size: 24px;
         color: #6b7280;
         cursor: pointer;
         padding: 5px;
         border-radius: 4px;
         transition: all 0.2s ease;
       }
       
       .odoo-theme-tab-close:hover {
         background: #f3f4f6;
         color: #374151;
       }
       
       .odoo-theme-capsule-group {
         display: flex;
         flex-wrap: wrap;
         gap: 10px;
         align-items: center;
       }
       
       .odoo-theme-radio {
         display: none;
       }
       
       .odoo-theme-capsule {
         display: inline-flex;
         align-items: center;
         gap: 10px;
         padding: 10px 20px;
         border-radius: 9999px;
         cursor: pointer;
         transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
         background: #ffffff;
         border: 2px solid #e5e7eb;
         color: #374151;
         font-size: 14px;
         font-weight: 500;
         white-space: nowrap;
         user-select: none;
         position: relative;
       }
       
       .odoo-theme-capsule:hover {
         background: #f9fafb;
         border-color: #d1d5db;
         transform: translateY(-1px);
         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
       }
       
       .odoo-theme-capsule:active {
         transform: translateY(0);
       }
       
       .odoo-theme-radio:checked + .odoo-theme-capsule {
         background: var(--theme-primary, #1f2937);
         border-color: var(--theme-primary, #1f2937);
         color: #ffffff;
         box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
         transform: translateY(-1px);
       }
       
       .odoo-theme-radio:checked + .odoo-theme-capsule:hover {
         background: var(--theme-primary-hover, #111827);
         border-color: var(--theme-primary-hover, #111827);
         box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
       }
       
       .odoo-theme-capsule-dot {
         width: 14px;
         height: 14px;
         border-radius: 50%;
         flex-shrink: 0;
         box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
         transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
       }
       
       .odoo-theme-radio:checked + .odoo-theme-capsule .odoo-theme-capsule-dot {
         box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
         transform: scale(1.1);
       }
       
       .odoo-theme-capsule-text {
         letter-spacing: -0.01em;
       }
       
       /* Dark mode support */
       @media (prefers-color-scheme: dark) {
         .odoo-floating-button {
           background: #1f2937;
           border-color: rgba(255, 255, 255, 0.1);
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
         }
         
         .odoo-floating-button:hover {
           border-color: rgba(255, 255, 255, 0.15);
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3);
         }
         
         .odoo-floating-icon {
           color: #f9fafb;
         }
         
         .odoo-floating-menu {
           background: #1f2937;
           border-color: rgba(255, 255, 255, 0.1);
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);
         }
         
         .odoo-menu-item {
           color: #f9fafb;
         }
         
         .odoo-menu-item:hover {
           background: #374151;
           color: #ffffff;
         }
         
         .odoo-menu-item:active {
           background: #4b5563;
         }
         
         .odoo-menu-divider {
           background: rgba(255, 255, 255, 0.1);
         }
         
         #odoo-theme-tab {
           background: #1f2937;
           border-top-color: #374151;
         }
         
         .odoo-theme-tab-title {
           color: #f9fafb;
         }
         
         .odoo-theme-tab-close {
           color: #9ca3af;
         }
         
         .odoo-theme-tab-close:hover {
           background: #374151;
           color: #f9fafb;
         }
         
         .odoo-theme-capsule {
           background: #374151;
           border-color: #4b5563;
           color: #f9fafb;
         }
         
         .odoo-theme-capsule:hover {
           background: #4b5563;
           border-color: #6b7280;
         }
         
         .odoo-theme-radio:checked + .odoo-theme-capsule {
           background: var(--theme-primary, #3b82f6);
           border-color: var(--theme-primary, #3b82f6);
           color: #ffffff;
         }
         
         .odoo-theme-radio:checked + .odoo-theme-capsule:hover {
           background: var(--theme-primary-hover, #2563eb);
           border-color: var(--theme-primary-hover, #2563eb);
         }
       }
  `;
    // Add styles and button to page
    document.head.appendChild(style);
    document.body.appendChild(floatingBtn);
    // Add theme tab at bottom of page
    const themeTab = document.createElement('div');
    themeTab.id = 'odoo-theme-tab';
    themeTab.innerHTML = `
    <div class="odoo-theme-tab-container">
      <div class="odoo-theme-tab-header">
        <span class="odoo-theme-tab-title">Theme Selection</span>
        <button class="odoo-theme-tab-close" id="odoo-theme-tab-close">×</button>
      </div>
      <div class="odoo-theme-tab-content">
        <div class="odoo-theme-capsule-group">
          <input type="radio" name="odoo-theme" value="phantom-black" id="theme-phantom-black" class="odoo-theme-radio">
          <label for="theme-phantom-black" class="odoo-theme-capsule" data-theme="phantom-black">
            <span class="odoo-theme-capsule-dot" style="background: #000000;"></span>
            <span class="odoo-theme-capsule-text">Phantom Black</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="crimson-red" id="theme-crimson-red" class="odoo-theme-radio">
          <label for="theme-crimson-red" class="odoo-theme-capsule" data-theme="crimson-red">
            <span class="odoo-theme-capsule-dot" style="background: #dc2626;"></span>
            <span class="odoo-theme-capsule-text">Crimson Red</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="rose-pink" id="theme-rose-pink" class="odoo-theme-radio">
          <label for="theme-rose-pink" class="odoo-theme-capsule" data-theme="rose-pink">
            <span class="odoo-theme-capsule-dot" style="background: #e91e63;"></span>
            <span class="odoo-theme-capsule-text">Rose Pink</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="royal-purple" id="theme-royal-purple" class="odoo-theme-radio">
          <label for="theme-royal-purple" class="odoo-theme-capsule" data-theme="royal-purple">
            <span class="odoo-theme-capsule-dot" style="background: #7c3aed;"></span>
            <span class="odoo-theme-capsule-text">Royal Purple</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="ocean-blue" id="theme-ocean-blue" class="odoo-theme-radio">
          <label for="theme-ocean-blue" class="odoo-theme-capsule" data-theme="ocean-blue">
            <span class="odoo-theme-capsule-dot" style="background: #1e40af;"></span>
            <span class="odoo-theme-capsule-text">Ocean Blue</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="emerald-green" id="theme-emerald-green" class="odoo-theme-radio">
          <label for="theme-emerald-green" class="odoo-theme-capsule" data-theme="emerald-green">
            <span class="odoo-theme-capsule-dot" style="background: #059669;"></span>
            <span class="odoo-theme-capsule-text">Emerald Green</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="sunset-orange" id="theme-sunset-orange" class="odoo-theme-radio">
          <label for="theme-sunset-orange" class="odoo-theme-capsule" data-theme="sunset-orange">
            <span class="odoo-theme-capsule-dot" style="background: #ea580c;"></span>
            <span class="odoo-theme-capsule-text">Sunset Orange</span>
          </label>
          
          <input type="radio" name="odoo-theme" value="gold-yellow" id="theme-gold-yellow" class="odoo-theme-radio">
          <label for="theme-gold-yellow" class="odoo-theme-capsule" data-theme="gold-yellow">
            <span class="odoo-theme-capsule-dot" style="background: #d97706;"></span>
            <span class="odoo-theme-capsule-text">Gold Yellow</span>
          </label>
        </div>
      </div>
    </div>
  `;
    document.body.appendChild(themeTab);
    const button = floatingBtn.querySelector('.odoo-floating-button');
    const menu = floatingBtn.querySelector('.odoo-floating-menu');
    const menuItems = floatingBtn.querySelectorAll('.odoo-menu-item');
    const themeTabElement = document.getElementById('odoo-theme-tab');
    const themeTabClose = document.getElementById('odoo-theme-tab-close');
    const themeRadios = themeTab.querySelectorAll('.odoo-theme-radio');
    const themeCapsules = themeTab.querySelectorAll('.odoo-theme-capsule');
    // Toggle menu on button click
    button?.addEventListener('click', (e) => {
        e.stopPropagation();
        menu?.classList.toggle('show');
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!floatingBtn.contains(target)) {
            menu?.classList.remove('show');
        }
    });
    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.getAttribute('data-action');
            if (action === 'theme') {
                // Show theme tab
                themeTabElement?.classList.add('show');
                menu?.classList.remove('show');
            }
            else if (action) {
                executeOdooAction(action);
                menu?.classList.remove('show');
            }
        });
    });
    // Close theme tab
    themeTabClose?.addEventListener('click', () => {
        themeTabElement?.classList.remove('show');
    });
    // Close theme tab when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (themeTabElement && !themeTabElement.contains(target) && !target.closest('[data-action="theme"]')) {
            themeTabElement.classList.remove('show');
        }
    });
    // Handle theme radio button changes
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const target = e.target;
            if (target.checked) {
                const theme = target.value;
                if (theme) {
                    applyOdooTheme(theme);
                    themeTabElement?.classList.remove('show');
                }
            }
        });
    });
    // Also handle capsule clicks for better UX
    themeCapsules.forEach(capsule => {
        capsule.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = capsule.getAttribute('data-theme');
            if (theme) {
                const radio = document.getElementById(`theme-${theme}`);
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
            }
        });
    });
    // Load saved theme
    const savedTheme = localStorage.getItem('odooTheme');
    if (savedTheme) {
        applyOdooTheme(savedTheme);
        // Check the radio button for the saved theme
        const savedRadio = document.getElementById(`theme-${savedTheme}`);
        if (savedRadio) {
            savedRadio.checked = true;
        }
    }
}
// Execute Odoo actions
function executeOdooAction(action) {
    const baseUrl = window.location.origin;
    let targetUrl = '';
    switch (action) {
        case 'frontend':
            targetUrl = `${baseUrl}/`;
            break;
        case 'database':
            targetUrl = `${baseUrl}/web/database/manager`;
            break;
        case 'backend':
            targetUrl = `${baseUrl}/web/`;
            break;
        case 'debug':
            targetUrl = `${baseUrl}/web?debug=1`;
            break;
        case 'session':
            targetUrl = `${baseUrl}/web/session/get_session_info`;
            break;
        case 'api':
            targetUrl = `${baseUrl}/web/dataset/call_kw`;
            break;
        case 'files':
            targetUrl = `${baseUrl}/web/static/src/web/static/src/js/core/boot.js`;
            break;
        default:
            return;
    }
    window.open(targetUrl, '_blank');
}
// Convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `${r}, ${g}, ${b}`;
    }
    return '113, 99, 158'; // fallback
}
// Apply Odoo theme
function applyOdooTheme(theme) {
    // Define color palettes
    const themes = {
        'phantom-black': {
            primary: '#000000',
            secondary: '#f3f4f6',
            accent: '#6b7280',
            text: '#111827',
            background: '#ffffff'
        },
        'crimson-red': {
            primary: '#dc2626',
            secondary: '#fef2f2',
            accent: '#fca5a5',
            text: '#991b1b',
            background: '#ffffff'
        },
        'rose-pink': {
            primary: '#e91e63',
            secondary: '#fce7f3',
            accent: '#f9a8d4',
            text: '#be185d',
            background: '#ffffff'
        },
        'royal-purple': {
            primary: '#7c3aed',
            secondary: '#f3f0ff',
            accent: '#c4b5fd',
            text: '#581c87',
            background: '#ffffff'
        },
        'ocean-blue': {
            primary: '#1e40af',
            secondary: '#eff6ff',
            accent: '#93c5fd',
            text: '#1e3a8a',
            background: '#ffffff'
        },
        'emerald-green': {
            primary: '#059669',
            secondary: '#ecfdf5',
            accent: '#6ee7b7',
            text: '#064e3b',
            background: '#ffffff'
        },
        'sunset-orange': {
            primary: '#ea580c',
            secondary: '#fff7ed',
            accent: '#fdba74',
            text: '#9a3412',
            background: '#ffffff'
        },
        'gold-yellow': {
            primary: '#d97706',
            secondary: '#fffbeb',
            accent: '#fcd34d',
            text: '#92400e',
            background: '#ffffff'
        }
    };
    const selectedTheme = themes[theme];
    if (!selectedTheme) {
        return;
    }
    // Save theme to localStorage
    localStorage.setItem('odooTheme', theme);
    // Remove existing theme styles
    const existingThemeStyle = document.getElementById('odoo-theme-styles');
    if (existingThemeStyle) {
        existingThemeStyle.remove();
    }
    // Create new theme styles
    const themeStyle = document.createElement('style');
    themeStyle.id = 'odoo-theme-styles';
    themeStyle.textContent = `
    /* Odoo Theme CSS Variables */
    :root {
      --theme-primary: ${selectedTheme.primary};
      --theme-primary-hover: ${selectedTheme.accent};
    }
    
    /* Odoo Theme Override */
    .o_main_navbar,
    .o_main_navbar .navbar-nav,
    .o_main_navbar .navbar-brand,
    .o_main_navbar .navbar-text {
      background-color: ${selectedTheme.primary} !important;
      color: white !important;
    }
    
    .o_main_navbar .navbar-nav .nav-link,
    .o_main_navbar .navbar-nav .nav-link:hover,
    .o_main_navbar .navbar-nav .nav-link:focus {
      color: white !important;
    }
    
    .o_main_navbar .dropdown-menu {
      background-color: ${selectedTheme.secondary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    .o_main_navbar .dropdown-item:hover {
      background-color: ${selectedTheme.accent} !important;
    }
    
    .o_main_navbar .o_menu_sections .o_nav_entry,
    .o_main_navbar .o_menu_sections .dropdown-toggle {
      background: ${selectedTheme.primary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    .o_main_navbar .o_menu_sections .o_nav_entry:hover,
    .o_main_navbar .o_menu_sections .dropdown-toggle:hover {
      background: ${selectedTheme.accent} !important;
    }
    
    .btn-primary,
    .o_btn_primary,
    .btn-primary:hover,
    .text-bg-primary,
    .text-bg-primary:hover,
    .o_btn_primary:hover,
    .tab.selected.text-bg-primary,
    .tab.text-bg-primary.selected {
      background-color: ${selectedTheme.primary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    .btn-primary:focus,
    .o_btn_primary:focus,
    .text-bg-primary:focus,
    .tab.selected.text-bg-primary:focus,
    .tab.text-bg-primary.selected:focus {
      box-shadow: 0 0 0 0.2rem ${selectedTheme.accent}40 !important;
    }
    
    /* Active button states */
    .btn-check:checked + .btn,
    :not(.btn-check) + .btn:active,
    .btn:first-child:active,
    .btn.active,
    .btn.show {
      color: white !important;
      background-color: ${selectedTheme.primary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    /* Checked form inputs */
    .form-check-input:checked,
    .form-check-input:checked:focus {
      background-color: ${selectedTheme.primary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    /* Table info styling */
    .table-info {
      --table-color: ${selectedTheme.text} !important;
      --table-bg: ${selectedTheme.secondary} !important;
      --table-border-color: ${selectedTheme.secondary} !important;
      --table-striped-bg: ${selectedTheme.secondary} !important;
      --table-striped-color: ${selectedTheme.text} !important;
      --table-active-bg: ${selectedTheme.primary} !important;
      --table-active-color: white !important;
      --table-hover-bg: ${selectedTheme.secondary} !important;
      --table-hover-color: ${selectedTheme.text} !important;
      color: var(--table-color) !important;
      border-color: var(--table-border-color) !important;
    }
    
    /* ERP Extension buttons */
    .erp_extension_cp_buttons button:hover {
      background-color: ${selectedTheme.secondary} !important;
      border: 1px solid ${selectedTheme.primary} !important;
      transform: translateY(-1px) !important;
      transition: all .2s !important;
    }
    
    .erp_extension_cp_buttons button:hover svg {
      fill: ${selectedTheme.primary} !important;
    }
    
    /* Button hover states */
    .btn:hover {
      color: white !important;
      background-color: ${selectedTheme.primary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    /* Outline primary buttons */
    .btn-outline-primary {
      --btn-color: ${selectedTheme.primary} !important;
      --btn-border-color: ${selectedTheme.primary} !important;
      --btn-hover-color: white !important;
      --btn-hover-bg: ${selectedTheme.primary} !important;
      --btn-hover-border-color: ${selectedTheme.primary} !important;
      --btn-focus-shadow-rgb: ${hexToRgb(selectedTheme.primary)} !important;
      --btn-active-color: white !important;
      --btn-active-bg: ${selectedTheme.primary} !important;
      --btn-active-border-color: ${selectedTheme.primary} !important;
      --btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125) !important;
      --btn-disabled-color: ${selectedTheme.primary} !important;
      --btn-disabled-bg: transparent !important;
      --btn-disabled-border-color: ${selectedTheme.primary} !important;
      --gradient: none !important;
    }
    
    /* Link buttons */
    .btn-link {
      --btn-font-weight: 400 !important;
      --btn-color: ${selectedTheme.primary} !important;
      --btn-bg: transparent !important;
      --btn-border-color: transparent !important;
      --btn-hover-color: ${selectedTheme.primary} !important;
      --btn-hover-border-color: transparent !important;
      --btn-active-color: ${selectedTheme.primary} !important;
      --btn-active-border-color: transparent !important;
      --btn-disabled-color: #6c757d !important;
      --btn-disabled-border-color: transparent !important;
      --btn-box-shadow: 0 0 0 #000 !important;
      --btn-focus-shadow-rgb: ${hexToRgb(selectedTheme.primary)} !important;
      text-decoration: none !important;
    }
    
    /* General button styling */
    .btn {
      --btn-focus-box-shadow: 0 0 0 0.25rem rgba(${hexToRgb(selectedTheme.primary)}, 0.5) !important;
    }
    
    /* Mail discuss sidebar channel commands */
    .o-mail-DiscussSidebar-item:hover .o-mail-DiscussSidebarChannel-commands .btn-group .btn:hover {
      border-color: ${selectedTheme.primary} !important;
      background-color: ${selectedTheme.secondary} !important;
    }
    
    .o_web_client .o_main_content {
      background-color: ${selectedTheme.background} !important;
    }
    
    .o_form_view .o_form_statusbar,
    .o_form_view .o_form_statusbar .o_statusbar_status {
      background-color: ${selectedTheme.secondary} !important;
      border-color: ${selectedTheme.primary} !important;
    }
    
    .o_list_view .o_list_table thead th {
      background-color: ${selectedTheme.secondary} !important;
      color: ${selectedTheme.text} !important;
    }
    
    .o_kanban_view .o_kanban_group {
      background-color: ${selectedTheme.secondary} !important;
    }
    
    .o_kanban_view .o_kanban_group .o_kanban_group_title {
      color: ${selectedTheme.text} !important;
    }
    
    .o_field_widget .o_input,
    .o_field_widget input,
    .o_field_widget textarea,
    .o_field_widget select {
      border-color: ${selectedTheme.accent} !important;
    }
    
    .o_field_widget .o_input:focus,
    .o_field_widget input:focus,
    .o_field_widget textarea:focus,
    .o_field_widget select:focus {
      border-color: ${selectedTheme.primary} !important;
      box-shadow: 0 0 0 0.2rem ${selectedTheme.accent}40 !important;
    }
    
    .o_web_client .o_main_content .o_action_manager {
      background-color: ${selectedTheme.background} !important;
    }
    
    .o_web_client .o_main_content .o_view_manager {
      background-color: ${selectedTheme.background} !important;
    }
    
    /* Sidebar and navigation */
    .o_main_navbar .o_menu_systray,
    .o_main_navbar .o_menu_systray .o_mail_systray_item {
      background-color: ${selectedTheme.primary} !important;
    }
    
    /* Footer links */
    .o_cc5 a:not(.btn),
    .o_footer a:not(.btn),
    .o_cc5 .btn-link,
    .o_footer .btn-link,
    .o_colored_level .o_cc5 a:not(.btn),
    .o_colored_level .o_cc5 .btn-link {
      color: ${selectedTheme.primary} !important;
    }
    
    /* DateTime picker styling */
    .o_datetime_picker .o_select_start:before,
    .o_datetime_picker .o_select_end:before {
      background: ${selectedTheme.secondary} !important;
    }
    
    .o_datetime_picker .o_current:before,
    .o_datetime_picker .o_highlighted:before,
    .o_datetime_picker .o_select_start:before,
    .o_datetime_picker .o_select_end:before {
      box-shadow: inset 0 0 0 1px ${selectedTheme.primary} !important;
    }
    
    /* Calendar and other views */
    .o_calendar_view .o_calendar_widget {
      background-color: ${selectedTheme.background} !important;
    }
    
    .o_calendar_view .fc-toolbar {
      background-color: ${selectedTheme.secondary} !important;
    }
    
    /* Charts and graphs */
    .o_graph_renderer,
    .o_pivot_view {
      background-color: ${selectedTheme.background} !important;
    }
  `;
    // Inject theme styles
    document.head.appendChild(themeStyle);
    // Update radio button selection
    const radioButtons = document.querySelectorAll('input[name="odoo-theme"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    const selectedRadio = document.getElementById(`theme-${theme}`);
    if (selectedRadio) {
        selectedRadio.checked = true;
    }
    // Show success message
}
// Show floating button if Odoo is detected
function showFloatingButtonIfOdoo() {
    const isOdoo = detectOdooWebsite();
    if (isOdoo) {
        createFloatingButton();
    }
}
// Check for Odoo and show button
showFloatingButtonIfOdoo();
// Also check after delays to catch dynamically loaded content
setTimeout(() => {
    showFloatingButtonIfOdoo();
}, 1000);
setTimeout(() => {
    showFloatingButtonIfOdoo();
}, 3000);
// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCurrentPageInfo') {
        const isOdoo = detectOdooWebsite();
        const odooMetadata = checkOdooMetadata();
        const pageInfo = {
            url: window.location.href,
            title: document.title || window.location.hostname,
            timestamp: Date.now(),
            isOdoo: isOdoo,
            odooMetadata: odooMetadata
        };
        sendResponse(pageInfo);
    }
    else if (request.action === 'refreshQuickLogin') {
        // Dispatch custom event that the Quick Login section listens for
        window.dispatchEvent(new CustomEvent('refreshQuickLogin'));
        sendResponse({ success: true });
    }
    else {
    }
    return true; // Keep the message channel open for async response
});
// QUICK LOGIN
(function initQuickLogin() {
    function isLoginPage() {
        // Exclude database creation/management pages
        const isDatabasePage = window.location.pathname.includes('/web/database') ||
            document.querySelector('.database_block') ||
            document.querySelector('input[name="master_pwd"]') ||
            document.querySelector('input[name="name"][placeholder*="database"]') ||
            document.title.toLowerCase().includes('database');
        if (isDatabasePage) {
            return false;
        }
        // Check for login page elements
        const loginInput = document.querySelector('input[name="login"], input[name="email"]');
        const passInput = document.querySelector('input[name="password"]');
        // Additional check: login page usually has a submit button with specific text
        const hasLoginButton = document.querySelector('button[type="submit"]') &&
            document.body &&
            (document.body.textContent?.toLowerCase().includes('log in') ||
                document.body.textContent?.toLowerCase().includes('sign in'));
        const isLogin = !!(loginInput && passInput && hasLoginButton);
        return isLogin;
    }
    function addButtons() {
        // Remove ALL existing instances (in case of duplicates)
        const existingButtons = document.querySelectorAll('#ql-buttons');
        existingButtons.forEach(btn => {
            btn.remove();
        });
        if (!isLoginPage()) {
            return;
        }
        // Inject hover style only once
        if (!document.getElementById('ql-hover-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'ql-hover-style';
            styleSheet.textContent = `
        #ql-buttons button:hover {
          --ql-bg: #ffe4e6 !important;
          --ql-border: #f9a8d4 !important;
          --ql-shadow: 0 2px 8px rgba(244, 114, 182, 0.25) !important;
        }
      `;
            document.head.appendChild(styleSheet);
        }
        chrome.storage.local.get(['customLogin', 'customLoginEnabled'], (result) => {
            const container = document.createElement('div');
            container.id = 'ql-buttons';
            container.style.cssText = `
        position: relative !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        background: white !important;
        padding: 15px 20px !important;
        border-radius: 6px !important;
        margin-bottom: 15px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        width: 100% !important;
        box-sizing: border-box !important;
      `;
            let customUser = null;
            let customPass = null;
            if (result.customLoginEnabled && result.customLogin) {
                customUser = result.customLogin.user;
                customPass = result.customLogin.pass;
            }
            let buttonsHTML = `
  <div style="display: flex !important; gap: 6px !important; justify-content: center !important; flex-wrap: nowrap !important; align-items: stretch !important;">
    <button data-user="admin" data-pass="admin" type="button" style="all: unset !important; box-sizing: border-box !important; background: var(--ql-bg, #f5f5f5) !important; color: #333 !important; padding: 8px 8px !important; border: 1px solid var(--ql-border, #ddd) !important; border-radius: 4px !important; cursor: pointer !important; font-size: 13px !important; font-weight: 500 !important; transition: all 0.2s ease !important; box-shadow: var(--ql-shadow, none) !important; white-space: normal !important; text-align: center !important; min-width: 60px !important; max-width: 100px !important; flex: 1 1 auto !important; line-height: 1.3 !important; word-break: break-word !important;">
      Admin
    </button>
    <button data-user="demo" data-pass="demo" type="button" style="all: unset !important; box-sizing: border-box !important; background: var(--ql-bg, #f5f5f5) !important; color: #333 !important; padding: 8px 8px !important; border: 1px solid var(--ql-border, #ddd) !important; border-radius: 4px !important; cursor: pointer !important; font-size: 13px !important; font-weight: 500 !important; transition: all 0.2s ease !important; box-shadow: var(--ql-shadow, none) !important; white-space: normal !important; text-align: center !important; min-width: 60px !important; max-width: 100px !important; flex: 1 1 auto !important; line-height: 1.3 !important; word-break: break-word !important;">
      Demo
    </button>
    <button data-user="portal" data-pass="portal" type="button" style="all: unset !important; box-sizing: border-box !important; background: var(--ql-bg, #f5f5f5) !important; color: #333 !important; padding: 8px 8px !important; border: 1px solid var(--ql-border, #ddd) !important; border-radius: 4px !important; cursor: pointer !important; font-size: 13px !important; font-weight: 500 !important; transition: all 0.2s ease !important; box-shadow: var(--ql-shadow, none) !important; white-space: normal !important; text-align: center !important; min-width: 60px !important; max-width: 100px !important; flex: 1 1 auto !important; line-height: 1.3 !important; word-break: break-word !important;">
      Portal
    </button>
`;
            if (customUser && customPass) {
                buttonsHTML += `
    <button data-user="${customUser}" data-pass="${customPass}" type="button" style="all: unset !important; box-sizing: border-box !important; background: var(--ql-bg, #f5f5f5) !important; color: #333 !important; padding: 8px 8px !important; border: 1px solid var(--ql-border, #ddd) !important; border-radius: 4px !important; cursor: pointer !important; font-size: 13px !important; font-weight: 500 !important; transition: all 0.2s ease !important; box-shadow: var(--ql-shadow, none) !important; white-space: normal !important; text-align: center !important; min-width: 60px !important; max-width: 100px !important; flex: 1 1 auto !important; line-height: 1.3 !important; word-break: break-word !important;">
      ${customUser}
    </button>
  `;
            }
            buttonsHTML += `</div>`;
            container.innerHTML = buttonsHTML;
            // Try multiple possible locations for the button container
            const possibleContainers = [
                '.oe_website_login_container',
                '.oe_login_form',
                'form.oe_login_form',
                '.card-body form',
                'form[action*="login"]'
            ];
            let inserted = false;
            for (const selector of possibleContainers) {
                const loginContainer = document.querySelector(selector);
                if (loginContainer) {
                    loginContainer.insertBefore(container, loginContainer.firstChild);
                    // Ensure flex layout is set correctly
                    const parentStyle = loginContainer;
                    if (window.getComputedStyle(parentStyle).display === 'flex') {
                        parentStyle.style.flexDirection = 'column';
                    }
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                const form = document.querySelector('form[action*="login"]') ||
                    document.querySelector('form.oe_login_form') ||
                    document.querySelector('form');
                if (form && form.parentElement) {
                    form.parentElement.insertBefore(container, form);
                    inserted = true;
                }
            }
            if (!inserted) {
                return;
            }
            // Add event listeners
            container.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const user = btn.getAttribute('data-user') || '';
                    const pass = btn.getAttribute('data-pass') || '';
                    login(user, pass);
                });
            });
        });
    }
    function login(username, password) {
        const loginInput = document.querySelector('input[name="login"], input[name="email"]');
        const passInput = document.querySelector('input[name="password"]');
        if (loginInput && passInput) {
            loginInput.value = username;
            passInput.value = password;
            loginInput.dispatchEvent(new Event('input', { bubbles: true }));
            loginInput.dispatchEvent(new Event('change', { bubbles: true }));
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.dispatchEvent(new Event('change', { bubbles: true }));
            const form = loginInput.closest('form');
            if (form) {
                setTimeout(() => {
                    form.submit();
                }, 200);
            }
        }
    }
    // Multiple initialization attempts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addButtons();
        });
    }
    else {
        addButtons();
    }
    // Single delayed attempt for slow-loading pages
    setTimeout(() => {
        addButtons();
    }, 1000);
    // Listen for refresh event
    window.addEventListener('refreshQuickLogin', () => {
        addButtons();
    });
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'refreshQuickLogin') {
            setTimeout(() => {
                addButtons();
            }, 100);
            sendResponse({ success: true });
            return true; // Important: indicates async response
        }
    });
})();
