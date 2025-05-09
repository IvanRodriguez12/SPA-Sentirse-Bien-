import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/admin.css';
import AdminHeader from './AdminHeader';

const API_URL = 'https://spa-sentirse-bien-production.up.railway.app/api'; // Cambiar por tu endpoint real

const AdminCuentas = () => {
  const [clientes, setClientes] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      toast.error('Debes iniciar sesión primero');
      return;
    }

    Promise.all([fetchClientes(), fetchAdministradores()])
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/clientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(response.data);
    } catch (error) {
      handleError(error, 'Error cargando clientes');
    }
  };

  const fetchAdministradores = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/administradores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdministradores(response.data);
    } catch (error) {
      handleError(error, 'Error cargando administradores');
    }
  };

  const handleError = (error, message) => {
    console.error(message, error);
    setError(error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const handleDelete = async (id, tipo) => {
    const confirmMessage = tipo === 'cliente' 
      ? "¿Eliminar este cliente permanentemente?" 
      : "¿Eliminar este administrador permanentemente?";

    if (window.confirm(confirmMessage)) {
      try {
        const token = localStorage.getItem('adminToken');
        const endpoint = tipo === 'cliente' 
          ? `clientes/${id}` 
          : `administradores/${id}`;

        await axios.delete(`${API_URL}/admin/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado correctamente`);
        tipo === 'cliente' ? fetchClientes() : fetchAdministradores();
      } catch (error) {
        handleError(error, `Error eliminando ${tipo}`);
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdministradores = administradores.filter(admin =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-panel">Cargando cuentas...</div>;
  if (error) return <div className="admin-panel">Error: {error}</div>;

  const TablaCuentas = ({ datos, tipo, onDelete, columns }) => (
    <div className="table-container">
      {datos.length === 0 ? (
        <p>No se encontraron {tipo}s</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {/* Mostrar teléfono solo para clientes */}
                    {col === 'Teléfono' ? item.telefono : item[col.toLowerCase()]}
                  </td>
                ))}
                <td>
                  <button
                    onClick={() => onDelete(item.id, tipo)}
                    className="admin-button delete-button"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="admin-panel">
      <AdminHeader title="Gestión de Cuentas" />

      <div className="admin-card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section className="accounts-section">
          <h3>Clientes ({filteredClientes.length})</h3>
          <TablaCuentas
            datos={filteredClientes}
            tipo="cliente"
            onDelete={handleDelete}
            columns={['Nombre', 'Email', 'Teléfono']} // Teléfono ahora sí se muestra
          />
        </section>

        <section className="accounts-section">
          <h3>Administradores ({filteredAdministradores.length})</h3>
          <TablaCuentas
            datos={filteredAdministradores}
            tipo="administrador"
            onDelete={handleDelete}
            columns={['Email']} // Eliminada la fecha de registro
          />
        </section>
      </div>
    </div>
  );
};

export default AdminCuentas;
