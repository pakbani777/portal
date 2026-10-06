// Konfigurasi URL Backend
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '' // Menggunakan relative path di Netlify
  : 'http://localhost:5000';
