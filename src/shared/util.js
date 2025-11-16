export function getCurrentUser() {
    try {
        const rawData = localStorage.getItem('user');
        if (!rawData) {
            return null;
        }
        return JSON.parse(rawData);
    } catch (e) {
        console.error('user 파싱 에러', e);
        return null;
    }
}