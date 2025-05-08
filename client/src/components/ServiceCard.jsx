const ServiceCard = ({ service, onViewDetails }) => {
  return (
    <li
      className="hover-effect"
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
      }}
    >
      {/* Imagen del servicio */}
      {service.imagen && (
        <img
          src={`/${service.imagen}`}
          alt={service.nombre}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        />
      )}

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0 }}>{service.nombre}</h4>
        <p>{service.descripcion}</p>
        <p>
          <strong>Precio:</strong> ${service.precio}
        </p>
        {/* Nueva línea para mostrar la duración */}
        <p>
          <strong>Duración:</strong> {service.duracion} minutos
        </p>
      </div>

      <button
        onClick={() => onViewDetails(service)}
        style={{
          marginTop: '1rem',
          backgroundColor: 'var(--rosa-medio)', // Cambiado a rosa
          color: 'white',
          padding: '0.8rem 1.5rem',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          ':hover': {
            backgroundColor: 'var(--rosa-oscuro)', // Oscurecer al pasar el mouse
            transform: 'translateY(-2px)'
          }
        }}
      >
        Ver Detalles
      </button>
    </li>
  );
};

export default ServiceCard;