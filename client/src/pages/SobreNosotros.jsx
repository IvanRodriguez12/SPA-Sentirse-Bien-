import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaSpa,
  FaLeaf,
  FaUsers,
  FaAward,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';
import styles from '../components/SobreNosotros/SobreNosotros.module.css';

const SobreNosotros = () => {
  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1><FaSpa /> Nuestra Historia</h1>
          <p>5 años transformando momentos en experiencias de bienestar</p>
        </div>
      </section>

      {/* Sección Nuestra Historia */}
      <section className={styles.section}>
        <div className={styles.textContent}>
          <h2>Quiénes Somos</h2>
          <p>
            Fundado en 2019, <strong>"Sentirse Bien"</strong> nació de la pasión por el bienestar integral.
            Comenzamos como un pequeño estudio de masajes y hoy somos un referente en diferentes tipos de tratamientos.
          </p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <FaUsers className={styles.statIcon} />
              <span>+5,000</span>
              <p>Clientes satisfechos</p>
            </div>
            <div className={styles.statItem}>
              <FaAward className={styles.statIcon} />
              <span>12</span>
              <p>Terapeutas certificados</p>
            </div>
            <div className={styles.statItem}>
              <FaLeaf className={styles.statIcon} />
              <span>100%</span>
              <p>Productos orgánicos</p>
            </div>
          </div>
        </div>
        <div className={styles.imageContent}>
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Interior del spa"
          />
        </div>
      </section>

      {/* Filosofía */}
      <section className={`${styles.section} ${styles.philosophy}`}>
        <h2>Nuestra Filosofía</h2>
        <div className={styles.philosophyGrid}>
          <div className={styles.card}>
            <h3><FaLeaf /> Bienestar Natural</h3>
            <p>Usamos solo ingredientes orgánicos y técnicas libres de químicos agresivos.</p>
          </div>
          <div className={styles.card}>
            <h3><FaUsers /> Diferentes Tratamientos</h3>
            <p>Cada uno de ellos se adapta a las necesidades específicas del cliente.</p>
          </div>
          <div className={styles.card}>
            <h3><FaSpa /> Experiencia Total</h3>
            <p>Desde el aroma hasta la música, cada detalle está diseñado para tu relajación.</p>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className={styles.section}>
        <h2>Conoce a Nuestros Expertos</h2>
        <div className={styles.teamGrid}>
          <div className={styles.teamMember}>
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D3D&auto=format&fit=crop&w=1470&q=80"
              alt="María González"
            />
            <h3>María González</h3>
            <p>Especialista en Masajes Descontracturantes</p>
            <p>10 años de experiencia</p>
          </div>
          <div className={styles.teamMember}>
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=300&auto=format&fit=crop&crop=focalpoint&fp-y=0.3"
              alt="Melani Rodriguez"
            />
            <h3>Melani Rodriguez</h3>
            <p>Terapeuta en Piedras Calientes</p>
            <p>Certificada por ABMP</p>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--verde-claro) 0%, var(--rosa-claro) 100%)',
        borderRadius: '12px',
        margin: '3rem 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            color: '#2e8b57',
            marginBottom: '1.5rem',
            fontSize: '2rem',
            fontWeight: '600',
            lineHeight: '1.3'
          }}>
            Transforma tu bienestar con una experiencia única
          </h2>

          <p style={{
            color: '#2e8b57',
            margin: '1.5rem auto',
            fontSize: '1.2rem',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Reserva hoy y recibe un <strong>10% de descuento</strong> en tu primer tratamiento spa
          </p>

          <div style={{ marginTop: '2rem' }}>
            <Link
              to="/categorias"  // Cambiado a ruta directa de reservas
              style={{
                display: 'inline-block',
                padding: '1.2rem 3.5rem',
                fontSize: '1.2rem',
                backgroundColor: 'var(--verde-oscuro)',
                background: 'var(--rosa-medio)',
                color: 'white',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: '0 4px 8px rgba(46, 125, 50, 0.2)',
                fontWeight: '500',
                letterSpacing: '0.5px',
                ':hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 16px rgba(46, 125, 50, 0.3)',
                  background: 'linear-gradient(to right, var(--verde-mas-oscuro), var(--verde-oscuro))'
                }
              }}
            >
              Reservar Ahora
            </Link>

            <p style={{
              marginTop: '1.5rem',
              color: '#2e8b57',
              fontSize: '0.9rem'
            }}>
              O llama al <a href="tel:+54 9 11 2345-6789" style={{ color: '#2e8b57', fontWeight: '600' }}>+54 9 11 2345-6789</a>
            </p>
          </div>
        </div>
      </section>

      {/* Info de contacto */}
      <section className={styles.contactInfo}>
        <h2><FaMapMarkerAlt /> Visítanos</h2>
        <p style={{margin: '1rem 0'}}>📍 Av. Relaxación 123, Buenos Aires</p>
        <div className={styles.infoGrid}>
          <div>
            <p><FaClock /> Lunes a Viernes: 9:00 - 20:30, Sábados: 10:00 - 19:00</p>
          </div>
          <div>
            <p><FaPhone /> +54 9 11 2345-6789</p>
            <p><FaEnvelope /> info@sentirsebien.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;