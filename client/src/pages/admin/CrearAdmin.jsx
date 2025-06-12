import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://spa-sentirse-bien-production.up.railway.app/api";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio")
    .oneOf(["dranafelicidad@gmail.com"], "Solo la Dra. Felicidad puede registrarse aquí"),
  contrasena: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6, "Mínimo 6 caracteres")
});

const CrearAdmin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/admin/registrar`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      toast.success(response.data.mensaje || "Admin creado exitosamente");
      localStorage.setItem("authToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.mensaje || "No se pudo crear la cuenta de admin"
      );
    }
  };

  return (
    <div style={{
      background: "#f0f0f0",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Registro Admin</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            {...register("email")}
            type="email"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Contraseña</label>
          <input
            {...register("contrasena")}
            type="password"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
          />
          {errors.contrasena && <p style={{ color: "red" }}>{errors.contrasena.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            background: "#28a745",
            color: "white",
            padding: "0.75rem",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Crear Admin
        </button>
      </form>
    </div>
  );
};

export default CrearAdmin;
