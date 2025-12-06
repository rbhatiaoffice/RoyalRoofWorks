// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://royalroofworks-backend.azurewebsites.net/api'
    : 'http://localhost:5000/api');

export default API_URL;

