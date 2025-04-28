// src/utils/examUtils.js
import { EXAM, STORAGE_KEYS } from './constants';

import examService from '../services/examService';

/**
 * Get questions for a subject, filtered by exam type and year if provided
 * @param {string} subjectId - The subject ID
 * @param {string} examType - Optional exam type (e.g., 'icas', 'naplan')
 * @param {number} year - Optional year level
 * @param {string} examId - Optional specific exam ID
 * @returns {Array} Array of questions
 */
export const getQuestions = (subjectId, examType, year, examId) => {
  try {
    // Input validation
    if (!subjectId) {
      console.error('Missing required parameter: subjectId');
      return getDefaultQuestions();
    }

    console.log(`Loading questions for: Subject: ${subjectId}, Type: ${examType}, Year: ${year}, Exam: ${examId}`);
    
    // Try to get questions from our service
    const questions = examService.getQuestions(examType, subjectId, year, examId);
    
    // If we found questions, return them
    if (Array.isArray(questions) && questions.length > 0) {
      return questions;
    }
    
    // Fallback to default questions
    return getDefaultQuestions(subjectId);
  } catch (error) {
    console.error('Error loading questions:', error);
    return getDefaultQuestions(subjectId);
  }
};

/**
 * Get default questions for sample exams
 * @param {string} subjectId - The subject ID
 * @returns {Array} Array of default questions
 */
const getDefaultQuestions = (subjectId) => {
  // Default questions by subject
  const defaultQuestionsMap = {
    mathematics: [
      {
        id: 'math1',
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'What is 25 + 37?',
        options: [
          { id: 'a', text: '52' },
          { id: 'b', text: '62' },
          { id: 'c', text: '72' },
          { id: 'd', text: '42' }
        ],
        correctAnswer: 'b',
        explanation: '25 + 37 = (20 + 5) + (30 + 7) = (20 + 30) + (5 + 7) = 50 + 12 = 62'
      },
      {
        id: 'math2',
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'A rectangle has a length of 12 cm and a width of 7 cm. What is its perimeter?',
        options: [
          { id: 'a', text: '19 cm' },
          { id: 'b', text: '38 cm' },
          { id: 'c', text: '48 cm' },
          { id: 'd', text: '84 cm' }
        ],
        correctAnswer: 'b',
        explanation: 'Perimeter = 2 × (length + width) = 2 × (12 + 7) = 2 × 19 = 38 cm'
      }
    ],
    science: [
      {
        id: 'science1',
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is a living thing?',
        options: [
          { id: 'a', text: 'Rock' },
          { id: 'b', text: 'Sun' },
          { id: 'c', text: 'Water' },
          { id: 'd', text: 'Tree' }
        ],
        correctAnswer: 'd',
        explanation: 'A tree is a living thing because it grows, reproduces, and responds to its environment.'
      },
      {
        id: 'science2',
        type: EXAM.QUESTION_TYPES.TRUE_FALSE,
        text: 'The moon produces its own light.',
        correctAnswer: false,
        explanation: 'The moon reflects light from the sun; it does not produce its own light.'
      }
    ],
    english: [
      {
        id: 'english1',
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is a synonym for "happy"?',
        options: [
          { id: 'a', text: 'Sad' },
          { id: 'b', text: 'Angry' },
          { id: 'c', text: 'Joyful' },
          { id: 'd', text: 'Tired' }
        ],
        correctAnswer: 'c',
        explanation: '"Joyful" is a synonym for "happy" as both words describe a feeling of pleasure or contentment.'
      }
    ],
    digital: [
      {
        id: 'digital1',
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is an input device?',
        options: [
          { id: 'a', text: 'Printer' },
          { id: 'b', text: 'Monitor' },
          { id: 'c', text: 'Speaker' },
          { id: 'd', text: 'Keyboard' }
        ],
        correctAnswer: 'd',
        explanation: 'A keyboard is an input device because it allows users to input data into a computer.'
      }
    ]
  };
  
  // Return subject specific questions or generic fallback
  return defaultQuestionsMap[subjectId] || [
    {
      id: 'generic1',
      type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
      text: 'What is the capital of France?',
      options: [
        { id: 'a', text: 'London' },
        { id: 'b', text: 'Paris' },
        { id: 'c', text: 'Berlin' },
        { id: 'd', text: 'Madrid' }
      ],
      correctAnswer: 'b',
      explanation: 'Paris is the capital city of France.'
    },
    {
      id: 'generic2',
      type: EXAM.QUESTION_TYPES.TRUE_FALSE,
      text: 'The Earth revolves around the Sun.',
      correctAnswer: true,
      explanation: 'The Earth revolves around the Sun in an elliptical orbit.'
    }
  ];
};

/**
 * Get exam subjects based on exam type
 * @param {string} examType - Optional exam type to filter subjects
 * @returns {Array} Array of subjects
 */
export const getSubjects = (examType = null) => {
  // If no exam type is provided, return default subjects
  if (!examType) {
    return [
      {
        id: 'mathematics',
        name: 'Mathematics',
        questionCount: 5,
        timeLimit: 45,
        icon: '🔢',
        description: 'Practice solving mathematical problems'
      },
      {
        id: 'science',
        name: 'Science',
        questionCount: 5,
        timeLimit: 45,
        icon: '🧪',
        description: 'Test your knowledge of scientific concepts'
      },
      {
        id: 'digital',
        name: 'Digital Technologies',
        questionCount: 5,
        timeLimit: 35,
        icon: '💻',
        description: 'Explore digital concepts and computational thinking'
      }
    ];
  }
  
  // Use the exam service to get subjects
  try {
    return examService.getSubjects(examType);
  } catch (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
};

/**
 * Get available exams for a specific subject, exam type, and year
 * @param {string} examType - The exam type
 * @param {string} subjectId - The subject ID
 * @param {number} year - The year level
 * @returns {Array} Array of available exams
 */
export const getAvailableExams = (examType, subjectId, year) => {
  try {
    // Input validation
    if (!examType || !subjectId) {
      console.warn('Missing required parameters for getAvailableExams');
      return [];
    }
    
    // Use the exam service to get available exams
    return examService.getAvailableExams(examType, subjectId, year);
  } catch (error) {
    console.error('Error getting available exams:', error);
    return [];
  }
};

// Keep existing functions unchanged
export const saveExamResult = (result) => {
  try {
    // Validate input
    if (!result || typeof result !== 'object') {
      console.error('Invalid exam result object');
      return false;
    }
    
    // Add date to result if not present
    const resultWithDate = {
      ...result,
      date: result.date || new Date().toISOString()
    };
    
    // Get existing results with fallback
    let existingResults = [];
    try {
      const existingResultsStr = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
      if (existingResultsStr) {
        const parsed = JSON.parse(existingResultsStr);
        if (Array.isArray(parsed)) {
          existingResults = parsed;
        }
      }
    } catch (parseError) {
      console.error('Error parsing existing results:', parseError);
      // Continue with empty array
    }
    
    // Add new result
    const updatedResults = [resultWithDate, ...existingResults];
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updatedResults));
    
    // Update streak data
    updateStreak();
    
    return true;
  } catch (error) {
    console.error('Error saving exam result:', error);
    
    // Attempt fallback to session storage if localStorage fails
    try {
      sessionStorage.setItem('last_exam_result', JSON.stringify(result));
      console.log('Saved to session storage as fallback');
    } catch (sessionError) {
      console.error('Session storage fallback also failed:', sessionError);
    }
    
    return false;
  }
};

export const getExamResults = () => {
  try {
    const resultsStr = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    return resultsStr ? JSON.parse(resultsStr) : [];
  } catch (error) {
    console.error('Error getting exam results:', error);
    return [];
  }
};

const updateStreak = () => {
  try {
    // Get current streak data
    const streakDataStr = localStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    const streakData = streakDataStr 
      ? JSON.parse(streakDataStr) 
      : { currentStreak: 0, longestStreak: 0, lastExamDate: null };
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastExamDate = streakData.lastExamDate;
    
    // If this is the first exam or the last exam was yesterday, increment streak
    if (!lastExamDate) {
      streakData.currentStreak = 1;
    } else {
      const lastExamDay = new Date(lastExamDate);
      const dayDiff = Math.floor((new Date(today) - lastExamDay) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day
        streakData.currentStreak += 1;
      } else if (dayDiff > 1) {
        // Streak broken
        streakData.currentStreak = 1;
      }
      // If same day (dayDiff === 0), don't change streak
    }
    
    // Update longest streak if needed
    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }
    
    // Update last exam date
    streakData.lastExamDate = today;
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
    
    return streakData;
  } catch (error) {
    console.error('Error updating streak:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};