import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import MetodoPago from '../components/MetodoPago';

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
    const [metodoPago, setMetodoPago] = useState('');
    const [pagarAhora, setPagarAhora] = useState(false);
    const [cardDetails, setCardDetails] = useState({ numero: '', vencimiento: '', cvv: '' });
    const [loadingServices, setLoadingServices] = useState(false);

    // Función para obtener la fecha/hora actual en zona horaria Argentina (UTC-3)
    const getArgentinaDateTime = () => {
        const now = new Date();
        // Convertir a Argentina (UTC-3)
        const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));
        return argentinaTime;
    };

    // Función para verificar si una fecha cumple con el requisito de 48 horas
    const isAtLeast48HoursFromNow = (date) => {
        const now = getArgentinaDateTime();
        const diffInHours = (date - now) / (1000 * 60 * 60);
        return diffInHours >= 48;
    };

    // Función para obtener fecha mínima (48 horas desde ahora)
    const getMinDate = () => {
        const now = getArgentinaDateTime();
        const minDate = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return minDate;
    };

    const validarDatosTarjeta = () => {
        if (metodoPago !== 'tarjeta' || !pagarAhora) return true;
        const { numero, vencimiento, cvv } = cardDetails;

        if (!numero.trim() || !vencimiento.trim() || !cvv.trim()) {
            toast.error("Por favor completá todos los campos de la tarjeta.");
            return false;
        }

        if (!/^[0-9]{16}$/.test(numero)) {
            toast.error("El número de tarjeta debe tener 16 dígitos.");
            return false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
            toast.error("El vencimiento debe tener el formato MM/AA.");
            return false;
        }

        if (!/^[0-9]{3}$/.test(cvv)) {
            toast.error("El CVV debe tener 3 dígitos.");
            return false;
        }

        return true;
    };

    const calcularPrecioTotal = () => services.reduce((total, s) => total + s.precio, 0);

    const aplicarDescuento = (total) => {
        const ahora = new Date();
        if (!selectedDateTime) return { aplicado: false, totalConDescuento: total };
        const diferenciaHoras = (selectedDateTime - ahora) / (1000 * 60 * 60);
        if (pagarAhora && metodoPago === 'tarjeta' && diferenciaHoras >= 48) {
            return {
                aplicado: true,
                totalConDescuento: total * 0.85
            };
        }
        return {
            aplicado: false,
            totalConDescuento: total
        };
    };

    const total = calcularPrecioTotal();
    const { aplicado, totalConDescuento } = aplicarDescuento(total);

    useEffect(() => {
        if (editingTurno) {
            const fecha = new Date(editingTurno.fechaHora);
            // Ajustar para zona horaria Argentina
            const fechaArgentina = new Date(fecha.getTime() - (3 * 60 * 60 * 1000));
            setSelectedDateTime(fechaArgentina);
        }
    }, [editingTurno]);

    useEffect(() => {
        const fetchServiciosYCategorias = async () => {
            setLoadingServices(true);
            try {
                const token = localStorage.getItem("authToken");

                const [serviciosRes, categoriasRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/servicios/listar`, {
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                    }),
                    axios.get(`${API_BASE_URL}/api/categorias/listar`, {
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                    })
                ]);

                const serviciosData = Array.isArray(serviciosRes.data)
                    ? serviciosRes.data
                    : serviciosRes.data.data || serviciosRes.data.servicios || [];

                const categoriasData = Array.isArray(categoriasRes.data)
                    ? categoriasRes.data
                    : categoriasRes.data.data || categoriasRes.data.categorias || [];

                setAllServices(serviciosData);
                setAllCategories(categoriasData);
            } catch (error) {
                console.error("Error cargando servicios:", error);

                if (error.response?.status === 403 || error.response?.status === 401) {
                    toast.error("Tu sesión ha expirado. Redirigiendo al login...");
                    localStorage.removeItem("authToken");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    toast.error("Error cargando servicios: " + (error.response?.data?.message || error.message));
                }
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServiciosYCategorias();
    }, [navigate]);

    const getServiceId = (servicio) => servicio._id || servicio.id || servicio.serviceId;

    const addService = (servicio) => {
        const servicioId = getServiceId(servicio);
        if (!servicioId) {
            toast.error("Error: No se pudo identificar el servicio.");
            return;
        }

        const yaAgregado = services.some(s => getServiceId(s) === servicioId);
        if (yaAgregado) {
            toast.info("Este servicio ya fue agregado.");
            return;
        }

        setServices(prev => [...prev, servicio]);
        toast.success(`${servicio.nombre} agregado correctamente`);
        closeModal();
    };

    const removeService = (id) => {
        const servicioRemovido = services.find(s => getServiceId(s) === id);
        setServices(services.filter(s => getServiceId(s) !== id));
        if (servicioRemovido) {
            toast.success(`${servicioRemovido.nombre} eliminado`);
        }
    };

    const getServicesByCategory = (categoria) => {
        if (!allServices || !Array.isArray(allServices)) return [];

        const categoriaId = categoria?._id || categoria?.id || categoria;

        return allServices.filter(servicio => {
            if (!servicio) return false;
            const categoriaDelServicio = servicio.categoria || servicio.categoriaId || servicio.category;

            if (typeof categoriaDelServicio === 'object' && categoriaDelServicio !== null) {
                const serviceCatId = categoriaDelServicio._id || categoriaDelServicio.id;
                return serviceCatId === categoriaId;
            }

            return categoriaDelServicio === categoriaId;
        });
    };

    const isServiceSelected = (servicio) => {
        const servicioId = getServiceId(servicio);
        if (!servicioId) return false;
        return services.some(s => getServiceId(s) === servicioId);
    };

    // Función corregida para calcular límites de horario
    const getTimeLimits = () => {
        if (!services.length) return null;

        const day = selectedDateTime?.getDay() || new Date().getDay();
        const isSaturday = day === 6;

        const config = {
            weekday: { open: 9, close: 20, closingMinute: 30 }, // 9:00 - 20:30
            saturday: { open: 10, close: 19, closingMinute: 0 }  // 10:00 - 19:00
        };

        const { open, close, closingMinute } = isSaturday ? config.saturday : config.weekday;

        // Calcular duración total de servicios
        const totalDuracion = services.reduce((total, servicio) => total + servicio.duracion, 0);

        // Hora de cierre real
        const realClosingTime = new Date();
        realClosingTime.setHours(close, closingMinute, 0, 0);

        // Último horario disponible considerando la duración de los servicios
        const lastBookableTime = new Date(realClosingTime.getTime() - totalDuracion * 60000);

        return {
            openingHour: open,
            closingHour: close,
            closingMinute: closingMinute,
            lastBookableHour: lastBookableTime.getHours(),
            lastBookableMinute: lastBookableTime.getMinutes(),
            displayClose: isSaturday ? "19:00" : "20:30",
            dayName: isSaturday ? 'sábados' : 'de lunes a viernes'
        };
    };

    const handleDateChange = (date) => {
        if (!date) {
            setSelectedDateTime(null);
            return;
        }

        // Si es sábado y la hora es menor a 10, ajustar a 10:00
        if (date.getDay() === 6 && date.getHours() < 10) {
            const newDate = new Date(date);
            newDate.setHours(10, 0, 0, 0);
            setSelectedDateTime(newDate);
            return;
        }

        setSelectedDateTime(date);
    };

    // Solo permitir días de lunes a sábado
    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0; // Excluir domingos
    };

    const filterPassedTime = (time) => {
        if (!services.length) return false;

        const hour = time.getHours();
        const minutes = time.getMinutes();
        const day = time.getDay();

        // Solo permitir intervalos de 30 minutos
        if (minutes !== 0 && minutes !== 30) return false;

        const timeLimits = getTimeLimits();
        if (!timeLimits) return false;

        // Validar horarios según el día
        if (day === 6) { // Sábado
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        } else if (day >= 1 && day <= 5) { // Lunes a Viernes
            return hour >= timeLimits.openingHour &&
                   (hour < timeLimits.lastBookableHour ||
                   (hour === timeLimits.lastBookableHour && minutes <= timeLimits.lastBookableMinute));
        }

        return false;
    };

    const handleReserva = async (e) => {
        e.preventDefault();
        if (!validarDatosTarjeta()) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${API_BASE_URL}/api/turnos/crear`, {
                fechaHora: selectedDateTime,
                metodoPago,
                pagado: pagarAhora,
                servicioIds: services.map(s => s.id)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Turno reservado correctamente");
            navigate("/turnos");
        } catch {
            toast.error("Error al reservar turno");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDateTime || !services.length) {
            toast.error("Faltan datos necesarios");
            return;
        }

        // Validar que la fecha sea al menos 48 horas en el futuro
        if (!isAtLeast48HoursFromNow(selectedDateTime)) {
            toast.error("Debes reservar tu turno con al menos 48 horas de anticipación.");
            return;
        }

        const timeLimits = getTimeLimits();
        if (!timeLimits) return;

        const hora = selectedDateTime.getHours();
        const minutos = selectedDateTime.getMinutes();

        // Validar horarios de atención
        if (hora > timeLimits.lastBookableHour ||
            (hora === timeLimits.lastBookableHour && minutos > timeLimits.lastBookableMinute)) {
            const lastHourFormatted = `${timeLimits.lastBookableHour}:${timeLimits.lastBookableMinute < 10 ? '0' : ''}${timeLimits.lastBookableMinute}`;
            toast.error(`El último turno ${timeLimits.dayName} es a las ${lastHourFormatted}`);
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("No se encontró token de autenticación. Redirigiendo al login...");
            navigate("/login");
            return;
        }

        try {
            // Convertir la fecha seleccionada a UTC para enviar al backend
            const fechaParaBackend = new Date(selectedDateTime.getTime() + (3 * 60 * 60 * 1000));

            const servicioIds = services.map(servicio => getServiceId(servicio)).filter(id => id);

            if (servicioIds.length !== services.length) {
                toast.error("Error: Algunos servicios no tienen ID válido.");
                return;
            }

            const turnoData = {
                fechaHora: fechaParaBackend.toISOString(),
                servicioIds: servicioIds
            };

            const endpoint = editingTurno
                ? `${API_BASE_URL}/api/turnos/editar/${editingTurno.id}`
                : `${API_BASE_URL}/api/turnos/crear`;

            const method = editingTurno ? 'put' : 'post';

            await axios[method](endpoint, turnoData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            toast.success(editingTurno ? "Turno editado exitosamente." : "Turno reservado exitosamente.");
            navigate("/turnos");
        } catch (error) {
            console.error("Error al reservar/editar el turno:", error);

            if (error.response?.status === 403 || error.response?.status === 401) {
                toast.error("Tu sesión ha expirado. Redirigiendo al login...");
                localStorage.removeItem("authToken");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                const errorMessage = error.response?.data?.message ||
                                   error.response?.data?.error ||
                                   error.message ||
                                   "Hubo un problema al reservar/editar el turno.";
                toast.error(errorMessage);
            }
        }
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

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
                        {services.map(servicio => {
                            const servicioId = getServiceId(servicio);
                            return (
                                <li key={servicioId} style={{
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
                                        onClick={() => removeService(servicioId)}
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
                            );
                        })}
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
                        Selecciona fecha y hora (mínimo 48hs de anticipación):
                    </label>
                    <DatePicker
                        selected={selectedDateTime}
                        onChange={handleDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        minDate={getMinDate()}
                        filterTime={filterPassedTime}
                        filterDate={isWeekday}
                        dateFormat="dd/MM/yyyy HH:mm"
                        placeholderText="Selecciona fecha y hora"
                        className="datetime-picker"
                        required
                    />
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                        Horarios de atención: Lunes a Viernes 9:00-20:30 | Sábados 10:00-19:00
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <h3>Resumen de pago</h3>
                        <p>Total sin descuento: ${total.toFixed(2)}</p>
                        {aplicado && (
                            <p style={{ color: 'green' }}>Descuento aplicado: 15% por pago anticipado</p>
                        )}
                        <p><strong>Total a pagar: ${totalConDescuento.toFixed(2)}</strong></p>
                    </div>
                </div>
                    <MetodoPago
                        metodoPago={metodoPago}
                        setMetodoPago={setMetodoPago}
                        pagarAhora={pagarAhora}
                        setPagarAhora={setPagarAhora}
                        cardDetails={cardDetails}
                        setCardDetails={setCardDetails}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
                            onClick={handleReserva}
                        >
                            {editingTurno ? 'Guardar Cambios' : 'Confirmar Reserva'}
                        </button>
                    </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
                            const serviciosDeCategoria = getServicesByCategory(categoria);
                            if (serviciosDeCategoria.length === 0) return null;

                            return (
                                <div key={categoria._id || categoria.id} style={{ marginBottom: '1.5rem' }}>
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
                                            const yaSeleccionado = isServiceSelected(servicio);
                                            const servicioId = getServiceId(servicio);

                                            return (
                                                <button
                                                    key={servicioId}
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
                                                            <div style={{ color: '#28a745', fontSize: '1.2rem', marginLeft: '0.5rem' }}>
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