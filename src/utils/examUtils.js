// src/utils/examUtils.js

import { STORAGE_KEYS } from './constants';
import dataLoader from './dataLoader';

/**
 * Get questions for an exam based on subject, type, and ID
 * @param {string} subjectId - The subject ID (e.g., 'mathematics')
 * @param {string} examType - The exam type (e.g., 'icas', 'naplan', 'sample')
 * @param {string} examId - The exam ID
 * @returns {Promise<Array>} Array of questions
 */
export const getExamQuestions = async (subjectId, examType, examId) => {
  try {
    const examData = await dataLoader.loadExam(subjectId, examType, examId);
    if (examData && examData.questions) {
      return examData.questions;
    }
    throw new Error('No questions found in exam data');
  } catch (error) {
    console.error('Error loading exam questions:', error);
    return [];
  }
};

/**
 * Legacy function for backwards compatibility
 * Get questions for a subject, filtered by exam type and year if provided
 * @param {string} subjectId - The subject ID
 * @param {string} examType - Optional exam type (e.g., 'icas', 'naplan')
 * @param {number} year - Optional year level
 * @param {string} examId - Optional specific exam ID
 * @returns {Array} Array of questions
 */
export const getQuestions = async (subjectId, examType, year, examId) => {
  console.log("Using legacy getQuestions function. Consider switching to getExamQuestions.");
  try {
    if (examId) {
      return await getExamQuestions(subjectId, examType, examId);
    }
    
    // Load default exam for this subject/type
    const examData = await dataLoader.loadExam(subjectId, examType || 'sample');
    if (examData && examData.questions) {
      return examData.questions;
    }
    
    return [];
  } catch (error) {
    console.error('Error in legacy getQuestions:', error);
    return [];
  }
};

/**
 * Get all available exams for a subject and type
 * @param {string} subjectId - The subject ID
 * @param {string} examType - The exam type
 * @returns {Promise<Array>} Array of exam metadata
 */
export const getAvailableExams = async (subjectId, examType) => {
  return await dataLoader.getAvailableExams(subjectId, examType);
};

/**
 * Legacy function for backwards compatibility
 * Get exam subjects based on exam type
 * @param {string} examType - Optional exam type to filter subjects
 * @returns {Array} Array of subjects
 */
export const getSubjects = async (examType = null) => {
  console.log("Using legacy getSubjects function. Consider switching to getAllSubjects.");
  const subjects = await getAllSubjects();
  
  if (!examType) {
    return subjects;
  }
  
  // Filter subjects by exam type if provided
  return subjects.filter(subject => 
    subject.examTypes && subject.examTypes.includes(examType)
  );
};

/**
 * Save exam result to localStorage
 * @param {Object} result - The exam result object
 * @returns {boolean} Success indicator
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
 * Get all exam results from localStorage
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
 * Update user's practice streak
 * @returns {Object} Updated streak data
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
 * Format seconds into minutes:seconds display
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string (e.g., "5:30")
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Get all available subjects and their metadata
 * @returns {Promise<Array>} Array of subject metadata
 */
export const getAllSubjects = async () => {
  try {
    // Import the manifest dynamically
    const manifest = await import('../data/category/manifest.json');
    
    // Transform subjects into a more convenient format
    const subjects = Object.entries(manifest.default.subjects).map(([id, data]) => ({
      id,
      name: data.name,
      icon: data.icon,
      description: data.description,
      questionCount: data.defaultQuestionCount,
      timeLimit: data.defaultTimeLimit,
      examTypes: Object.keys(data.examTypes || {})
    }));
    
    return subjects;
  } catch (error) {
    console.error('Error getting all subjects:', error);
    return [];
  }
};

// Export functions
export default {
  getExamQuestions,
  getQuestions,
  getAvailableExams,
  getSubjects,
  saveExamResult,
  getExamResults,
  formatTime,
  getAllSubjects
};