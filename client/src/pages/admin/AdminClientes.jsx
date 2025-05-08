import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin.css';
import AdminHeader from './AdminHeader';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/clientes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setClientes(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este cliente permanentemente?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/clientes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchClientes();
      } catch (error) {
        console.error("Error eliminando cliente:", error);
      }
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      className="admin-button"
                      style={{ background: 'var(--rosa-medio)' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;