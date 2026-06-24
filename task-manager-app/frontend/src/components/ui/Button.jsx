import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  icon: Icon,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    icon: 'btn-icon',
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button type={type} className={classes} style={fullWidth ? { width: '100%' } : {}} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
