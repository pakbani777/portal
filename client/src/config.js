// Konfigurasi URL Backend
// Saat berjalan di komputer Anda (development), gunakan localhost.
// Saat di Netlify (production), gunakan URL Render.com Anda.
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://portal-pai-backend.onrender.com' // Nanti ganti dengan URL Render Anda yang sebenarnya
  : 'http://localhost:5000';
