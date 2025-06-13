import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ContactoModal from '../components/ContactoModal';

const Turnos = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [turnos, setTurnos] = useState([]);
    const [showContactModal, setShowContactModal] = useState(false);

    const formatearFecha = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatearHora = (iso) => {
        const date = new Date(iso);
        return date.toLocaleTimeString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    useEffect(() => {
        const fetchTurnos = async () => {
            const token = localStorage.getItem("authToken");
            if (!user || !token) return;

            try {
                const response = await axios.get(
                    `https://spa-sentirse-bien-production.up.railway.app/api/turnos/listar`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                // ❗ No filtramos por cliente porque ya estamos usando un DTO (strings)
                setTurnos(response.data);
            } catch (error) {
                console.error("Error al cargar los turnos:", error.response?.data || error.message);
                toast.error("Hubo un problema al cargar tus turnos.");
            }
        };

        fetchTurnos();
    }, [user, navigate]);

    const handleNewReservation = () => {
        navigate('/categorias');
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        setShowContactModal(true);
    };

    const handleCloseModal = () => {
        setShowContactModal(false);
    };

    if (turnos.length === 0) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>No tienes turnos reservados.</h2>
                <button
                    onClick={handleNewReservation}
                    style={{
                        backgroundColor: 'var(--rosa-medio)',
                        color: 'white',
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Hacer una reserva
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={handleNewReservation}
                    style={{
                        backgroundColor: 'var(--rosa-medio)',
                        color: 'white',
                        padding: '0.8rem 1.5rem',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer'
                    }}
                >
                    Hacer una reserva
                </button>

                <button
                    onClick={handleCancelClick}
                    style={{
                        padding: '0.8rem 1.5rem',
                        backgroundColor: 'transparent',
                        color: 'var(--verde-oscuro)',
                        border: '1px solid var(--verde-oscuro)',
                        borderRadius: '25px',
                        cursor: 'pointer'
                    }}
                >
                    Arrepentirse del turno
                </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {turnos.map((turno) => {
                    const fecha = new Date(turno.horaInicio);
                    return (
                        <li
                            key={turno.id}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginBottom: '1rem'
                            }}
                        >
                            <div>
                                <p><strong>Servicios:</strong> {turno.servicios.join(", ")}</p>
                                <p><strong>Fecha:</strong> {formatearFecha(fecha)}</p>
                                <p><strong>Hora:</strong> {formatearHora(fecha)}</p>
                                <p><strong>Profesional:</strong> {turno.profesionalNombre}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {showContactModal && (
                <ContactoModal onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Turnos;