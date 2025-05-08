import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Servicio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const service = location.state?.service;

  if (!service) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No se encontró el servicio</h2>
        <button
          onClick={() => navigate('/categorias')}
          style={buttonStyle}
        >
          Volver a Categorías
        </button>
      </div>
    );
  }

  const handleReserve = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/reservas', { state: { service } });
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        background: 'linear-gradient(to bottom right, var(--verde-claro), var(--rosa-claro))',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ color: 'var(--verde-oscuro)', marginBottom: '1rem' }}>{service.nombre}</h2>
      <img
        src={service.imagen || 'https://via.placeholder.com/800x400'}
        alt={service.nombre}
        style={{
          width: '100%',
          maxHeight: '60vh',
          objectFit: 'contain',
          borderRadius: '10px',
          marginBottom: '1rem',
          backgroundColor: 'var(--verde-claro)',
          padding: '1rem',
        }}
      />
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{service.descripcion}</p>

      {/* Sección de detalles con duración */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem'
      }}>
        <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
          <strong style={{ color: 'var(--verde-oscuro)' }}>Precio:</strong> ${service.precio}
        </p>
        <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
          <strong style={{ color: 'var(--verde-oscuro)' }}>Duración:</strong> {service.duracion} minutos
        </p>
        {service.categoria && (
          <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
            <strong style={{ color: 'var(--verde-oscuro)' }}>Categoría:</strong> {service.categoria.nombre}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/categorias')}
          style={buttonStyle}
        >
          Volver a Categorías
        </button>
        <button
          onClick={handleReserve}
          style={{ ...buttonStyle, backgroundColor: 'var(--verde-oscuro)' }}
        >
          Reservar
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'var(--rosa-medio)',
  color: 'white',
  padding: '0.8rem 1.5rem',
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
};

export default Servicio;