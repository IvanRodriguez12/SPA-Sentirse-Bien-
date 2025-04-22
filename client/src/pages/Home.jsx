import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { getCategories, getServicesByCategory } from '../api/ListServicios';

const Home = () => {
  const navigate = useNavigate();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setLoading(true);
        const categories = await getCategories(); // Obtener todas las categorías
        const randomServices = await Promise.all(
          categories.map(async (category) => {
            const servicesInCategory = await getServicesByCategory(category.id); // Obtener servicios por categoría
            if (servicesInCategory.length > 0) {
              // Seleccionar un servicio aleatorio de la categoría
              const randomService = servicesInCategory[Math.floor(Math.random() * servicesInCategory.length)];
              return {
                ...randomService,
                categoryName: category.nombre, // Agregar el nombre de la categoría al objeto del servicio
              };
            }
            return null; // Si no hay servicios en la categoría, devolver null
          })
        );
        setFeaturedServices(randomServices.filter((service) => service !== null)); // Filtrar categorías sin servicios
      } catch (err) {
        console.error('Error fetching featured services:', err);
        setError('Hubo un problema al cargar los servicios destacados. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const handleServiceClick = (service) => {
    navigate('/servicios', { state: { service } }); // Redirigir a la página de servicios con el servicio seleccionado
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando servicios destacados...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  }

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
        <h2>Bienvenido a SPA “Sentirse bien”</h2>
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