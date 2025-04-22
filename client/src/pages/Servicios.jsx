import React, { useEffect, useState } from 'react';
import { getCategories, getServicesByCategory } from '../api/ListServicios';
import { useNavigate } from 'react-router-dom';

const Servicios = () => {
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

        // Fetch services for all categories concurrently
        const servicesData = await Promise.all(
          categoriesData.map(async (category) => {
            const categoryServices = await getServicesByCategory(category.id);
            return { [category.nombre]: categoryServices };
          })
        );

        // Combine all services into a single object
        const combinedServices = servicesData.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

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

  const handleReserve = (service) => {
    navigate('/reservas', { state: { service } });
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando servicios...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ animation: 'fadeIn 0.6s ease' }}>Nuestros Servicios</h2>

      {categories.map((category) => (
        <div key={category.id} className="service-card" style={{ margin: '3rem 0' }}>
          <h3 style={categoryStyle}>{category.nombre}</h3>
          <ul style={listStyle}>
            {services[category.nombre]?.map((service) => (
              <li key={service.id} className="hover-effect" style={serviceItemStyle}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>{service.nombre}</h4>
                  <p>{service.descripcion}</p>
                  <p><strong>Precio:</strong> ${service.precio}</p>
                </div>
                <button
                  style={buttonStyle}
                  onClick={() => handleReserve(service)}
                >
                  Reservar
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Estilos separados para mejor lectura
const categoryStyle = {
  color: 'var(--verde-oscuro)',
  borderBottom: '2px solid var(--rosa-medio)',
  paddingBottom: '0.5rem',
  fontSize: '1.8rem',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const serviceItemStyle = {
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const buttonStyle = {
  backgroundColor: 'var(--rosa-medio)',
  border: 'none',
  padding: '0.8rem 1.5rem',
  borderRadius: '25px',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

export default Servicios;