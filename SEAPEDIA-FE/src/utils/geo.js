// Koordinat pusat Jakarta sebagai basis
const BASE_LAT = -6.200000;
const BASE_LNG = 106.816666;

/**
 * Menghasilkan koordinat pseudo-random yang konsisten berdasarkan String ID
 * @param {string} id - UUID atau string ID unik
 * @returns {[number, number]} - [Latitude, Longitude]
 */
export function generateCoordsFromId(id) {
  if (!id) return [BASE_LAT, BASE_LNG];

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Membuat offset latitude antara -0.1 sampai +0.1
  // Membuat offset longitude antara -0.1 sampai +0.1
  const latOffset = (hash % 1000) / 10000; 
  const lngOffset = ((hash >> 2) % 1000) / 10000;

  return [BASE_LAT + latOffset, BASE_LNG + lngOffset];
}

/**
 * Menghitung jarak lurus (Haversine Formula) antara dua koordinat dalam Kilometer
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c;
  return Number(d.toFixed(1)); // 1 desimal
}
