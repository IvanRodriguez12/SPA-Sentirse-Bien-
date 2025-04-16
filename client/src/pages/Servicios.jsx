const Servicios = () => {
    const servicesData = {
      Masajes: {
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        items: [
          'Anti-stress',
          'Descontracturantes',
          'Masajes con piedras calientes',
          'Circulatorios'
        ]
      },
      Belleza: {
        image: 'https://images.unsplash.com/photo-1590540172602-2f7d1ac92959?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        items: [
          'Lifting de pestaña',
          'Depilación facial',
          'Belleza de manos y pies'
        ]
      },
      Tratamientos_Faciales: {
        items: [
            'Punta de Diamante: Microexfoliación.',
            'Limpieza profunda + Hidratación',
            'Crio frecuencia facial: produce el “SHOCK TERMICO” logrando resultados instantáneos de efecto lifting.'
        ],
        },
        Tratamientos_Corporales: {
        items:[
            'VelaSlim: Reducción de la circunferencia corporal y la celulitis.',
            'DermoHealth: moviliza los distintos tejidos de la piel y estimula la microcirculación, generando un drenaje linfático.',
            'Criofrecuencia: produce un efecto de lifting instantáneo.',
            'Ultracavitación:Técnica reductora.'
        ],
        },
        Servicios_Grupales:{
        items:[
            'Hidromasajes',
            'Yoga'
        ],
        },
    };
  
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ animation: 'fadeIn 0.6s ease' }}>Nuestros Servicios</h2>
        
        {Object.entries(servicesData).map(([category, data], index) => (
          <div 
            key={category}
            className="service-card"
            style={{ margin: '3rem 0' }}
          >
            <div style={{
              display: 'flex',
              flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <img 
                src={data.image}
                alt={category}
                style={{
                  width: '40%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={categoryStyle}>{category}</h3>
              </div>
            </div>
            
            <ul style={listStyle}>
              {data.items.map((service, idx) => (
                <li 
                  key={idx}
                  className="hover-effect"
                  style={serviceItemStyle}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{service}</h4>
                  </div>
                  <button style={buttonStyle}>
                    Reservar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  // Estilos separados para mejor lectura
  const categoryStyle = {
    color: 'var(--verde-oscuro)',
    borderBottom: '2px solid var(--rosa-medio)',
    paddingBottom: '0.5rem',
    fontSize: '1.8rem'
  };
  
  const listStyle = {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  };
  
  const serviceItemStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  
  const buttonStyle = {
    backgroundColor: 'var(--rosa-medio)',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'var(--verde-oscuro)',
      transform: 'scale(1.05)'
    }
  };
  
  export default Servicios;