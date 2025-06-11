import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaQuestionCircle,
  FaSpa,
  FaCalendarCheck,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import styles from "../styles/FAQ.module.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Iconos por categoría
  const categoryIcons = {
    general: <FaQuestionCircle className={styles.categoryIcon} />,
    masajes: <FaSpa className={styles.categoryIcon} />,
    preparacion: <FaCalendarCheck className={styles.categoryIcon} />,
    politicas: <FaClipboardList className={styles.categoryIcon} />
  };

  // Todas las preguntas y respuestas
  const faqs = {
    general: [
      {
        question: "¿Cómo reservo un servicio?",
        answer: "Puedes reservar desde nuestra página de 'Reservas' seleccionando el servicio, fecha y horario."
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos efectivo, tarjetas crédito/débito (Visa, MasterCard) y transferencias bancarias."
      },
      {
        question: "¿Necesito reservar con anticipación?",
        answer: "Recomendamos reservar al menos con 48 horas de anticipación."
      },
      {
        question: "¿Tienen estacionamiento?",
        answer: "Sí, contamos con estacionamiento gratuito para clientes."
      }
    ],
    masajes: [
      {
        question: "¿Qué tipo de masajes ofrecen?",
        answer: "Masajes relajantes, descontracturantes, piedras calientes y otros tratamientos que se pueden observar en nuestro apartado de Servicios."
      },
      {
        question: "¿Debo desvestirme completamente para un masaje?",
        answer: "Depende del tratamiento. En la mayoría de casos se trabaja con ropa interior (te cubrimos con toallas) o ropa cómoda."
      },
      {
        question: "¿Los masajes tienen algún beneficio médico?",
        answer: "Ayudan a mejorar la circulación, reducir los dolores musculares y aliviar el estrés."
      },
      {
        question: "¿Cuánto dura una sesión típica?",
        answer: "Las sesiones estándar son de 60 o 90 minutos, pero ofrecemos algunos tratamientos express de 30 minutos."
      }
    ],
    preparacion: [
      {
        question: "¿Cómo debo prepararme antes de mi sesión?",
        answer: "Recomendamos llegar 10 minutos antes, evitar comidas pesadas y estar hidratado."
      },
      {
        question: "¿Puedo recibir un masaje si estoy embarazada?",
        answer: "Sí, ofrecemos masajes prenatales especializados (solo después del primer trimestre y con autorización médica)."
      },
      {
        question: "¿Puedo comer antes de un masaje?",
        answer: "Evita comidas pesadas 2 horas antes. Opta por snacks ligeros como frutas."
      },
      {
        question: "¿Qué debo llevar?",
        answer: "Solo ropa cómoda. Proveemos toallas, aceites y todo lo necesario."
      }
    ],
    politicas: [
      {
        question: "¿Cuál es su política de cancelación?",
        answer: "Puedes cancelar o reagendar hasta 24 horas antes sin costo y dentro del horario de atención al cliente mediante nuestra sección de Contacto para hablar con nuestro personal. Cancelaciones con menos tiempo tienen un cargo del 50%."
      },
      {
        question: "¿Ofrecen facturación?",
        answer: "Sí, podemos emitir facturas A o B. Solicítala al finalizar tu servicio."
      },
      {
        question: "¿Puedo regalar un servicio?",
        answer: "Sí, además ofrecemos un 10% de descuento en el primer tratamiento."
      },
      {
        question: "¿Atienden a menores de edad?",
        answer: "Sí, desde 12 años con autorización firmada por padres/tutores."
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}><FaSpa /> Preguntas Frecuentes</h1>

      {/* Navegación por categorías */}
      <div className={styles.categories}>
        {Object.keys(faqs).map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setActiveIndex(null);
            }}
            className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
          >
            {categoryIcons[category]}
            {category === 'general' && ' General'}
            {category === 'masajes' && ' Masajes'}
            {category === 'preparacion' && ' Preparación'}
            {category === 'politicas' && ' Políticas'}
          </button>
        ))}
      </div>

      {/* Acordeón de preguntas */}
      <div className={styles.accordion}>
        {faqs[activeCategory].map((faq, index) => (
          <div key={index} className={styles.accordionItem}>
            <button
              className={`${styles.accordionQuestion} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {activeIndex === index ?
                <FaChevronUp className={styles.accordionIcon} /> :
                <FaChevronDown className={styles.accordionIcon} />
              }
            </button>
            <div className={`${styles.accordionAnswer} ${activeIndex === index ? styles.show : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className={styles.homeLink}>← Volver al inicio</Link>
    </div>
  );
};

export default FAQ;