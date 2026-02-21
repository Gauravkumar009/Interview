import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
