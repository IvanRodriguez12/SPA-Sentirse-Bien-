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
  const [currentTurno, setCurrentTurno] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState({
    turnos: false,
    clientes: false,
    servicios: false
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Verificar token al montar el componente
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

  const fetchServicios = () => fetchData(
    `https://spa-sentirse-bien-production.up.railway.app/api/servicios/listar`,
    setServicios,
    'servicios',
    false
  );

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

  const handleEdit = (turno) => {
    setCurrentTurno({
      ...turno,
      fechaHora: new Date(turno.fechaHora).toISOString().slice(0, 16),
      estado: turno.estado || 'PENDIENTE' // Asegurar valor por defecto
    });
    setEditModalOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Sesión expirada. Por favor inicie sesión nuevamente');
        navigate('/admin/login');
        return;
      }

      // 1. Validación extendida del token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (tokenPayload.exp < now) {
        toast.error('Tu sesión ha expirado');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      // 2. Preparar datos con validación estricta
      const turnoData = {
        fechaHora: new Date(currentTurno.fechaHora).toISOString(),
        servicioId: Number(currentTurno.servicio.id),
        clienteId: Number(currentTurno.cliente.id),
        estado: currentTurno.estado || 'PENDIENTE'
      };

      // 3. Configuración de axios con credenciales
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
        timeout: 10000
      };

      // 4. Interceptor para capturar errores detallados
      const instance = axios.create();
      instance.interceptors.response.use(
        response => response,
        error => {
          if (error.response?.status === 403) {
            const errorMessage = error.response.headers['x-error-message'] ||
                               error.response.data?.message ||
                               'Acceso denegado';
            console.error('Error 403 Detallado:', {
              status: error.response.status,
              headers: error.response.headers,
              data: error.response.data,
              errorMessage
            });
            error.message = errorMessage; // Sobrescribir mensaje genérico
          }
          return Promise.reject(error);
        }
      );

      // 5. Realizar petición
      const response = await instance.put(
        `https://spa-sentirse-bien-production.up.railway.app/api/admin/turnos/${currentTurno.id}`,
        turnoData,
        config
      );

      if (response.status === 200) {
        toast.success('Turno actualizado correctamente');
        setEditModalOpen(false);
        fetchTurnos(selectedCliente);
      }
    } catch (error) {
      console.error('Error completo al actualizar turno:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      // 6. Manejo específico de error 403
      if (error.response?.status === 403) {
        if (error.message.includes('CSRF') || error.message.includes('csrf')) {
          toast.error('Error de seguridad. Recarga la página e intenta nuevamente');
        } else if (error.message.includes('role') || error.message.includes('permiso')) {
          toast.error('No tienes permisos suficientes para esta acción');
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          toast.error(`Acceso denegado: ${error.message}`);
        }
      } else {
        toast.error(error.message || 'Error al actualizar el turno');
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
                            className="admin-button"
                            onClick={() => handleEdit(turno)}
                          >
                            Editar
                          </button>
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
          </div>
        )}
      </div>

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        className="admin-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h3>Editar Turno</h3>
          <button
            onClick={() => setEditModalOpen(false)}
            className="admin-button close-button"
          >
            ×
          </button>
        </div>
        {currentTurno && (
          <form onSubmit={handleSubmitEdit}>
            <div className="form-group">
              <label>Fecha y Hora:</label>
              <input
                type="datetime-local"
                value={currentTurno.fechaHora}
                onChange={(e) => setCurrentTurno({...currentTurno, fechaHora: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Servicio:</label>
              <select
                value={currentTurno.servicio?.id || ''}
                onChange={(e) => setCurrentTurno({
                  ...currentTurno,
                  servicio: servicios.find(s => s.id == e.target.value)
                })}
                required
              >
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre} ({servicio.duracion} min)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Duración:</label>
              <input
                type="text"
                value={currentTurno.servicio?.duracion ? `${currentTurno.servicio.duracion} minutos` : 'No definida'}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label>Estado:</label>
              <select
                value={currentTurno.estado || 'PENDIENTE'}
                onChange={(e) => setCurrentTurno({...currentTurno, estado: e.target.value})}
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="CANCELADO">Cancelado</option>
                <option value="COMPLETADO">Completado</option>
              </select>
            </div>
            <div className="button-group">
              <button type="submit" className="admin-button">
                Guardar Cambios
              </button>
              <button
                type="button"
                className="admin-button cancel-button"
                onClick={() => setEditModalOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminTurnos;