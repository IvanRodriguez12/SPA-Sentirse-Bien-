import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const AdminRegistrar = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    contrasena: '',
    profesion: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.post(`${API_URL}/clientes/registrar`, formData, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (formData.profesion?.trim()) {
        toast.success("Profesional registrado exitosamente");
      } else {
        toast.success("Cliente registrado exitosamente");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar al cliente o profesional");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registrar Cliente o Profesional</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required />
        <input name="contrasena" type="password" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} required />
        <input name="profesion" placeholder="Profesión (vacío si es cliente)" value={formData.profesion} onChange={handleChange} />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default AdminRegistrar;
