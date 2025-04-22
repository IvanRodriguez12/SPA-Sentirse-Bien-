import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación

const Servicio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario autenticado

  const service = location.state?.service; // Obtener el servicio desde el estado de navegación

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
      // Si el usuario no está autenticado, redirigir a la página de login
      navigate('/login');
    } else {
      // Si el usuario está autenticado, redirigir a la página de reservas
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
        src={service.imagen || 'https://via.placeholder.com/800x400'} // Imagen del servicio o un placeholder
        alt={service.nombre}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '10px',
          marginBottom: '1rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      />
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{service.descripcion}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--rosa-medio)' }}>
        Precio: ${service.precio}
      </p>
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

// Estilo para los botones
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