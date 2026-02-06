// API Configuration
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://backend-eaodkzzp1-satyapal-khakhals-projects.vercel.app/api'  // Production Vercel backend
    : 'http://localhost:5000/api';  // Development URL

export default API_BASE_URL;
