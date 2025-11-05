import { SiteService } from '../services/SiteService';
import { $, createElement, isValidUrl } from '../utils/dom';
export class TopSites {
    constructor() {
        this.container = $('topSites');
        this.siteService = new SiteService();
        this.init();
    }
    init() {
        this.render();
        this.setupAddSite();
    }
    render() {
        if (!this.container)
            return;
        this.container.innerHTML = '';
        const sites = this.siteService.getSites();
        sites.forEach(site => {
            const siteEl = createElement('div', 'flex flex-col items-center cursor-pointer group');
            siteEl.innerHTML = `
        <div class="w-12 h-12 bg-card-bg border border-gray-600 rounded-full flex items-center justify-center text-white font-semibold mb-2 group-hover:border-accent-blue transition-colors">
          ${site.icon}
        </div>
        <span class="text-xs text-gray-400 group-hover:text-white transition-colors">${site.name}</span>
      `;
            siteEl.addEventListener('click', () => window.open(site.url, '_blank'));
            this.container?.appendChild(siteEl);
        });
    }
    setupAddSite() {
        const addButton = $('addSiteBtn');
        if (!addButton)
            return;
        addButton.addEventListener('click', () => {
            const url = prompt('Enter website URL (e.g., https://example.com):');
            if (!url || !isValidUrl(url)) {
                alert('Please enter a valid URL');
                return;
            }
            const name = prompt('Enter website name:');
            if (!name)
                return;
            const newSite = {
                name,
                url: url.startsWith('http') ? url : `https://${url}`,
                icon: name.charAt(0).toUpperCase()
            };
            this.siteService.addSite(newSite);
            this.render();
        });
    }
}
