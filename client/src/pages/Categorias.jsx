import React, { useEffect, useState } from 'react';
import { getCategories, getServicesByCategory } from '../api/ListServicios';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const servicesData = await Promise.all(
          categoriesData.map(async (category) => {
            const categoryServices = await getServicesByCategory(category.id);
            return { [category.nombre]: categoryServices };
          })
        );

        const combinedServices = servicesData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setServices(combinedServices);
      } catch (error) {
        console.error('Error fetching categories or services:', error);
        setError('Hubo un problema al cargar los servicios. Inténtalo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  const handleViewService = (service) => {
    navigate('/servicios', { state: { services: [service] } }); // ✅ Envía una lista con un solo elemento
  };

  if (loading) return <div style={{ padding: '2rem' }}>Cargando servicios...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ animation: 'fadeIn 0.6s ease' }}>Nuestros Servicios</h2>
      {categories.map((category) => (
        <div key={category.id} className="service-card" style={{ margin: '3rem 0' }}>
          <h3 style={{ color: 'var(--verde-oscuro)', borderBottom: '2px solid var(--rosa-medio)', paddingBottom: '0.5rem', fontSize: '1.8rem' }}>
            {category.nombre}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services[category.nombre]?.map((service) => (
              <ServiceCard key={service.id} service={service} onViewDetails={handleViewService} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Categorias;