const Home = () => {
  const featuredServices = [
    { 
      name: 'Masajes Anti-stress', 
      category: 'Masajes',
      image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Yoga Grupal', 
      category: 'Servicios Grupales',
      image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Tratamiento Facial', 
      category: 'Tratamientos Faciales',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529a0a0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <section style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        background: `linear-gradient(to right, var(--verde-claro), var(--rosa-claro))`,
        animation: 'fadeIn 1s ease'
      }}>
        <h2>Bienvenido a Bamboo Spa</h2>
        <p>Tu oasis de relajación natural</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Servicios Destacados</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '1rem'
        }}>
          {featuredServices.map((service, index) => (
            <div 
              key={index}
              className="featured-service hover-effect"
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={service.image}
                alt={service.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '1rem' }}>
                <h4>{service.name}</h4>
                <p style={{ color: 'var(--verde-oscuro)' }}>{service.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;