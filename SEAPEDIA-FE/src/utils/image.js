// Base URL backend (tanpa /api), untuk nyusun src gambar yang di-serve dari /uploads BE.
// Set VITE_BASE_URL di .env (mis. https://api.domain-lu.com). Fallback ke localhost untuk dev.
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export function getImageUrl(url, fallback = "https://via.placeholder.com/150") {
    if (!url) return fallback;
    if (url.startsWith("http")) return url;        // sudah absolute (mis. unsplash)
    // path relatif dari BE, mis. "/uploads/products/xxx.jpg"
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
