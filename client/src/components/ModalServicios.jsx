import React from 'react';
import Modal from 'react-modal';

const ModalServicios = ({
    modalIsOpen,
    closeModal,
    loadingServices,
    allCategories,
    getServicesByCategory,
    isServiceSelected,
    addService,
    getServiceId,
}) => (
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
            <>
                {allCategories.map((categoria) => {
                    const serviciosDeCategoria = getServicesByCategory(categoria);
                    if (serviciosDeCategoria.length === 0) return null;

                    return (
                        <div key={categoria._id || categoria.id} className="categoria">
                            <h4>
                                {categoria.nombre}
                                <span>({serviciosDeCategoria.length} servicio{serviciosDeCategoria.length !== 1 ? 's' : ''})</span>
                            </h4>
                            <div className="servicios-grid">
                                {serviciosDeCategoria.map(servicio => {
                                    const yaSeleccionado = isServiceSelected(servicio);
                                    const servicioId = getServiceId(servicio);

                                    return (
                                        <button
                                            key={servicioId}
                                            onClick={() => addService(servicio)}
                                            disabled={yaSeleccionado}
                                            className={yaSeleccionado ? 'seleccionado' : ''}
                                        >
                                            <div>
                                                <strong>{servicio.nombre}</strong>
                                                <div>${servicio.precio} • {servicio.duracion} min</div>
                                                {servicio.descripcion && <div>{servicio.descripcion}</div>}
                                            </div>
                                            {yaSeleccionado && <div>✓ Ya agregado</div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </>
        )}
    </Modal>
);

export default ModalServicios;