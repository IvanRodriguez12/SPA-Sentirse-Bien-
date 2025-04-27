import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Reserva = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const service = location.state?.service;
    const editingTurno = location.state?.editingTurno; // Obtener el turno a editar

    const [dia, setDia] = useState('01');
    const [mes, setMes] = useState('01');
    const [hora, setHora] = useState('08:00');

    useEffect(() => {
        // Si estamos editando un turno, precargar los valores en el formulario
        if (editingTurno) {
            const fechaEditar = new Date(editingTurno.fechaHora);
            setDia(fechaEditar.getDate().toString().padStart(2, '0'));
            setMes((fechaEditar.getMonth() + 1).toString().padStart(2, '0'));
            const horaEditar = fechaEditar.getHours().toString().padStart(2, '0');
            const minutosEditar = fechaEditar.getMinutes().toString().padStart(2, '0');
            setHora(`${horaEditar}:${minutosEditar}`);
        }
    }, [editingTurno]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken"); // Usa el mismo token de AuthContext

        const year = new Date().getFullYear();
        const selectedDate = new Date(`${year}-${mes}-${dia}T${hora}:00`);
        const now = new Date();

        if (selectedDate < now) {
            toast.error("No puedes seleccionar una fecha pasada.");
            return;
        }

        if (selectedDate.getDay() === 0) {
            toast.error("No puedes reservar turnos los domingos.");
            return;
        }

        const turnoData = {
            servicio: { id: service.id },
            cliente: { id: user.id },
            fechaHora: selectedDate.toISOString(),
        };

        try {
            if (!token) {
                throw new Error("Token no encontrado, inicia sesión nuevamente.");
            }

            if (editingTurno) {
                await axios.put(`http://localhost:8080/api/turnos/editar/${editingTurno.id}`, turnoData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Agregado el token JWT
                        "Content-Type": "application/json"
                    }
                });
                toast.success("Turno actualizado exitosamente.");
            } else {
                await axios.post("http://localhost:8080/api/turnos/crear", turnoData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Agregado el token JWT
                        "Content-Type": "application/json"
                    }
                });
                toast.success("Turno reservado exitosamente.");
            }

            navigate("/turnos");
        } catch (error) {
            console.error("Error al reservar/editar el turno:", error.response?.data || error.message);
            toast.error("Hubo un problema al reservar/editar el turno. Inténtalo nuevamente.");
        }
    };

    const diasOptions = Array.from({ length: 31 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return <option key={day} value={day}>{day}</option>;
    });

    const mesesOptions = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return <option key={month} value={month}>{month}</option>;
    });

    const horasOptions = Array.from({ length: 25 }, (_, i) => {
        const hour = Math.floor(8 + i / 2).toString().padStart(2, '0');
        const minutes = i % 2 === 0 ? '00' : '30';
        return <option key={`${hour}:${minutes}`} value={`${hour}:${minutes}`}>{`${hour}:${minutes}`}</option>;
    });

    return (
        <div className="form-container" style={{ padding: '2rem' }}>
            <h2>{editingTurno ? 'Editar Turno' : 'Reservar Servicio'}</h2>
            {service && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <p><strong>Servicio:</strong> {service.nombre}</p>
                    <p><strong>Descripción:</strong> {service.descripcion}</p>
                    <p><strong>Precio:</strong> ${service.precio}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor="dia" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Selecciona el día:
                </label>
                <select
                    id="dia"
                    value={dia}
                    onChange={(e) => setDia(e.target.value)}
                    style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {diasOptions}
                </select>

                <label htmlFor="mes" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Selecciona el mes:
                </label>
                <select
                    id="mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {mesesOptions}
                </select>

                <label htmlFor="hora" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Selecciona la hora:
                </label>
                <select
                    id="hora"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {horasOptions}
                </select>

                <button
                    type="submit"
                    className="submit-btn"
                    style={{ backgroundColor: 'var(--rosa-medio)', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
                >
                    {editingTurno ? 'Guardar Cambios' : 'Confirmar Reserva'}
                </button>
            </form>
        </div>
    );
};

export default Reserva;