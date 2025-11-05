import { SiteService } from '../services/SiteService';
import { $ } from '../utils/dom';
export class ScreenTime {
    constructor() {
        this.timeSpentEl = $('timeSpent');
        this.dailyAverageEl = $('dailyAverage');
        this.mostUsedEl = $('mostUsed');
        this.siteService = new SiteService();
        this.init();
    }
    init() {
        this.update();
        setInterval(() => this.update(), 300000); // Update every 5 minutes
    }
    update() {
        if (!this.timeSpentEl || !this.dailyAverageEl || !this.mostUsedEl)
            return;
        const stats = this.siteService.getScreenTimeStats();
        this.timeSpentEl.textContent = stats.timeSpent;
        this.dailyAverageEl.textContent = stats.dailyAverage;
        this.mostUsedEl.textContent = stats.mostUsed;
    }
}
