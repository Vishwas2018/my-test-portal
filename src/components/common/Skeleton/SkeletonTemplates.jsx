import React from 'react';
import Skeleton from './Skeleton';
import styled from 'styled-components';

// Styled container for consistent spacing
const SkeletonContainer = styled.div`
  width: 100%;
  padding: ${props => props.padding || '0'};
  background: ${props => props.background || 'transparent'};
  border-radius: ${props => props.borderRadius || '0'};
  box-shadow: ${props => props.boxShadow || 'none'};
`;

// Card skeleton with image, title, and description
export const CardSkeleton = ({ dark, imageHeight = '200px', lines = 3, ...props }) => (
  <SkeletonContainer 
    padding="0" 
    background={dark ? 'var(--gray-800)' : 'var(--white)'} 
    borderRadius="var(--radius-lg)" 
    boxShadow="var(--shadow-md)"
    {...props}
  >
    <Skeleton 
      type="image" 
      height={imageHeight} 
      borderRadius="var(--radius-lg) var(--radius-lg) 0 0" 
      dark={dark} 
    />
    <div style={{ padding: '1.5rem' }}>
      <Skeleton 
        width="70%" 
        height="24px" 
        spacing="1rem" 
        dark={dark} 
      />
      <Skeleton 
        type="text" 
        lines={lines} 
        dark={dark} 
      />
      <Skeleton 
        width="120px" 
        height="36px" 
        borderRadius="var(--radius-full)" 
        spacing="0" 
        style={{ marginTop: '1.5rem' }} 
        dark={dark} 
      />
    </div>
  </SkeletonContainer>
);

// Profile skeleton with avatar, name, title, and description
export const ProfileSkeleton = ({ dark, ...props }) => (
  <SkeletonContainer 
    padding="1.5rem" 
    background={dark ? 'var(--gray-800)' : 'var(--white)'} 
    borderRadius="var(--radius-lg)" 
    boxShadow="var(--shadow-md)"
    {...props}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
      <Skeleton 
        type="avatar" 
        width="64px" 
        height="64px" 
        dark={dark} 
      />
      <div style={{ marginLeft: '1rem', flex: 1 }}>
        <Skeleton 
          width="60%" 
          height="20px" 
          spacing="0.5rem" 
          dark={dark} 
        />
        <Skeleton 
          width="40%" 
          height="16px" 
          dark={dark} 
        />
      </div>
    </div>
    <Skeleton 
      type="text" 
      lines={3} 
      dark={dark} 
    />
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginTop: '1.5rem' 
    }}>
      <Skeleton 
        width="30%" 
        height="36px" 
        borderRadius="var(--radius-full)" 
        dark={dark} 
      />
      <Skeleton 
        width="30%" 
        height="36px" 
        borderRadius="var(--radius-full)" 
        dark={dark} 
      />
    </div>
  </SkeletonContainer>
);

// Table skeleton with header and rows
export const TableSkeleton = ({ 
  dark, 
  rows = 5, 
  columns = 4, 
  headerHeight = '48px',
  rowHeight = '40px',
  ...props 
}) => (
  <SkeletonContainer {...props}>
    {/* Table header */}
    <div style={{ 
      display: 'flex', 
      borderBottom: dark ? '1px solid var(--gray-700)' : '1px solid var(--gray-200)',
      padding: '0.75rem 1rem',
      background: dark ? 'var(--gray-800)' : 'var(--gray-50)',
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
    }}>
      {Array(columns).fill(0).map((_, i) => (
        <div key={`header-${i}`} style={{ flex: i === 0 ? 0.5 : 1, padding: '0 0.5rem' }}>
          <Skeleton 
            height={headerHeight} 
            width={i === 0 ? '50%' : '80%'} 
            dark={dark} 
          />
        </div>
      ))}
    </div>
    
    {/* Table rows */}
    {Array(rows).fill(0).map((_, rowIndex) => (
      <div 
        key={`row-${rowIndex}`} 
        style={{ 
          display: 'flex', 
          borderBottom: dark ? '1px solid var(--gray-700)' : '1px solid var(--gray-100)',
          padding: '0.75rem 1rem',
          background: dark 
            ? rowIndex % 2 === 0 ? 'var(--gray-800)' : 'var(--gray-750)' 
            : rowIndex % 2 === 0 ? 'var(--white)' : 'var(--gray-50)',
          borderRadius: rowIndex === rows - 1 
            ? '0 0 var(--radius-lg) var(--radius-lg)' 
            : '0'
        }}
      >
        {Array(columns).fill(0).map((_, colIndex) => (
          <div 
            key={`cell-${rowIndex}-${colIndex}`} 
            style={{ flex: colIndex === 0 ? 0.5 : 1, padding: '0 0.5rem' }}
          >
            <Skeleton 
              height={rowHeight} 
              width={colIndex === 0 ? '50%' : colIndex === columns - 1 ? '40%' : '70%'} 
              dark={dark} 
            />
          </div>
        ))}
      </div>
    ))}
  </SkeletonContainer>
);