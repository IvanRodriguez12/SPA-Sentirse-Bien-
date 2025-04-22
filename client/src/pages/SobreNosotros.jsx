import React from 'react';
import instagramLogo from '../assets/Instagram-Logo.png'; // Ruta del logo de Instagram
import twitterLogo from '../assets/twitter_x-logo.png'; // Ruta del logo de X (Twitter)
import facebookLogo from '../assets/facebook_logo.png'; // Ruta del logo de Facebook

const SobreNosotros = () => {
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
      <h2 style={{ color: 'var(--texto-oscuro)', marginBottom: '1rem' }}>Nuestra Historia</h2>
      <p style={{ maxWidth: '800px', margin: '2rem auto', color: 'var(--texto-oscuro)' }}>
        En SPA “Sentirse bien” combinamos técnicas ancestrales con tecnología moderna
        para ofrecerte una experiencia única de relajación y bienestar.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {/* Botón de Instagram */}
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#E1306C', // Color de Instagram
            color: 'white',
            padding: '1rem',
            borderRadius: '15px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            width: '100px',
            height: '100px',
            justifyContent: 'center',
          }}
        >
          <img
            src={instagramLogo}
            alt="Instagram"
            style={{ width: '70px', height: '40px', marginBottom: '0.5rem' }}
          />
          Instagram
        </a>

        {/* Botón de X (Twitter) */}
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1DA1F2', // Color de X (Twitter)
            color: 'white',
            padding: '1rem',
            borderRadius: '15px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            width: '100px',
            height: '100px',
            justifyContent: 'center',
          }}
        >
          <img
            src={twitterLogo}
            alt="X"
            style={{ width: '50px', height: '40px', marginBottom: '0.5rem' }}
          />
          X
        </a>

        {/* Botón de Facebook */}
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#1877F2', // Color de Facebook
            color: 'white',
            padding: '1rem',
            borderRadius: '15px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            width: '100px',
            height: '100px',
            justifyContent: 'center',
          }}
        >
          <img
            src={facebookLogo}
            alt="Facebook"
            style={{ width: '40px', height: '40px', marginBottom: '0.5rem' }}
          />
          Facebook
        </a>
      </div>
    </div>
  );
};

export default SobreNosotros;