import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Reserva = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const service = location.state?.service;
    const editingTurno = location.state?.editingTurno;

    const [selectedDateTime, setSelectedDateTime] = useState(null);

    useEffect(() => {
        if (editingTurno) {
            const fecha = new Date(editingTurno.fechaHora);
            const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
            setSelectedDateTime(fechaLocal);
        }
    }, [editingTurno]);

    const handleDateChange = (date) => {
        if (!date) {
            setSelectedDateTime(null);
            return;
        }

        if (date.getDay() === 6) {
            const hours = date.getHours();
            if (!selectedDateTime || hours < 10) {
                const newDate = new Date(date);
                newDate.setHours(10, 0, 0, 0);
                setSelectedDateTime(newDate);
                return;
            }
        }

        setSelectedDateTime(date);
    };

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0;
    };

    const filterPassedTime = (time) => {
        const hour = time.getHours();
        const minutes = time.getMinutes();
        const day = time.getDay();

        if (minutes !== 0 && minutes !== 30) return false;

        if (day === 6) {
            return hour >= 10 && hour <= 19;
        } else if (day >= 1 && day <= 5) {
            return hour >= 9 && hour <= 21;
        }
        return false;
    };

    const getTimeConstraints = () => {
        if (!selectedDateTime) return { minTime: null, maxTime: null };

        const day = selectedDateTime.getDay();
        const isToday = selectedDateTime.toDateString() === new Date().toDateString();

        let minHours = 9;
        let maxHours = 21;

        if (day === 6) {
            minHours = 10;
            maxHours = 19;
        }

        const minTime = new Date(selectedDateTime);
        minTime.setHours(minHours, 0, 0, 0);

        const maxTime = new Date(selectedDateTime);
        maxTime.setHours(maxHours, 0, 0, 0);

        if (isToday) {
            const now = new Date();
            if (now.getHours() >= minHours) {
                minTime.setHours(now.getHours());
                minTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            }
        }

        return { minTime, maxTime };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDateTime) {
            toast.error("Por favor selecciona fecha y hora");
            return;
        }

        const token = localStorage.getItem("authToken");
        const now = new Date();

        if (selectedDateTime < now) {
            toast.error("No puedes seleccionar una fecha/hora pasada.");
            return;
        }

        try {
            const fechaParaBackend = new Date(selectedDateTime);
            fechaParaBackend.setMinutes(fechaParaBackend.getMinutes() - fechaParaBackend.getTimezoneOffset());

            const turnoData = {
                servicio: { id: service.id },
                cliente: { id: user.id },
                fechaHora: fechaParaBackend.toISOString(),
            };

            if (editingTurno) {
                await axios.put(`http://localhost:8080/api/turnos/editar/${editingTurno.id}`, turnoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                toast.success("Turno actualizado exitosamente.");
            } else {
                await axios.post("http://localhost:8080/api/turnos/crear", turnoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                toast.success("Turno reservado exitosamente.");
            }

            navigate("/turnos");
        } catch (error) {
            console.error("Error al reservar/editar el turno:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Hubo un problema al reservar/editar el turno.");
        }
    };

    const { minTime, maxTime } = getTimeConstraints();

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ marginBottom: '1.5rem' }}>
                {editingTurno ? 'Editar Turno' : 'Reservar Servicio'}
            </h2>

            {service && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <p><strong>Servicio:</strong> {service.nombre}</p>
                    <p><strong>Descripción:</strong> {service.descripcion}</p>
                    <p><strong>Precio:</strong> ${service.precio}</p>
                    <p><strong>Duración:</strong> {service.duracion} minutos</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}>
                        Selecciona fecha y hora:
                    </label>
                    <DatePicker
                        selected={selectedDateTime}
                        onChange={handleDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        minDate={new Date()}
                        minTime={minTime}
                        maxTime={maxTime}
                        filterTime={filterPassedTime}
                        filterDate={isWeekday}
                        dateFormat="dd/MM/yyyy h:mm aa"
                        placeholderText="Selecciona fecha y hora"
                        className="datetime-picker"
                        required
                    />
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '1rem'
                }}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: 'var(--rosa-medio)',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            ':hover': {
                                transform: 'scale(1.03)',
                                backgroundColor: 'var(--rosa-oscuro)'
                            }
                        }}
                    >
                        {editingTurno ? 'Guardar Cambios' : 'Confirmar Reserva'}
                    </button>
                </div>
            </form>

            <style>
                {`
                    .datetime-picker {
                        width: 100%;
                        padding: 0.8rem;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                    }
                    .react-datepicker__header {
                        background-color: #f8f9fa;
                    }
                    .react-datepicker__day--selected {
                        background-color: var(--verde-oscuro);
                    }
                    .react-datepicker__time-container
                    .react-datepicker__time
                    .react-datepicker__time-box
                    ul.react-datepicker__time-list
                    li.react-datepicker__time-list-item--selected {
                        background-color: var(--verde-oscuro);
                    }
                `}
            </style>
        </div>
    );
};

export default Reserva;