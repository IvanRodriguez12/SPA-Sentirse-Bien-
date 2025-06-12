import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';

import MetodoPago from '../components/MetodoPago';
import ServiciosSeleccionados from '../components/ServiciosSeleccionados';
import ResumenPago from '../components/ResumenPago';
import SelectorFecha from '../components/SelectorFecha';
import BotonConfirmar from '../components/BotonConfirmar';
import ModalServicios from '../components/ModalServicios';

import '../styles/reserva.css';

Modal.setAppElement('#root');

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app";

const Reserva = () => {

    const getServicesByCategory = (categoria) => {
        return allServices.filter(serv => 
            serv.categoria?.id === categoria.id || 
            serv.categoria?._id === categoria._id
        );
    };

    const isServiceSelected = (servicio) => {
        return services.some(s => s.id === servicio.id || s._id === servicio._id);
    };
    
    
    const location = useLocation();
    const navigate = useNavigate();
    const [services, setServices] = useState(location.state?.services || []);
    const editingTurno = location.state?.editingTurno;

    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [allServices, setAllServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/servicios`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
                setAllServices(response.data);
            } catch (error) {
                console.error("Error cargando servicios:", error);
                toast.error("Error al cargar los servicios.");
            }
        };
        fetchServices();
    }, []);
    
    const [allCategories, setAllCategories] = useState([]);
    const [metodoPago, setMetodoPago] = useState('');
    const [pagarAhora, setPagarAhora] = useState(false);
    const [cardDetails, setCardDetails] = useState({ numero: '', vencimiento: '', cvv: '' });
    const [loadingServices, setLoadingServices] = useState(false);

    const getArgentinaDateTime = () => {
        const now = new Date();
        return new Date(now.getTime() - (3 * 60 * 60 * 1000));
    };

    const getMinDate = () => {
        const now = getArgentinaDateTime();
        return new Date(now.getTime() + (48 * 60 * 60 * 1000));
    };

    const validarDatosTarjeta = () => {
        if (metodoPago !== 'tarjeta') return true;
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
            return { aplicado: true, totalConDescuento: total * 0.85 };
        }
        return { aplicado: false, totalConDescuento: total };
    };

    const total = calcularPrecioTotal();
    const { aplicado, totalConDescuento } = aplicarDescuento(total);

    useEffect(() => {
        if (editingTurno) {
            const fecha = new Date(editingTurno.fechaHora);
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
                setAllServices(serviciosRes.data || []);
                setAllCategories(categoriasRes.data || []);
            } catch (error) {
                console.error("Error cargando servicios:", error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    toast.error("Tu sesión ha expirado.");
                    localStorage.removeItem("authToken");
                    setTimeout(() => navigate("/login"), 2000);
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
        if (!servicioId) return toast.error("No se pudo identificar el servicio.");
        const yaAgregado = services.some(s => getServiceId(s) === servicioId);
        if (yaAgregado) return toast.info("Este servicio ya fue agregado.");
        setServices(prev => [...prev, servicio]);
        toast.success(`${servicio.nombre} agregado correctamente`);
        closeModal();
    };

    const removeService = (id) => {
        const servicioRemovido = services.find(s => getServiceId(s) === id);
        setServices(services.filter(s => getServiceId(s) !== id));
        if (servicioRemovido) toast.success(`${servicioRemovido.nombre} eliminado`);
    };

    const handleDateChange = (date) => setSelectedDateTime(date);
    const isWeekday = (date) => date.getDay() !== 0;

    const filterPassedTime = (time) => {
        const minutes = time.getMinutes();
        return minutes === 0 || minutes === 30;
    };

    const handleReserva = async (e) => {
        e.preventDefault();
        if (!validarDatosTarjeta()) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${API_BASE_URL}/api/turnos/crear`, {
                fechaHora: selectedDateTime,
                metodoPago,
                pagado: true,
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

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="reserva-container">
            <h2>{editingTurno ? 'Editar Turno' : 'Reservar Servicio'}</h2>
            <ServiciosSeleccionados services={services} removeService={removeService} getServiceId={getServiceId} />
            <button onClick={openModal} className="btn-agregar" disabled={loadingServices}>
                {loadingServices ? 'Cargando servicios...' : 'Añadir Servicio'}
            </button>
            <form onSubmit={handleReserva}>
                <SelectorFecha
                    selectedDateTime={selectedDateTime}
                    handleDateChange={handleDateChange}
                    getMinDate={getMinDate}
                    filterPassedTime={filterPassedTime}
                    isWeekday={isWeekday}
                />
                <ResumenPago total={total} aplicado={aplicado} totalConDescuento={totalConDescuento} />
                <MetodoPago
                    metodoPago={metodoPago}
                    setMetodoPago={setMetodoPago}
                    pagarAhora={pagarAhora}
                    setPagarAhora={setPagarAhora}
                    cardDetails={cardDetails}
                    setCardDetails={setCardDetails}
                />
                <BotonConfirmar handleClick={handleReserva} editingTurno={editingTurno} />
            </form>
            
            <ModalServicios
                modalIsOpen={modalIsOpen}
                closeModal={() => setModalIsOpen(false)}
                loadingServices={loadingServices}
                allCategories={allCategories}
                getServicesByCategory={getServicesByCategory}
                isServiceSelected={isServiceSelected}
                addService={addService}
                getServiceId={getServiceId}
            />
        </div>
    );
};

export default Reserva;