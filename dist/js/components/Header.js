import { UserService } from '../services/UserService';
import { $, formatDate } from '../utils/dom';
export class Header {
    constructor() {
        this.greetingEl = $('greeting');
        this.dateEl = $('date');
        this.userService = new UserService();
        this.init();
    }
    init() {
        this.updateGreeting();
        this.updateDate();
        setInterval(() => this.updateDate(), 60000); // Update date every minute
    }
    updateGreeting() {
        if (!this.greetingEl)
            return;
        this.greetingEl.textContent = this.userService.getGreeting();
    }
    updateDate() {
        if (!this.dateEl)
            return;
        this.dateEl.textContent = formatDate();
    }
}
