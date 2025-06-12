import React from 'react';
import Modal from 'react-modal';
import '../styles/modal-servicios.css'; // Asegúrate de tener este archivo CSS

const ModalServicios = ({
    services,
    modalIsOpen,
    closeModal,
    loadingServices,
    allCategories,
    allServices,
    addService,
    getServiceId,
}) => {
    const renderCategorias = () => {
        const isServiceSelected = (servicio) => {
            if (!services) return false;
            return services.some(s => {
                const sId = s._id || s.id;
                const servicioId = servicio._id || servicio.id;
                return sId === servicioId;
            });
        };

        return allCategories.map((categoria) => {
            const serviciosDeCategoria = allServices.filter(serv => {
                const catId = typeof serv.categoria === 'object' && serv.categoria !== null
                    ? serv.categoria.id || serv.categoria._id
                    : serv.categoria;
                return catId === categoria.id || catId === categoria._id;
            });

            return (
                <div key={categoria.id || categoria._id} className="categoria-block">
                    <h4>{categoria.nombre}</h4>
                    {serviciosDeCategoria.length > 0 ? (
                        <ul>
                            {serviciosDeCategoria.map((servicio) => (
                                <li key={getServiceId(servicio)}>
                                    {servicio.nombre} - ${servicio.precio}
                                    {!isServiceSelected(servicio) && (
                                        <button onClick={() => addService(servicio)}>Añadir</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay servicios en esta categoría</p>
                    )}
                </div>
            );
        });
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Seleccionar Servicios"
            className="modal-servicios"
        >
            <div className="modal-header">
                <h3>Seleccionar Servicios</h3>
                <button onClick={closeModal}>×</button>
            </div>

            {loadingServices ? (
                <div className="modal-loading">
                    <p>Cargando servicios...</p>
                </div>
            ) : allCategories.length === 0 ? (
                <div className="modal-empty">
                    <p>No hay categorías disponibles</p>
                </div>
            ) : (
                <>{renderCategorias()}</>
            )}
        </Modal>
    );
};

export default ModalServicios;
