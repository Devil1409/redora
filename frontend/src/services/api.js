import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('redora_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const detail = err.response?.data?.error || err.response?.data?.message || "No detail";
      console.error(`🔒 AUTH REJECTED: ${detail}`);
      console.log("Current Token:", localStorage.getItem('redora_token')?.substring(0, 10) + "...");
    }
    return Promise.reject(err);
  }
);

export default API
