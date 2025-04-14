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

// Shake animation for error state
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

// TextArea container
const TextAreaContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.marginBottom || '1.5rem'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.error && css`
    animation: ${shakeAnimation} 0.5s ease-in-out;
  `}
`;

// Label styles
const TextAreaLabel = styled.label`
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

// Styled TextArea
const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: var(--text-body);
  font-family: var(--font-primary);
  background-color: ${props => props.dark ? 'var(--gray-800)' : 'var(--white)'};
  border: 2px solid ${props => 
    props.error ? 'var(--error)' : 
    props.success ? 'var(--success)' : 
    props.dark ? 'var(--gray-700)' : 'var(--gray-200)'
  };
  border-radius: ${props => props.rounded ? 'var(--radius-lg)' : 'var(--radius-md)'};
  color: ${props => props.dark ? 'var(--gray-100)' : 'var(--gray-900)'};
  min-height: ${props => props.minHeight || '120px'};
  resize: ${props => props.resize || 'vertical'};
  transition: all 0.2s ease;
  box-shadow: ${props => 
    props.error ? '0 0 0 0 rgba(229, 62, 62, 0.1)' : 
    props.success ? '0 0 0 0 rgba(72, 187, 120, 0.1)' : 
    'none'
  };
  
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

// Character count
const CharacterCount = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: var(--text-xs);
  color: ${props => 
    props.isNearLimit ? 'var(--warning)' : 
    props.dark ? 'var(--gray-400)' : 'var(--gray-500)'
  };
  background-color: ${props => 
    props.dark ? 'rgba(36, 40, 46, 0.7)' : 'rgba(255, 255, 255, 0.8)'
  };
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
  transition: color 0.2s ease;
  
  ${props => props.isOverLimit && css`
    color: var(--error);
    font-weight: 600;
  `}
`;

// Validation icon
const ValidationIcon = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: ${props => props.error ? 'var(--error)' : 'var(--success)'};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.25rem;
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
 * TextArea component with validation states and character counting
 */
const TextArea = ({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error = false,
  success = false,
  helperText,
  minHeight,
  maxLength,
  rows,
  resize = 'vertical',
  rounded = false,
  dark = false,
  fullWidth = true,
  marginBottom,
  showCharacterCount = false,
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
  const [charCount, setCharCount] = useState(value ? value.length : 0);
  
  // Update state when props change
  useEffect(() => {
    setLocalError(error);
    setLocalSuccess(success);
    setLocalHelperText(helperText);
    setCharCount(value ? value.length : 0);
  }, [error, success, helperText, value]);
  
  // Handle change with character count
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    
    // Call parent onChange
    if (onChange) {
      onChange(e);
    }
  };
  
  // Handle on blur validation
  const handleBlur = (e) => {
    setIsTouched(true);
    
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
  
  // Generate unique ID if none provided
  const textareaId = id || `textarea-${name || Math.random().toString(36).substr(2, 9)}`;
  
  // Calculate if near or over character limit
  const isNearLimit = maxLength && charCount >= maxLength * 0.8;
  const isOverLimit = maxLength && charCount > maxLength;
  
  return (
    <TextAreaContainer 
      marginBottom={marginBottom} 
      fullWidth={fullWidth} 
      error={localError}
      className={className}
    >
      {label && (
        <TextAreaLabel 
          htmlFor={textareaId}
          error={localError}
          success={localSuccess}
          dark={dark}
          required={required}
        >
          {label}
        </TextAreaLabel>
      )}
      
      <div style={{ position: 'relative' }}>
        <StyledTextArea
          id={textareaId}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={(e) => onFocus && onFocus(e)}
          disabled={disabled}
          required={required}
          rows={rows}
          error={localError}
          success={localSuccess}
          minHeight={minHeight}
          resize={resize}
          rounded={rounded}
          dark={dark}
          aria-invalid={localError ? 'true' : 'false'}
          aria-describedby={localHelperText ? `${textareaId}-helper-text` : undefined}
          maxLength={maxLength && isOverLimit ? maxLength : undefined}
          {...rest}
        />
        
        {showCharacterCount && maxLength && (
          <CharacterCount 
            dark={dark} 
            isNearLimit={isNearLimit} 
            isOverLimit={isOverLimit}
          >
            {charCount}/{maxLength}
          </CharacterCount>
        )}
        
        {showValidationIcon && isTouched && (localError || localSuccess) && (
          <ValidationIcon
            error={localError}
            success={localSuccess}
          >
            {localError ? <AlertIcon /> : <CheckIcon />}
          </ValidationIcon>
        )}
      </div>
      
      {localHelperText && (
        <HelperText
          id={`${textareaId}-helper-text`}
          error={localError}
          success={localSuccess}
          dark={dark}
          animate={isTouched}
        >
          {localHelperText}
        </HelperText>
      )}
    </TextAreaContainer>
  );
};

TextArea.propTypes = {
  /** TextArea ID */
  id: PropTypes.string,
  /** TextArea name */
  name: PropTypes.string,
  /** TextArea label */
  label: PropTypes.string,
  /** TextArea value */
  value: PropTypes.string,
  /** TextArea placeholder */
  placeholder: PropTypes.string,
  /** Change handler */
  onChange: PropTypes.func.isRequired,
  /** Blur handler */
  onBlur: PropTypes.func,
  /** Focus handler */
  onFocus: PropTypes.func,
  /** Is TextArea disabled */
  disabled: PropTypes.bool,
  /** Is TextArea required */
  required: PropTypes.bool,
  /** Error state */
  error: PropTypes.bool,
  /** Success state */
  success: PropTypes.bool,
  /** Helper text to display below TextArea */
  helperText: PropTypes.string,
  /** Minimum height of TextArea */
  minHeight: PropTypes.string,
  /** Maximum character length */
  maxLength: PropTypes.number,
  /** Number of rows */
  rows: PropTypes.number,
  /** TextArea resize behavior */
  resize: PropTypes.oneOf(['none', 'both', 'horizontal', 'vertical']),
  /** Use rounded corners */
  rounded: PropTypes.bool,
  /** Use dark theme */
  dark: PropTypes.bool,
  /** Use full width */
  fullWidth: PropTypes.bool,
  /** Bottom margin */
  marginBottom: PropTypes.string,
  /** Show character count */
  showCharacterCount: PropTypes.bool,
  /** Show validation icon */
  showValidationIcon: PropTypes.bool,
  /** Validate on blur */
  validateOnBlur: PropTypes.bool,
  /** Validation function returning { error, success, message } */
  validate: PropTypes.func,
  /** Additional class name */
  className: PropTypes.string,
};

export default TextArea;