import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const allServices = [
    { 
      name: 'Masajes Anti-stress', 
      category: 'Masajes',
      image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Masaje Relajante', 
      category: 'Masajes',
      image: 'https://images.unsplash.com/photo-1556228720-421e7d3a6c83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Manicura y Pedicura', 
      category: 'Belleza',
      image: 'https://images.unsplash.com/photo-1587502536263-9298e3ebd7f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Corte y Peinado', 
      category: 'Belleza',
      image: 'https://images.unsplash.com/photo-1595433562696-1a519d5d3b4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Tratamiento Facial', 
      category: 'Tratamientos Faciales',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529a0a0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Limpieza Facial Profunda', 
      category: 'Tratamientos Faciales',
      image: 'https://images.unsplash.com/photo-1597764699513-5b2d1c0b0c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Exfoliación Corporal', 
      category: 'Tratamientos Corporales',
      image: 'https://images.unsplash.com/photo-1587500154936-1c7c4d5b6c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Envoltura de Barro', 
      category: 'Tratamientos Corporales',
      image: 'https://images.unsplash.com/photo-1595433562696-1a519d5d3b4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Yoga Grupal', 
      category: 'Sesiones Grupales',
      image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    { 
      name: 'Meditación Guiada', 
      category: 'Sesiones Grupales',
      image: 'https://images.unsplash.com/photo-1519181245277-cffeb31da2fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    // Seleccionar un servicio aleatorio por categoría
    const categories = ['Masajes', 'Belleza', 'Tratamientos Faciales', 'Tratamientos Corporales', 'Sesiones Grupales'];
    const randomServices = categories.map(category => {
      const servicesInCategory = allServices.filter(service => service.category === category);
      return servicesInCategory[Math.floor(Math.random() * servicesInCategory.length)];
    });
    setFeaturedServices(randomServices);
  }, []);

  const handleServiceClick = (service) => {
    navigate('/reservas', { state: { service } });
  };

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
          display: 'flex',
          overflowX: 'auto',
          gap: '2rem',
          marginTop: '1rem',
          padding: '1rem 0'
        }}>
          {featuredServices.map((service, index) => (
            <div 
              key={index}
              className="featured-service hover-effect"
              onClick={() => handleServiceClick(service)}
              style={{
                minWidth: '300px',
                cursor: 'pointer',
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                flex: '0 0 auto'
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