import axios from 'axios';

const API_URL = 'https://spa-sentirse-bien-production.up.railway.app/api/auth'; // Cambiar por tu endpoint real

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    // 👇 Nos aseguramos que haya token en la respuesta
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.mensaje || 'Error al iniciar sesión');
    } else {
      throw new Error('Error de red o servidor no disponible');
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || 'Error desconocido al registrarse';
    throw new Error(mensaje);
  }
};