export class UserService {
    constructor() {
        this.user = this.loadUser();
    }
    loadUser() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        const defaultUser = {
            name: 'CHETAN',
            settings: {
                theme: 'dark',
                showScreenTime: true,
                showPrivacyStats: true,
                customSites: true
            }
        };
        this.saveUser(defaultUser);
        return defaultUser;
    }
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
    }
    getUser() {
        return { ...this.user };
    }
    updateSettings(settings) {
        this.user.settings = { ...this.user.settings, ...settings };
        this.saveUser(this.user);
    }
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12)
            return `Good morning, ${this.user.name}`;
        if (hour < 17)
            return `Good afternoon, ${this.user.name}`;
        return `Good evening, ${this.user.name}`;
    }
}
