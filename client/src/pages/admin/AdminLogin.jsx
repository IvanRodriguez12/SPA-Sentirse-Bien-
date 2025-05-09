import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.contrasena);
    } catch {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <div style={{ 
      background: 'var(--verde-claro)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: 'var(--texto-muy-oscuro)', textAlign: 'center' }}>
          Acceso Administrador
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            {...register('email', { required: true })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid var(--verde-medio)',
              borderRadius: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            {...register('contrasena', { required: true })}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid var(--verde-medio)',
              borderRadius: '5px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--verde-oscuro)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isSubmitting ? 'Iniciando...' : 'Ingresar'}
        </button>

         <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            to="/admin/registrar" 
            style={{ 
              color: 'var(--verde-oscuro)', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ¿Primer administrador? Regístrate aquí
          </Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link 
            to="/" 
            style={{ color: 'var(--texto-oscuro)', textDecoration: 'none' }}
          >
            Volver al sitio principal
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;