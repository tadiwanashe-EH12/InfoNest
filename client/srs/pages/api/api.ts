import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const getBooks = async (params = {}) => {
  const response = await apiClient.get('/books', { params });
  return response.data;
};

export const getBookDetails = async (id: string) => {
  const response = await apiClient.get(`/books/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

// Add more API calls as needed