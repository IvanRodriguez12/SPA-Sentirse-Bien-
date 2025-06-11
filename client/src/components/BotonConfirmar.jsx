import React from 'react';

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