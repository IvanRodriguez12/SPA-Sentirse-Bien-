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
        src="https://maps.app.goo.gl/CX8M84G5tVGHL1Rj7"
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