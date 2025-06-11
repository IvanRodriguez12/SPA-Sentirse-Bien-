import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerificarEmail = () => {
  const [mensaje, setMensaje] = useState("Verificando correo...");
  const [exito, setExito] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMensaje("Token no proporcionado.");
      setExito(false);
      return;
    }

    fetch(
      `https://spa-sentirse-bien-backend.up.railway.app/api/clientes/verificar-email?token=${token}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Token no válido o expirado");
        return res.text();
      })
      .then((data) => {
        setMensaje(data);
        setExito(true);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        setMensaje(err.message);
        setExito(false);
      });
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        backgroundColor: exito === true ? "#e0ffe0" : "#ffe0e0",
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "5rem auto",
      }}
    >
      <h2>{mensaje}</h2>
      {exito === true && <p>Serás redirigido al login en unos segundos...</p>}
    </div>
  );
};

export default VerificarEmail;
