import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Cambiar por tu endpoint real

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
    const response = await axios.post(`${API_URL}/register`, {
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono, 
      contrasena: userData.contrasena
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};