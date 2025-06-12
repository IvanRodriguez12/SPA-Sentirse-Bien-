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
      background: '#f0f4f8',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Ingreso Profesional/Admin</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input {...register("email")} type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Contraseña</label>
            <input {...register("contrasena")} type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px' }} />
          </div>
          <button type="submit" disabled={isSubmitting} style={{
            width: '100%',
            background: '#5cb85c',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '6px'
          }}>
            Ingresar
          </button>
          <p style={{ marginTop: 20, textAlign: 'center' }}>
            ¿Sos la Dra. Felicidad y aún no tenés cuenta?
            <a href="/admin/crear-admin" style={{ color: 'blue', marginLeft: 5 }}>Crear cuenta</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
