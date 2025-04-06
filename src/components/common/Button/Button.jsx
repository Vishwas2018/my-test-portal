import './Button.css';

import { Link } from 'react-router-dom';
// src/components/common/Button/Button.jsx
import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => {
  // Button classes based on props
  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;

  // Internal link (React Router)
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...rest}>
        {children}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Standard button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;