import React from 'react';
import '../styles/botonConfirmar.css'; // Asegúrate de tener este archivo CSS

const BotonConfirmar = ({ editingTurno, handleReserva }) => (
    <div className="boton-confirmar">
        <button
            type="submit"
            onClick={handleReserva}
        >
            {editingTurno ? 'Guardar Cambios' : 'Confirmar Reserva'}
        </button>
    </div>
);

export default BotonConfirmar;