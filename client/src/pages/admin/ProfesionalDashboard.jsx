import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DashboardProfesional = () => {
  const [turnos, setTurnos] = useState([]);
  const [filtrarPropios, setFiltrarPropios] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('authUser'));

  const hoy = format(new Date(), 'yyyy-MM-dd');
  const manana = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `https://spa-sentirse-bien-production.up.railway.app/api/turnos/profesional/${usuario.id}?fechaInicio=${hoy}&fechaFin=${manana}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTurnos(response.data);
    } catch (error) {
      console.error("Error al obtener turnos", error);
    }
  };

  useEffect(() => {
    if (usuario?.profesion) {
      fetchTurnos();
    }
  }, []);

  const turnosFiltrados = filtrarPropios
    ? turnos.filter(t => t.profesional?.id === usuario.id)
    : turnos;

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
      <ul className="turno-list">
        {turnosFiltrados.map((turno) => (
          <li key={turno.id} className="turno-item">
            <strong>{format(new Date(turno.fecha), 'eeee dd/MM', { locale: es })}</strong><br />
            {turno.hora} - {turno.servicio?.nombre}<br />
            Cliente: {turno.cliente?.nombre}<br />
            Profesional: {turno.profesional?.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardProfesional;
