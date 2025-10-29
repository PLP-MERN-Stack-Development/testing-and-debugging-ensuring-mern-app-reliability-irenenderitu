import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const bugAPI = {
  getAllBugs: (filters = {}) => 
    api.get('/bugs', { params: filters }),
  
  getBugById: (id) => 
    api.get(`/bugs/${id}`),
  
  createBug: (bugData) => 
    api.post('/bugs', bugData),
  
  updateBug: (id, updates) => 
    api.put(`/bugs/${id}`, updates),
  
  deleteBug: (id) => 
    api.delete(`/bugs/${id}`)
};

export default api;