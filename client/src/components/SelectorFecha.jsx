import React from 'react';
import DatePicker from 'react-datepicker';
import "../styles/selectorFecha.css"; // Asegúrate de tener este archivo CSS

const SelectorFecha = ({ selectedDateTime, handleDateChange, getMinDate }) => {
    const filtrarFecha = (date) => {
        const day = date.getDay(); // 0 = Domingo, 6 = Sábado
        return day !== 0; // Bloqueamos domingos
    };

    const filtrarHora = (time) => {
        const date = new Date(time);
        const day = date.getDay();
        const hour = date.getHours();
        const minute = date.getMinutes();

        if (day === 6) {
            // Sábado: 10:00 a 19:00
            return (hour > 9 && hour < 19) || (hour === 10 && minute >= 0) || (hour === 18 && minute <= 30);
        } else if (day >= 1 && day <= 5) {
            // Lunes a Viernes: 09:00 a 20:30
            return (hour > 8 && hour < 20) || (hour === 9 && minute >= 0) || (hour === 20 && minute <= 30);
        }
        return false;
    };

    return (
        <div className="selector-fecha">
            <label>Selecciona fecha y hora (mínimo 48hs de anticipación):</label>
            <DatePicker
                selected={selectedDateTime}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                minDate={getMinDate()}
                filterDate={filtrarFecha}
                filterTime={filtrarHora}
                dateFormat="dd/MM/yyyy HH:mm"
                placeholderText="Selecciona fecha y hora"
                className="datetime-picker"
                required
            />
            <div className="horarios-info">
                Horarios de atención: Lunes a Viernes 9:00-20:30 | Sábados 10:00-19:00
            </div>
        </div>
    );
};

export default SelectorFecha;
