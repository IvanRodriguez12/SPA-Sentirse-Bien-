// src/components/Layout.jsx
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Nav';

const Layout = () => {
  const location = useLocation();
  const background = location.state?.backgroundLocation;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
  if (window.botpressWebChat) {
    setTimeout(() => {
      window.botpressWebChat.sendEvent({ type: 'show' });
    }, 1000);
    return;
  }

  const script1 = document.createElement('script');
  script1.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
  script1.async = true;

  script1.onload = () => {
    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/06/12/02/20250612022903-7E8BQV3B.js';
    script2.async = true;

    setTimeout(() => {
      document.body.appendChild(script2);
    }, 1000); 
  };

  document.body.appendChild(script1);
}, []);

  return (
    <div className="spa-app">
      <Navbar />
      <main>
        <Outlet />
      </main>
      {background && (
        <Routes>
          <Route path="/contacto" element={<ContactoModal />} />
        </Routes>
      )}
      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer style={{
    backgroundColor: 'var(--verde-oscuro)',
    color: 'white',
    padding: '3rem 2rem',
    marginTop: 'auto'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Sección Contacto */}
      <div>
        <h3>Contacto</h3>
        <p>📧 spasentirsebiencontacto@gmail.com</p>
        <p>📞 +54 9 12 3456-7890</p>
      </div>

      {/* Sección Enlaces Rápidos */}
      <div>
        <h3>Enlaces Rápidos</h3>
        <Link
          to="/categorias"
          style={{
            color: 'white',
            display: 'block',
            textDecoration: 'none',
            marginBottom: '0.5rem'
          }}>
          Servicios
        </Link>
        <Link
          to="/faq"
          style={{
            color: 'white',
            display: 'block',
            textDecoration: 'none',
            marginBottom: '0.5rem'
          }}>
          Preguntas Frecuentes
        </Link>
        <Link
          to="/sobre-nosotros"
          style={{
            color: 'white',
            display: 'block',
            textDecoration: 'none'
          }}>
          Sobre Nosotros
        </Link>
      </div>

      {/* Sección Redes Sociales - Versión en columna CENTRADA */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Centra todo el contenido horizontalmente
      }}>
        <h3 style={{
          marginBottom: '1rem',
          width: '100%',
          textAlign: 'center' // Centra el texto del título
        }}>
          Síguenos
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centra los elementos hijos horizontalmente
          gap: '0.8rem',
          width: '100%'
        }}>
          <a href="https://www.instagram.com/spa.sentirsebien/" style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📱</span> Instagram
          </a>
          <a href="https://www.facebook.com/profile.php?id=61577026581004" style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📘</span> Facebook
          </a>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div style={{
      textAlign: 'center',
      marginTop: '2rem',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      paddingTop: '2rem'
    }}>
      <p>© 2019 SPA "Sentirse Bien" - Todos los derechos reservados</p>
    </div>
  </footer>
);

export default Layout;