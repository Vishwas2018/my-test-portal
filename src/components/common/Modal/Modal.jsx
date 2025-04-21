import React, { useCallback, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

// Styled components for Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  padding: ${props => props.$padding || '2rem'};
  width: ${props => props.$width || '500px'};
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  z-index: var(--z-modal);
  box-shadow: var(--shadow-lg);
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-20px)')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  border: ${props => props.$border || 'none'};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  border-bottom: ${props => (props.$hasBorder ? '1px solid var(--light-gray)' : 'none')};
  padding-bottom: ${props => (props.$hasBorder ? '1rem' : '0')};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: var(--dark);
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  color: var(--dark-gray);
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 50%;
  
  &:hover {
    color: var(--dark);
    background-color: var(--light-gray);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const ModalBody = styled.div`
  flex: 1;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: ${props => props.$justify || 'flex-end'};
  gap: 1rem;
  margin-top: ${props => (props.$hasContent ? '1.5rem' : '0')};
  border-top: ${props => (props.$hasBorder ? '1px solid var(--light-gray)' : 'none')};
  padding-top: ${props => (props.$hasBorder ? '1.5rem' : '0')};
`;

/**
 * Modal component for displaying content in a dialog box
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title (optional)
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content (optional)
 * @param {boolean} props.closeOnEsc - Whether to close the modal when Escape key is pressed (default: true)
 * @param {boolean} props.closeOnOverlayClick - Whether to close the modal when clicking the overlay (default: true)
 * @param {string} props.width - Modal width (default: '500px')
 * @param {string} props.padding - Modal padding (default: '2rem')
 * @param {boolean} props.hasBorderHeader - Whether to show a border below the header (default: true)
 * @param {boolean} props.hasBorderFooter - Whether to show a border above the footer (default: true)
 * @param {string} props.footerJustify - Justify content value for the footer (default: 'flex-end')
 * @param {string} props.border - Border style for the modal (default: none)
 * @param {string} props.ariaLabel - ARIA label for the modal (default: 'Modal')
 * @param {string} props.ariaDescribedBy - ARIA described-by ID for the modal
 */
const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  width,
  padding,
  hasBorderHeader = true,
  hasBorderFooter = true,
  footerJustify,
  border,
  ariaLabel = 'Modal',
  ariaDescribedBy,
  ...rest
}) => {
  const modalRef = useRef(null);
  
  // Handle ESC key press
  const handleKeyDown = useCallback((event) => {
    if (closeOnEsc && event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [closeOnEsc, isOpen, onClose]);
  
  // Handle overlay click
  const handleOverlayClick = useCallback((event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget && isOpen) {
      onClose();
    }
  }, [closeOnOverlayClick, isOpen, onClose]);
  
  // Close icon component
  const CloseIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
  
  // Add event listeners for ESC key and focus trap
  useEffect(() => {
    // Add event listener for ESC key
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus trap logic
    if (isOpen && modalRef.current) {
      // Store the element that had focus before opening the modal
      const previouslyFocusedElement = document.activeElement;
      
      // Focus the modal container
      modalRef.current.focus();
      
      // Return a cleanup function that restores focus
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore focus when the modal closes
        if (previouslyFocusedElement && 'focus' in previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Use portal to render modal at the end of the body
  const modalContent = (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={handleOverlayClick}
      role="presentation"
      data-testid="modal-overlay"
    >
      <ModalContainer
        ref={modalRef}
        $isOpen={isOpen}
        $width={width}
        $padding={padding}
        $border={border}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex="-1"
        data-testid="modal-container"
        {...rest}
      >
        {title && (
          <ModalHeader $hasBorder={hasBorderHeader}>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton 
              onClick={onClose} 
              aria-label="Close modal"
              data-testid="modal-close-button"
            >
              <CloseIcon />
            </CloseButton>
          </ModalHeader>
        )}
        
        <ModalBody>{children}</ModalBody>
        
        {footer && (
          <ModalFooter 
            $hasContent={!!footer} 
            $hasBorder={hasBorderFooter}
            $justify={footerJustify}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
  
  return isOpen ? createPortal(modalContent, document.body) : null;
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  width: PropTypes.string,
  padding: PropTypes.string,
  hasBorderHeader: PropTypes.bool,
  hasBorderFooter: PropTypes.bool,
  footerJustify: PropTypes.string,
  border: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string
};

export default Modal;