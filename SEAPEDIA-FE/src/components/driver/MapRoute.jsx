import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance } from '../../utils/geo';

// Fix default icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color, iconSvg) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
        ${iconSvg}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const storeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`;
const dropoffIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const motorIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16A3 3 0 1 0 5 22A3 3 0 1 0 5 16Z"/><path d="M19 16A3 3 0 1 0 19 22A3 3 0 1 0 19 16Z"/><path d="M5 19H8"/><path d="M11 19H16"/><path d="M6 16L9 9H13L15 13H18.5"/><path d="M12 9L13 6H16"/></svg>`;

const storeIcon = createIcon('#ea580c', storeIconSvg); // orange-600
const dropoffIcon = createIcon('#0d9488', dropoffIconSvg); // teal-600
const motorIcon = createIcon('#1f2937', motorIconSvg); // gray-800

// Helper untuk fix issue Leaflet tiles abu-abu (kepotong) saat ditaruh di flex/grid layout
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250); // delay agar animasi render CSS selesai
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MapRoute({ startCoords, endCoords, isAnimating = false }) {
  const [motorCoords, setMotorCoords] = useState(startCoords);
  const distance = calculateDistance(startCoords[0], startCoords[1], endCoords[0], endCoords[1]);

  useEffect(() => {
    if (!isAnimating) {
      setMotorCoords(startCoords);
      return;
    }

    let animationFrameId;
    let startTime = null;
    const duration = 8000; // 8 detik per loop

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const p = Math.min(elapsed / duration, 1);

      // Smooth easing (ease in-out)
      const easeInOut = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

      const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * easeInOut;
      const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * easeInOut;
      
      setMotorCoords([lat, lng]);

      if (p < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        startTime = null; // reset loop
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [startCoords, endCoords, isAnimating]);

  // Posisi tengah untuk map
  const centerLat = (startCoords[0] + endCoords[0]) / 2;
  const centerLng = (startCoords[1] + endCoords[1]) / 2;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-gray-200">
      {/* Overlay Jarak */}
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm font-bold text-sm text-gray-800 border border-white">
        Jarak: {distance} KM
      </div>

      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Rute (Polyline) */}
        <Polyline 
          positions={[startCoords, endCoords]} 
          pathOptions={{ color: '#0d9488', weight: 4, dashArray: '8, 8', opacity: 0.7 }} 
        />

        {/* Titik Jemput */}
        <Marker position={startCoords} icon={storeIcon}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            Lokasi Pengambilan
          </Tooltip>
        </Marker>

        {/* Titik Antar */}
        <Marker position={endCoords} icon={dropoffIcon}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
            Tujuan Pengiriman
          </Tooltip>
        </Marker>

        {/* Animasi Motor */}
        {isAnimating && (
          <Marker position={motorCoords} icon={motorIcon} zIndexOffset={1000} />
        )}
      </MapContainer>
    </div>
  );
}
