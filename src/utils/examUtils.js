// src/utils/examUtils.js
import { STORAGE_KEYS } from './constants';
import examsData from '../data/exam.json';

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
    console.log(`Loading questions for: Subject: ${subjectId}, Type: ${examType}, Year: ${year}, Exam: ${examId}`);
    
    // If we have a specific examId, return questions for that exam
    if (examId) {
      const exam = getExamById(examId);
      return exam ? exam.questions : [];
    }
    
    // If we have type, year, and subject, find matching exam
    if (examType && year && subjectId) {
      // Find exams matching the criteria
      const matchingExams = findExams(examType, subjectId, year);
      
      // Return questions from first matching exam, if any
      if (matchingExams.length > 0) {
        return matchingExams[0].questions;
      }
    }
    
    // For backward compatibility or fallback
    return getDefaultQuestions(subjectId);
  } catch (error) {
    console.error('Error loading questions:', error);
    return getDefaultQuestions(subjectId);
  }
};

/**
 * Get a specific exam by ID
 * @param {string} examId - The ID of the exam
 * @returns {Object|null} The exam object or null if not found
 */
const getExamById = (examId) => {
  // Check if it's a sample exam (sample-examType-year-subject-1)
  if (examId.startsWith('sample-')) {
    const parts = examId.split('-');
    if (parts.length >= 4) {
      const examType = parts[1];
      const year = parseInt(parts[2].replace('year', ''));
      const subjectId = parts[3];
      
      // Find matching exams
      const matchingExams = findExams(examType, subjectId, year);
      return matchingExams.length > 0 ? matchingExams[0] : null;
    }
    return null;
  }
  
  // Regular exam ID format: examType-year-subject-number
  const parts = examId.split('-');
  if (parts.length >= 4) {
    const examType = parts[0];
    const year = parseInt(parts[1]);
    const subjectId = parts[2];
    
    // Find matching exams
    const matchingExams = findExams(examType, subjectId, year);
    return matchingExams.length > 0 ? matchingExams[0] : null;
  }
  
  return null;
};

/**
 * Find exams matching criteria
 * @param {string} examType - The exam type (naplan, icas, icas_all_stars)
 * @param {string} subjectId - The subject ID
 * @param {number} year - The year level
 * @returns {Array} Array of matching exams
 */
const findExams = (examType, subjectId, year) => {
  try {
    // Check if we have the exam type and subject
    if (!examsData[examType] || !examsData[examType][subjectId]) {
      return [];
    }
    
    // Filter exams by year
    return examsData[examType][subjectId].filter(exam => 
      exam.year === year || exam.year === parseInt(year)
    );
  } catch (error) {
    console.error('Error finding exams:', error);
    return [];
  }
};

/**
 * Get default questions (for backward compatibility)
 * @param {string} subjectId - The subject ID
 * @returns {Array} Array of default questions
 */
const getDefaultQuestions = (subjectId) => {
  return [
    {
      id: `${subjectId}1`,
      type: 'multipleChoice',
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
      id: `${subjectId}2`,
      type: 'trueFalse',
      text: 'The Earth revolves around the Sun.',
      correctAnswer: true,
      explanation: 'The Earth revolves around the Sun in an elliptical orbit.'
    },
    {
      id: `${subjectId}3`,
      type: 'fillInBlank',
      text: 'The largest planet in our solar system is ________.',
      correctAnswer: 'Jupiter',
      explanation: 'Jupiter is the largest planet in our solar system.'
    },
    {
      id: `${subjectId}4`,
      type: 'multipleChoice',
      text: 'Which of these is not a programming language?',
      options: [
        { id: 'a', text: 'Python' },
        { id: 'b', text: 'Java' },
        { id: 'c', text: 'WebFlow' },
        { id: 'd', text: 'Ruby' }
      ],
      correctAnswer: 'c',
      explanation: 'WebFlow is a web design tool, not a programming language.'
    }
  ];
};

/**
 * Get exam subjects based on exam type
 * @param {string} examType - Optional exam type to filter subjects
 * @returns {Array} Array of subjects
 */
export const getSubjects = (examType = null) => {
  try {
    if (examType && examsData[examType]) {
      // Get all subjects for the given exam type
      return Object.keys(examsData[examType]).map(subjectId => {
        // Use the first exam for this subject to get info
        const firstExam = examsData[examType][subjectId][0];
        const questionCount = firstExam ? firstExam.questions.length : 0;
        const timeLimit = firstExam ? firstExam.timeLimit : 30;
        
        // Map subject IDs to display names and icons
        const subjectMappings = {
          // NAPLAN
          'reading': { name: 'Reading', icon: '📚' },
          'writing': { name: 'Writing', icon: '✏️' },
          'numeracy': { name: 'Numeracy', icon: '🔢' },
          'language': { name: 'Language Conventions', icon: '📝' },
          
          // ICAS
          'science': { name: 'Science', icon: '🧪' },
          'spelling': { name: 'Spelling Bee', icon: '🐝' },
          'grammar': { name: 'Grammar', icon: '📝' },
          'mathematics': { name: 'Mathematics', icon: '🔢' },
          'digital': { name: 'Digital Technologies', icon: '💻' },
          
          // ICAS All Stars
          'english': { name: 'English', icon: '📚' },
          'reasoning': { name: 'Reasoning', icon: '🧠' },
          'general_knowledge': { name: 'General Knowledge', icon: '🌍' },
          'digital_literacy': { name: 'Digital Literacy', icon: '💻' }
        };
        
        const subjectInfo = subjectMappings[subjectId] || { 
          name: subjectId.charAt(0).toUpperCase() + subjectId.slice(1), 
          icon: '📝' 
        };
        
        return {
          id: subjectId,
          name: subjectInfo.name,
          questionCount,
          timeLimit,
          icon: subjectInfo.icon
        };
      });
    }
    
    // If no exam type provided, return default subjects
    return [
      {
        id: 'math',
        name: 'Mathematics',
        questionCount: 20,
        timeLimit: 30,
        icon: '🧮'
      },
      {
        id: 'science',
        name: 'Science',
        questionCount: 25,
        timeLimit: 40,
        icon: '🔬'
      },
      {
        id: 'english',
        name: 'English',
        questionCount: 30,
        timeLimit: 45,
        icon: '📚'
      },
      {
        id: 'coding',
        name: 'Coding',
        questionCount: 15,
        timeLimit: 30,
        icon: '💻'
      }
    ];
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
    const matchingExams = findExams(examType, subjectId, year);
    
    // Map the actual exams to the format expected by the UI
    return matchingExams.map((exam, index) => ({
      id: `${examType}-${year}-${subjectId}-${index + 1}`,
      name: `Exam ${index + 1}`,
      grade: year,
      type: examType,
      subject: subjectId,
      questionCount: exam.questions.length,
      timeLimit: exam.timeLimit
    }));
  } catch (error) {
    console.error('Error getting available exams:', error);
    return [];
  }
};

/**
 * Save exam result to localStorage
 * @param {Object} result - The exam result to save
 */
export const saveExamResult = (result) => {
  try {
    // Add date to result
    const resultWithDate = {
      ...result,
      date: new Date().toISOString()
    };
    
    // Get existing results
    const existingResultsStr = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);
    const existingResults = existingResultsStr ? JSON.parse(existingResultsStr) : [];
    
    // Add new result
    const updatedResults = [resultWithDate, ...existingResults];
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(updatedResults));
    
    // Update streak data
    updateStreak();
    
    return true;
  } catch (error) {
    console.error('Error saving exam result:', error);
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