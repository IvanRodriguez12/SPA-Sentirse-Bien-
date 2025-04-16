// src/pages/BookAppointment.jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { createAppointment } from '../api/spaApi';
import FormInput from '../components/FormInput';

const BookAppointment = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createAppointment(data);
      toast.success('Reserva creada exitosamente!');
      reset();
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al crear la reserva');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Reserva tu cita</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
        <FormInput
          label="Nombre completo"
          id="name"
          type="text"
          register={register}
          required
          error={errors.name}
        />
        
        <FormInput
          label="Email"
          id="email"
          type="email"
          register={register}
          required
          error={errors.email}
          pattern={{
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email inválido"
          }}
        />
        
        <FormInput
          label="Teléfono"
          id="phone"
          type="tel"
          register={register}
          required
          error={errors.phone}
        />
        
        <div className="form-group">
          <label htmlFor="service">Servicio</label>
          <select
            id="service"
            {...register("service", { required: "Selecciona un servicio" })}
            className={errors.service ? 'error' : ''}
          >
            <option value="">Selecciona un servicio...</option>
            <option value="Masaje Anti-stress">Masaje Anti-stress</option>
            <option value="Tratamiento Facial">Tratamiento Facial</option>
            {/* Agrega más opciones según tus servicios */}
          </select>
          {errors.service && <span className="error-message">{errors.service.message}</span>}
        </div>
        
        <FormInput
          label="Fecha"
          id="date"
          type="date"
          register={register}
          required
          error={errors.date}
        />
        
        <FormInput
          label="Hora"
          id="time"
          type="time"
          register={register}
          required
          error={errors.time}
        />
        
        <div className="form-group">
          <label htmlFor="notes">Notas adicionales</label>
          <textarea
            id="notes"
            {...register("notes")}
            rows="4"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Reservar cita'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;