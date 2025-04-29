// src/utils/fileSystemUtils.js

/**
 * Utility for handling file system operations related to exams
 */

/**
 * Load an exam file from the data directory structure
 * @param {string} subject - Subject name
 * @param {string} examType - Exam type name
 * @param {string} examId - Exam ID
 * @returns {Promise<Object|null>} - The exam data or null if not found
 */
export const loadExamFile = async (subject, examType, examId) => {
    try {
      // Construct the path
      const path = `../data/category/Subjects/${subject}/${examType}/${examId}.json`;
      
      // Use dynamic import to load the JSON file
      const examData = await import(path);
      return examData.default;
    } catch (error) {
      console.error(`Error loading exam file for ${subject}/${examType}/${examId}:`, error);
      return null;
    }
  };
  
  /**
   * Get all subjects from the manifest
   * @returns {Promise<Array>} - Array of subject data
   */
  export const getAllSubjects = async () => {
    try {
      const manifest = await import('../data/category/manifest.json');
      
      return Object.entries(manifest.default.subjects).map(([id, data]) => ({
        id,
        ...data
      }));
    } catch (error) {
      console.error('Error getting all subjects:', error);
      return [];
    }
  };
  
  /**
   * Get all exam types for a subject
   * @param {string} subjectId - Subject identifier
   * @returns {Promise<Array>} - Array of exam type data
   */
  export const getExamTypesForSubject = async (subjectId) => {
    try {
      const manifest = await import('../data/category/manifest.json');
      
      const subject = manifest.default.subjects[subjectId];
      if (!subject || !subject.examTypes) {
        return [];
      }
      
      return Object.entries(subject.examTypes).map(([id, data]) => ({
        id,
        ...data
      }));
    } catch (error) {
      console.error(`Error getting exam types for subject ${subjectId}:`, error);
      return [];
    }
  };
  
  /**
   * Gets exams for a specific subject and exam type
   * @param {string} subjectId - Subject identifier
   * @param {string} examType - Exam type identifier
   * @returns {Promise<Array>} - Array of exam data
   */
  export const getExamsForType = async (subjectId, examType) => {
    try {
      const manifest = await import('../data/category/manifest.json');
      
      const subject = manifest.default.subjects[subjectId];
      if (!subject || !subject.examTypes || !subject.examTypes[examType]) {
        return [];
      }
      
      return subject.examTypes[examType].exams || [];
    } catch (error) {
      console.error(`Error getting exams for ${subjectId}/${examType}:`, error);
      return [];
    }
  };
  
  export default {
    loadExamFile,
    getAllSubjects,
    getExamTypesForSubject,
    getExamsForType
  };