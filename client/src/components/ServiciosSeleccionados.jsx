import React from 'react';

const ServiciosSeleccionados = ({ services, getServiceId, removeService }) => {
    return (
        <div className="servicios-seleccionados">
            <p><strong>Servicios:</strong> {services.map(s => s.nombre).join(", ")}</p>
            <p><strong>Precio total:</strong> ${services.reduce((total, s) => total + s.precio, 0)}</p>
            <p><strong>Duración total:</strong> {services.reduce((total, s) => total + s.duracion, 0)} minutos</p>
            <ul>
                {services.map(servicio => {
                    const servicioId = getServiceId(servicio);
                    return (
                        <li key={servicioId}>
                            <span>{servicio.nombre} - ${servicio.precio}</span>
                            <button onClick={() => removeService(servicioId)} title="Eliminar servicio">
                                ❌
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ServiciosSeleccionados;