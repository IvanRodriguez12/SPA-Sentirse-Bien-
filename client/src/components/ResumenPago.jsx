import React from 'react';

const ResumenPago = ({ total, aplicado, totalConDescuento }) => (
    <div className="resumen-pago">
        <h3>Resumen de pago</h3>
        <p>Total sin descuento: ${total.toFixed(2)}</p>
        {aplicado && (
            <p className="descuento">Descuento aplicado: 15% por pago anticipado</p>
        )}
        <p><strong>Total a pagar: ${totalConDescuento.toFixed(2)}</strong></p>
    </div>
);

export default ResumenPago;