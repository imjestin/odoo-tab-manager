export class SiteService {
    constructor() {
        this.sites = [];
        this.loadSites();
    }
    loadSites() {
        const savedSites = localStorage.getItem('topSites');
        this.sites = savedSites ? JSON.parse(savedSites) : SiteService.defaultSites;
    }
    saveSites() {
        localStorage.setItem('topSites', JSON.stringify(this.sites));
    }
    getSites() {
        return [...this.sites];
    }
    addSite(site) {
        this.sites.push(site);
        this.saveSites();
    }
    removeSite(index) {
        this.sites.splice(index, 1);
        this.saveSites();
    }
    getScreenTimeStats() {
        return {
            timeSpent: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
            dailyAverage: `${Math.floor(Math.random() * 2) + 2}h ${Math.floor(Math.random() * 60)}m`,
            mostUsed: `${this.sites[Math.floor(Math.random() * this.sites.length)].name} - ${Math.floor(Math.random() * 60) + 30} minutes`
        };
    }
}
SiteService.defaultSites = [
    { name: 'Google', url: 'https://google.com', icon: 'G' },
    { name: 'YouTube', url: 'https://youtube.com', icon: '▶' },
    { name: 'Amazon', url: 'https://amazon.com', icon: 'a' },
    { name: 'Facebook', url: 'https://facebook.com', icon: 'f' },
    { name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'W' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'S' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷' }
];
