import { useForm, useModal } from '../../hooks';

import Button from '../common/Button';
import Modal from '../common/Modal';
import React from 'react';
import styled from 'styled-components';

// Styled components for the example
const ExampleContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$hasError ? 'var(--error)' : 'var(--light-gray)'};
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition-normal);
  
  &:focus {
    border-color: ${props => props.$hasError ? 'var(--error)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError 
      ? 'rgba(229, 62, 62, 0.3)' 
      : 'rgba(110, 207, 255, 0.3)'};
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$hasError ? 'var(--error)' : 'var(--light-gray)'};
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition-normal);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    border-color: ${props => props.$hasError ? 'var(--error)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.$hasError 
      ? 'rgba(229, 62, 62, 0.3)' 
      : 'rgba(110, 207, 255, 0.3)'};
    outline: none;
  }
`;

const FormError = styled.div`
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(72, 187, 120, 0.1);
  border-left: 4px solid #48bb78;
  color: #2f855a;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

/**
 * Example component demonstrating the use of Modal and custom hooks
 */
const ModalExample = () => {
  // Use the useModal hook to manage modal state
  const { isOpen, openModal, closeModal } = useModal();
  
  // Use the useForm hook to manage form state with validation
  const { 
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm(
    // Initial form values
    { 
      name: '',
      email: '',
      message: ''
    },
    // Validation function
    (values) => {
      const errors = {};
      
      if (!values.name) {
        errors.name = 'Name is required';
      }
      
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email is invalid';
      }
      
      if (!values.message) {
        errors.message = 'Message is required';
      } else if (values.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
      }
      
      return errors;
    }
  );
  
  // Success state to show a message after form submission
  const [showSuccess, setShowSuccess] = React.useState(false);
  
  // Handle form submission
  const submitForm = async (formData) => {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    
    // Show success message and close modal
    setShowSuccess(true);
    closeModal();
    resetForm();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <ExampleContainer>
      <h2>Modal Component Example with Custom Hooks</h2>
      <p>
        This example demonstrates how to use the Modal component with useModal and useForm hooks.
      </p>
      
      {showSuccess && (
        <SuccessMessage>
          Your message has been sent successfully!
        </SuccessMessage>
      )}
      
      <ButtonContainer>
        <Button variant="primary" onClick={openModal}>
          Open Contact Form
        </Button>
      </ButtonContainer>
      
      {/* Contact Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Contact Us"
        width="600px"
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(submitForm)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(submitForm)}>
          <FormGroup>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              $hasError={touched.name && errors.name}
            />
            {touched.name && errors.name && (
              <FormError>{errors.name}</FormError>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              $hasError={touched.email && errors.email}
            />
            {touched.email && errors.email && (
              <FormError>{errors.email}</FormError>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="message">Message</FormLabel>
            <TextArea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your message"
              $hasError={touched.message && errors.message}
            />
            {touched.message && errors.message && (
              <FormError>{errors.message}</FormError>
            )}
          </FormGroup>
        </form>
      </Modal>
    </ExampleContainer>
  );
};

export default ModalExample;