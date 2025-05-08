// src/components/Layout.jsx
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Nav';

const Layout = () => {
  const location = useLocation();
  const background = location.state?.backgroundLocation;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
      <div>
        <h3>Contacto</h3>
        <p>📧 info@sentirsebien.com</p>
        <p>📞 +54 9 11 2345-6789</p>
      </div>
      
      <div>
        <h3>Enlaces Rápidos</h3>
        <Link to="/servicios" style={{color: 'white', display: 'block'}}>Servicios</Link>
        <Link to="/faq" style={{color: 'white', display: 'block'}}>Preguntas Frecuentes</Link>
        <Link to="/blog" style={{color: 'white', display: 'block'}}>Blog Wellness</Link>
      </div>
      
      <div>
        <h3>Síguenos</h3>
        <div style={{display: 'flex', gap: '1rem'}}>
          <a href="#" style={{color: 'white'}}>📱 Instagram</a>
          <a href="#" style={{color: 'white'}}>📘 Facebook</a>
        </div>
      </div>
    </div>
    
    <div style={{
      textAlign: 'center',
      marginTop: '2rem',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      paddingTop: '2rem'
    }}>
      <p>© 2024 SPA "Sentirse Bien" - Todos los derechos reservados</p>
    </div>
  </footer>
);

export default Layout;