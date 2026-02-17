const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:5000';

export default API_BASE;

