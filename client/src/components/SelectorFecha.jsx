import React from 'react';
import DatePicker from 'react-datepicker';

const SelectorFecha = ({ selectedDateTime, handleDateChange, getMinDate, filterPassedTime, isWeekday }) => (
    <div className="selector-fecha">
        <label>Selecciona fecha y hora (mínimo 48hs de anticipación):</label>
        <DatePicker
            selected={selectedDateTime}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            minDate={getMinDate()}
            filterTime={filterPassedTime}
            filterDate={isWeekday}
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

export default SelectorFecha;