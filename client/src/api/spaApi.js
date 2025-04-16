// src/api/spaApi.js
import axios from 'axios';

const spaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

// Interceptor para manejar errores
spaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const getServices = () => spaApi.get('/services');
export const getServiceById = (id) => spaApi.get(`/services/${id}`);
export const createAppointment = (appointmentData) => spaApi.post('/appointments', appointmentData);
export const sendContactForm = (formData) => spaApi.post('/contact', formData);

export default spaApi;