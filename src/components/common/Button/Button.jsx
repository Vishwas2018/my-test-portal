import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

// Base button styles
const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-bounce);
  text-decoration: none;
  border: none;
  outline: none;
  font-family: 'Nunito', sans-serif;
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-fun);
  text-transform: uppercase;
  
  /* Size variants */
  ${props => props.size === 'small' && `
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  `}
  
  ${props => props.size === 'medium' && `
    padding: 0.9rem 2rem;
    font-size: 1.1rem;
  `}
  
  ${props => props.size === 'large' && `
    padding: 1.2rem 2.5rem;
    font-size: 1.25rem;
  `}
  
  /* Button variants */
  ${props => props.variant === 'primary' && `
    background: var(--primary);
    color: white;
    box-shadow: 0 8px 0 var(--primary-dark);
    transform: translateY(-4px);
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 0 var(--primary-dark);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 0 var(--primary-dark);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: translateY(0);
      box-shadow: 0 4px 0 var(--primary-dark);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
      z-index: -1;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: var(--white);
    color: var(--primary);
    border: 3px solid var(--primary);
    box-shadow: 0 6px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);
      background: var(--light-gray);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
    }
  `}
  
  ${props => props.variant === 'cta' && `
    background: var(--secondary);
    color: white;
    box-shadow: 0 8px 0 var(--secondary-dark);
    transform: translateY(-4px);
    position: relative;
    z-index: 1;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 0 var(--secondary-dark);
      animation: wobble 0.8s ease;
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 0 var(--secondary-dark);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
      z-index: -1;
    }
  `}
  
  ${props => props.variant === 'text' && `
    background: transparent;
    color: var(--primary);
    padding: 0.5rem 1rem;
    position: relative;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: transparent;
    text-underline-offset: 4px;
    box-shadow: none;
    
    &:hover {
      text-decoration-color: var(--primary);
      transform: scale(1.05);
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Icon styling */
  ${props => props.hasIcon && `
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    
    svg {
      width: 1.5em;
      height: 1.5em;
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: rotate(10deg) scale(1.1);
    }
  `}
`;

// Link version of the button
const LinkButton = styled(Link)`
  ${ButtonBase}
`;

// Anchor version of the button
const AnchorButton = styled.a`
  ${ButtonBase}
`;

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
  // Check if button has icon children
  const hasIcon = React.Children.toArray(children).some(
    child => React.isValidElement(child) && (child.type === 'svg' || child.type === 'i')
  );

  // Common props for all button types
  const buttonProps = {
    variant,
    size,
    disabled,
    className,
    hasIcon,
    ...rest
  };

  // Internal link (React Router)
  if (to) {
    return (
      <LinkButton to={to} {...buttonProps}>
        {children}
      </LinkButton>
    );
  }

  // External link
  if (href) {
    return (
      <AnchorButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...buttonProps}
      >
        {children}
      </AnchorButton>
    );
  }

  // Standard button
  return (
    <ButtonBase
      as="button"
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </ButtonBase>
  );
};

export default Button;