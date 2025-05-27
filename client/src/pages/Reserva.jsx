import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const Reserva = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const services = location.state?.services || [];
    const editingTurno = location.state?.editingTurno;

    const [selectedDateTime, setSelectedDateTime] = useState(null);

    useEffect(() => {
        if (editingTurno) {
            const fecha = new Date(editingTurno.fechaHora);
            const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
            setSelectedDateTime(fechaLocal);
        }
    }, [editingTurno]);

    // Función para calcular los límites según el día y duración del servicio
    const getTimeLimits = () => {
        if (!services.length) return null;

        const day = selectedDateTime?.getDay() || new Date().getDay();
        const isSaturday = day === 6;

        // Configuración base
        const config = {
            weekday: {
                open: 9,    // Apertura L-V
                close: 21,  // Cierre L-V (21:01)
                displayClose: "21:00"
            },
            saturday: {
                open: 10,   // Apertura Sábado
                close: 19,  // Cierre Sábado (19:01)
                displayClose: "19:00"
            }
        };

        const { open, close } = isSaturday ? config.saturday : config.weekday;

        // Calcula el último turno posible considerando la duración
        const lastAvailableTime = new Date();
        lastAvailableTime.setHours(close, 1, 0, 0); // Hora de cierre (21:01 o 19:01)
        const totalDuracion = services.reduce((total, servicio) => total + servicio.duracion, 0);
        const lastBookableTime = new Date(lastAvailableTime.getTime() - totalDuracion * 60000);

        return {
            openingHour: open,
            closingHour: close,
            lastBookableHour: lastBookableTime.getHours(),
            lastBookableMinute: lastBookableTime.getMinutes(),
            displayClose: isSaturday ? config.saturday.displayClose : config.weekday.displayClose,
            dayName: isSaturday ? 'sábados' : 'de lunes a viernes'
        };
    };

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
        return day !== 0; // No domingos
    };

    const filterPassedTime = (time) => {
        if (!services.length) return false;

        const hour = time.getHours();
        const minutes = time.getMinutes();
        const day = time.getDay();

        // Solo permitir horas en punto o y media
        if (minutes !== 0 && minutes !== 30) return false;

        const timeLimits = getTimeLimits();
        if (!timeLimits) return false;

        // Validar horario según día
        if (day === 6) { // Sábados
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        }
        else if (day >= 1 && day <= 5) { // Lunes a Viernes
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        }
        return false; // Domingos no disponibles
    };

    const getTimeConstraints = () => {
       if (!selectedDateTime || !services.length) return { minTime: null, maxTime: null };

        const timeLimits = getTimeLimits();
        if (!timeLimits) return { minTime: null, maxTime: null };

        const isToday = selectedDateTime.toDateString() === new Date().toDateString();

        const minTime = new Date(selectedDateTime);
        minTime.setHours(timeLimits.openingHour, 0, 0, 0);

        const maxTime = new Date(selectedDateTime);
        maxTime.setHours(timeLimits.closingHour, 1, 0, 0); // 21:01 o 19:01

        if (isToday) {
            const now = new Date();
            if (now.getHours() >= timeLimits.openingHour) {
                minTime.setHours(now.getHours());
                minTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            }
        }

        return { minTime, maxTime };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDateTime || !services.length) {
            toast.error("Faltan datos necesarios");
            return;
        }

        const token = localStorage.getItem("authToken");

        if (!token) {
            toast.error("Debes iniciar sesión para reservar un turno.");
            navigate("/login");
            return;
        }

        console.log("Token enviado:", token); // ✅ Verifica que el token no sea `null`

        try {
            const fechaParaBackend = new Date(selectedDateTime);
            fechaParaBackend.setMinutes(fechaParaBackend.getMinutes() - fechaParaBackend.getTimezoneOffset());

            const turnoData = {
                clienteId: user.id,
                fechaHora: fechaParaBackend.toISOString(),
                servicios: services.map(servicio => servicio.id), // ✅ Envía solo IDs de servicios
            };

            console.log("Datos enviados al backend:", turnoData); // ✅ Verifica que `turnoData` sea correcto

            if (editingTurno) {
                await axios.put(`${API_URL}/turnos/editar/${editingTurno.id}`, turnoData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                toast.success("Turno actualizado exitosamente.");
            } else {
                await axios.post(`${API_URL}/turnos/crear`, turnoData, {
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
    const timeLimits = getTimeLimits();

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2 style={{ marginBottom: '1.5rem' }}>
                {editingTurno ? 'Editar Turno' : 'Reservar Servicio'}
            </h2>

            {services.length > 0 && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <p><strong>Servicios:</strong> {services.map(servicio => servicio.nombre).join(", ")}</p>
                    <p><strong>Descripción:</strong> {services.map(servicio => servicio.descripcion).join(", ")}</p>
                    <p><strong>Precio total:</strong> ${services.reduce((total, servicio) => total + servicio.precio, 0)}</p>
                    <p><strong>Duración total:</strong> {services.reduce((total, servicio) => total + servicio.duracion, 0)} minutos</p>
                    {timeLimits && (
                        <>
                            <p><strong>Horario:</strong> {timeLimits.dayName} de {timeLimits.openingHour}:00 a {timeLimits.displayClose}</p>
                            <p><strong>Último turno:</strong> {timeLimits.lastBookableHour}:{timeLimits.lastBookableMinute < 10 ? '0' : ''}{timeLimits.lastBookableMinute}</p>
                        </>
                    )}
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