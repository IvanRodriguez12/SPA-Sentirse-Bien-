import axios from 'axios';

const API_URL = 'https://spa-sentirse-bien-production.up.railway.app/api'; // Cambiar por tu endpoint real

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias/listar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/servicios/listar?categoriaId=${categoryId}`); // ✅ Filtración desde el backend
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServiceDetails = async (serviceId) => {
  console.log("Obteniendo detalles de servicio con ID:", serviceId); // ✅ Verifica si serviceId es correcto
  try {
    const response = await axios.get(`${API_URL}/servicios/detalle/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service details:', error);
    throw error;
  }
};