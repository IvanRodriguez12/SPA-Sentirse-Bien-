const Testimonials = () => (
    <section style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      backgroundColor: 'var(--verde-claro)',
    }}>
      <h2>Lo que dicen nuestros clientes</h2>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '2rem',
        padding: '2rem 0',
        scrollSnapType: 'x mandatory'
      }}>
        {[
          {name: 'Ana G.', text: 'La mejor experiencia de relajación que tuve en mi vida. ¡Volveré seguro!'},
          {name: 'Carlos M.', text: 'Personal super capacitado y atención de primera calidad.'},
          {name: 'María L.', text: 'Ambiente increíble y tratamientos excepcionales.'}
        ].map((testimonial, index) => (
          <div key={index} style={{
            minWidth: '300px',
            backgroundColor: 'var(--rosa-claro)',
            borderRadius: '15px',
            padding: '2rem',
            scrollSnapAlign: 'center'
          }}>
            <p style={{fontStyle: 'italic'}}>" {testimonial.text} "</p>
            <p style={{fontWeight: 'bold', marginTop: '1rem'}}>— {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );

export default Testimonials;