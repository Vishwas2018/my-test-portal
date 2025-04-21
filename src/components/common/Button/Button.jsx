import styled, { css } from 'styled-components';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Shared button styles using styled-components
 */
const baseButtonStyles = css`
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
  font-family: var(--font-primary);
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  
  /* Size variants */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
        `;
      case 'large':
        return css`
          padding: 1.2rem 2.5rem;
          font-size: 1.25rem;
        `;
      case 'medium':
      default:
        return css`
          padding: 0.9rem 2rem;
          font-size: 1.1rem;
        `;
    }
  }}
  
  /* Button variants */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return css`
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
        `;
      case 'secondary':
        return css`
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
        `;
      case 'cta':
        return css`
          background: var(--secondary);
          color: white;
          box-shadow: 0 8px 0 var(--secondary-dark);
          transform: translateY(-4px);
          
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
        `;
      case 'text':
        return css`
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
        `;
      default:
        return css`
          background: var(--primary);
          color: white;
        `;
    }
  }}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Icon styling */
  ${({ $hasIcon }) => $hasIcon && css`
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

// Regular button component
const StyledButton = styled.button`
  ${baseButtonStyles}
`;

// Link button component (for React Router)
const StyledLinkButton = styled(Link)`
  ${baseButtonStyles}
`;

// Anchor button component (for external links)
const StyledAnchorButton = styled.a`
  ${baseButtonStyles}
`;

/**
 * Button Component
 * 
 * A universal button component that can be rendered as a regular button,
 * a React Router link, or an external link.
 */
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
    child => React.isValidElement(child) && 
    (child.type === 'svg' || child.type === 'i' || 
     (typeof child.type === 'function' && child.type.name && 
      (child.type.name.includes('Icon') || child.type.name.includes('SVG'))))
  );

  // Common props for all button types
  const buttonProps = {
    variant,
    size,
    disabled,
    className,
    $hasIcon: hasIcon,
    ...rest
  };

  // Internal link (React Router)
  if (to) {
    return (
      <StyledLinkButton to={to} {...buttonProps}>
        {children}
      </StyledLinkButton>
    );
  }

  // External link
  if (href) {
    return (
      <StyledAnchorButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...buttonProps}
      >
        {children}
      </StyledAnchorButton>
    );
  }

  // Standard button
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Button style variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'cta', 'text']),
  /** Button size */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** React Router link destination */
  to: PropTypes.string,
  /** External link destination */
  href: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
};

export default Button;