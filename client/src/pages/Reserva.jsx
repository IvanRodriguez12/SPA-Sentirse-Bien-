import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';

import MetodoPago from '../components/MetodoPago';
import ServiciosSeleccionados from '../components/ServiciosSeleccionados';
import ResumenPago from '../components/ResumenPago';
import SelectorFecha from '../components/SelectorFecha';
import BotonConfirmar from '../components/BotonConfirmar';
import ModalServicios from '../components/ModalServicios';

import '../styles/Reserva.css';

Modal.setAppElement('#root');

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
  'https://spa-sentirse-bien-production.up.railway.app';

const Reserva = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------- Estados ---------- */
  const [services, setServices] = useState(location.state?.services || []);
  const editingTurno = location.state?.editingTurno ?? null;

  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [allServices, setAllServices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cardDetails, setCardDetails] = useState({
    numero: '',
    vencimiento: '',
    cvv: ''
  });

  const [loadingServices, setLoadingServices] = useState(false);

  /* ---------- Helpers ---------- */
  const getServiceId = s => s._id || s.id || s.serviceId;

  const getServicesByCategory = categoria => {
    if (!categoria) return [];
    const catId = categoria._id || categoria.id || categoria.categoriaId;
    return allServices.filter(s => {
      const catSrv = s.categoria?._id || s.categoria?.id || s.categoria;
      return catSrv === catId;
    });
  };

  const isServiceSelected = servicio =>
    services.some(s => getServiceId(s) === getServiceId(servicio));

  const addService = servicio => {
    if (isServiceSelected(servicio)) {
      toast.info('Este servicio ya fue agregado.');
      return;
    }
    setServices(prev => [...prev, servicio]);
    toast.success(`${servicio.nombre} agregado correctamente`);
    closeModal();
  };

  const removeService = id => {
    const eliminado = services.find(s => getServiceId(s) === id);
    setServices(prev => prev.filter(s => getServiceId(s) !== id));
    if (eliminado) toast.success(`${eliminado.nombre} eliminado`);
  };

  /* ---------- Lógica de fecha ---------- */
  const handleDateChange = date => setSelectedDateTime(date);

  const isWeekday = date => date.getDay() !== 0; // sin domingos

  const filterPassedTime = time => {
    const minutes = time.getMinutes();
    return minutes === 0 || minutes === 30;
  };

  const getMinDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 48);
    return now;
  };

  /* ---------- Carga de servicios / categorías ---------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingServices(true);
      try {
        const token = localStorage.getItem('authToken');
        const [servRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/servicios/listar`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/categorias/listar`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setAllServices(servRes.data || []);
        setAllCategories(catRes.data || []);
      } catch {
        toast.error('Error cargando servicios / categorías');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Validaciones ---------- */
  const validarDatosTarjeta = () => {
    if (metodoPago !== 'tarjeta') return true;
    const { numero, vencimiento, cvv } = cardDetails;
    if (!numero || !vencimiento || !cvv) {
      toast.error('Completa los datos de la tarjeta');
      return false;
    }
    if (!/^[0-9]{16}$/.test(numero)) {
      toast.error('Número de tarjeta inválido (16 dígitos)');
      return false;
    }
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(vencimiento)) {
      toast.error('Vencimiento inválido (MM/AA)');
      return false;
    }
    if (!/^[0-9]{3}$/.test(cvv)) {
      toast.error('CVV inválido (3 dígitos)');
      return false;
    }
    return true;
  };

  /* ---------- Pago y descuento ---------- */
  const calcularPrecioTotal = () =>
    services.reduce((acc, s) => acc + (s.precio ?? 0), 0);

  const aplicarDescuento = total => {
    const ahora = new Date();
    if (!selectedDateTime) return { aplicado: false, totalConDescuento: total };

    const diferenciaHoras = (selectedDateTime - ahora) / (1000 * 60 * 60);
    // Aplica 15% de descuento si paga con tarjeta y reserva con >= 48h de anticipación
    if (metodoPago === 'tarjeta' && diferenciaHoras >= 48) {
      return { aplicado: true, totalConDescuento: total * 0.85 };
    }
    return { aplicado: false, totalConDescuento: total };
  };

  const total = calcularPrecioTotal();
  const { aplicado, totalConDescuento } = aplicarDescuento(total);

  /* ---------- Crear / editar turno ---------- */
  const handleReserva = async e => {
    e.preventDefault();
    if (!validarDatosTarjeta()) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_BASE_URL}/api/turnos/${editingTurno ? 'editar' : 'crear'}`,
        {
          fechaHora: selectedDateTime,
          servicios: services.map(getServiceId),
          metodoPago,
          total: totalConDescuento
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Turno reservado correctamente');
      navigate('/turnos');
    } catch {
      toast.error('Error al reservar turno');
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  /* ---------- Render ---------- */
  return (
    <div className="reserva-container">
      <h2>{editingTurno ? 'Editar Turno' : 'Reservar Servicio'}</h2>

      <ServiciosSeleccionados
        services={services}
        removeService={removeService}
        getServiceId={getServiceId}
      />

      <button
        onClick={openModal}
        className="btn-agregar"
        disabled={loadingServices}
      >
        {loadingServices ? 'Cargando…' : 'Añadir Servicio'}
      </button>

      <form onSubmit={handleReserva}>
        <SelectorFecha
          selectedDateTime={selectedDateTime}
          handleDateChange={handleDateChange}
          getMinDate={getMinDate}
          filterPassedTime={filterPassedTime}
          isWeekday={isWeekday}
        />

        <ResumenPago
          total={total}
          totalConDescuento={totalConDescuento}
          aplicado={aplicado}
        />

        <MetodoPago
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
        />

        <BotonConfirmar editingTurno={!!editingTurno} handleReserva={handleReserva} />
      </form>

      <ModalServicios
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        loadingServices={loadingServices}
        allCategories={allCategories}
        getServicesByCategory={getServicesByCategory}
        addService={addService}
        isServiceSelected={isServiceSelected}
        getServiceId={getServiceId}
      />
    </div>
  );
};

export default Reserva;
