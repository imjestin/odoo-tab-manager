import { $ } from '../utils/dom';
export class Search {
    constructor() {
        this.searchInput = $('search');
        this.init();
    }
    init() {
        if (!this.searchInput)
            return;
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter')
                return;
            const query = this.searchInput?.value.trim();
            if (!query)
                return;
            if (query.includes('.') && !query.includes(' ')) {
                const url = query.startsWith('http') ? query : `https://${query}`;
                window.open(url, '_blank');
            }
            else {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
            if (this.searchInput)
                this.searchInput.value = '';
        });
    }
}
