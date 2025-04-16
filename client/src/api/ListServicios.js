import { Axios } from "axios";

export const getServices = async () => {
  try {
    const response = await Axios.get('/api/servicios');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}