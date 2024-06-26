import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    "Content-Type": "application/json",

  baseURL: 'http://localhost:4500', 
});

// Request interceptor
// adding token auth one time only and use anywhere by calling api and calling it
axiosInstance.interceptors.request.use(
  config => {
    const token = JSON.parse(localStorage.getItem('token')); 
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.clear();

      window.location.href = '/Home';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
