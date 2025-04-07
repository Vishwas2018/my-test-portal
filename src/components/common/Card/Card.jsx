import './Card.css';

// src/components/common/Card/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title, 
  footer, 
  className = '', 
  ...rest 
}) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;