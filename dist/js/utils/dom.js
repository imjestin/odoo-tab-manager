export function $(id) {
    return document.getElementById(id);
}
export function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (innerHTML)
        element.innerHTML = innerHTML;
    return element;
}
export function formatDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
export function isValidUrl(url) {
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
        return true;
    }
    catch {
        return false;
    }
}
