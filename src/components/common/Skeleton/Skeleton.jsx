import styled, { keyframes } from 'styled-components';

import PropTypes from 'prop-types';
import React from 'react';

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Base skeleton container
const SkeletonBase = styled.div`
  background: ${({ dark }) => 
    dark ? 'var(--gray-700)' : 'var(--gray-100)'};
  background-image: ${({ dark }) => 
    dark 
      ? 'linear-gradient(to right, var(--gray-700) 0%, var(--gray-600) 20%, var(--gray-700) 40%)'
      : 'linear-gradient(to right, var(--gray-100) 0%, var(--gray-200) 20%, var(--gray-100) 40%)'
  };
  background-size: 800px 100%;
  border-radius: ${props => props.borderRadius || 'var(--radius-md)'};
  display: inline-block;
  line-height: 1;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  animation: ${shimmer} 1.5s infinite linear;
  margin-bottom: ${props => props.marginBottom || '0'};
`;

// Text skeleton with multiple lines
const TextBlock = styled.div`
  width: 100%;
  margin-bottom: ${props => props.spacing || '1rem'};
  
  & > ${SkeletonBase}:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

// Round skeleton for avatars and icons
const RoundSkeleton = styled(SkeletonBase)`
  border-radius: 50%;
`;

// Image/card placeholder
const RectSkeleton = styled(SkeletonBase)`
  border-radius: ${props => props.borderRadius || 'var(--radius-md)'};
`;

// Skeleton component with various types
const Skeleton = ({ type = 'text', lines = 1, width, height, spacing, dark = false, ...props }) => {
  // For text skeletons with multiple lines
  if (type === 'text' && lines > 1) {
    return (
      <TextBlock spacing={spacing}>
        {[...Array(lines)].map((_, i) => (
          <SkeletonBase 
            key={i} 
            width={i === lines - 1 && lines > 1 ? '80%' : '100%'} 
            height={height || '16px'}
            dark={dark}
            {...props}
          />
        ))}
      </TextBlock>
    );
  }

  // For avatar/round
  if (type === 'avatar' || type === 'round') {
    return (
      <RoundSkeleton 
        width={width || '48px'} 
        height={height || width || '48px'}
        dark={dark}
        {...props}
      />
    );
  }

  // For image/card
  if (type === 'image' || type === 'card') {
    return (
      <RectSkeleton 
        width={width || '100%'} 
        height={height || '200px'}
        dark={dark}
        {...props}
      />
    );
  }

  // Default single line text
  return (
    <SkeletonBase 
      width={width} 
      height={height || '16px'} 
      marginBottom={spacing}
      dark={dark}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  /** Type of skeleton: text, avatar/round, image/card */
  type: PropTypes.oneOf(['text', 'avatar', 'round', 'image', 'card']),
  /** Number of lines for text type */
  lines: PropTypes.number,
  /** Width of the skeleton */
  width: PropTypes.string,
  /** Height of the skeleton */
  height: PropTypes.string,
  /** Bottom margin/spacing */
  spacing: PropTypes.string,
  /** Use dark theme colors */
  dark: PropTypes.bool,
  /** Border radius */
  borderRadius: PropTypes.string
};

export default Skeleton;