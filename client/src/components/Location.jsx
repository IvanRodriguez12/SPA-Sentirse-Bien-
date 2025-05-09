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
        <p style={{margin: '1rem 0'}}>📍 Av. Relaxación 123, Buenos Aires</p>
        <p>🕒 Horarios:<br/>
          Lunes a Viernes: 9:00 - 20:30<br/>
          Sábados: 10:00 - 19:00
        </p>
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
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016887889527!2d-58.383759!3d-34.603738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf425a4a1f%3A0x9dc384029c9de5a2!2sObelisco!5e0!3m2!1ses!2sar!4v1716425382352!5m2!1ses!2sar"
        width="400"
        height="300"
        style={{border: '0', borderRadius: '15px', flex: '1 1 400px'}}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade">
      </iframe>
    </section>
  );

  export default Location;