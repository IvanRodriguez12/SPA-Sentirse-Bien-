const Carousel = ({ items, onItemClick }) => {
    return (
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '2rem',
          marginTop: '1rem',
          padding: '1rem 0',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="featured-service hover-effect"
            onClick={() => onItemClick(item)}
            style={{
              minWidth: '300px',
              cursor: 'pointer',
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              flex: '0 0 auto',
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '1rem' }}>
              <h4>{item.name}</h4>
              <p style={{ color: 'var(--verde-oscuro)' }}>{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Carousel; // Exportación por defecto