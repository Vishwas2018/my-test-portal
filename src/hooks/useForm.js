// src/hooks/useForm.js
import { useCallback, useReducer } from 'react';

// Form reducer to handle all form state logic
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value
        },
        // Clear error for this field when value changes
        errors: {
          ...state.errors,
          [action.field]: ''
        },
        // Mark field as touched
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true
        }
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };

    case 'RESET_FORM':
      return {
        values: action.values || state.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        submitCount: state.submitCount
      };

    case 'INCREMENT_SUBMIT_COUNT':
      return {
        ...state,
        submitCount: state.submitCount + 1
      };

    default:
      return state;
  }
};

/**
 * Custom hook for managing form state with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function
 * @returns {Object} Form state and methods
 */
const useForm = (initialValues = {}, validateFn = null) => {
  // Initialize the form state with reducer
  const [state, dispatch] = useReducer(formReducer, {
    values: initialValues,
    initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitCount: 0
  });

  // Handle field change
  const handleChange = useCallback((event) => {
    const target = event.target || event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    dispatch({
      type: 'SET_VALUE',
      field: name,
      value
    });
  }, []);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const field = event.target.name;
    
    dispatch({
      type: 'SET_TOUCHED',
      field
    });

    // Field-level validation on blur if validation function exists
    if (validateFn) {
      const errors = validateFn(state.values);
      if (errors && errors[field]) {
        dispatch({
          type: 'SET_ERRORS',
          errors
        });
      }
    }
  }, [state.values, validateFn]);

  // Validate all form values
  const validateForm = useCallback(() => {
    if (!validateFn) return true;

    const errors = validateFn(state.values);
    dispatch({
      type: 'SET_ERRORS',
      errors: errors || {}
    });

    return !errors || Object.keys(errors).length === 0;
  }, [state.values, validateFn]);

  // Handle form submission
  const handleSubmit = useCallback((submitFn) => {
    return async (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      dispatch({ type: 'INCREMENT_SUBMIT_COUNT' });

      // Mark all fields as touched
      const allTouched = Object.keys(state.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      
      Object.keys(allTouched).forEach(field => {
        dispatch({
          type: 'SET_TOUCHED',
          field
        });
      });

      // Validate form
      const isValid = validateForm();

      if (isValid && submitFn) {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
        
        try {
          await submitFn(state.values);
        } finally {
          dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
        }
      }
    };
  }, [state.values, validateForm]);

  // Set a specific field value
  const setFieldValue = useCallback((name, value) => {
    dispatch({
      type: 'SET_VALUE',
      field: name,
      value
    });
  }, []);

  // Reset form to initial values or new values
  const resetForm = useCallback((newValues) => {
    dispatch({
      type: 'RESET_FORM',
      values: newValues
    });
  }, []);

  return {
    ...state,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    validateForm
  };
};

export default useForm;