import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import PropTypes from 'prop-types';

// Error animation
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

// Container for the input component
const InputContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.marginBottom || '1rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.error && css`
    animation: ${shakeAnimation} 0.5s ease-in-out;
  `}
`;

// Label styles
const InputLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-200)' : 'var(--dark)'
  };
  transition: color 0.2s ease;

  ${props => props.required && css`
    &::after {
      content: '*';
      color: ${props.dark ? 'var(--coral-400)' : 'var(--error)'};
      margin-left: 0.25rem;
    }
  `}
`;

// Input field styles
const StyledInput = styled.input`
  width: 100%;
  padding: ${props => {
    switch(props.size) {
      case 'large': return '0.75rem 1rem';
      case 'small': return '0.375rem 0.75rem';
      default: return '0.625rem 0.875rem';
    }
  }};
  font-size: ${props => {
    switch(props.size) {
      case 'large': return 'var(--text-md)';
      case 'small': return 'var(--text-sm)';
      default: return 'var(--text-base)';
    }
  }};
  font-family: var(--font-primary);
  background-color: ${props => props.dark ? 'var(--gray-800)' : 'var(--white)'};
  border: 2px solid ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-700)' : 'var(--gray-200)'
  };
  border-radius: ${props => props.rounded ? 'var(--radius-full)' : 'var(--radius-md)'};
  color: ${props => props.dark ? 'var(--gray-100)' : 'var(--dark)'};
  transition: all 0.2s ease;
  box-shadow: ${props => 
    props.error ? '0 0 0 0 rgba(229, 62, 62, 0.1)' : 
    props.success ? '0 0 0 0 rgba(72, 187, 120, 0.1)' : 
    'none'
  };
  
  ${props => props.icon && css`
    padding-left: 2.5rem;
  `}
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.error ? 'var(--error)' : 
      props.success ? 'var(--success)' : 
      'var(--primary)'
    };
    box-shadow: ${props => 
      props.error ? '0 0 0 3px rgba(229, 62, 62, 0.2)' : 
      props.success ? '0 0 0 3px rgba(72, 187, 120, 0.2)' : 
      '0 0 0 3px rgba(110, 207, 255, 0.2)'
    };
  }
  
  &:hover:not(:focus):not(:disabled) {
    border-color: ${props => 
      props.error ? 'var(--error)' : 
      props.success ? 'var(--success)' : 
      props.dark ? 'var(--gray-600)' : 'var(--gray-300)'
    };
  }
  
  &:disabled {
    background-color: ${props => props.dark ? 'var(--gray-750)' : 'var(--gray-100)'};
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &::placeholder {
    color: ${props => props.dark ? 'var(--gray-500)' : 'var(--gray-400)'};
    opacity: 0.8;
  }
`;

// Input icon
const InputIcon = styled.div`
  position: absolute;
  top: ${props => props.labelText ? '2.125rem' : '0.625rem'};
  left: 0.75rem;
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-400)' : 'var(--gray-500)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.size === 'large' ? '1.5rem' : props.size === 'small' ? '1rem' : '1.25rem'};
  pointer-events: none;
`;

// Helper text
const HelperText = styled.div`
  font-size: var(--text-sm);
  margin-top: 0.375rem;
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-400)' : 'var(--gray-500)'
  };
  
  ${props => props.animate && props.error && css`
    animation: ${shakeAnimation} 0.5s ease-in-out;
  `}
`;

/**
 * Input component with validation states
 * 
 * A flexible input component that supports different states, sizes,
 * and can display icons and helper text.
 */
const Input = ({
  id,
  name,
  type = 'text',
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error = false,
  errorMessage = '',
  success = false,
  helperText,
  icon,
  size = 'medium',
  rounded = false,
  dark = false,
  fullWidth = true,
  marginBottom,
  className,
  ...rest
}) => {
  const [isTouched, setIsTouched] = useState(false);
  
  // Handle blur event
  const handleBlur = (e) => {
    setIsTouched(true);
    if (onBlur) onBlur(e);
  };
  
  // Generate unique ID if none provided
  const inputId = id || `input-${name || Math.random().toString(36).substring(2, 9)}`;
  
  // Determine helper text to display
  const displayHelperText = error && errorMessage ? errorMessage : helperText;
  
  return (
    <InputContainer 
      marginBottom={marginBottom} 
      fullWidth={fullWidth} 
      error={error}
      className={className}
    >
      {label && (
        <InputLabel 
          htmlFor={inputId}
          error={error}
          success={success}
          dark={dark}
          required={required}
        >
          {label}
        </InputLabel>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <InputIcon 
            labelText={!!label}
            error={error}
            success={success}
            dark={dark}
            size={size}
          >
            {icon}
          </InputIcon>
        )}
        
        <StyledInput
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          error={error}
          success={success}
          icon={!!icon}
          size={size}
          rounded={rounded}
          dark={dark}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={displayHelperText ? `${inputId}-helper-text` : undefined}
          {...rest}
        />
      </div>
      
      {displayHelperText && (
        <HelperText
          id={`${inputId}-helper-text`}
          error={error}
          success={success}
          dark={dark}
          animate={isTouched}
        >
          {displayHelperText}
        </HelperText>
      )}
    </InputContainer>
  );
};

Input.propTypes = {
  /** Input ID */
  id: PropTypes.string,
  /** Input name */
  name: PropTypes.string,
  /** Input type (text, password, email, etc.) */
  type: PropTypes.string,
  /** Input label */
  label: PropTypes.string,
  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Input placeholder */
  placeholder: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Blur handler */
  onBlur: PropTypes.func,
  /** Focus handler */
  onFocus: PropTypes.func,
  /** Is input disabled */
  disabled: PropTypes.bool,
  /** Is input required */
  required: PropTypes.bool,
  /** Error state */
  error: PropTypes.bool,
  /** Error message */
  errorMessage: PropTypes.string,
  /** Success state */
  success: PropTypes.bool,
  /** Helper text to display below input */
  helperText: PropTypes.string,
  /** Icon to display inside input */
  icon: PropTypes.node,
  /** Input size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Use rounded corners */
  rounded: PropTypes.bool,
  /** Use dark theme */
  dark: PropTypes.bool,
  /** Use full width */
  fullWidth: PropTypes.bool,
  /** Bottom margin */
  marginBottom: PropTypes.string,
  /** Additional class name */
  className: PropTypes.string,
};

export default Input;