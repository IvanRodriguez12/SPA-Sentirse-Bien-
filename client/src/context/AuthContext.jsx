import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Verifica si hay token guardado y obtiene datos del usuario
  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get('https://spa-sentirse-bien-production.up.railway.app/api/clientes/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        logout();
      }
    }
  };

  // Iniciar sesión
  const login = async (email, contrasena) => {
    try {
      const response = await axios.post('https://spa-sentirse-bien-production.up.railway.app/api/clientes/login', {
        email,
        contrasena
      });

      const { token, cliente, mensaje } = response.data;

      if (!token || !cliente) {
        throw new Error(mensaje || 'Error al iniciar sesión');
      }

      localStorage.setItem('authToken', token);
      setUser(cliente);
      setIsAuthenticated(true);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Credenciales incorrectas');
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success('Sesión cerrada correctamente');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


