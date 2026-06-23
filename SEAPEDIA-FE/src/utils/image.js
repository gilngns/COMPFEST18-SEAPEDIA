export function getImageUrl(url, fallback = 'https://via.placeholder.com/150') {
    if (!url) return fallback;
    if (url.startsWith("http")) return url;
    return `http://localhost:5000${url}`;
}
