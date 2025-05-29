import React from 'react';

const Location = () => (
  <section style={{
    padding: '4rem 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--verde-claro)'
  }}>
    <div style={{flex: '1 1 400px', maxWidth: '600px'}}>
      <h2>Nuestra Ubicación</h2>
      <p style={{margin: '1rem 0'}}>📍 Av. 25 de Mayo 240, Resistencia, Chaco</p>
      <p>🕒 Horarios:<br/>
        Lunes a Viernes: 9:00 - 20:30<br/>
        Sábados: 10:00 - 19:00
      </p>

      {/* Botón para abrir Google Maps con la ruta */}
      <a
        href="https://www.google.com/maps/dir/?api=1&destination=Av+25+de+Mayo+240+Resistencia+Chaco"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button style={{
          marginTop: '1rem',
          padding: '1rem 2rem',
          backgroundColor: 'var(--verde-oscuro)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer'
        }}>
          Cómo llegar
        </button>
      </a>
    </div>

    {/* Mapa de Google con la ubicación */}
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.6472634314305!2d-58.99098192493083!3d-27.44910171582816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450cf53bed1db1%3A0xdeb8b89d182d5d52!2sAv.%2025%20de%20Mayo%20240%2C%20H3500AAP%20Resistencia%2C%20Chaco!5e0!3m2!1ses-419!2sar!4v1748498738900!5m2!1ses-419!2sar"
      width="600"
      height="450"
      style={{ border: '0', borderRadius: '15px', flex: '1 1 400px' }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </section>
);

export default Location;
