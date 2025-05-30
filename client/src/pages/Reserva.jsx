import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app";

const Reserva = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [services, setServices] = useState(location.state?.services || []);
    const editingTurno = location.state?.editingTurno;

    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [allServices, setAllServices] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);

    useEffect(() => {
        if (editingTurno) {
            const fecha = new Date(editingTurno.fechaHora);
            const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
            setSelectedDateTime(fechaLocal);
        }
    }, [editingTurno]);

    useEffect(() => {
        const fetchServiciosYCategorias = async () => {
            setLoadingServices(true);
            try {
                const token = localStorage.getItem("authToken");
                console.log('Intentando cargar servicios desde:', `${API_BASE_URL}/api/servicios/listar`);
                console.log('Token disponible:', !!token);

                const [serviciosRes, categoriasRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/servicios/listar`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }),
                    axios.get(`${API_BASE_URL}/api/categorias/listar`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    })
                ]);

                console.log('Servicios obtenidos:', serviciosRes.data);
                console.log('Categorías obtenidas:', categoriasRes.data);

                // Normalizar datos de servicios y categorías
                const serviciosData = Array.isArray(serviciosRes.data)
                    ? serviciosRes.data
                    : serviciosRes.data.data || serviciosRes.data.servicios || [];

                const categoriasData = Array.isArray(categoriasRes.data)
                    ? categoriasRes.data
                    : categoriasRes.data.data || categoriasRes.data.categorias || [];

                console.log('Servicios procesados:', serviciosData);
                console.log('Categorías procesadas:', categoriasData);

                setAllServices(serviciosData);
                setAllCategories(categoriasData);
            } catch (error) {
                console.error("Error cargando servicios o categorías:", error);
                console.error("Detalles del error:", error.response?.data || error.message);
                console.error("Status del error:", error.response?.status);

                if (error.response?.status === 403) {
                    toast.error("Tu sesión ha expirado. Redirigiendo al login...");
                    localStorage.removeItem("authToken");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    toast.error("Error cargando servicios: " + (error.response?.data?.message || error.message));
                }
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServiciosYCategorias();
    }, [navigate]);

    const openModal = () => {
        console.log('Abriendo modal. Servicios disponibles:', allServices.length);
        console.log('Categorías disponibles:', allCategories.length);
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const addService = (servicio) => {
        // Verificar si el servicio ya está agregado
        const yaAgregado = services.some(s => s._id === servicio._id);

        if (yaAgregado) {
            toast.info("Este servicio ya fue agregado.");
            return;
        }

        setServices(prevServices => [...prevServices, servicio]);
        toast.success(`${servicio.nombre} agregado correctamente`);
        closeModal();
    };

    const removeService = (id) => {
        const servicioRemovido = services.find(s => s._id === id);
        setServices(services.filter(s => s._id !== id));
        if (servicioRemovido) {
            toast.success(`${servicioRemovido.nombre} eliminado`);
        }
    };

    // Función mejorada para obtener servicios por categoría
    const getServicesByCategory = (categoriaId) => {
        if (!allServices || !Array.isArray(allServices)) {
            console.log('allServices no es un array válido:', allServices);
            return [];
        }

        const serviciosFiltrados = allServices.filter(servicio => {
            if (!servicio) return false;

            // Diferentes formas de comparar la categoría según la estructura de datos
            const categoriaDelServicio = servicio.categoria || servicio.categoriaId || servicio.category;

            // Si la categoría es un objeto, comparar por _id
            if (typeof categoriaDelServicio === 'object' && categoriaDelServicio !== null) {
                return categoriaDelServicio._id === categoriaId || categoriaDelServicio.id === categoriaId;
            }

            // Si la categoría es un string, comparar directamente
            return categoriaDelServicio === categoriaId;
        });

        console.log(`Servicios para categoría ${categoriaId}:`, serviciosFiltrados);
        return serviciosFiltrados;
    };

    // Función para verificar si un servicio ya está agregado
    const isServiceSelected = (servicioId) => {
        return services.some(s => s._id === servicioId);
    };

    // Función para calcular los límites según el día y duración del servicio
    const getTimeLimits = () => {
        if (!services.length) return null;

        const day = selectedDateTime?.getDay() || new Date().getDay();
        const isSaturday = day === 6;

        const config = {
            weekday: {
                open: 9,
                close: 21,
                displayClose: "21:00"
            },
            saturday: {
                open: 10,
                close: 19,
                displayClose: "19:00"
            }
        };

        const { open, close } = isSaturday ? config.saturday : config.weekday;

        const lastAvailableTime = new Date();
        lastAvailableTime.setHours(close, 1, 0, 0);
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
        return day !== 0;
    };

    const filterPassedTime = (time) => {
        if (!services.length) return false;

        const hour = time.getHours();
        const minutes = time.getMinutes();
        const day = time.getDay();

        if (minutes !== 0 && minutes !== 30) return false;

        const timeLimits = getTimeLimits();
        if (!timeLimits) return false;

        if (day === 6) {
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        }
        else if (day >= 1 && day <= 5) {
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        }
        return false;
    };

    const getTimeConstraints = () => {
        if (!selectedDateTime || !services.length) return { minTime: null, maxTime: null };

        const timeLimits = getTimeLimits();
        if (!timeLimits) return { minTime: null, maxTime: null };

        const isToday = selectedDateTime.toDateString() === new Date().toDateString();

        const minTime = new Date(selectedDateTime);
        minTime.setHours(timeLimits.openingHour, 0, 0, 0);

        const maxTime = new Date(selectedDateTime);
        maxTime.setHours(timeLimits.closingHour, 1, 0, 0);

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

        const timeLimits = getTimeLimits();
        if (!timeLimits) return;

        const hora = selectedDateTime.getHours();
        const minutos = selectedDateTime.getMinutes();
        const now = new Date();

        if (hora > timeLimits.lastBookableHour ||
            (hora === timeLimits.lastBookableHour && minutos > timeLimits.lastBookableMinute)) {
            toast.error(`El último turno ${timeLimits.dayName} es a ${timeLimits.lastBookableHour}:${timeLimits.lastBookableMinute < 10 ? '0' : ''}${timeLimits.lastBookableMinute}`);
            return;
        }

        if (selectedDateTime < now) {
            toast.error("No puedes seleccionar una fecha/hora pasada.");
            return;
        }

        const token = localStorage.getItem("authToken");
        try {
            const fechaParaBackend = new Date(selectedDateTime);

            const turnoData = {
                fechaHora: fechaParaBackend.toISOString(),
                servicioIds: services.map(servicio => servicio._id)
            };

            console.log("Turno data:", turnoData);

            const endpoint = editingTurno
                ? `${API_BASE_URL}/api/turnos/editar/${editingTurno.id}`
                : `${API_BASE_URL}/api/turnos/crear`;

            const method = editingTurno ? 'put' : 'post';

            const response = await axios[method](endpoint, turnoData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log('Respuesta del servidor:', response.data);

            toast.success(editingTurno ? "Turno editado exitosamente." : "Turno reservado exitosamente.");
            navigate("/turnos");
        } catch (error) {
            console.error("Error al reservar/editar el turno:", error);

            if (error.response?.status === 403) {
                toast.error("Tu sesión ha expirado. Redirigiendo al login...");
                localStorage.removeItem("authToken");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const errorMessage = error.response?.data?.message ||
                                   error.response?.data?.error ||
                                   error.message ||
                                   "Hubo un problema al reservar/editar el turno.";
                toast.error(errorMessage);
            }
        }
    };

    const { minTime, maxTime } = getTimeConstraints();

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>
                {editingTurno ? 'Editar Turno' : 'Reservar Servicio'}
            </h2>

            {services.length > 0 && (
                <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <p><strong>Servicios:</strong> {services.map(servicio => servicio.nombre).join(", ")}</p>
                    <p><strong>Precio total:</strong> ${services.reduce((total, servicio) => total + servicio.precio, 0)}</p>
                    <p><strong>Duración total:</strong> {services.reduce((total, servicio) => total + servicio.duracion, 0)} minutos</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {services.map(servicio => (
                            <li key={servicio._id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem',
                                marginBottom: '0.25rem',
                                backgroundColor: 'white',
                                borderRadius: '4px'
                            }}>
                                <span>{servicio.nombre} - ${servicio.precio}</span>
                                <button
                                    onClick={() => removeService(servicio._id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        color: '#dc3545'
                                    }}
                                    title="Eliminar servicio"
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={openModal}
                style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
                disabled={loadingServices}
            >
                {loadingServices ? 'Cargando servicios...' : 'Añadir Servicio'}
            </button>

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
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {editingTurno ? 'Guardar Cambios' : 'Confirmar Reserva'}
                    </button>
                </div>
            </form>

            {/* Modal para seleccionar servicios */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Seleccionar Servicios"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Seleccionar Servicios</h3>
                    <button
                        onClick={closeModal}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                    >
                        ×
                    </button>
                </div>

                {loadingServices ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Cargando servicios...</p>
                    </div>
                ) : allCategories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>No hay categorías disponibles</p>
                    </div>
                ) : (
                    <>
                        {allCategories.map((categoria) => {
                            const serviciosDeCategoria = getServicesByCategory(categoria._id);

                            // Solo mostrar la categoría si tiene servicios
                            if (serviciosDeCategoria.length === 0) {
                                return null;
                            }

                            return (
                                <div key={categoria._id} style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{
                                        marginBottom: '0.5rem',
                                        color: '#333',
                                        borderBottom: '2px solid #e9ecef',
                                        paddingBottom: '0.25rem'
                                    }}>
                                        {categoria.nombre}
                                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                                            ({serviciosDeCategoria.length} servicio{serviciosDeCategoria.length !== 1 ? 's' : ''})
                                        </span>
                                    </h4>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        {serviciosDeCategoria.map(servicio => {
                                            const yaSeleccionado = isServiceSelected(servicio._id);

                                            return (
                                                <button
                                                    key={servicio._id}
                                                    onClick={() => addService(servicio)}
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        padding: '0.75rem',
                                                        border: yaSeleccionado ? '2px solid #28a745' : '1px solid #ddd',
                                                        borderRadius: '6px',
                                                        backgroundColor: yaSeleccionado ? '#e8f5e8' : 'white',
                                                        cursor: yaSeleccionado ? 'not-allowed' : 'pointer',
                                                        opacity: yaSeleccionado ? 0.7 : 1,
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    disabled={yaSeleccionado}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <strong style={{ color: yaSeleccionado ? '#28a745' : '#333' }}>
                                                                {servicio.nombre}
                                                            </strong>
                                                            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                                                                ${servicio.precio} • {servicio.duracion} min
                                                            </div>
                                                            {servicio.descripcion && (
                                                                <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.25rem' }}>
                                                                    {servicio.descripcion}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {yaSeleccionado && (
                                                            <div style={{
                                                                color: '#28a745',
                                                                fontSize: '1.2rem',
                                                                marginLeft: '0.5rem'
                                                            }}>
                                                                ✓
                                                            </div>
                                                        )}
                                                    </div>
                                                    {yaSeleccionado && (
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            color: '#28a745',
                                                            marginTop: '0.25rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            Ya agregado
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Información de servicios seleccionados */}
                        {services.length > 0 && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: '4px solid #007bff'
                            }}>
                                <h5 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                                    Servicios seleccionados ({services.length})
                                </h5>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    Total: ${services.reduce((total, s) => total + s.precio, 0)} •
                                    {services.reduce((total, s) => total + s.duracion, 0)} minutos
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Debug info solo en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: '#fff3cd',
                        borderRadius: '4px',
                        border: '1px solid #ffeaa7'
                    }}>
                        <h5 style={{ color: '#856404', marginBottom: '0.5rem' }}>Debug Info:</h5>
                        <div style={{ fontSize: '0.8rem', color: '#856404' }}>
                            <p>Total categorías: {allCategories.length}</p>
                            <p>Total servicios: {allServices.length}</p>
                            <p>Servicios seleccionados: {services.length}</p>
                            {allCategories.map(cat => {
                                const serviciosCount = getServicesByCategory(cat._id).length;
                                return (
                                    <p key={cat._id}>
                                        {cat.nombre}: {serviciosCount} servicio{serviciosCount !== 1 ? 's' : ''}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Modal>

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