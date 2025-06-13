import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import '../../styles/ProfesionalDashboard.css';

const ProfesionalDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filtrarPropios, setFiltrarPropios] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('authUser'));

  const hoy = format(new Date(), 'yyyy-MM-dd');
  const manana = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = filtrarPropios
        ? `/api/turnos/profesional/${usuario.id}?fechaInicio=${hoy}&fechaFin=${manana}`
        : `/api/turnos/listar?fechaInicio=${hoy}&fechaFin=${manana}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTurnos(response.data);
    } catch (error) {
      console.error("Error al obtener turnos", error);
    }
  };

  useEffect(() => {
    if (usuario?.profesion) {
      fetchTurnos();
    }
  }, [filtrarPropios]);

  return (
    <div className="dashboard-container">
      <h2>Turnos de Hoy y Mañana</h2>
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
              <div><span className="turno-label">Servicio:</span> {turno.servicio?.nombre}</div>
              <div><span className="turno-label">Hora:</span> {turno.horaInicio}</div>
              <div><span className="turno-label">Precio:</span> ${turno.precio}</div>
              <div><span className="turno-label">Profesional:</span> {turno.profesional?.nombre}</div>
              <div><span className="turno-label">Cliente:</span> {turno.cliente?.nombre}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfesionalDashboard;
