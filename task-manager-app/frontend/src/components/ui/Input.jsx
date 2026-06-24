import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        name={id}
        className={`form-input ${error ? 'border-danger' : ''}`}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  );
};

export default Input;
