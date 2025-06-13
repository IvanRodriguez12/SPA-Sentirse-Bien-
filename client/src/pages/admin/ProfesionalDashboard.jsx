import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/ProfesionalDashboard.css';

const ProfesionalDashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filtrarPropios, setFiltrarPropios] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('authUser'));

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = filtrarPropios
        ? `/api/turnos/profesional`
        : `/api/turnos/listar`;

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

      <div className="turno-card">
        <div className="turno-grid">
          <div><span className="turno-label">Servicio:</span></div>
          <div><span className="turno-label">Hora:</span></div>
          <div><span className="turno-label">Precio:</span></div>
          <div><span className="turno-label">Profesional:</span></div>
          <div><span className="turno-label">Cliente:</span></div>
        </div>
      </div>

      {turnos.length === 0 ? (
        <p>No hay turnos para mostrar.</p>
      ) : (
        turnos.map((turno, idx) => (
          <div className="turno-card" key={idx}>
            <div className="turno-grid">
              <div>
                <span className="turno-label">Servicios:</span>{" "}
                {Array.isArray(turno.servicios)
                  ? turno.servicios.map((s, i) =>
                      s ? <span key={i}>{s.nombre}{i < turno.servicios.length - 1 ? ", " : ""}</span> : null
                    )
                  : "Sin servicios"}
              </div>
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
