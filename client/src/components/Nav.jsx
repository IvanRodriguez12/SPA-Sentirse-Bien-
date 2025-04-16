import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: 'var(--verde-medio)',
      padding: '1rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      gap: '2rem'
    }}>
      {/* Sección izquierda */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>
          Inicio
        </Link>
        <Link to="/servicios" style={linkStyle}>
          Servicios
        </Link>
      </div>

      {/* Logo central */}
      <div style={{
        position: 'absolute',
        left: '10%',
        transform: 'translateX(-50%)'
      }}>
        <Link to="/" style={logoStyle}>
          <h1 style={{ margin: 0 }}>Bamboo Spa</h1>
        </Link>
      </div>

      {/* Sección derecha */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/contacto" style={linkStyle}>
          Contacto
        </Link>
        <Link to="/sobre-nosotros" style={linkStyle}>
          Sobre Nosotros
        </Link>
      </div>
        
        {/* Botones de autenticación */}
        <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
        {user ? (
          <button onClick={logout} style={logoutButtonStyle}>
            Cerrar Sesión
          </button>
        ) : (
          <>
            <Link to="/login" style={loginButtonStyle}>
            Iniciar Sesión
            </Link>
            <Link to="/registro" style={registerButtonStyle}>
            Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
      

// Estilos base
const baseButtonStyle = {
  padding: '0.5rem 1.5rem',
  borderRadius: '25px',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  fontWeight: '500'
};

// Estilo para los links principales
const linkStyle = {
  ...baseButtonStyle,
  color: 'var(--texto-oscuro)',
  ':hover': {
    backgroundColor: 'var(--rosa-claro)',
    transform: 'translateY(-2px)'
  }
};

// Estilo del logo
const logoStyle = {
  textDecoration: 'none',
  color: 'var(--texto-oscuro)',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  transition: 'transform 0.3s ease',
  ':hover': {
    transform: 'scale(1.05)'
  }
};

// Estilo botón Iniciar Sesión
const loginButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'transparent',
  border: '2px solid var(--verde-oscuro)',
  color: 'var(--verde-oscuro)',
  ':hover': {
    backgroundColor: 'var(--verde-oscuro)',
    color: 'white',
    transform: 'scale(1.05)'
  }
};

// Estilo botón Registrarse
const registerButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--rosa-medio)',
  color: 'white',
  ':hover': {
    backgroundColor: 'var(--rosa-claro)',
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
};

const logoutButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--verde-oscuro)',
  color: 'white',
  ':hover': {
    backgroundColor: 'var(--verde-medio)'
  }
};

export default Navbar;