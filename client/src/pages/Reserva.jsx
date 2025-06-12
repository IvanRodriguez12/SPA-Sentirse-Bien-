import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/reserva.css';

import MetodoPago from '../components/MetodoPago';
import ServiciosSeleccionados from '../components/ServiciosSeleccionados';
import ResumenPago from '../components/ResumenPago';
import SelectorFecha from '../components/SelectorFecha';
import BotonConfirmar from '../components/BotonConfirmar';
import ModalServicios from '../components/ModalServicios';

import '../styles/reserva.css';

Modal.setAppElement('#root');

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://spa-sentirse-bien-production.up.railway.app';

const Reserva = () => {
  const location = useLocation();

  /** ------------------  ESTADOS ------------------ **/
  const [services, setServices] = useState(location.state?.services || []);
  const editingTurno = location.state?.editingTurno;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [allServices, setAllServices] = useState([]);         // ✅ FIX
  const [allCategories, setAllCategories] = useState([]);

  const [metodoPago, setMetodoPago] = useState('efectivo');

  const [cardDetails, setCardDetails] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
  });

  const [loadingServices, setLoadingServices] = useState(false);

  /** ------------------  HELPERS ------------------ **/
  const getServiceId = (s) => s._id || s.id;

  const getServicesByCategory = (categoria) => {
    if (!categoria) return [];
    const catId = categoria._id || categoria.id;
    return allServices.filter((srv) => {
      const catSrv = srv.categoria?._id || srv.categoria?.id || srv.categoria;
      return catSrv === catId;
    });
  };

  const isServiceSelected = (servicio) =>
    services.some((s) => getServiceId(s) === getServiceId(servicio));

  const addService = (servicio) => {
    if (isServiceSelected(servicio))
      return toast.info('Este servicio ya fue agregado.');

    setServices((prev) => [...prev, servicio]);
    toast.success(`${servicio.nombre} agregado correctamente`);
    closeModal();
  };

  const removeService = (id) => {
    const eliminado = services.find((s) => getServiceId(s) === id);
    setServices(services.filter((s) => getServiceId(s) !== id));
    if (eliminado) toast.success(`${eliminado.nombre} eliminado`);
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  /** ------------  CARGA INICIAL DE DATA ------------ **/
  useEffect(() => {
    const fetchData = async () => {
      setLoadingServices(true);
      try {
        const token = localStorage.getItem('authToken');
        const [{ data: serv }, { data: cats }] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/servicios/listar`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          axios.get(`${API_BASE_URL}/api/categorias/listar`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);
        setAllServices(serv || []);
        setAllCategories(cats || []);
      } catch {
        toast.error('Error cargando servicios / categorías');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchData();
  }, []);

  /* … resto de tus funciones de validación de fecha y handleReserva, sin cambios … */

  /** ------------------  RENDER ------------------ **/
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

      {/* ----- Datos de turno y pago ----- */}
      <form /* onSubmit={handleReserva} */>
        <SelectorFecha /* props */ />

        <ResumenPago /* props */ />

        <MetodoPago
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          cardDetails={cardDetails}
          setCardDetails={setCardDetails}
        />

        <BotonConfirmar /* disabled={!condicionesCumplidas} */ />
      </form>

      {/* ----- Modal de selección de servicios ----- */}
      <ModalServicios
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
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
