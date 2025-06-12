import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email requerido'),
  contrasena: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  confirmarContrasena: yup.string()
    .oneOf([yup.ref('contrasena'), null], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña'),
});

const CrearAdmin = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (data.email !== "dranafelicidad@gmail.com") {
      toast.error("Solo la Dra. Felicidad puede registrarse como administradora.");
      return;
    }

    try {
      const body = {
        email: data.email,
        contrasena: data.contrasena
      };

      await axios.post(`${API_URL}/admin/registrar`, body);
      toast.success("Administradora creada correctamente");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la administradora");
    }
  };

  return (
    <div className="form-container">
      <h2>Crear administradora</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <label>Email</label>
        <input {...register("email")} type="email" />
        <p>{errors.email?.message}</p>

        <label>Contraseña</label>
        <input {...register("contrasena")} type="password" />
        <p>{errors.contrasena?.message}</p>

        <label>Confirmar Contraseña</label>
        <input {...register("confirmarContrasena")} type="password" />
        <p>{errors.confirmarContrasena?.message}</p>

        <button type="submit" disabled={isSubmitting}>Crear administradora</button>
      </form>
    </div>
  );
};

export default CrearAdmin;
