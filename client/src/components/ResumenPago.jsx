import React from 'react';
import '../styles/resumenPago.css'; // Asegúrate de tener este archivo CSS

const ResumenPago = ({ total = 0, aplicado = false, totalConDescuento = 0 }) => (
    <div className="resumen-pago">
        <h3>Resumen de pago</h3>
        <p>Total sin descuento: ${Number(total).toFixed(2)}</p>
        {aplicado && (
            <p className="descuento">Descuento aplicado: 15% por pago anticipado</p>
        )}
        <p><strong>Total a pagar: ${Number(totalConDescuento).toFixed(2)}</strong></p>
    </div>
);

export default ResumenPago;