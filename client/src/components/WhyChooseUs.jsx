const WhyChooseUs = () => (
    <section style={{
      padding: '4rem 2rem',
      backgroundColor: 'var(--rosa-claro)',
      textAlign: 'center'
    }}>
      <h2 style={{marginBottom: '2rem'}}>¿Por qué elegirnos?</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {[
          {icon: '🌿', title: 'Productos Naturales', text: 'Ingredientes 100% orgánicos y sostenibles'},
          {icon: '👩⚕️', title: 'Expertos Certificados', text: 'Profesionales con más de 10 años de experiencia'},
          {icon: '💆', title: 'Personalizado', text: 'Tratamientos adaptados a tus necesidades'},
          {icon: '🏆', title: 'Premiados', text: 'Reconocidos como mejor spa 2023 en la región'}
        ].map((item, index) => (
          <div key={index} style={{
            padding: '2rem',
            borderRadius: '10px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{item.icon}</div>
            <h3 style={{color: 'var(--verde-oscuro)'}}>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );

  export default WhyChooseUs;