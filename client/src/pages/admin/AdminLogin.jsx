import '../../styles/AdminLogin.css';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const AdminLogin = () => {
  const adminAuthContext = useAdminAuth();
  const authContext = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (email === "dranafelicidad@gmail.com") {
        // LOGIN ADMIN
        await adminAuthContext.login(email, password);
      } else {
        // LOGIN PROFESIONAL
        await authContext.login(email, password);
      }
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login Profesional / Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    
      <div className="registro-link">
        <a href="/admin/registro-profesional">¿Sos profesional? Registrate</a>
      </div>
    
</div>
  );
};

export default AdminLogin;
