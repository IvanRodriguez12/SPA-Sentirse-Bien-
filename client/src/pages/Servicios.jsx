import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Servicio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  console.log("Estado recibido en Servicio:", location.state); // ✅ Verificar qué datos llegan

  const services = location.state?.services || [];

  if (!services.length) {
    console.error("No se encontró ningún servicio. Estado recibido:", location.state);
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No se encontró ningún servicio</h2>
        <button
          onClick={() => navigate('/categorias')}
          style={buttonStyle}
        >
          Volver a Categorías
        </button>
      </div>
    );
  }

  const [selectedServices, setSelectedServices] = useState(services.length ? services : []);

  const handleSelectService = (servicio) => {
    setSelectedServices(prev => [...prev, servicio]); // ✅ Agrega otro servicio a la lista
  };

  const handleReserve = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/reservas', { state: { services: selectedServices } }); // ✅ Envía la lista completa de servicios
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
      <h2 style={{ color: 'var(--verde-oscuro)', marginBottom: '1rem' }}>{services[0]?.nombre}</h2>
      <img
        src={services[0]?.imagen || 'https://via.placeholder.com/800x400'}
        alt={services[0]?.nombre}
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
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{services[0]?.descripcion}</p>

      {/* Sección de detalles con duración */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem'
      }}>
        <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
          <strong style={{ color: 'var(--verde-oscuro)' }}>Precio:</strong> ${services[0]?.precio}
        </p>
        <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
          <strong style={{ color: 'var(--verde-oscuro)' }}>Duración:</strong> {services[0]?.duracion} minutos
        </p>
        {services[0]?.categoria && (
          <p style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>
            <strong style={{ color: 'var(--verde-oscuro)' }}>Categoría:</strong> {services[0]?.categoria.nombre}
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
          onClick={() => handleSelectService(services[0])}
          style={{ ...buttonStyle, backgroundColor: 'var(--rosa-claro)' }}
        >
          Añadir otro servicio
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
