import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../assets/Spa-icon.png'; // Asegúrate de que la ruta sea correcta
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={{
      backgroundColor: 'var(--verde-medio)',
      padding: '1rem 5%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Sección izquierda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={logoStyle}>
          <img
            src={Icon}
            alt="Spa Icon"
            style={{ width: '40px', height: '40px', marginRight: '0.5rem' }}
          />
          <h1 style={{ margin: 0, display: 'inline-block' }}>SPA “Sentirse bien” </h1>
        </Link>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/categorias" style={linkStyle}>Servicios</Link>
        <Link
          to="/contacto"
          style={linkStyle}
          state={{ backgroundLocation: location }}
        >
          Contacto
        </Link>
      </div>

      {/* Sección derecha */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user && (
          <>
            <Link to="/turnos" style={linkStyle}>Turnos</Link>
            <span style={userNameStyle}>{user.nombre}</span>
            <button onClick={logout} style={logoutButtonStyle}>
              Cerrar Sesión
            </button>
          </>
        )}
        {!user && (
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
  textAlign: 'center',
  transition: 'all 0.3s ease',
  fontWeight: '500',
};

// Estilo para los links principales
const linkStyle = {
  ...baseButtonStyle,
  color: 'var(--texto-oscuro)',
};

// Estilo del logo
const logoStyle = {
  textDecoration: 'none',
  color: 'var(--texto-oscuro)',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
};

// Estilos responsive con `@media`
const responsiveStyles = {
  '@media (max-width: 768px)': {
    nav: {
      flexDirection: 'column',
      textAlign: 'center',
    },
    '.menu': {
      flexDirection: 'column',
      gap: '10px',
    },
  }
};

// Estilos botones
const loginButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'transparent',
  border: '2px solid var(--verde-oscuro)',
  color: 'var(--verde-oscuro)',
};

const registerButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--rosa-medio)',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const logoutButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--verde-oscuro)',
  color: 'white',
};

const userNameStyle = {
  fontWeight: 'bold',
  color: 'var(--texto-oscuro)',
  fontSize: '1rem',
};

export default Navbar;
