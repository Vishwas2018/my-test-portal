// src/utils/dataLoader.js (update)

// Import the manifest
import manifest from '../data/category/manifest.json';

/**
 * Utility to load exams from the organized directory structure
 */

/**
 * Load exam data by subject, exam type, and optional exam ID
 * @param {string} subjectId - The subject ID (e.g., 'mathematics')
 * @param {string} examType - The exam type (e.g., 'icas', 'naplan')
 * @param {string} examId - Optional specific exam ID
 * @returns {Object|null} Exam data object or null if not found
 */
export const loadExam = async (subjectId, examType, examId) => {
  try {
    // Validate inputs
    if (!subjectId || !examType) {
      console.error('Missing required parameters for loadExam');
      return null;
    }
    
    // Check if subject and exam type exist in manifest
    const subject = manifest.subjects[subjectId];
    if (!subject) {
      console.error(`Subject not found: ${subjectId}`);
      return null;
    }
    
    const examTypeInfo = subject.examTypes[examType];
    if (!examTypeInfo) {
      console.error(`Exam type not found: ${examType} for subject ${subjectId}`);
      return null;
    }
    
    // If examId is provided, load that specific exam
    if (examId) {
      try {
        // Dynamically import the JSON file
        const examData = await import(`../data/category/Subjects/${subject.name}/${examTypeInfo.name}/${examId}.json`);
        return examData.default;
      } catch (error) {
        console.error(`Failed to load specific exam: ${examId}`, error);
        return null;
      }
    }
    
    // Otherwise, load the first exam in the directory
    if (examTypeInfo.exams && examTypeInfo.exams.length > 0) {
      const firstExam = examTypeInfo.exams[0];
      try {
        const examData = await import(`../data/category/Subjects/${subject.name}/${examTypeInfo.name}/${firstExam.id}.json`);
        return examData.default;
      } catch (error) {
        console.error(`Failed to load default exam for ${subject.name}/${examTypeInfo.name}`, error);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading exam data:', error);
    return null;
  }
};

/**
 * Load available exams for a subject and exam type
 * @param {string} subjectId - The subject ID
 * @param {string} examType - The exam type
 * @returns {Array} Array of available exam metadata
 */
export const loadAvailableExams = (subjectId, examType) => {
  try {
    // Validate inputs
    if (!subjectId || !examType) {
      console.error('Missing required parameters for loadAvailableExams');
      return [];
    }
    
    // Check if subject and exam type exist in manifest
    const subject = manifest.subjects[subjectId];
    if (!subject) {
      console.error(`Subject not found: ${subjectId}`);
      return [];
    }
    
    const examTypeInfo = subject.examTypes[examType];
    if (!examTypeInfo) {
      console.error(`Exam type not found: ${examType} for subject ${subjectId}`);
      return [];
    }
    
    // Return the exams list from the manifest
    return examTypeInfo.exams || [];
  } catch (error) {
    console.error('Error loading available exams:', error);
    return [];
  }
};

export default {
  loadExam,
  loadAvailableExams
};