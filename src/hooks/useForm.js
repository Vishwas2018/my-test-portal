import { useCallback, useState } from 'react';

/**
 * Custom hook for form state management
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function that returns errors object
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validateFn = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  /**
   * Handle input change
   * 
   * @param {Event|Object} event - DOM event or object with name and value
   */
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target || event;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);
  
  /**
   * Handle input blur for field-level validation
   * 
   * @param {Event|Object} event - DOM event or object with name
   */
  const handleBlur = useCallback((event) => {
    const { name } = event.target || event;
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate field if validation function exists
    if (validateFn) {
      const fieldErrors = validateFn({
        ...values,
        // Ensure latest value is used for validation
        [name]: event.target?.value ?? values[name]
      });
      
      if (fieldErrors && fieldErrors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: fieldErrors[name]
        }));
      }
    }
  }, [values, validateFn]);
  
  /**
   * Validate all form values
   * 
   * @returns {boolean} Is form valid
   */
  const validateForm = useCallback(() => {
    if (!validateFn) return true;
    
    const validationErrors = validateFn(values);
    setErrors(validationErrors || {});
    
    return !validationErrors || Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);
  
  /**
   * Handle form submission
   * 
   * @param {Function} submitFn - Function to call with form values if valid
   * @returns {Function} Event handler function for form submission
   */
  const handleSubmit = useCallback(
    (submitFn) => async (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      setSubmitCount(prev => prev + 1);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }), 
        {}
      );
      setTouched(allTouched);
      
      // Validate form
      const isValid = validateForm();
      
      if (isValid && submitFn) {
        setIsSubmitting(true);
        try {
          await submitFn(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm]
  );
  
  /**
   * Set a specific field value
   * 
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);
  
  /**
   * Set a specific field error
   * 
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);
  
  /**
   * Reset form to initial values or new values
   * 
   * @param {Object} newValues - New values to reset to (optional)
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Helpers
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    resetForm,
    validateForm
  };
};

export default useForm;