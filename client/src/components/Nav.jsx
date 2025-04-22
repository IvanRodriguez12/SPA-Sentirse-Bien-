import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import bambooIcon from '../assets/bamboo-icon.png'; // Asegúrate de que la ruta sea correcta

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: 'var(--verde-medio)',
      padding: '1rem 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Sección izquierda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={logoStyle}>
          <img
            src={bambooIcon}
            alt="Bamboo Icon"
            style={{ width: '40px', height: '40px', marginRight: '0.5rem' }}
          />
          <h1 style={{ margin: 0, display: 'inline-block' }}>Bamboo Spa</h1>
        </Link>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/servicios" style={linkStyle}>Servicios</Link>
        <Link to="/contacto" style={linkStyle}>Contacto</Link>
        <Link to="/sobre-nosotros" style={linkStyle}>Sobre Nosotros</Link>
      </div>

      {/* Sección derecha */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user && (
          <>
            <Link to="/turnos" style={linkStyle}>Turnos</Link>
            <span style={userNameStyle}>{user.nombre}</span> {/* Mostrar el nombre del usuario */}
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

// Estilo botón Iniciar Sesión
const loginButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'transparent',
  border: '2px solid var(--verde-oscuro)',
  color: 'var(--verde-oscuro)',
};

// Estilo botón Registrarse
const registerButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--rosa-medio)',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

// Estilo botón Cerrar Sesión
const logoutButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: 'var(--verde-oscuro)',
  color: 'white',
};

// Estilo para el nombre del usuario
const userNameStyle = {
  fontWeight: 'bold',
  color: 'var(--texto-oscuro)',
  fontSize: '1rem',
};

export default Navbar;