import React, { useEffect } from 'react';

import styled from 'styled-components';

const ToggleContainer = styled.button`
  background: ${({ theme }) => theme === 'light' ? 'var(--gradient-primary)' : 'var(--off-white)'};
  border: 2px solid var(--primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  font-size: 0.5rem;
  justify-content: space-between;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.5rem;
  position: relative;
  width: 4rem;
  height: 2rem;
  transition: var(--transition-normal);

  &:focus {
    outline: none;
    box-shadow: var(--shadow-sm);
  }
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: var(--transition-normal);
  
  svg {
    width: 1rem;
    height: 1rem;
    transition: all 0.3s linear;
    
    &:first-child {
      transform: ${({ theme }) => theme === 'light' ? 'translateY(0)' : 'translateY(100px)'};
      color: var(--highlight);
    }
    
    &:nth-child(2) {
      transform: ${({ theme }) => theme === 'light' ? 'translateY(-100px)' : 'translateY(0)'};
      color: var(--gray-100);
    }
  }
`;

const ToggleThumb = styled.span`
  position: absolute;
  top: 0.15rem;
  left: ${({ theme }) => theme === 'light' ? '0.15rem' : 'calc(100% - 1.85rem)'};
  width: 1.7rem;
  height: 1.7rem;
  border-radius: var(--radius-full);
  background-color: var(--white);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: var(--transition-bounce);
  z-index: 1;
`;

// Sun icon component
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

// Moon icon component
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

/**
 * A toggle component that switches between light and dark mode
 * 
 * @param {boolean} darkMode - Current dark mode state
 * @param {function} onChange - Callback when toggle is clicked
 */
const DarkModeToggle = ({ darkMode, onChange }) => {
  const theme = darkMode ? 'dark' : 'light';
  
  // Apply theme class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ToggleContainer 
      onClick={onChange}
      theme={theme}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <Icons theme={theme}>
        <SunIcon />
        <MoonIcon />
      </Icons>
      <ToggleThumb theme={theme} />
    </ToggleContainer>
  );
};

export default DarkModeToggle;