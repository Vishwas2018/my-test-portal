// src/utils/dataLoader.js

/**
 * Utility to load exams from the organized directory structure
 */

/**
 * Load exam data by subject, exam type, and optional exam ID
 * @param {string} subjectId - The subject ID (e.g., 'mathematics')
 * @param {string} examType - The exam type (e.g., 'icas', 'naplan', 'sample')
 * @param {string} examId - Optional specific exam ID
 * @returns {Promise<Object|null>} Exam data object or null if not found
 */
export const loadExam = async (subjectId, examType = 'sample', examId = null) => {
  try {
    // Normalize exam type name for directory structure
    let examTypeDir;
    switch (examType) {
      case 'icas_all_stars':
      case 'icas_all':
        examTypeDir = 'ICAS All';
        break;
      case 'icas':
        examTypeDir = 'ICAS';
        break;
      case 'naplan':
        examTypeDir = 'Naplan';
        break;
      case 'sample':
      default:
        examTypeDir = 'Free Sample exams';
        break;
    }

    // Capitalize first letter of subject
    const capitalizedSubject = subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
    
    // Handle subject name mapping
    const subjectMap = {
      'digital': 'Digital Technologies',
      'mathematics': 'Mathematics',
      'science': 'Science',
      'reading': 'Reading',
      'writing': 'Writing',
      'spelling': 'Spelling',
      'grammar': 'Grammar',
      'numeracy': 'Numeracy',
      'language': 'Language Conventions',
      'reasoning': 'Reasoning'
    };
    
    const subjectDir = subjectMap[subjectId] || capitalizedSubject;
    
    // Determine exam ID to load
    const fileId = examId || 'Exam1';
    
    // Construct the path to the JSON file
    const filePath = `../data/category/Subjects/${subjectDir}/${examTypeDir}/${fileId}`;
    
    // Dynamically import the JSON file
    try {
      const examData = await import(filePath + '.json');
      return examData.default;
    } catch (importError) {
      console.error(`Failed to import exam data from ${filePath}.json:`, importError);
      
      // Try alternative path formats if the first attempt fails
      try {
        // Try with lowercase exam type directory
        const altFilePath = `../data/category/Subjects/${subjectDir}/${examTypeDir.toLowerCase()}/${fileId}`;
        const examData = await import(altFilePath + '.json');
        return examData.default;
      } catch (altError) {
        console.error(`Failed alternative import paths as well:`, altError);
        return null;
      }
    }
  } catch (error) {
    console.error('Error loading exam data:', error);
    return null;
  }
};

/**
 * Get available exams for a subject and exam type from the manifest
 * @param {string} subjectId - The subject ID
 * @param {string} examType - The exam type
 * @returns {Array} Array of available exam metadata
 */
export const getAvailableExams = async (subjectId, examType) => {
  try {
    // Import the manifest dynamically
    const manifest = await import('../data/category/manifest.json');
    
    // Check if subject exists in manifest
    if (manifest.default.subjects && manifest.default.subjects[subjectId]) {
      const subject = manifest.default.subjects[subjectId];
      
      // Check if exam type exists for this subject
      if (subject.examTypes && subject.examTypes[examType]) {
        return subject.examTypes[examType].exams || [];
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error getting available exams:', error);
    return [];
  }
};

export default {
  loadExam,
  getAvailableExams
};