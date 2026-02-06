// API Configuration
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://backend-rnfq5h3gd-satyapal-khakhals-projects.vercel.app/api'  // Production Vercel backend
    : 'http://localhost:5000/api';  // Development URL

export default API_BASE_URL;
