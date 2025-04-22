const Button = ({ onClick, children, style }) => {
    return (
      <button
        onClick={onClick}
        style={{
          backgroundColor: 'var(--rosa-medio)',
          color: 'white',
          padding: '0.8rem 1.5rem',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          ...style,
        }}
      >
        {children}
      </button>
    );
  };
  
  export default Button;