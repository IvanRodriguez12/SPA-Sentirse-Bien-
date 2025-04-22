import React from 'react';

const Contacto = () => {
  const whatsappNumber = '+5491234567890'; // Número de WhatsApp del spa
  const emailAddress = 'info@SPA “Sentirse bien” .com'; // Correo electrónico del spa

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Contacto</h2>
      <p>¿Tienes alguna consulta? ¡Contáctanos!</p>

      {/* Botón de WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '1rem 0',
        }}
      >
        Enviar mensaje por WhatsApp
      </a>

      <br />

      {/* Enlace de correo */}
      <a
        href={`mailto:${emailAddress}`}
        style={{
          display: 'inline-block',
          backgroundColor: '#0078D4',
          color: 'white',
          padding: '0.8rem 1.5rem',
          borderRadius: '25px',
          textDecoration: 'none',
          fontWeight: 'bold',
          margin: '1rem 0',
        }}
      >
        Enviar correo electrónico
      </a>
    </div>
  );
};

export default Contacto;