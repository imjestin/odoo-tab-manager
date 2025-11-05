export class PrivacyService {
    getPrivacyStats() {
        return {
            trackersBlocked: Math.floor(Math.random() * 500) + 1000,
            weeklyStats: {
                'Mon': Math.floor(Math.random() * 200),
                'Tue': Math.floor(Math.random() * 200),
                'Wed': Math.floor(Math.random() * 200),
                'Thu': Math.floor(Math.random() * 200),
                'Fri': Math.floor(Math.random() * 200),
                'Sat': Math.floor(Math.random() * 200),
                'Sun': Math.floor(Math.random() * 200)
            }
        };
    }
}
