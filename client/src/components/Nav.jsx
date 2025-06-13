import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../assets/Spa-icon.png';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <img src={Icon} alt="Spa Icon" className="navbar-icon" />
          <h1 className="navbar-title">SPA “Sentirse bien”</h1>
        </Link>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={navbar-right ${menuOpen ? 'open' : ''}}>
        <Link to="/" className="nav-link" onClick={closeMenu}>Inicio</Link>
        <Link to="/categorias" className="nav-link" onClick={closeMenu}>Servicios</Link>
        <Link to="/contacto" className="nav-link" state={{ backgroundLocation: location }} onClick={closeMenu}>Contacto</Link>

        {user ? (
          <>
            <Link to="/turnos" className="nav-link" onClick={closeMenu}>Turnos</Link>
            <span className="user-name">{user.nombre}</span>
            <button onClick={() => { logout(); closeMenu(); }} className="logout-button">Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button" onClick={closeMenu}>Iniciar Sesión</Link>
            <Link to="/registro" className="register-button" onClick={closeMenu}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;