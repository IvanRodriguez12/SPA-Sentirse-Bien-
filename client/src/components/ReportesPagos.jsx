import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const ReportesPagos = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  const obtenerReportes = async () => {
    if (!desde || !hasta) return alert("Debes seleccionar el rango de fechas.");

    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resServicios, resProfesionales] = await Promise.all([
        axios.get(`${API_URL}/turnos/reportes/servicios`, {
          ...config, params: { desde, hasta }
        }),
        axios.get(`${API_URL}/turnos/reportes/profesionales`, {
          ...config, params: { desde, hasta }
        })
      ]);

      setServicios(resServicios.data);
      setProfesionales(resProfesionales.data);
    } catch (err) {
      console.error(err);
      alert("Error al obtener reportes");
    }
  };

  return (
    <div className="reportes-container">
      <h2>Reportes de Pagos</h2>

      <div className="filtros">
        <label>Desde: <input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} /></label>
        <button onClick={obtenerReportes}>Buscar</button>
      </div>

      <h3>Totales por Servicio</h3>
      <table>
        <thead>
          <tr><th>Servicio</th><th>Total Pagado</th></tr>
        </thead>
        <tbody>
          {servicios.map((s, i) => (
            <tr key={i}><td>{s.servicio}</td><td>${s.totalPagado.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>

      <h3>Totales por Profesional</h3>
      <table>
        <thead>
          <tr><th>Profesional</th><th>Total Pagado</th></tr>
        </thead>
        <tbody>
          {profesionales.map((p, i) => (
            <tr key={i}><td>{p.profesional}</td><td>${p.totalPagado.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportesPagos;
