import React from 'react';
import styled from 'styled-components';

// Styled glass container with frosted effect
const GlassWrapper = styled.div`
  background: ${props => props.dark ? 'rgba(36, 40, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${props => props.borderRadius || 'var(--radius-lg)'};
  border: 1px solid ${props => props.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)'};
  padding: ${props => props.padding || '2rem'};
  box-shadow: ${props => props.dark ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
  width: ${props => props.width || '100%'};
  max-width: ${props => props.maxWidth || 'none'};
  height: ${props => props.height || 'auto'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.1);
    z-index: -1;
  }
`;

/**
 * GlassContainer component - creates a modern frosted glass effect container
 */
const GlassContainer = ({ 
  children, 
  dark = false,
  padding,
  borderRadius,
  width,
  maxWidth,
  height,
  className,
  ...rest 
}) => {
  return (
    <GlassWrapper
      dark={dark}
      padding={padding}
      borderRadius={borderRadius}
      width={width}
      maxWidth={maxWidth}
      height={height}
      className={className}
      {...rest}
    >
      {children}
    </GlassWrapper>
  );
};

export default GlassContainer;