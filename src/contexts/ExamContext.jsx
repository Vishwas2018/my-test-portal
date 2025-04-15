// src/contexts/ExamContext.jsx
import React, { createContext, useContext, useEffect, useReducer } from 'react';

// Initial state
const initialState = {
  examResults: [],
  examPapers: [],
  streakData: { currentStreak: 0, longestStreak: 0 },
  currentExam: {
    questions: [],
    currentIndex: 0,
    userAnswers: {},
    flaggedQuestions: [],
    startTime: null,
    isSubmitting: false
  },
  isLoading: false,
  error: null
};

// Create context
const ExamContext = createContext();

// Reducer function
const examReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        examResults: action.payload.examResults,
        examPapers: action.payload.examPapers,
        streakData: action.payload.streakData,
        isLoading: false
      };
    case 'SET_CURRENT_EXAM':
      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          questions: action.payload.questions,
          startTime: new Date()
        }
      };
    case 'SET_ANSWER':
      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          userAnswers: {
            ...state.currentExam.userAnswers,
            [action.payload.index]: action.payload.answer
          }
        }
      };
    case 'TOGGLE_FLAG':
      const index = action.payload.index;
      const flaggedQuestions = state.currentExam.flaggedQuestions.includes(index)
        ? state.currentExam.flaggedQuestions.filter(i => i !== index)
        : [...state.currentExam.flaggedQuestions, index];

      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          flaggedQuestions
        }
      };
    case 'SET_CURRENT_INDEX':
      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          currentIndex: action.payload.index
        }
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        currentExam: {
          ...state.currentExam,
          isSubmitting: action.payload
        }
      };
    case 'RESET_EXAM':
      return {
        ...state,
        currentExam: {
          questions: [],
          currentIndex: 0,
          userAnswers: {},
          flaggedQuestions: [],
          startTime: null,
          isSubmitting: false
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const ExamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const examResults = localStorage.getItem('exam_results');
      const examPapers = localStorage.getItem('exam_papers');
      const streakData = localStorage.getItem('streak_data');

      dispatch({
        type: 'LOAD_DATA',
        payload: { 
          examResults: examResults ? JSON.parse(examResults) : [],
          examPapers: examPapers ? JSON.parse(examPapers) : [],
          streakData: streakData ? JSON.parse(streakData) : { currentStreak: 0, longestStreak: 0 }
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Failed to load data from storage'
      });
    }
  }, []);

  return (
    <ExamContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
};

// Custom hook for using the context
export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};