import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext'; // Asegurate que el path sea correcto
import { toast } from 'react-hot-toast';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('La contraseña es requerida')
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(loginSchema) });

  const { login } = useAuth(); // ✅ Usamos el contexto

  const onSubmit = async (data) => {
    await login(data.email, data.password); // ✅ Llama al login del contexto
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <h2>Iniciar Sesión</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            {...register('password')}
            className={`form-input ${errors.password ? 'input-error' : ''}`}
          />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="auth-link">
          ¿No tienes cuenta?{' '}
          <a href="/registro" className="link">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

