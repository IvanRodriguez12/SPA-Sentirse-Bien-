// src/components/Layout.jsx
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Nav';

const Layout = () => {
  const location = useLocation();

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
      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer className="spa-footer">
    <p>Contacto: info@SPA “Sentirse bien” .com | Tel: +54 9 1234-567890</p>
    <p>© 2024 SPA “Sentirse bien”  - Todos los derechos reservados</p>
  </footer>
);

export default Layout;