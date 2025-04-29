// src/services/examDataService.js

/**
 * Service responsible for organizing and managing exam data
 */

import dataLoader from '../utils/dataLoader';

/**
 * Get organized exam structure for a subject
 * @param {string} subjectId - Subject identifier 
 * @returns {Promise<Object>} - Organized exam structure
 */
export const getSubjectExamStructure = async (subjectId) => {
  try {
    // Import manifest
    const manifest = await import('../data/category/manifest.json');
    const subjectInfo = manifest.default.subjects[subjectId];
    
    if (!subjectInfo) {
      throw new Error(`Subject not found: ${subjectId}`);
    }
    
    // Organize by exam type
    const examTypes = {};
    
    for (const [typeId, typeInfo] of Object.entries(subjectInfo.examTypes || {})) {
      examTypes[typeId] = {
        name: typeInfo.name,
        exams: typeInfo.exams || []
      };
    }
    
    return {
      id: subjectId,
      name: subjectInfo.name,
      icon: subjectInfo.icon,
      description: subjectInfo.description,
      defaultQuestionCount: subjectInfo.defaultQuestionCount,
      defaultTimeLimit: subjectInfo.defaultTimeLimit,
      examTypes
    };
  } catch (error) {
    console.error(`Error getting subject exam structure for ${subjectId}:`, error);
    return null;
  }
};

/**
 * Get all available exams categorized by subject and type
 * @returns {Promise<Object>} - All exams organized by subject and type
 */
export const getAllExams = async () => {
  try {
    // Import manifest
    const manifest = await import('../data/category/manifest.json');
    
    // Organize data by subject
    const subjects = {};
    
    for (const [subjectId, subjectInfo] of Object.entries(manifest.default.subjects)) {
      subjects[subjectId] = {
        id: subjectId,
        name: subjectInfo.name,
        icon: subjectInfo.icon,
        description: subjectInfo.description,
        examTypes: {}
      };
      
      // Add exam types for each subject
      for (const [typeId, typeInfo] of Object.entries(subjectInfo.examTypes || {})) {
        subjects[subjectId].examTypes[typeId] = {
          name: typeInfo.name,
          exams: typeInfo.exams || []
        };
      }
    }
    
    return subjects;
  } catch (error) {
    console.error('Error getting all exams:', error);
    return {};
  }
};

/**
 * Get all exams available for a specific year level
 * @param {number} yearLevel - Year/grade level
 * @returns {Promise<Object>} - Exams filtered by year level
 */
export const getExamsByYearLevel = async (yearLevel) => {
  try {
    const allExams = await getAllExams();
    const yearExams = {};
    
    // Filter exams by year level
    for (const [subjectId, subject] of Object.entries(allExams)) {
      const examTypes = {};
      
      for (const [typeId, typeInfo] of Object.entries(subject.examTypes)) {
        const filteredExams = typeInfo.exams.filter(exam => 
          exam.year === yearLevel || exam.year === 'all' || !exam.year
        );
        
        if (filteredExams.length > 0) {
          examTypes[typeId] = {
            name: typeInfo.name,
            exams: filteredExams
          };
        }
      }
      
      if (Object.keys(examTypes).length > 0) {
        yearExams[subjectId] = {
          ...subject,
          examTypes
        };
      }
    }
    
    return yearExams;
  } catch (error) {
    console.error(`Error getting exams for year level ${yearLevel}:`, error);
    return {};
  }
};

/**
 * Get exam data including questions
 * @param {string} subjectId - Subject identifier
 * @param {string} examType - Exam type (e.g., 'sample', 'icas', 'naplan')
 * @param {string} examId - Exam identifier
 * @returns {Promise<Object|null>} - Complete exam data with questions
 */
export const getExamData = async (subjectId, examType, examId) => {
  try {
    return await dataLoader.loadExam(subjectId, examType, examId);
  } catch (error) {
    console.error(`Error getting exam data for ${subjectId}/${examType}/${examId}:`, error);
    return null;
  }
};

export default {
  getSubjectExamStructure,
  getAllExams,
  getExamsByYearLevel,
  getExamData
};