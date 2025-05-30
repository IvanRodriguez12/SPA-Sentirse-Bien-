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

    // Función para convertir UTC a hora local de Argentina
    const convertirAHoraArgentina = (fechaUTC) => {
        const fecha = new Date(fechaUTC);
        // Convertir a zona horaria de Argentina (UTC-3)
        const fechaArgentina = new Date(fecha.getTime() - (3 * 60 * 60 * 1000));
        return fechaArgentina;
    };

    // Función para formatear fecha en zona horaria argentina
    const formatearFechaArgentina = (fechaUTC) => {
        const fecha = convertirAHoraArgentina(fechaUTC);
        return fecha.toLocaleDateString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Función para formatear hora en zona horaria argentina
    const formatearHoraArgentina = (fechaUTC) => {
        const fecha = convertirAHoraArgentina(fechaUTC);
        return fecha.toLocaleTimeString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    useEffect(() => {
        const fetchTurnos = async () => {
            const token = localStorage.getItem("authToken");
            if (!user || !user.id || !token) return;

            try {
                const response = await axios.get(`https://spa-sentirse-bien-production.up.railway.app/api/turnos/listar`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const userTurnos = response.data.filter((turno) => turno.cliente.id === user.id);
                setTurnos(userTurnos);
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
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
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        ':hover': {
                            backgroundColor: 'var(--verde-oscuro)',
                            color: 'white'
                        }
                    }}
                >
                    Arrepentirse del turno
                </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {turnos.map((turno) => {
                    const fechaInicio = new Date(turno.fechaHora);
                    const duracionTotal = turno.servicios.reduce((total, servicio) => total + servicio.duracion, 0);
                    const fechaFin = new Date(fechaInicio.getTime() + duracionTotal * 60000);

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
                                <p><strong>Servicios:</strong> {turno.servicios.map(servicio => servicio.nombre).join(", ")}</p>
                                <p><strong>Fecha:</strong> {formatearFechaArgentina(turno.fechaHora)}</p>
                                <p><strong>Hora inicio:</strong> {formatearHoraArgentina(turno.fechaHora)}</p>
                                <p><strong>Hora fin:</strong> {formatearHoraArgentina(fechaFin)}</p>
                                <p><strong>Duración total:</strong> {duracionTotal} minutos</p>
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