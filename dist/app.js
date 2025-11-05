"use strict";
/// <reference types="chrome"/>
class App {
    constructor() {
        this.newsItems = [];
        this.newsScrollInterval = null;
        this.isEditingQuickLinks = false;
        this.greetingEl = document.getElementById("greeting");
        this.nameInputEl = document.getElementById("nameInput");
        this.dateEl = document.getElementById("date");
        this.searchEl = document.getElementById("search");
        this.themeToggleEl = document.getElementById("themeToggle");
        this.devModeEl = document.getElementById("devMode");
        this.consultantModeEl = document.getElementById("consultantMode");
        this.userModeEl = document.getElementById("userMode");
        this.newsModeEl = document.getElementById("newsMode");
        this.modeDisplayEl = document.getElementById("modeDisplay");
        this.searchModeToggleEl = document.getElementById("searchModeToggle");
        this.searchModeIndicatorEl = document.getElementById("searchModeIndicator");
        this.searchEngineSelectorEl = document.getElementById("searchEngineSelector");
        this.searchEngineDropdownEl = document.getElementById("searchEngineDropdown");
        this.editQuickLinksEl = document.getElementById("editQuickLinks");
        this.quickLinksGridEl = document.getElementById("quickLinksGrid");
        this.currentTheme = this.loadTheme();
        this.currentMode = this.loadMode();
        this.currentSearchMode = this.loadSearchMode();
        this.currentSearchEngine = this.loadSearchEngine();
        this.init();
    }
    async init() {
        this.setupImageErrorHandling();
        await this.updateGreeting();
        this.updateDate();
        this.setupSearch();
        this.setupTheme();
        this.setupThemeToggle();
        this.setupModeToggle();
        this.setupSearchModeToggle();
        this.setupSearchEngineSelector();
        this.setupQuickLinksEdit();
        await this.fetchNews();
        this.applyMode();
        this.applySearchMode();
        this.applySearchEngine();
        this.setupMessageListener();
        setInterval(() => this.updateDate(), 60000);
        // Update greeting every hour to keep it current
        setInterval(() => this.updateGreeting(), 3600000);
        // Update news every 30 minutes
        setInterval(() => this.fetchNews(), 1800000);
        // Watch for system theme changes
        if (window.matchMedia) {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", () => this.applyTheme());
        }
    }
    setupMessageListener() {
        // Use common mode sync instead of message passing
        if (window.modeSync) {
            window.modeSync.addListener((mode) => {
                console.log("Received mode change from modeSync:", mode);
                this.currentMode = mode;
                this.applyMode();
            });
        }
    }
    loadTheme() {
        return localStorage.getItem("theme") || "system";
    }
    loadMode() {
        return localStorage.getItem("odooMode") || "developer";
    }
    saveTheme(theme) {
        localStorage.setItem("theme", theme);
        this.currentTheme = theme;
    }
    saveMode(mode) {
        localStorage.setItem("odooMode", mode);
        this.currentMode = mode;
    }
    updateBrowserAction(mode) {
        if (chrome.action) {
            // Update title
            chrome.action.setTitle({
                title: `New Tab - ${mode} Mode`,
            });
            // Update badge with mode abbreviation
            const badgeText = {
                Developer: "DEV",
                Consultant: "CON",
                User: "USR",
                News: "NEW",
            };
            chrome.action.setBadgeText({
                text: badgeText[mode] || "DEV",
            });
            // Set badge background color (Odoo purple)
            chrome.action.setBadgeBackgroundColor({
                color: "#714B67",
            });
        }
    }
    setupTheme() {
        this.applyTheme();
    }
    applyTheme() {
        // Remove all theme classes
        document.documentElement.classList.remove("theme-light", "theme-dark", "theme-system", "dark");
        // Add current theme class
        document.documentElement.classList.add(`theme-${this.currentTheme}`);
        // Apply dark mode if needed
        const isDark = this.currentTheme === "dark" ||
            (this.currentTheme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        if (isDark) {
            document.documentElement.classList.add("dark");
        }
    }
    setupThemeToggle() {
        if (!this.themeToggleEl)
            return;
        this.themeToggleEl.addEventListener("click", () => {
            switch (this.currentTheme) {
                case "light":
                    this.saveTheme("dark");
                    break;
                case "dark":
                    this.saveTheme("system");
                    break;
                case "system":
                    this.saveTheme("light");
                    break;
            }
            this.applyTheme();
        });
    }
    setupModeToggle() {
        if (!this.devModeEl ||
            !this.consultantModeEl ||
            !this.userModeEl ||
            !this.newsModeEl)
            return;
        // Remove active class from all mode buttons
        const removeActive = () => {
            this.devModeEl?.classList.remove("bg-odoo-purple", "text-white");
            this.consultantModeEl?.classList.remove("bg-odoo-purple", "text-white");
            this.userModeEl?.classList.remove("bg-odoo-purple", "text-white");
            this.newsModeEl?.classList.remove("bg-odoo-purple", "text-white");
        };
        const switchMode = (mode, button) => {
            removeActive();
            button?.classList.add("bg-odoo-purple", "text-white");
            // Add pulse animation
            button?.classList.add("scale-110");
            setTimeout(() => button?.classList.remove("scale-110"), 200);
            // Use common mode sync
            if (window.modeSync) {
                window.modeSync.setMode(mode);
            }
            else {
                // Fallback if modeSync not available
                this.currentMode = mode;
                this.saveMode(mode);
                this.applyMode();
                this.updateBrowserAction(mode);
            }
        };
        // Click handlers
        this.devModeEl.addEventListener("click", () => switchMode("developer", this.devModeEl));
        this.consultantModeEl.addEventListener("click", () => switchMode("consultant", this.consultantModeEl));
        this.userModeEl.addEventListener("click", () => switchMode("user", this.userModeEl));
        this.newsModeEl.addEventListener("click", () => switchMode("news", this.newsModeEl));
        // Platform detection and shortcut text update
        const isMac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
        const modifierKey = isMac ? "Option" : "Alt";
        // Update shortcut text in tooltips
        document.querySelectorAll("[data-shortcut]").forEach((el) => {
            if (el instanceof HTMLElement) {
                el.textContent = el.textContent?.replace("Alt", modifierKey) || "";
            }
        });
        // Keyboard shortcuts (Alt/Option + 1/2/3)
        document.addEventListener("keydown", (e) => {
            // Debug log to see what keys are being pressed
            console.log("Key pressed:", {
                key: e.key,
                code: e.code,
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
            });
            // Check for both number keys and numpad keys
            const isOne = e.key === "1" || e.code === "Digit1" || e.code === "Numpad1";
            const isTwo = e.key === "2" || e.code === "Digit2" || e.code === "Numpad2";
            const isThree = e.key === "3" || e.code === "Digit3" || e.code === "Numpad3";
            const isFour = e.key === "4" || e.code === "Digit4" || e.code === "Numpad4";
            if ((e.altKey || e.metaKey) && !e.ctrlKey && !e.shiftKey) {
                if (isOne) {
                    e.preventDefault();
                    switchMode("developer", this.devModeEl);
                }
                else if (isTwo) {
                    e.preventDefault();
                    switchMode("consultant", this.consultantModeEl);
                }
                else if (isThree) {
                    e.preventDefault();
                    switchMode("user", this.userModeEl);
                }
                else if (isFour) {
                    e.preventDefault();
                    switchMode("news", this.newsModeEl);
                }
            }
        });
    }
    setupImageErrorHandling() {
        // Handle image errors globally to comply with CSP
        // Add error handlers to all existing images
        document.querySelectorAll("img").forEach((img) => {
            img.addEventListener("error", function () {
                this.style.display = "none";
            });
        });
        // Use MutationObserver to handle dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        // Handle the node itself if it's an image
                        if (element.tagName === "IMG") {
                            element.addEventListener("error", function () {
                                this.style.display = "none";
                            });
                        }
                        // Handle images within the node
                        element.querySelectorAll("img").forEach((img) => {
                            img.addEventListener("error", function () {
                                this.style.display = "none";
                            });
                        });
                    }
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    applyMode() {
        // Remove active class from all mode buttons
        this.devModeEl?.classList.remove("bg-odoo-purple", "text-white");
        this.consultantModeEl?.classList.remove("bg-odoo-purple", "text-white");
        this.userModeEl?.classList.remove("bg-odoo-purple", "text-white");
        this.newsModeEl?.classList.remove("bg-odoo-purple", "text-white");
        // Stop any existing news scroll
        if (this.newsScrollInterval) {
            clearInterval(this.newsScrollInterval);
            this.newsScrollInterval = null;
        }
        // Add active class to current mode
        switch (this.currentMode) {
            case "developer":
                this.devModeEl?.classList.add("bg-odoo-purple", "text-white");
                if (this.modeDisplayEl)
                    this.modeDisplayEl.textContent = "Developer Mode";
                this.updateBrowserAction("Developer");
                break;
            case "consultant":
                this.consultantModeEl?.classList.add("bg-odoo-purple", "text-white");
                if (this.modeDisplayEl)
                    this.modeDisplayEl.textContent = "Consultant Mode";
                this.updateBrowserAction("Consultant");
                break;
            case "user":
                this.userModeEl?.classList.add("bg-odoo-purple", "text-white");
                if (this.modeDisplayEl)
                    this.modeDisplayEl.textContent = "User Mode";
                this.updateBrowserAction("User");
                break;
            case "news":
                this.newsModeEl?.classList.add("bg-odoo-purple", "text-white");
                if (this.modeDisplayEl)
                    this.modeDisplayEl.textContent = "Latest News";
                this.updateBrowserAction("News");
                this.startNewsScroll();
                break;
        }
        // Add fade animation to mode display
        if (this.modeDisplayEl) {
            this.modeDisplayEl.classList.add("opacity-0");
            setTimeout(() => {
                this.modeDisplayEl?.classList.remove("opacity-0");
                this.modeDisplayEl?.classList.add("opacity-100", "transition-opacity", "duration-300");
            }, 50);
        }
        // Update card visibility
        this.updateCards();
    }
    async getBrowserUserName() {
        try {
            // Try to get user info from Chrome identity API
            if (chrome.identity && chrome.identity.getProfileUserInfo) {
                const userInfo = await new Promise((resolve) => {
                    chrome.identity.getProfileUserInfo((info) => {
                        resolve(info);
                    });
                });
                if (userInfo && userInfo.email) {
                    // Extract name from email (everything before @)
                    const email = userInfo.email;
                    const name = email.split("@")[0];
                    // Capitalize first letter and replace dots/underscores with spaces
                    return name
                        .split(/[._]/)
                        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(" ");
                }
            }
        }
        catch (error) {
            console.error("Error getting browser user info:", error);
        }
        // Fallback to saved name or Guest
        const savedName = localStorage.getItem("userName");
        return savedName || "Guest";
    }
    async updateGreeting() {
        if (!this.greetingEl || !this.nameInputEl)
            return;
        const name = await this.getBrowserUserName();
        const greeting = this.getTimeBasedGreeting();
        // Show/hide name input based on whether we have a name
        if (name === "Guest") {
            this.greetingEl.textContent = greeting;
            this.nameInputEl.classList.remove("hidden");
            this.nameInputEl.value = "";
        }
        else {
            this.nameInputEl.classList.add("hidden");
            this.greetingEl.textContent = `${greeting}, ${name}`;
        }
        // Setup name input handlers
        this.setupNameInput();
    }
    updateDate() {
        if (!this.dateEl)
            return;
        const now = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        this.dateEl.textContent = now.toLocaleDateString("en-US", options);
    }
    loadSearchMode() {
        return localStorage.getItem("searchMode") || "search";
    }
    saveSearchMode(mode) {
        localStorage.setItem("searchMode", mode);
        this.currentSearchMode = mode;
    }
    loadSearchEngine() {
        return localStorage.getItem("searchEngine") || "google";
    }
    saveSearchEngine(engine) {
        localStorage.setItem("searchEngine", engine);
        this.currentSearchEngine = engine;
    }
    setupSearchModeToggle() {
        if (!this.searchModeToggleEl)
            return;
        this.searchModeToggleEl.addEventListener("click", () => {
            const nextMode = this.currentSearchMode === "search" ? "ask" : "search";
            this.saveSearchMode(nextMode);
            this.applySearchMode();
        });
    }
    applySearchMode() {
        // Update toggle handle position and button background
        const toggleHandle = document.querySelector("[data-toggle-handle]");
        if (toggleHandle instanceof HTMLElement) {
            toggleHandle.style.transform =
                this.currentSearchMode === "search"
                    ? "translateX(0)"
                    : "translateX(20px)";
        }
        // Update toggle button background
        if (this.searchModeToggleEl) {
            this.searchModeToggleEl.className = `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none group ${this.currentSearchMode === "search"
                ? "bg-odoo-purple-lighter dark:bg-odoo-purple/50"
                : "bg-odoo-purple dark:bg-odoo-purple-light"}`;
        }
        // Update indicator text and style
        if (this.searchModeIndicatorEl) {
            this.searchModeIndicatorEl.textContent =
                this.currentSearchMode === "search" ? "Search" : "Ask";
            this.searchModeIndicatorEl.className = `ml-2 text-xs font-medium ${this.currentSearchMode === "search"
                ? "text-slate-400 dark:text-gray-400"
                : "text-odoo-purple dark:text-odoo-purple-light"}`;
        }
        // Update input placeholder
        if (this.searchEl) {
            this.searchEl.placeholder =
                this.currentSearchMode === "search"
                    ? "Search Google or type a URL"
                    : "Ask a question...";
        }
    }
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        return hour < 12
            ? "Good morning"
            : hour < 17
                ? "Good afternoon"
                : "Good evening";
    }
    async handleNameInput() {
        if (!this.nameInputEl || !this.greetingEl)
            return;
        const newName = this.nameInputEl.value.trim();
        if (newName) {
            localStorage.setItem("userName", newName);
            await this.updateGreeting();
        }
        else {
            // Clear name from localStorage
            localStorage.removeItem("userName");
            // Clear input and hide it if empty
            this.nameInputEl.value = "";
            this.nameInputEl.classList.add("hidden");
            // Reset greeting to just time-based greeting without name
            this.greetingEl.textContent = this.getTimeBasedGreeting();
        }
    }
    setupNameInput() {
        if (!this.nameInputEl)
            return;
        // Handle input events
        this.nameInputEl.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                await this.handleNameInput();
            }
        });
        // Handle blur
        this.nameInputEl.addEventListener("blur", async () => {
            await this.handleNameInput();
        });
        // Click on greeting to edit name
        this.greetingEl?.addEventListener("click", async () => {
            if (!this.nameInputEl || !this.greetingEl)
                return;
            const name = await this.getBrowserUserName();
            if (name !== "Guest") {
                this.nameInputEl.value = name;
                this.nameInputEl.classList.remove("hidden");
                this.greetingEl.textContent = this.getTimeBasedGreeting();
                this.nameInputEl.focus();
            }
            else {
                // If no name is set, just show the input field
                this.nameInputEl.value = "";
                this.nameInputEl.classList.remove("hidden");
                this.greetingEl.textContent = this.getTimeBasedGreeting();
                this.nameInputEl.focus();
            }
        });
    }
    setupSearchEngineSelector() {
        if (!this.searchEngineSelectorEl || !this.searchEngineDropdownEl)
            return;
        // Toggle dropdown
        this.searchEngineSelectorEl.addEventListener("click", (e) => {
            e.stopPropagation();
            this.searchEngineDropdownEl?.classList.toggle("hidden");
        });
        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
            this.searchEngineDropdownEl?.classList.add("hidden");
        });
        // Handle search engine selection
        this.searchEngineDropdownEl.addEventListener("click", (e) => {
            const target = e.target;
            const engine = target
                .closest("[data-engine]")
                ?.getAttribute("data-engine");
            if (engine) {
                this.saveSearchEngine(engine);
                this.applySearchEngine();
                this.searchEngineDropdownEl?.classList.add("hidden");
            }
        });
    }
    applySearchEngine() {
        if (!this.searchEngineSelectorEl)
            return;
        const engines = {
            google: {
                name: "Google",
                favicon: "https://www.google.com/favicon.ico",
            },
            bing: {
                name: "Bing",
                favicon: "https://www.bing.com/favicon.ico",
            },
            duckduckgo: {
                name: "DuckDuckGo",
                favicon: "https://duckduckgo.com/favicon.ico",
            },
            yandex: {
                name: "Yandex",
                favicon: "https://yandex.com/favicon.ico",
            },
            brave: {
                name: "Brave",
                favicon: "https://brave.com/favicon.ico",
            },
        };
        const current = engines[this.currentSearchEngine];
        this.searchEngineSelectorEl.innerHTML = `
      <div class="flex items-center">
        <img src="${current.favicon}" alt="${current.name}" class="w-4 h-4" onerror="this.style.display='none'">
        <span class="text-xs ml-2">${current.name}</span>
      </div>
      <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    `;
    }
    getSearchUrl(query) {
        const engines = {
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
            brave: `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
        };
        return engines[this.currentSearchEngine];
    }
    setupQuickLinksEdit() {
        if (!this.editQuickLinksEl || !this.quickLinksGridEl)
            return;
        // Load saved quick links on startup
        this.loadQuickLinks();
        this.editQuickLinksEl.addEventListener("click", () => {
            this.isEditingQuickLinks = !this.isEditingQuickLinks;
            this.applyQuickLinksEditMode();
        });
    }
    loadQuickLinks() {
        const savedLinks = localStorage.getItem("quickLinks");
        if (savedLinks && this.quickLinksGridEl) {
            try {
                const links = JSON.parse(savedLinks);
                if (links.length > 0) {
                    this.quickLinksGridEl.innerHTML = "";
                    links.forEach((link) => {
                        this.createQuickLinkElement(link.url, link.name, link.favicon);
                    });
                }
                // If no saved links, keep the default HTML structure
            }
            catch (error) {
                console.error("Error loading quick links:", error);
            }
        }
    }
    saveQuickLinks() {
        if (!this.quickLinksGridEl)
            return;
        const links = Array.from(this.quickLinksGridEl.querySelectorAll("a")).map((link) => ({
            url: link.getAttribute("href") || "",
            name: link.querySelector("span")?.textContent || "",
            favicon: link.querySelector("img")?.getAttribute("src") || "",
        }));
        localStorage.setItem("quickLinks", JSON.stringify(links));
        // If no links remain, reload to show default structure
        if (links.length === 0) {
            this.loadQuickLinks();
        }
    }
    createQuickLinkElement(url, name, favicon) {
        if (!this.quickLinksGridEl)
            return;
        // Create container div
        const container = document.createElement("div");
        container.className = "relative";
        // Create link element
        const newLink = document.createElement("a");
        newLink.href = url;
        newLink.target = "_blank";
        newLink.className = "flex flex-col items-center cursor-pointer group";
        const domain = this.getDomainFromUrl(url);
        const faviconUrl = favicon || `https://${domain}/favicon.ico`;
        newLink.innerHTML = `
      <div class="w-12 h-12 bg-white/50 dark:bg-card-bg/30 backdrop-blur-sm border border-slate-200/40 dark:border-gray-700/30 rounded-full flex items-center justify-center font-semibold mb-2 group-hover:border-accent-blue/50 transition-all duration-200">
        <img src="${faviconUrl}" alt="${name}" class="w-8 h-8" onerror="this.style.display='none'">
      </div>
      <span class="text-xs text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">${name}</span>
    `;
        container.appendChild(newLink);
        this.quickLinksGridEl.appendChild(container);
    }
    applyQuickLinksEditMode() {
        if (!this.editQuickLinksEl || !this.quickLinksGridEl)
            return;
        if (this.isEditingQuickLinks) {
            this.editQuickLinksEl.textContent = "Done";
            this.editQuickLinksEl.classList.add("bg-odoo-purple", "text-white", "px-3", "py-1", "rounded");
            this.editQuickLinksEl.classList.remove("hover:underline");
            // Add edit and delete buttons to each link
            const links = this.quickLinksGridEl.querySelectorAll("a");
            links.forEach((link, index) => {
                const container = link.parentElement;
                if (container) {
                    container.style.position = "relative";
                    // Edit button
                    const editBtn = document.createElement("button");
                    editBtn.className =
                        "absolute -top-1 -left-1 w-5 h-5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center";
                    editBtn.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          `;
                    editBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.editQuickLink(link);
                    };
                    // Delete button
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className =
                        "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center";
                    deleteBtn.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          `;
                    deleteBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Remove the entire container (div with relative class)
                        const container = link.closest(".relative");
                        if (container) {
                            container.remove();
                        }
                        else {
                            link.remove();
                        }
                        this.saveQuickLinks();
                        // Re-apply edit mode to update button positions
                        this.applyQuickLinksEditMode();
                    };
                    container.appendChild(editBtn);
                    container.appendChild(deleteBtn);
                }
            });
            // Add "Add New" button
            this.addNewQuickLinkButton();
        }
        else {
            this.editQuickLinksEl.textContent = "Edit";
            this.editQuickLinksEl.classList.remove("bg-odoo-purple", "text-white", "px-3", "py-1", "rounded");
            this.editQuickLinksEl.classList.add("hover:underline");
            // Remove all edit/delete buttons and "Add New" button
            const buttons = this.quickLinksGridEl.querySelectorAll("button");
            buttons.forEach((btn) => btn.remove());
            const addNewBtns = this.quickLinksGridEl.querySelectorAll(".add-new-btn");
            addNewBtns.forEach((btn) => btn.remove());
        }
    }
    addNewQuickLinkButton() {
        // Remove any existing "Add New" buttons first
        const existingAddBtns = this.quickLinksGridEl?.querySelectorAll(".add-new-btn");
        existingAddBtns?.forEach((btn) => btn.remove());
        const addBtn = document.createElement("div");
        addBtn.className =
            "flex flex-col items-center cursor-pointer group relative add-new-btn";
        addBtn.innerHTML = `
      <div class="w-12 h-12 bg-white/50 dark:bg-card-bg/30 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-full flex items-center justify-center font-semibold mb-2 group-hover:border-odoo-purple/50 dark:group-hover:border-odoo-purple-light/50 transition-all duration-200">
        <svg class="w-6 h-6 text-slate-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </div>
      <span class="text-xs text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New</span>
    `;
        addBtn.onclick = () => this.addNewQuickLink();
        this.quickLinksGridEl?.appendChild(addBtn);
    }
    normalizeUrl(url) {
        // Remove any whitespace
        url = url.trim();
        // If it already starts with http:// or https://, return as is
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        // If it starts with www., add https://
        if (url.startsWith("www.")) {
            return `https://${url}`;
        }
        // For other cases, add https://
        return `https://${url}`;
    }
    getDomainFromUrl(url) {
        try {
            const normalizedUrl = this.normalizeUrl(url);
            return new URL(normalizedUrl).hostname;
        }
        catch (error) {
            // If URL parsing fails, try to extract domain manually
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
            return cleanUrl.split("/")[0];
        }
    }
    editQuickLink(link) {
        const currentUrl = link.getAttribute("href") || "";
        const currentName = link.querySelector("span")?.textContent || "";
        const newUrl = prompt("Enter URL (e.g., odoo.com, www.odoo.com, or https://odoo.com):", currentUrl);
        if (!newUrl)
            return;
        const newName = prompt("Enter name:", currentName);
        if (!newName)
            return;
        try {
            const normalizedUrl = this.normalizeUrl(newUrl);
            const domain = this.getDomainFromUrl(newUrl);
            // Update the link
            link.setAttribute("href", normalizedUrl);
            link.querySelector("span").textContent = newName;
            // Update favicon
            const img = link.querySelector("img");
            if (img) {
                img.setAttribute("src", `https://${domain}/favicon.ico`);
                img.setAttribute("alt", newName);
                img.setAttribute("onerror", "this.style.display='none'");
            }
            // Save changes
            this.saveQuickLinks();
        }
        catch (error) {
            alert("Invalid URL format. Please enter a valid URL.");
        }
    }
    addNewQuickLink() {
        const url = prompt("Enter URL (e.g., odoo.com, www.odoo.com, or https://odoo.com):");
        if (!url)
            return;
        const name = prompt("Enter name:");
        if (!name)
            return;
        try {
            const normalizedUrl = this.normalizeUrl(url);
            this.createQuickLinkElement(normalizedUrl, name);
            // Save changes
            this.saveQuickLinks();
            // Re-apply edit mode to show buttons on new link
            this.applyQuickLinksEditMode();
        }
        catch (error) {
            alert("Invalid URL format. Please enter a valid URL.");
        }
    }
    setupSearch() {
        if (!this.searchEl)
            return;
        this.searchEl.addEventListener("keypress", (e) => {
            if (e.key !== "Enter")
                return;
            const query = this.searchEl?.value.trim();
            if (!query)
                return;
            if (this.currentSearchMode === "search") {
                if (query.includes(".") && !query.includes(" ")) {
                    const url = query.startsWith("http") ? query : `https://${query}`;
                    window.location.href = url;
                }
                else {
                    window.location.href = this.getSearchUrl(query);
                }
            }
            else {
                // For Ask mode, use a different search engine or AI service
                window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, "_blank");
            }
            if (this.searchEl)
                this.searchEl.value = "";
        });
    }
    updateCards() {
        // Hide all cards first
        document.querySelectorAll("[data-mode]").forEach((card) => {
            if (card instanceof HTMLElement) {
                card.classList.add("hidden");
            }
        });
        // Show cards for current mode
        document
            .querySelectorAll(`[data-mode="${this.currentMode}"]`)
            .forEach((card) => {
            if (card instanceof HTMLElement) {
                card.classList.remove("hidden");
            }
        });
        // Add animation classes for smooth transition
        document
            .querySelectorAll(`[data-mode="${this.currentMode}"]`)
            .forEach((card) => {
            if (card instanceof HTMLElement) {
                card.classList.add("opacity-0");
                setTimeout(() => {
                    card.classList.remove("opacity-0");
                    card.classList.add("opacity-100", "transition-opacity", "duration-300");
                }, 50);
            }
        });
    }
    async fetchNews() {
        try {
            // Use a CORS proxy to fetch the RSS feed
            const corsProxy = "https://api.allorigins.win/raw?url=";
            const rssUrl = encodeURIComponent("https://www.opensourceprojects.dev/rss");
            const response = await fetch(corsProxy + rssUrl);
            const text = await response.text();
            // Parse RSS feed
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            this.newsItems = Array.from(items)
                .slice(0, 12)
                .map((item) => ({
                title: item.querySelector("title")?.textContent || "",
                link: item.querySelector("link")?.textContent || "",
                pubDate: item.querySelector("pubDate")?.textContent || "",
                description: item.querySelector("description")?.textContent || "",
            }));
            // Update news display if in news mode
            if (this.currentMode === "news") {
                this.renderNewsItems();
            }
        }
        catch (error) {
            console.error("Failed to fetch news:", error);
            // Fallback to mock data if fetch fails
            this.newsItems = [
                {
                    title: "Unable to fetch latest news - Check your internet connection",
                    link: "https://www.opensourceprojects.dev/",
                    pubDate: new Date().toISOString(),
                    description: "Please check your internet connection and try again.",
                },
            ];
            if (this.currentMode === "news") {
                this.renderNewsItems();
            }
        }
    }
    renderNewsItems() {
        const newsContainer = document.getElementById("newsContainer");
        if (!newsContainer || this.newsItems.length === 0)
            return;
        newsContainer.innerHTML = "";
        // Create 3 duplicates of items for longer seamless loop
        const duplicatedItems = [
            ...this.newsItems,
            ...this.newsItems,
            ...this.newsItems,
        ];
        duplicatedItems.forEach((item, index) => {
            const newsItem = document.createElement("div");
            newsItem.className = `news-item w-full px-4 py-3 flex-shrink-0`;
            // Clean up description (remove HTML tags and limit length)
            const cleanDescription = item.description
                .replace(/<[^>]*>/g, "") // Remove HTML tags
                .replace(/&[^;]+;/g, "") // Remove HTML entities
                .trim()
                .substring(0, 120) + (item.description.length > 120 ? "..." : "");
            newsItem.innerHTML = `
        <a href="${item.link}" target="_blank" class="block group">
          <h3 class="text-base font-semibold text-slate-800 dark:text-white mb-1 group-hover:text-odoo-purple dark:group-hover:text-odoo-purple-light transition-colors duration-200 leading-tight">
            ${item.title}
          </h3>
          <p class="text-sm text-slate-600 dark:text-gray-300 mb-1 leading-relaxed">
            ${cleanDescription}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500 dark:text-gray-400">
              ${new Date(item.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
            </span>
            <span class="text-xs text-odoo-purple dark:text-odoo-purple-light font-medium">
              Read more →
            </span>
          </div>
        </a>
      `;
            newsContainer.appendChild(newsItem);
        });
    }
    startNewsScroll() {
        const newsContainer = document.getElementById("newsContainer");
        if (!newsContainer) {
            console.log("News container not found");
            return;
        }
        this.renderNewsItems();
        const items = newsContainer.querySelectorAll(".news-item");
        console.log(`Found ${items.length} news items`);
        if (items.length === 0) {
            console.log("No news items to scroll");
            return;
        }
        // Calculate animation duration based on number of items
        const itemHeight = 120; // Approximate height of each news item
        const totalHeight = items.length * itemHeight;
        const visibleHeight = 160; // Height of visible container
        const scrollDistance = totalHeight / 3; // Scroll through one-third of the items (first set)
        const duration = (scrollDistance / 30) * 500; // 50px per second scroll speed
        // Set up marquee scroll
        newsContainer.style.animation = `scrollUp ${duration}ms linear infinite`;
        // Add CSS animation if not already added
        if (!document.getElementById("newsScrollAnimation")) {
            const style = document.createElement("style");
            style.id = "newsScrollAnimation";
            style.textContent = `
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `;
            document.head.appendChild(style);
        }
        console.log("News marquee scroll started");
    }
}
document.addEventListener("DOMContentLoaded", async () => new App());
