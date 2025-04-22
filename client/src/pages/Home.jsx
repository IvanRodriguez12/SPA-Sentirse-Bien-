import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';

const Home = () => {
  const navigate = useNavigate();
  const allServices = [
    { name: 'Masajes Anti-stress', category: 'Masajes', image: '...' },
    { name: 'Masaje Relajante', category: 'Masajes', image: '...' },
    { name: 'Manicura y Pedicura', category: 'Belleza', image: '...' },
    { name: 'Corte y Peinado', category: 'Belleza', image: '...' },
    { name: 'Tratamiento Facial', category: 'Tratamientos Faciales', image: '...' },
    { name: 'Limpieza Facial Profunda', category: 'Tratamientos Faciales', image: '...' },
    { name: 'Exfoliación Corporal', category: 'Tratamientos Corporales', image: '...' },
    { name: 'Yoga Grupal', category: 'Sesiones Grupales', image: '...' },
    { name: 'Meditación Guiada', category: 'Sesiones Grupales', image: '...' },
  ];

  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    const categories = ['Masajes', 'Belleza', 'Tratamientos Faciales', 'Tratamientos Corporales', 'Sesiones Grupales'];
    const randomServices = categories.map((category) => {
      const servicesInCategory = allServices.filter((service) => service.category === category);
      return servicesInCategory[Math.floor(Math.random() * servicesInCategory.length)];
    });
    setFeaturedServices(randomServices);
  }, []);

  const handleServiceClick = (service) => {
    navigate('/reservas', { state: { service } });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: `linear-gradient(to right, var(--verde-claro), var(--rosa-claro))`,
          animation: 'fadeIn 1s ease',
        }}
      >
        <h2>Bienvenido a SPA “Sentirse bien” </h2>
        <p>Tu oasis de relajación natural</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Servicios Destacados</h3>
        <Carousel items={featuredServices} onItemClick={handleServiceClick} />
      </section>
    </div>
  );
};

export default Home;