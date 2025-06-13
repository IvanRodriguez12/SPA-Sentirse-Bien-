import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerUser } from '../api/Auth';

const registerSchema = yup.object().shape({
  name: yup.string().required('Nombre requerido'),
  email: yup.string().email('Email inválido').required('Requerido'),
  phone: yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{6,}$/, 'Número de teléfono inválido')
    .required('Teléfono requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña')
});

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        nombre: data.name,
        email: data.email.trim().toLowerCase(),
        telefono: data.phone.replace(/\s/g, ''),
        contrasena: data.password
      };

      await registerUser(formattedData);
      toast.success('¡Registro exitoso!');
      toast('Revisa tu correo electrónico para verificar tu cuenta 📩', { icon: '📧' });
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Error en el registro');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <h2>Crear Cuenta</h2>

        <div className="form-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre completo"
            {...register('name')}
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            style={{ border: '1px solid var(--verde-oscuro)', borderRadius: '5px' }}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Ingresa tu email"
            {...register('email')}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            style={{ border: '1px solid var(--verde-oscuro)', borderRadius: '5px' }}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            placeholder="Ej: +54 11 1234-5678"
            {...register('phone')}
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            style={{ border: '1px solid var(--verde-oscuro)', borderRadius: '5px' }}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Crea una contraseña"
            {...register('password')}
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            style={{ border: '1px solid var(--verde-oscuro)', borderRadius: '5px' }}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="Confirma tu contraseña"
            {...register('confirmPassword')}
            className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            style={{ border: '1px solid var(--verde-oscuro)', borderRadius: '5px' }}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="auth-link">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="link">
            Inicia sesión aquí
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
