import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/admin.css';
import AdminHeader from './AdminHeader';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar token antes de hacer cualquier petición
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      toast.error('Debes iniciar sesión primero');
      return;
    }

    fetchClientes();
  }, [navigate]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/admin/clientes', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Error cargando clientes');

      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este cliente permanentemente?")) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        await axios.delete(`http://localhost:8080/api/admin/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Cliente eliminado correctamente');
        fetchClientes();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
        toast.error(error.response?.data?.message || 'Error eliminando cliente');
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-panel">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="admin-panel">Error: {error}</div>;
  }

  return (
    <div className="admin-panel">
      <AdminHeader title="Gestión de Clientes" />

      <div className="admin-card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          {filteredClientes.length === 0 ? (
            <p>No se encontraron clientes</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(cliente.id)}
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
      </div>
    </div>
  );
};

export default AdminClientes;