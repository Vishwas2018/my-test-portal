// src/utils/examUtils.js
import { EXAM, STORAGE_KEYS } from './constants';

// Import data sources - make sure these imports are correct
import defaultQuestionBank from '../data/defaultQuestionBank';
import examData from '../data/examData';

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
    
    // If we have a specific examId and complete parameters
    if (examType && subjectId && year && examId) {
      try {
        // Safely access the data structure with optional chaining
        const examQuestions = examData?.[examType]?.subjects?.[subjectId]?.exams?.[year]?.find(e => e.id === examId)?.questions;
        
        if (Array.isArray(examQuestions) && examQuestions.length > 0) {
          return examQuestions;
        }
      } catch (err) {
        console.error('Error accessing specific exam questions:', err);
      }
    }
    
    // If we have type, year, and subject (but no specific exam ID)
    if (examType && year && subjectId) {
      try {
        // Safely access the data structure with optional chaining
        const yearExams = examData?.[examType]?.subjects?.[subjectId]?.exams?.[year];
        
        if (Array.isArray(yearExams) && yearExams.length > 0 && yearExams[0]?.questions) {
          return yearExams[0].questions;
        }
      } catch (err) {
        console.error('Error accessing year-specific exam questions:', err);
      }
    }
    
    // Fallback to default questions for this subject
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
  try {
    // Get questions from the default question bank based on subject
    if (defaultQuestionBank && typeof defaultQuestionBank === 'object' && subjectId && defaultQuestionBank[subjectId]) {
      const questions = defaultQuestionBank[subjectId];
      if (Array.isArray(questions) && questions.length > 0) {
        return questions;
      }
    }
  } catch (err) {
    console.error('Error accessing default question bank:', err);
  }
  
  // Fallback generic questions if everything else fails
  return [
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
    },
    {
      id: 'generic3',
      type: EXAM.QUESTION_TYPES.FILL_IN_BLANK,
      text: 'The largest planet in our solar system is ________.',
      correctAnswer: 'Jupiter',
      explanation: 'Jupiter is the largest planet in our solar system.'
    }
  ];
};

/**
 * Get exam subjects based on exam type
 * @param {string} examType - Optional exam type to filter subjects
 * @returns {Array} Array of subjects
 */
export const getSubjects = (examType = null) => {
  // Default subjects for sample exams
  const defaultSubjects = [
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
  
  try {
    if (examType && examData?.[examType]) {
      // Extract subjects from our data structure
      const examTypeData = examData[examType];
      const subjects = Object.keys(examTypeData.subjects || {}).map(subjectId => {
        const subjectData = examTypeData.subjects[subjectId];
        if (!subjectData) return null;
        
        const metadata = subjectData.metadata || {};
        
        // Find the first exam to get question count and time limit
        let questionCount = 0;
        let timeLimit = EXAM.DEFAULT_TIME_LIMIT;
        
        // Loop through all year levels to find at least one exam
        const yearLevels = Object.keys(subjectData.exams || {});
        if (yearLevels.length > 0) {
          const firstYearExams = subjectData.exams[yearLevels[0]];
          if (Array.isArray(firstYearExams) && firstYearExams.length > 0) {
            const firstExam = firstYearExams[0];
            questionCount = firstExam.questions ? firstExam.questions.length : 0;
            timeLimit = firstExam.timeLimit || EXAM.DEFAULT_TIME_LIMIT;
          }
        }
        
        return {
          id: subjectId,
          name: metadata.name || subjectId,
          icon: metadata.icon || '📚',
          questionCount,
          timeLimit,
          description: metadata.description || ''
        };
      }).filter(Boolean); // Filter out null entries
      
      return subjects;
    }
    
    return defaultSubjects;
  } catch (error) {
    console.error('Error getting subjects:', error);
    return defaultSubjects;
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
    if (!examType || !subjectId || !year) {
      console.warn('Missing required parameters for getAvailableExams');
      return [];
    }
    
    // Safely access exams with optional chaining
    const yearExams = examData?.[examType]?.subjects?.[subjectId]?.exams?.[year];
    
    if (Array.isArray(yearExams) && yearExams.length > 0) {
      // Map the exams to the required format
      return yearExams.map(exam => ({
        id: exam.id || `${subjectId}_${year}_${Math.random().toString(36).substr(2, 9)}`,
        name: exam.title || `${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} Exam`,
        grade: parseInt(year, 10) || 0,
        type: examType,
        subject: subjectId,
        questionCount: Array.isArray(exam.questions) ? exam.questions.length : 0,
        timeLimit: exam.timeLimit || EXAM.DEFAULT_TIME_LIMIT
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error getting available exams:', error);
    return [];
  }
};

/**
 * Save exam result to localStorage with error handling
 * @param {Object} result - The exam result to save
 * @returns {boolean} Success status
 */
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

/**
 * Get exam results from localStorage
 * @returns {Array} Array of exam results
 */
export const getExamResults = () => {
  try {
    const resultsStr = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    return resultsStr ? JSON.parse(resultsStr) : [];
  } catch (error) {
    console.error('Error getting exam results:', error);
    return [];
  }
};

/**
 * Update user streak when completing an exam
 */
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

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};