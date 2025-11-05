import { PrivacyService } from '../services/PrivacyService';
import { $ } from '../utils/dom';
export class Privacy {
    constructor() {
        this.trackersEl = $('trackersBlocked');
        this.privacyService = new PrivacyService();
        this.init();
    }
    init() {
        this.update();
        setInterval(() => this.update(), 600000); // Update every 10 minutes
    }
    update() {
        if (!this.trackersEl)
            return;
        const stats = this.privacyService.getPrivacyStats();
        this.trackersEl.textContent = stats.trackersBlocked.toLocaleString();
    }
}
