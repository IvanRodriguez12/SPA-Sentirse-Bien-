import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import AdminHeader from './AdminHeader';

Modal.setAppElement('#root');

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: { id: '' },
    tipo: '',
    imagen: '',
    duracion: 30 // Valor por defecto añadido
  });
  const [editingId, setEditingId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const [serviciosRes, categoriasRes] = await Promise.all([
        axios.get('https://spa-sentirse-bien-production.up.railway.app/api/servicios/listar'),
        axios.get('https://spa-sentirse-bien-production.up.railway.app/api/categorias/listar')
      ]);

      setServicios(serviciosRes.data);
      setCategorias(categoriasRes.data);
    } catch {
      toast.error('Error cargando datos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingId
        ? `https://spa-sentirse-bien-production.up.railway.app/api/servicios/editar/${editingId}`
        : 'https://spa-sentirse-bien-production.up.railway.app/api/servicios/crear';

      const method = editingId ? 'put' : 'post';

      await axios[method](endpoint, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success(editingId ? 'Servicio actualizado' : 'Servicio creado');
      fetchDatos();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error guardando servicio');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este servicio permanentemente?")) {
      try {
        await axios.delete(`https://spa-sentirse-bien-production.up.railway.app/api/servicios/eliminar/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Servicio eliminado');
        fetchDatos();
      } catch {
        toast.error('Error eliminando servicio');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: { id: '' },
      tipo: '',
      imagen: '',
      duracion: 30 // Reset al valor por defecto
    });
    setEditingId(null);
    setShowForm(false);
  };

  const openImageModal = (imagenUrl) => {
    const fullImageUrl = `/${imagenUrl}`;
    setSelectedImage(fullImageUrl);
    setModalIsOpen(true);
  };

  const closeImageModal = () => {
    setModalIsOpen(false);
    setSelectedImage('');
  };

  return (
    <div className="admin-panel">
      <AdminHeader title="Gestión de Servicios" />
        <div className="header-container">
          <button
            className="admin-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Ocultar Formulario' : 'Añadir Nuevo Servicio'}
          </button>
        </div>

      {showForm && (
        <div className="admin-card form-container">
          <h3>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Precio ($):</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Duración (minutos):</label>
              <input
                type="number"
                min="1"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select
                value={formData.categoria.id}
                onChange={(e) => setFormData({
                  ...formData,
                  categoria: { id: e.target.value }
                })}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <input
                type="text"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>URL Imagen:</label>
              <input
                type="text"
                value={formData.imagen}
                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                placeholder="Ruta relativa (ej: assets/servicios/facial.jpg)"
                required
              />
            </div>

            <div className="button-group">
              <button type="submit" className="admin-button">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                className="admin-button cancel-button"
                onClick={resetForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        <h3>Servicios Existentes</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Duración</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.descripcion}</td>
                  <td>${servicio.precio.toFixed(2)}</td>
                  <td>{servicio.duracion} min</td>
                  <td>{servicio.categoria?.nombre}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="admin-button image-button"
                        onClick={() => openImageModal(servicio.imagen)}
                      >
                        Ver Imagen
                      </button>
                      <button
                        className="admin-button"
                        onClick={() => {
                          setFormData({
                            ...servicio,
                            categoria: { id: servicio.categoria?.id }
                          });
                          setEditingId(servicio.id);
                          setShowForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-button delete-button"
                        onClick={() => handleDelete(servicio.id)}
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
        isOpen={modalIsOpen}
        onRequestClose={closeImageModal}
        className="image-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h3>Vista Previa de la Imagen</h3>
          <button
            onClick={closeImageModal}
            className="admin-button close-button"
          >
            Cerrar
          </button>
        </div>
        <img
          src={selectedImage}
          alt="Vista previa del servicio"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminServicios;