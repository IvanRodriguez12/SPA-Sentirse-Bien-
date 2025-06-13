import React from 'react';
import '../styles/metodo-pago.css';

const MetodoPago = ({
  metodoPago,
  setMetodoPago,
  cardDetails,
  setCardDetails,
  showError
}) => {
  return (
    <div className="metodo-pago">
      <h3>Método de pago</h3>

      <label>
        <input
          type="radio"
          name="metodoPago"
          value="efectivo"
          checked={metodoPago === 'efectivo'}
          onChange={() => setMetodoPago('efectivo')}
        />
        Efectivo
      </label>

      <label>
        <input
          type="radio"
          name="metodoPago"
          value="tarjeta"
          checked={metodoPago === 'tarjeta'}
          onChange={() => setMetodoPago('tarjeta')}
        />
        Tarjeta (crédito / débito)
      </label>

      {metodoPago === 'tarjeta' && (
        <div className="tarjeta-form">
          <input
            type="text"
            placeholder="Número de tarjeta"
            value={cardDetails.numero}
            onChange={e => setCardDetails({ ...cardDetails, numero: e.target.value })}
          />
          <input
            type="text"
            placeholder="MM/AA"
            value={cardDetails.vencimiento}
            onChange={e => setCardDetails({ ...cardDetails, vencimiento: e.target.value })}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
          />
        </div>
      )}

      {showError && !metodoPago && (
        <p className="error-text">⚠ Por favor, seleccioná un método de pago.</p>
      )}
    </div>
  );
};

export default MetodoPago;
