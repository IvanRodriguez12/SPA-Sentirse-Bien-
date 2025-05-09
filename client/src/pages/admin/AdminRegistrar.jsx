// pages/admin/AdminRegistrar.jsx
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAdminAuth } from '../../context/AdminAuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Requerido'),
  contrasena: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  confirmarContrasena: yup.string()
    .oneOf([yup.ref('contrasena'), null], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
});

const AdminRegistrar = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [adminExiste, setAdminExiste] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        // 1. Primero verificar si ya está autenticado
        if (admin) {
          setIsLoading(false);
          return; // Si ya está autenticado, permitir acceso
        }

        // 2. Si no está autenticado, verificar existencia de admins
        const response = await axios.get(`${API_URL}/admin/existeAdmin`);
        setAdminExiste(response.data);
        
        // 3. Redirigir solo si existen admins Y no está autenticado
        if (response.data) {
          navigate('/admin/login');
        } else {
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error de conexión");
        setIsLoading(false);
      }
    };

    verificarAcceso();
  }, [admin, navigate]);

  const onSubmit = async (data) => {
    try {
      const headers = adminExiste ? {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      } : {};
      
      const response = await axios.post(
        `https://spa-sentirse-bien-production.up.railway.app/api/admin/registrar`,
        {
          email: data.email.trim().toLowerCase(),
          contrasena: data.contrasena
        },
        { headers } 
      );

      if (response.data.mensaje) {
        toast.success(adminExiste 
          ? 'Administrador registrado exitosamente' 
          : '¡Primer administrador creado!');
          
        navigate(adminExiste ? '/admin/dashboard' : '/admin/login');
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al registrar administrador';
      toast.error(mensaje);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{
      background: 'var(--verde-claro)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          color: 'var(--texto-muy-oscuro)',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          Registrar Nuevo Administrador
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label>
            <input
              type="email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `2px solid ${errors.email ? 'red' : 'var(--verde-medio)'}`,
                borderRadius: '5px'
              }}
            />
            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Contraseña:</label>
            <input
              type="password"
              {...register('contrasena')}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `2px solid ${errors.contrasena ? 'red' : 'var(--verde-medio)'}`,
                borderRadius: '5px'
              }}
            />
            {errors.contrasena && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.contrasena.message}</p>}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              {...register('confirmarContrasena')}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `2px solid ${errors.confirmarContrasena ? 'red' : 'var(--verde-medio)'}`,
                borderRadius: '5px'
              }}
            />
            {errors.confirmarContrasena && (
              <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.confirmarContrasena.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--verde-oscuro)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Administrador'}
          </button>

          <Link 
            to="/admin/dashboard"
            style={{
              display: 'block',
              textAlign: 'center',
              color: 'var(--texto-oscuro)',
              textDecoration: 'none'
            }}
          >
            Volver al Panel de Control
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistrar;