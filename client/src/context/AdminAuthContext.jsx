import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const response = await axios.get(`https://spa-sentirse-bien-production.up.railway.app/api/admin/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(response.data);
        setIsAdminAuthenticated(true);
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      }
    }
  };

  const login = async (email, contrasena) => {
    try {
      const response = await axios.post(`https://spa-sentirse-bien-production.up.railway.app/api/admin/login`, {
        email, 
        contrasena
      });

      const { token } = response.data;
      
      localStorage.setItem('adminToken', token);
      setIsAdminAuthenticated(true);
      toast.success('Bienvenido Administrador');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error en credenciales');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAdminAuthenticated(false);
    navigate('/admin/login');
    toast.success('Sesión admin cerrada');
  };

  useEffect(() => { checkAdminAuth(); }, []);

  return (
    <AdminAuthContext.Provider 
        value={{ 
        admin,
        isAdminAuthenticated,
        login, // Tu función real
        logout // Tu función real
        }}
    >
        {children}
    </AdminAuthContext.Provider>
    );
    };

    export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
    }
return context;
};