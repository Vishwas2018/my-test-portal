import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import PropTypes from 'prop-types';

// Success icon for validation
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Error icon for validation
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Chevron icon for select
const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Shake animation for error state
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

// Select container
const SelectContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.marginBottom || '1.5rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.error && css`
    animation: ${shakeAnimation} 0.5s ease-in-out;
  `}
`;

// Label styles
const SelectLabel = styled.label`
  display: block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-200)' : 'var(--gray-700)'
  };
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;

  ${props => props.required && css`
    &::after {
      content: '*';
      color: ${props.dark ? 'var(--coral-400)' : 'var(--error)'};
      margin-left: 0.25rem;
    }
  `}
`;

// Select wrapper to handle custom styling
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// Styled select
const StyledSelect = styled.select`
  width: 100%;
  padding: ${props => props.size === 'large' 
    ? '0.75rem 1rem' 
    : props.size === 'small' 
      ? '0.375rem 0.75rem' 
      : '0.625rem 0.875rem'
  };
  padding-right: 2.5rem; /* Space for the dropdown icon */
  font-size: ${props => props.size === 'large' 
    ? 'var(--text-md)' 
    : props.size === 'small' 
      ? 'var(--text-sm)' 
      : 'var(--text-body)'
  };
  font-family: var(--font-primary);
  background-color: ${props => props.dark ? 'var(--gray-800)' : 'var(--white)'};
  border: 2px solid ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-700)' : 'var(--gray-200)'
  };
  border-radius: ${props => props.rounded ? 'var(--radius-full)' : 'var(--radius-md)'};
  color: ${props => props.dark ? 'var(--gray-100)' : 'var(--gray-900)'};
  transition: all 0.2s ease;
  box-shadow: ${props => 
    props.error ? '0 0 0 0 rgba(229, 62, 62, 0.1)' : 
    props.success ? '0 0 0 0 rgba(72, 187, 120, 0.1)' : 
    'none'
  };
  appearance: none; /* Remove default styling */
  
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
  
  /* Custom placeholder coloring */
  &.placeholder {
    color: ${props => props.dark ? 'var(--gray-500)' : 'var(--gray-400)'};
  }
`;

// Custom dropdown icon
const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-400)' : 'var(--gray-500)'
  };
  transition: transform 0.2s ease;
  
  /* Rotate icon when select is open */
  ${props => props.isOpen && css`
    transform: translateY(-50%) rotate(180deg);
  `}
`;

// Input icon
const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-400)' : 'var(--gray-500)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

// Validation icon
const ValidationIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 2.5rem; /* Space for dropdown icon */
  transform: translateY(-50%);
  color: ${props => props.error ? 'var(--error)' : 'var(--success)'};
  display: flex;
  align-items: center;
  justify-content: center;
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
 * Modern Select component with validation states and visual feedback
 */
const Select = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error = false,
  success = false,
  helperText,
  icon,
  options = [],
  placeholder,
  size = 'medium',
  rounded = false,
  dark = false,
  fullWidth = true,
  marginBottom,
  showValidationIcon = true,
  validateOnBlur = false,
  validate,
  className,
  ...rest
}) => {
  const [localError, setLocalError] = useState(error);
  const [localSuccess, setLocalSuccess] = useState(success);
  const [localHelperText, setLocalHelperText] = useState(helperText);
  const [isTouched, setIsTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update state when props change
  useEffect(() => {
    setLocalError(error);
    setLocalSuccess(success);
    setLocalHelperText(helperText);
  }, [error, success, helperText]);
  
  // Handle on blur validation
  const handleBlur = (e) => {
    setIsTouched(true);
    setIsOpen(false);
    
    if (validateOnBlur && validate) {
      const result = validate(e.target.value);
      setLocalError(result.error);
      setLocalSuccess(result.success);
      setLocalHelperText(result.message || helperText);
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Handle focus
  const handleFocus = (e) => {
    setIsOpen(true);
    if (onFocus) {
      onFocus(e);
    }
  };
  
  // Generate unique ID if none provided
  const selectId = id || `select-${name || Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <SelectContainer 
      marginBottom={marginBottom} 
      fullWidth={fullWidth} 
      error={localError}
      className={className}
    >
      {label && (
        <SelectLabel 
          htmlFor={selectId}
          error={localError}
          success={localSuccess}
          dark={dark}
          required={required}
        >
          {label}
        </SelectLabel>
      )}
      
      <SelectWrapper>
        {icon && (
          <InputIcon
            error={localError}
            success={localSuccess}
            dark={dark}
          >
            {icon}
          </InputIcon>
        )}
        
        <StyledSelect
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          required={required}
          error={localError}
          success={localSuccess}
          icon={!!icon}
          size={size}
          rounded={rounded}
          dark={dark}
          aria-invalid={localError ? 'true' : 'false'}
          aria-describedby={localHelperText ? `${selectId}-helper-text` : undefined}
          className={!value && placeholder ? 'placeholder' : ''}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
        
        {/* Custom dropdown icon */}
        <SelectIcon 
          error={localError}
          success={localSuccess}
          dark={dark}
          isOpen={isOpen}
        >
          <ChevronIcon />
        </SelectIcon>
        
        {showValidationIcon && isTouched && (localError || localSuccess) && (
          <ValidationIcon
            error={localError}
            success={localSuccess}
          >
            {localError ? <AlertIcon /> : <CheckIcon />}
          </ValidationIcon>
        )}
      </SelectWrapper>
      
      {localHelperText && (
        <HelperText
          id={`${selectId}-helper-text`}
          error={localError}
          success={localSuccess}
          dark={dark}
          animate={isTouched}
        >
          {localHelperText}
        </HelperText>
      )}
    </SelectContainer>
  );
};

Select.propTypes = {
  /** Select ID */
  id: PropTypes.string,
  /** Select name */
  name: PropTypes.string,
  /** Select label */
  label: PropTypes.string,
  /** Select value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Blur handler */
  onBlur: PropTypes.func,
  /** Focus handler */
  onFocus: PropTypes.func,
  /** Is select disabled */
  disabled: PropTypes.bool,
  /** Is select required */
  required: PropTypes.bool,
  /** Error state */
  error: PropTypes.bool,
  /** Success state */
  success: PropTypes.bool,
  /** Helper text to display below select */
  helperText: PropTypes.string,
  /** Icon to display inside select */
  icon: PropTypes.node,
  /** Options array of { value, label } objects */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Select size (small, medium, large) */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Use rounded corners */
  rounded: PropTypes.bool,
  /** Use dark theme */
  dark: PropTypes.bool,
  /** Use full width */
  fullWidth: PropTypes.bool,
  /** Bottom margin */
  marginBottom: PropTypes.string,
  /** Show validation icon */
  showValidationIcon: PropTypes.bool,
  /** Validate on blur */
  validateOnBlur: PropTypes.bool,
  /** Validation function returning { error, success, message } */
  validate: PropTypes.func,
  /** Additional class name */
  className: PropTypes.string,
};

export default Select;