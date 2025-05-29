import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const ContactoModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.backgroundLocation;

  const handleClose = () => {
    navigate(background || '/');
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>

        <h2 style={{ color: 'var(--texto-oscuro)', marginBottom: '1rem' }}>Contacto</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <WhatsAppLink
            href="https://wa.me/5491234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </WhatsAppLink>

          <EmailLink href="spasentirsebiencontacto@gmail.com">
            Email
          </EmailLink>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

// Estilos con styled-components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  position: relative;
  animation: modalSlide 0.3s ease-out;

  @keyframes modalSlide {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--texto-oscuro);
`;

const BaseLink = styled.a`
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const WhatsAppLink = styled(BaseLink)`
  background: #25D366;
`;

const EmailLink = styled(BaseLink)`
  background: var(--rosa-medio);
`;

export default ContactoModal;