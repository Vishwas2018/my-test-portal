// src/components/ExamInterface/AccessibilityControls/AccessibilityControls.jsx
import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

// Styled components for the container and main button
const AccessibilityContainer = styled.div`
  position: fixed;
  top: ${props => props.$isOpen ? '1rem' : '-100px'};
  right: 1rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: ${props => props.$isOpen ? '1rem' : '0'};
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
  max-width: ${props => props.$isOpen ? '300px' : '0'};
  width: 100%;
`;

const AccessibilityButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-md);
  z-index: 1001;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background-color: var(--primary-dark);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.4), var(--shadow-md);
  }
`;

// Header components
const ControlsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: 0.75rem;
`;

const ControlsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: var(--dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--dark-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--dark);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

// Section components
const ControlsSection = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  color: var(--dark-gray);
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Toggle switch components
const ToggleControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleLabel = styled.label`
  font-size: 0.9rem;
  color: var(--dark);
  cursor: pointer;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--primary);
  }
  
  &:checked + span:before {
    transform: translateX(18px);
  }
  
  &:focus + span {
    box-shadow: 0 0 1px var(--primary);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--light-gray);
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

// Slider control components
const SliderControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--dark);
`;

const SliderValue = styled.span`
  font-weight: 600;
  color: var(--primary);
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--light-gray);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
`;

// Radio button components
const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RadioButton = styled.button`
  background-color: ${props => props.$active ? 'var(--primary)' : 'var(--light-gray)'};
  color: ${props => props.$active ? 'white' : 'var(--dark)'};
  border: none;
  border-radius: var(--radius-md);
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-dark)' : 'var(--dark-gray)'};
    color: white;
  }
`;

/**
 * AccessibilityControls component provides accessibility options for students
 * Features include font size adjustment, high contrast mode, and reading aids
 * 
 * @param {Object} settings - Current accessibility settings
 * @param {Function} onChange - Callback when settings change
 */
const AccessibilityControls = ({ settings, onChange }) => {
  // State for panel open/close
  const [isOpen, setIsOpen] = useState(false);
  
  // Default accessibility settings
  const defaultSettings = {
    fontSize: 1, // 0.8, 1, 1.2, 1.5
    highContrast: false,
    reduceMotion: false,
    dyslexicFont: false,
    lineHeight: 1.5, // 1.2, 1.5, 2
    textSpacing: 0, // 0, 1, 2 (word spacing in px)
    colorMode: 'default' // 'default', 'protanopia', 'deuteranopia', 'tritanopia'
  };
  
  // State for current settings
  const [accessibilitySettings, setAccessibilitySettings] = useState(defaultSettings);
  
  // Initialize with provided settings or defaults
  useEffect(() => {
    if (settings) {
      setAccessibilitySettings(prev => ({
        ...prev,
        ...settings
      }));
    }
  }, [settings]);
  
  // Apply accessibility settings to document
  useEffect(() => {
    const html = document.querySelector('html');
    const body = document.querySelector('body');
    
    if (!html || !body) return;
    
    // Apply each setting to the document
    
    // Font size
    body.style.fontSize = `${accessibilitySettings.fontSize}rem`;
    
    // Line height
    body.style.lineHeight = accessibilitySettings.lineHeight;
    
    // Text spacing
    body.style.wordSpacing = `${accessibilitySettings.textSpacing}px`;
    
    // High contrast
    if (accessibilitySettings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (accessibilitySettings.reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
    
    // Dyslexic font
    if (accessibilitySettings.dyslexicFont) {
      body.style.fontFamily = "'OpenDyslexic', sans-serif";
    } else {
      body.style.fontFamily = "";
    }
    
    // Color mode for color blindness
    if (accessibilitySettings.colorMode === 'default') {
      html.removeAttribute('data-color-mode');
    } else {
      html.setAttribute('data-color-mode', accessibilitySettings.colorMode);
    }
    
    // Save settings to localStorage for persistence
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    
    // Notify parent component of changes
    if (onChange) {
      onChange(accessibilitySettings);
    }
  }, [accessibilitySettings, onChange]);
  
  // Handler for updating individual settings
  const updateSetting = useCallback((key, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  // Toggle panel open/close
  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Close panel
  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Reset all settings to defaults
  const resetSettings = useCallback(() => {
    setAccessibilitySettings(defaultSettings);
  }, []);
  
  return (
    <>
      {/* Main accessibility button */}
      <AccessibilityButton 
        onClick={togglePanel}
        aria-label="Accessibility settings"
        title="Accessibility options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      </AccessibilityButton>
      
      {/* Settings panel */}
      <AccessibilityContainer $isOpen={isOpen}>
        <ControlsHeader>
          <ControlsTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
            </svg>
            Accessibility Tools
          </ControlsTitle>
          
          <CloseButton 
            onClick={closePanel}
            aria-label="Close accessibility menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </CloseButton>
        </ControlsHeader>
        
        {/* Text Size Section */}
        <ControlsSection>
          <SectionTitle>Text Size</SectionTitle>
          <SectionContent>
            <SliderControl>
              <SliderLabel>
                <span>Text Size</span>
                <SliderValue>{accessibilitySettings.fontSize}x</SliderValue>
              </SliderLabel>
              <SliderInput 
                type="range" 
                min="0.8" 
                max="1.5" 
                step="0.1" 
                value={accessibilitySettings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseFloat(e.target.value))}
                aria-label="Adjust text size"
              />
            </SliderControl>
          </SectionContent>
        </ControlsSection>
        
        {/* Reading Settings Section */}
        <ControlsSection>
          <SectionTitle>Reading Settings</SectionTitle>
          <SectionContent>
            <ToggleControl>
              <ToggleLabel htmlFor="high-contrast">High Contrast</ToggleLabel>
              <ToggleSwitch>
                <ToggleInput 
                  type="checkbox" 
                  id="high-contrast"
                  checked={accessibilitySettings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleControl>
            
            <ToggleControl>
              <ToggleLabel htmlFor="dyslexic-font">Dyslexic Font</ToggleLabel>
              <ToggleSwitch>
                <ToggleInput 
                  type="checkbox" 
                  id="dyslexic-font"
                  checked={accessibilitySettings.dyslexicFont}
                  onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleControl>
            
            <SliderControl>
              <SliderLabel>
                <span>Line Spacing</span>
                <SliderValue>{accessibilitySettings.lineHeight}x</SliderValue>
              </SliderLabel>
              <SliderInput 
                type="range" 
                min="1.2" 
                max="2" 
                step="0.1" 
                value={accessibilitySettings.lineHeight}
                onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                aria-label="Adjust line spacing"
              />
            </SliderControl>
            
            <SliderControl>
              <SliderLabel>
                <span>Word Spacing</span>
                <SliderValue>{accessibilitySettings.textSpacing}px</SliderValue>
              </SliderLabel>
              <SliderInput 
                type="range" 
                min="0" 
                max="5" 
                step="1" 
                value={accessibilitySettings.textSpacing}
                onChange={(e) => updateSetting('textSpacing', parseInt(e.target.value, 10))}
                aria-label="Adjust word spacing"
              />
            </SliderControl>
          </SectionContent>
        </ControlsSection>
        
        {/* Visual Preferences Section */}
        <ControlsSection>
          <SectionTitle>Visual Preferences</SectionTitle>
          <SectionContent>
            <ToggleControl>
              <ToggleLabel htmlFor="reduce-motion">Reduce Motion</ToggleLabel>
              <ToggleSwitch>
                <ToggleInput 
                  type="checkbox" 
                  id="reduce-motion"
                  checked={accessibilitySettings.reduceMotion}
                  onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleControl>
            
            <SectionTitle>Color Mode</SectionTitle>
            <RadioGroup>
              <RadioButton 
                $active={accessibilitySettings.colorMode === 'default'}
                onClick={() => updateSetting('colorMode', 'default')}
                aria-label="Default color mode"
              >
                Default
              </RadioButton>
              <RadioButton 
                $active={accessibilitySettings.colorMode === 'protanopia'}
                onClick={() => updateSetting('colorMode', 'protanopia')}
                aria-label="Protanopia color mode"
              >
                Protanopia
              </RadioButton>
            </RadioGroup>
            <RadioGroup>
              <RadioButton 
                $active={accessibilitySettings.colorMode === 'deuteranopia'}
                onClick={() => updateSetting('colorMode', 'deuteranopia')}
                aria-label="Deuteranopia color mode"
              >
                Deuteranopia
              </RadioButton>
              <RadioButton 
                $active={accessibilitySettings.colorMode === 'tritanopia'}
                onClick={() => updateSetting('colorMode', 'tritanopia')}
                aria-label="Tritanopia color mode"
              >
                Tritanopia
              </RadioButton>
            </RadioGroup>
          </SectionContent>
        </ControlsSection>
        
        {/* Reset button */}
        <ControlsSection>
          <SectionContent>
            <button 
              onClick={resetSettings}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--light-gray)',
                color: 'var(--dark)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                marginTop: '0.5rem'
              }}
            >
              Reset to Defaults
            </button>
          </SectionContent>
        </ControlsSection>
      </AccessibilityContainer>
    </>
  );
};

export default AccessibilityControls;