import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../assets/Spa-icon.png';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src={Icon} alt="Spa Icon" className="navbar-icon" />
          <span className="navbar-title">SPA “Sentirse bien”</span>
        </Link>
      </div>

      {/* Botón hamburguesa visible solo en mobile */}
      {isMobile && (
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      )}

      {/* Menú principal */}
      <div className={`navbar-links ${isMobile && menuOpen ? 'mobile-menu open' : isMobile ? 'mobile-menu' : ''}`}>
        <Link to="/" onClick={closeMenu}>Inicio</Link>
        <Link to="/categorias" onClick={closeMenu}>Servicios</Link>
        <Link to="/contacto" state={{ backgroundLocation: location }} onClick={closeMenu}>Contacto</Link>

        {user ? (
          <>
            <Link to="/turnos" onClick={closeMenu}>Turnos</Link>
            <span className="user-name">{user.nombre}</span>
            <button onClick={() => { logout(); closeMenu(); }} className="navbar-button">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} className="navbar-button">Iniciar Sesión</Link>
            <Link to="/registro" onClick={closeMenu} className="navbar-button register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
