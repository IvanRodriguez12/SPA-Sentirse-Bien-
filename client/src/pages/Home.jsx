import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { getCategories, getServicesByCategory } from '../api/ListServicios';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Location from '../components/Location';
import WelcomeSection from '../components/WelcomeSection';

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
      <WelcomeSection/>
      <section style={{ marginTop: '2rem' }}>
        <h3>Servicios Destacados</h3>
        <Carousel items={featuredServices} onItemClick={handleServiceClick} />
      </section>
      <WhyChooseUs />
      <Testimonials />
      <Location />
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(to right, var(--verde-claro), var(--rosa-claro))'
      }}>
        <h2>¿Listo para tu experiencia de relajación?</h2>
        <p style={{margin: '1rem 0'}}>Reserva tu sesión hoy mismo y obtén un 10% de descuento en tu primer tratamiento</p>
        <button 
          onClick={() => navigate('/categorias')}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.1rem',
            backgroundColor: 'var(--rosa-medio)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          Reservar Ahora
        </button>
      </section>
    </div>
  );
};

export default Home;