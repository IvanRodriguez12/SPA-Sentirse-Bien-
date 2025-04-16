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

const Header = () => (
  <header className="spa-header">
    <div className="logo-container">
      <Link to="/">
        <h1>Lotus Bamboo Spa</h1>
      </Link>
      <div className="logo-symbols">
        <span className="bamboo">🎋</span>
        <span className="lotus">🌸</span>
        <span className="stone">🪨</span>
      </div>
    </div>
    <nav className="main-nav">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="spa-footer">
    {/* ... (mismo footer que antes) ... */}
  </footer>
);

export default Layout;