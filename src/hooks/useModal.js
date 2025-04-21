import { useCallback, useState } from 'react';

/**
 * Hook for managing modal state
 * 
 * @returns {Object} Modal state and actions
 */
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

export default useModal;