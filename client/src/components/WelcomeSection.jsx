import React, { useState } from 'react';

const WelcomeSection = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
  
    return (
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100%', // Mantiene la proporción original
        maxHeight: '90vh',
        minHeight: '400px',
        margin: '0rem',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <img 
          src="/assets/home/Fondo4.jpg" 
          alt="Fondo spa"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top', // Ajusta según necesidad
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay adaptable */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)'
        }}></div>
  
        {/* Contenido centrado */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '90%',
          maxWidth: '800px'
        }}>
          <h2 style={{ 
            color: 'var(--verde-oscuro)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            Bienvenido a SPA <br/> “Sentirse bien”
          </h2>
          <p style={{ 
            color: 'var(--texto-oscuro)',
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            lineHeight: '1.5'
          }}>
            Tu oasis de relajación natural
          </p>
        </div>
      </section>
    );
  };

  export default WelcomeSection;