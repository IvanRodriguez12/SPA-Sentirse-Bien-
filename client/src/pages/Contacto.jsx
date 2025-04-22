import React from 'react';

const Contacto = () => {
  const whatsappNumber = '+5491234567890'; // Número de WhatsApp del spa
  const emailAddress = 'info@SPA “Sentirse bien” .com'; // Correo electrónico del spa

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(to bottom right, var(--verde-claro), var(--rosa-claro))',
        minHeight: '100vh', // Asegura que el fondo cubra toda la pantalla
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2 style={{ color: 'var(--texto-oscuro)', marginBottom: '1rem' }}>Contacto</h2>
      <p style={{ color: 'var(--texto-oscuro)', marginBottom: '2rem' }}>
        ¿Tienes alguna consulta? ¡Contáctanos!
      </p>

      {/* Botón de WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: 'var(--verde-oscuro)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '1rem 0',
          transition: 'all 0.3s ease',
        }}
      >
        Enviar mensaje por WhatsApp
      </a>

      {/* Enlace de correo */}
      <a
        href={`mailto:${emailAddress}`}
        style={{
          display: 'inline-block',
          backgroundColor: 'var(--rosa-medio)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '1rem 0',
          transition: 'all 0.3s ease',
        }}
      >
        Enviar correo electrónico
      </a>
    </div>
  );
};

export default Contacto;