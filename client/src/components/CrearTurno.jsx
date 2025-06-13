import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const schema = yup.object().shape({
  clienteId: yup.string().required('Cliente requerido'),
  servicioId: yup.string().required('Servicio requerido'),
  profesionalId: yup.string().required('Profesional requerido'),
  fecha: yup.string().required('Fecha requerida'),
  hora: yup.string().required('Hora requerida'),
});

const CrearTurno = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [clientesRes, serviciosRes] = await Promise.all([
          axios.get(`${API_URL}/admin/clientes`, config),
          axios.get(`${API_URL}/servicios/listar`, config),
        ]);

        const clientesData = clientesRes.data;
        const profesionalesFiltrados = clientesData.filter(c => c.profesion);

        setClientes(clientesData);
        setServicios(serviciosRes.data);
        setProfesionales(profesionalesFiltrados);
      } catch (err) {
        toast.error("Error cargando datos");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_URL}/turnos`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Turno creado correctamente");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear turno");
    }
  };

  return (
    <div className="form-container">
      <h2>Crear nuevo turno</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <label>Cliente</label>
        <select {...register("clienteId")}>
          <option value="">Seleccionar</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <p>{errors.clienteId?.message}</p>

        <label>Servicio</label>
        <select {...register("servicioId")}>
          <option value="">Seleccionar</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <p>{errors.servicioId?.message}</p>

        <label>Profesional</label>
        <select {...register("profesionalId")}>
          <option value="">Seleccionar</option>
          {profesionales.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <p>{errors.profesionalId?.message}</p>

        <label>Fecha</label>
        <input type="date" {...register("fecha")} />
        <p>{errors.fecha?.message}</p>

        <label>Hora</label>
        <input type="time" {...register("hora")} />
        <p>{errors.hora?.message}</p>

        <button type="submit" disabled={isSubmitting}>Crear Turno</button>
      </form>
    </div>
  );
};

export default CrearTurno;