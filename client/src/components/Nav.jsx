import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../assets/Spa-icon.png';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav style={navStyle}>
      {/* Sección izquierda */}
      <div style={menuContainerStyle}>
        <Link to="/" style={logoStyle}>
          <img src={Icon} alt="Spa Icon" style={iconStyle} />
          <h1 style={titleStyle}>SPA “Sentirse bien”</h1>
        </Link>
        <div style={menuLinksStyle}>
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/categorias" style={linkStyle}>Servicios</Link>
          <Link to="/contacto" style={linkStyle} state={{ backgroundLocation: location }}>
            Contacto
          </Link>
        </div>
      </div>

      {/* Sección derecha */}
      <div style={menuContainerStyle}>
        {user ? (
          <>
            <Link to="/turnos" style={linkStyle}>Turnos</Link>
            <span style={userNameStyle}>{user.nombre}</span>
            <button onClick={logout} style={logoutButtonStyle}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={loginButtonStyle}>Iniciar Sesión</Link>
            <Link to="/registro" style={registerButtonStyle}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Estilos adaptativos para centrar en cualquier dispositivo
const navStyle = {
  backgroundColor: 'var(--verde-medio)',
  padding: '1rem 5%',
  maxWidth: '1200px', // Limita el ancho en pantallas grandes
  margin: '0 auto', // Centra el navbar en cualquier tamaño de pantalla
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center', // Centrado en móviles
};

const menuContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  justifyContent: 'center', // Centra los elementos horizontalmente
};

const menuLinksStyle = {
  display: 'flex',
  gap: '1rem',
};

const logoStyle = {
  textDecoration: 'none',
  color: 'var(--texto-oscuro)',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  width: '40px',
  height: '40px',
  marginRight: '0.5rem',
};

const titleStyle = {
  margin: 0,
  display: 'inline-block',
};

const baseButtonStyle = {
  padding: '0.5rem 1.5rem',
  borderRadius: '25px',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  fontWeight: '500',
};

const linkStyle = {
  ...baseButtonStyle,
  color: 'var(--texto-oscuro)',
};

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
