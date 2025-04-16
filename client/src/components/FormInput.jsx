// src/components/FormInput.jsx
const FormInput = ({ 
    label, 
    id, 
    type, 
    register, 
    required, 
    error, 
    pattern, 
    ...rest 
  }) => {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          {...register(id, { 
            required: required && `${label} es requerido`,
            pattern
          })}
          className={error ? 'error' : ''}
          {...rest}
        />
        {error && <span className="error-message">{error.message}</span>}
      </div>
    );
  };
  
  export default FormInput;