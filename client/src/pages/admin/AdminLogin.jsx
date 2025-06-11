import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const usuario = await login(data.email, data.contrasena);
      if (!usuario) return;

      if (usuario.email === "dranafelicidad@gmail.com") {
        navigate("/admin/dashboard");
      } else if (usuario.profesion) {
        navigate("/profesional/dashboard");
      } else {
        toast.error("Este acceso es solo para profesionales o administradores.");
      }
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
        <h2 style={{ color: 'var(--texto-muy-oscuro)', textAlign: 'center' }}>Iniciar sesión</h2>

        <div className="form-group">
          <label>Email</label>
          <input {...register('email')} type="email" required />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input {...register('contrasena')} type="password" required />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;