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
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0 }}>{service.nombre}</h4>
        <p>{service.descripcion}</p>
        <p>
          <strong>Precio:</strong> ${service.precio}
        </p>
      </div>
      <button
        onClick={() => onViewDetails(service)}
        style={{
          backgroundColor: 'var(--rosa-medio)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
        }}
      >
        Ver Detalles
      </button>
    </li>
  );  
  };

  export default ServiceCard;