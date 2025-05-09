import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import '../../styles/admin.css';
import AdminHeader from './AdminHeader';

const AdminDashboard = () => {
  const { logout } = useAdminAuth();

  return (
    <div className="admin-panel">
      <nav style={{ 
        background: 'var(--verde-medio)', 
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '5px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h2 style={{ color: 'white', margin: 0 }}>
            Panel de Administración
          </h2>
          <button 
            onClick={logout}
            className="admin-button"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Nuevo card para registro de administradores */}
        <Link to="/admin/registrar" className="admin-card">
          <h3>Registrar Administradores</h3>
          <p>Crear nuevas cuentas de administradores</p>
        </Link>

        <Link to="/admin/servicios" className="admin-card">
          <h3>Gestionar Servicios</h3>
          <p>Agrega, edita o elimina servicios</p>
        </Link>
        
        <Link to="/admin/turnos" className="admin-card">
          <h3>Gestionar Turnos</h3>
          <p>Consulta y elimina turnos</p>
        </Link>
        
        <Link to="/admin/cuentas" className="admin-card">
          <h3>Gestionar Cuentas</h3>
          <p>Administra clientes y otros administradores</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;