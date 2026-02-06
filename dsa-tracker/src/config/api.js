// API Configuration
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://thinkscope-api.onrender.com/api'  // Production URL (update after deploying to Render)
    : 'http://localhost:5000/api';  // Development URL

export default API_BASE_URL;
