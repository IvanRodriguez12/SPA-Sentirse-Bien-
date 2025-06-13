import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import '../../styles/admin.css';
import AdminHeader from './AdminHeader';

Modal.setAppElement('#root');

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const AdminTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [loading, setLoading] = useState({
    turnos: false,
    clientes: false,
    servicios: false
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      toast.error('Debes iniciar sesión como administrador');
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      fetchClientes();
      fetchServicios();
    }
  }, []);

  useEffect(() => {
    if (selectedCliente && localStorage.getItem('adminToken')) {
      fetchTurnos(selectedCliente);
    } else {
      setTurnos([]);
    }
  }, [selectedCliente]);

  const fetchData = async (url, setData, loadingKey, requiresAuth = true) => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setError(null);

      const config = {};

      if (requiresAuth) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No hay token de administrador');
        }
        config.headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
      }

      const response = await axios.get(url, config);
      setData(response.data);
    } catch (error) {
      console.error(`Error cargando ${loadingKey}:`, error);
      setError(error);
      toast.error(error.response?.data?.message || `Error cargando ${loadingKey}`);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const fetchTurnos = (clienteId) => fetchData(
    `https://spa-sentirse-bien-production.up.railway.app/api/admin/turnos/cliente/${clienteId}`,
    setTurnos,
    'turnos'
  );

  const fetchClientes = () => fetchData(
    `https://spa-sentirse-bien-production.up.railway.app/api/admin/clientes`,
    setClientes,
    'clientes'
  );

  const fetchServicios = async () => {
    await fetchData(`https://spa-sentirse-bien-production.up.railway.app/api/servicios/listar`, () => {}, 'servicios', false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este turno permanentemente?")) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        await axios.delete(`https://spa-sentirse-bien-production.up.railway.app/api/admin/turnos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Turno eliminado correctamente');
        fetchTurnos(selectedCliente);
      } catch (error) {
        console.error("Error eliminando turno:", error);
        toast.error(error.response?.data?.message || 'No tienes permisos para eliminar turnos');
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    }
  };

  if (loading.clientes || loading.servicios) {
    return <div className="admin-panel">Cargando datos iniciales...</div>;
  }

  if (error) {
    return <div className="admin-panel">Error: {error.message || 'Ocurrió un error'}</div>;
  }

  return (
    <div className="admin-panel">
      <AdminHeader title="Gestión de Turnos" />

      <div className="admin-card filter-section">
        <div className="form-group">
          <label>Seleccionar Cliente:</label>
          <select
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
            disabled={loading.clientes}
          >
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} ({cliente.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card">
        

        {loading.turnos ? (
          <div className="loading-message">Cargando turnos...</div>
        ) : turnos.length === 0 ? (
          <div className="no-results">
            {selectedCliente ? 'No hay turnos para este cliente' : 'Seleccione un cliente para ver sus turnos'}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map(turno => {
                  const fechaFin = new Date(new Date(turno.fechaHora).getTime() + turno.servicio.duracion * 60000);
                  return (
                    <tr key={turno.id}>
                      <td>
                        {new Date(turno.fechaHora).toLocaleString()} <br />
                        <small>Fin: {fechaFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                      </td>
                      <td>{turno.cliente.nombre}</td>
                      <td>{turno.servicio.nombre}</td>
                      <td>{turno.servicio.duracion} min</td>
                      <td>{turno.estado || 'Pendiente'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="admin-button delete-button"
                            onClick={() => handleDelete(turno.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="admin-card">
  <h3 style={{ marginTop: '2rem' }}>Crear nuevo turno</h3>
  <CrearTurno />
</div>
          </div>
        )}
      </div>

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        className="admin-modal"
        overlayClassName="modal-overlay"
      >
      </Modal>
    </div>
  );
};

export default AdminTurnos;