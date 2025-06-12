import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { AdminAuthContext } from '../../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const adminAuthContext = useContext(AdminAuthContext);

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
        const response = await axios.post(`${API_URL}/clientes/login`, {
          email,
          contrasenia: password,
        });

        const cliente = response.data.cliente;

        if (!cliente.profesion) {
          toast.error("Este usuario no es un profesional.");
          return;
        }

        authContext.login(response.data);
        toast.success(`Bienvenido/a profesional ${cliente.nombreCompleto}`);
        navigate("/profesional/dashboard");
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
    </div>
  );
};

export default AdminLogin;
