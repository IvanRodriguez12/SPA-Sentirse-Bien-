import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Turnos = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        const fetchTurnos = async () => {
            const token = localStorage.getItem("authToken");  // Cambié "token" por "authToken"
            if (!user || !user.id || !token) return; // Evita llamadas sin usuario autenticado o sin token

            try {
                const response = await axios.get(`http://localhost:8080/api/turnos/listar`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Token correcto
                        "Content-Type": "application/json"
                    }
                });

                console.log("Respuesta del servidor:", response.data);
                const userTurnos = response.data.filter((turno) => turno.cliente.id === user.id);
                setTurnos(userTurnos);
            } catch (error) {
                console.error("Error al cargar los turnos:", error.response?.data || error.message);
                toast.error("Hubo un problema al cargar tus turnos.");
            }
        };

        fetchTurnos();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este turno?')) {
            try {
                await axios.delete(`http://localhost:8080/api/turnos/eliminar/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Token para eliminación
                        "Content-Type": "application/json"
                    }
                });

                setTurnos(turnos.filter((turno) => turno.id !== id));
                toast.success('Turno eliminado exitosamente.');
            } catch (error) {
                console.error('Error al eliminar el turno:', error);
                toast.error('Hubo un problema al eliminar el turno.');
            }
        }
    };

    const handleEdit = (turno) => {
        navigate('/reservas', {
            state: {
                service: turno.servicio,
                editingTurno: turno
            }
        });
    };

    const handleNewReservation = () => {
        navigate('/servicios');
    };

    if (turnos.length === 0) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>No tienes turnos reservados.</h2>
                <button
                    onClick={handleNewReservation}
                    style={{ backgroundColor: 'var(--rosa-medio)', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
                >
                    Hacer una reserva
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Mis Turnos</h2>
            <button
                onClick={handleNewReservation}
                style={{ backgroundColor: 'var(--rosa-medio)', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '25px', cursor: 'pointer', marginBottom: '1rem' }}
            >
                Hacer una reserva
            </button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {turnos.map((turno) => (
                    <li
                        key={turno.id}
                        style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <div>
                            <p><strong>Servicio:</strong> {turno.servicio.nombre}</p>
                            <p><strong>Fecha:</strong> {new Date(turno.fechaHora).toLocaleDateString()}</p>
                            <p><strong>Hora:</strong> {new Date(turno.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(turno)}
                                style={{
                                    backgroundColor: 'var(--verde-oscuro)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    marginRight: '0.5rem',
                                }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(turno.id)}
                                style={{
                                    backgroundColor: 'var(--verde-oscuro)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    marginLeft: '0.5rem',
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Turnos;
