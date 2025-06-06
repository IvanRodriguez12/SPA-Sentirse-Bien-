import React from 'react';

const MetodoPago = ({
    metodoPago,
    setMetodoPago,
    pagarAhora,
    setPagarAhora,
    cardDetails,
    setCardDetails
}) => {
    return (
        <div>
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
                Tarjeta de crédito o débito
            </label>

            {metodoPago === 'tarjeta' && (
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={cardDetails.numero}
                        onChange={(e) => setCardDetails({ ...cardDetails, numero: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardDetails.vencimiento}
                        onChange={(e) => setCardDetails({ ...cardDetails, vencimiento: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                </div>
            )}

            <label>
                <input
                    type="checkbox"
                    checked={pagarAhora}
                    onChange={() => setPagarAhora(!pagarAhora)}
                />
                ¿Deseás pagar ahora?
            </label>
        </div>
    );
};

export default MetodoPago;
