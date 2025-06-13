import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ProfesionalDashboard.css';

const ProfesionalDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filtrarPropios, setFiltrarPropios] = useState(false);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = filtrarPropios
        ? '/api/turnos/profesional'
        : '/api/turnos/listar';

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTurnos(response.data);
    } catch (error) {
      console.error("Error al obtener turnos", error);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [filtrarPropios]);

  return (
    <div className="dashboard-container">
      <h2>Turnos del Profesional</h2>
      <button onClick={() => window.print()} style={{ marginBottom: '1rem' }}>Imprimir Turnos</button>
      <label>
        <input
          type="checkbox"
          checked={filtrarPropios}
          onChange={(e) => setFiltrarPropios(e.target.checked)}
        />
        Mostrar solo mis turnos
      </label>

      {turnos.length === 0 ? (
        <p>No hay turnos para mostrar.</p>
      ) : (
        turnos.map((turno, idx) => (
          <div className="turno-card" key={idx}>
            <div className="turno-grid">
              <div><span className="turno-label">Servicios:</span> {turno.servicios?.join(", ")}</div>
              <div><span className="turno-label">Hora:</span> {turno.horaInicio}</div>
              <div><span className="turno-label">Profesional:</span> {turno.profesionalNombre}</div>
              <div><span className="turno-label">Cliente:</span> {turno.clienteNombre}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfesionalDashboard;