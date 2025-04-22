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
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <img
              src={item.image || 'https://via.placeholder.com/300x200'} // Imagen del servicio o un placeholder
              alt={item.nombre}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                padding: '1rem',
                flexGrow: 1,
                backgroundColor: 'white',
              }}
            >
              <h4
                style={{
                  color: 'var(--texto-oscuro)',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                }}
              >
                {item.nombre || 'Nombre no disponible'}
              </h4>
              <p
                style={{
                  color: 'var(--verde-oscuro)',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                {item.categoryName || 'Categoría no disponible'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Carousel;