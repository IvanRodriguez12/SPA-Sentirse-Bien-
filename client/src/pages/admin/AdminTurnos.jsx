import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import AdminHeader from './AdminHeader';

Modal.setAppElement('#root');

const AdminTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTurno, setCurrentTurno] = useState(null);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetchClientes();
    fetchServicios();
    if (selectedCliente) fetchTurnos(selectedCliente);
  }, [selectedCliente]);

  const fetchTurnos = async (clienteId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/turnos/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setTurnos(response.data);
    } catch {
      toast.error('Error cargando turnos');
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/clientes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setClientes(response.data);
    } catch {
      toast.error('Error cargando clientes');
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/servicios/listar');
      setServicios(response.data);
    } catch {
      toast.error('Error cargando servicios');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este turno permanentemente?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/turnos/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        toast.success('Turno eliminado');
        fetchTurnos(selectedCliente);
      } catch {
        toast.error('Error eliminando turno');
      }
    }
  };

  const handleEdit = (turno) => {
    setCurrentTurno({
      ...turno,
      fechaHora: new Date(turno.fechaHora).toISOString().slice(0, 16)
    });
    setEditModalOpen(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/turnos/editar/${currentTurno.id}`, currentTurno, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      toast.success('Turno actualizado');
      setEditModalOpen(false);
      fetchTurnos(selectedCliente);
    } catch {
      toast.error('Error actualizando turno');
    }
  };

  return (
    <div className="admin-panel">
      <AdminHeader title="Gestión de Turnos" />
      
      <div className="admin-card filter-section">
        <div className="form-group">
          <label>Seleccionar Cliente:</label>
          <select
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
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
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map(turno => (
                <tr key={turno.id}>
                  <td>{new Date(turno.fechaHora).toLocaleString()}</td>
                  <td>{turno.cliente.nombre}</td>
                  <td>{turno.servicio.nombre}</td>
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
              ))}
            </tbody>
          </table>
        </div>
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
        <form onSubmit={handleSubmitEdit}>
          <div className="form-group">
            <label>Fecha y Hora:</label>
            <input
              type="datetime-local"
              value={currentTurno?.fechaHora || ''}
              onChange={(e) => setCurrentTurno({...currentTurno, fechaHora: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Servicio:</label>
            <select
              value={currentTurno?.servicio?.id || ''}
              onChange={(e) => setCurrentTurno({
                ...currentTurno, 
                servicio: servicios.find(s => s.id == e.target.value)
              })}
              required
            >
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado:</label>
            <select
              value={currentTurno?.estado || 'PENDIENTE'}
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
      </Modal>
    </div>
  );
};

export default AdminTurnos;