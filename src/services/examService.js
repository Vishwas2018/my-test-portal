import { EXAM } from '../utils/constants';
// src/services/examService.js
import examData from '../data/exam.json';

/**
 * ExamService provides a centralized way to access and manipulate exam data
 */
class ExamService {
  /**
   * Get all available exam types (NAPLAN, ICAS, etc.)
   * @returns {Array} Array of exam type objects with metadata
   */
  getExamTypes() {
    return Object.keys(examData).map(typeId => {
      return {
        id: typeId,
        name: typeId === 'naplan' ? 'NAPLAN' : 
              typeId === 'icas' ? 'ICAS' : 
              typeId === 'icas_all_stars' ? 'ICAS All Stars' : 
              typeId.toUpperCase(),
        description: typeId === 'naplan' ? 'National Assessment Program - Literacy and Numeracy' :
                    typeId === 'icas' ? 'International Competitions and Assessments for Schools' :
                    typeId === 'icas_all_stars' ? 'Advanced ICAS with comprehensive topics' :
                    'Standardized exam preparation',
        icon: typeId === 'naplan' ? '🏫' :
              typeId === 'icas' ? '🎓' :
              typeId === 'icas_all_stars' ? '⭐' :
              '📝'
      };
    });
  }

  /**
   * Get all subjects for a specific exam type
   * @param {string} examType - The exam type ID (e.g., 'naplan', 'icas')
   * @returns {Array} Array of subject objects with metadata
   */
  getSubjects(examType) {
    if (!examType || !examData[examType]) return [];

    return Object.keys(examData[examType] || {}).map(subjectId => {
      const subjectExams = examData[examType][subjectId] || [];
      const firstExam = subjectExams[0] || {};
      
      return {
        id: subjectId,
        name: this._formatSubjectName(subjectId),
        questionCount: firstExam.questions ? firstExam.questions.length : 0,
        timeLimit: firstExam.timeLimit || EXAM.DEFAULT_TIME_LIMIT,
        icon: this._getSubjectIcon(subjectId),
        description: this._getSubjectDescription(subjectId)
      };
    });
  }

  /**
   * Get available exams for a specific subject, exam type, and year
   * @param {string} examType - The exam type (e.g., 'naplan', 'icas')
   * @param {string} subjectId - The subject ID
   * @param {number|string} year - The year level
   * @returns {Array} Array of available exam objects
   */
  getAvailableExams(examType, subjectId, year) {
    if (!examType || !subjectId) return [];

    // Handle both string and number year formats
    const yearNumber = year ? parseInt(year, 10) : null;
    
    // Get all exams for this subject
    const subjectExams = examData[examType]?.[subjectId] || [];
    
    // Filter by year if specified
    return subjectExams
      .filter(exam => !yearNumber || exam.year === yearNumber)
      .map(exam => ({
        id: exam.examId || `${subjectId}_${exam.year || 'all'}_${Math.random().toString(36).substr(2, 9)}`,
        name: exam.title || `${this._formatSubjectName(subjectId)} Exam`,
        year: exam.year || 'all',
        type: examType,
        subject: subjectId,
        questionCount: exam.questions ? exam.questions.length : 0,
        timeLimit: exam.timeLimit || EXAM.DEFAULT_TIME_LIMIT
      }));
  }

  /**
   * Get questions for a specific exam
   * @param {string} examType - The exam type (e.g., 'naplan', 'icas')
   * @param {string} subjectId - The subject ID
   * @param {number|string} year - The year level
   * @param {string} examId - The specific exam ID
   * @returns {Array} Array of question objects
   */
  getQuestions(examType, subjectId, year, examId) {
    if (!examType || !subjectId) return [];

    // Get all exams for this subject
    const subjectExams = examData[examType]?.[subjectId] || [];
    
    // Find the specified exam
    let targetExam;
    
    if (examId) {
      targetExam = subjectExams.find(exam => exam.examId === examId);
    } else if (year) {
      // If no examId provided but year is, find the first exam for that year
      const yearNumber = parseInt(year, 10);
      targetExam = subjectExams.find(exam => exam.year === yearNumber);
    } else {
      // If neither provided, use the first exam
      targetExam = subjectExams[0];
    }
    
    return targetExam?.questions || [];
  }

  /**
   * Helper method to format subject name
   * @private
   * @param {string} subjectId - The subject ID
   * @returns {string} Formatted subject name
   */
  _formatSubjectName(subjectId) {
    // Convert underscores to spaces and capitalize words
    return subjectId
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Helper method to get an icon for a subject
   * @private
   * @param {string} subjectId - The subject ID
   * @returns {string} An emoji icon
   */
  _getSubjectIcon(subjectId) {
    const subjectIcons = {
      mathematics: '🔢',
      numeracy: '🔢',
      math: '🧮',
      science: '🧪',
      reading: '📚',
      writing: '✍️',
      spelling: '🔤',
      grammar: '📝',
      digital: '💻',
      'digital_technologies': '💻',
      english: '📖',
      language: '🗣️',
      reasoning: '🧠',
      general_knowledge: '🌍'
    };
    
    return subjectIcons[subjectId] || '📝';
  }

  /**
   * Helper method to get a description for a subject
   * @private
   * @param {string} subjectId - The subject ID
   * @returns {string} A description
   */
  _getSubjectDescription(subjectId) {
    const descriptions = {
      mathematics: 'Mathematical reasoning and problem-solving',
      numeracy: 'Number and Algebra, Measurement and Geometry',
      reading: 'Reading comprehension and text analysis',
      writing: 'Extended writing and composition skills',
      spelling: 'Spelling patterns, rules, and conventions',
      grammar: 'Grammar, punctuation, and language conventions',
      digital: 'Digital systems and computational thinking',
      science: 'Scientific knowledge and inquiry skills',
      english: 'Reading comprehension and language skills',
      language: 'Grammar, punctuation, and spelling conventions',
      reasoning: 'Logical thinking and problem-solving',
      general_knowledge: 'Knowledge across various disciplines'
    };
    
    return descriptions[subjectId] || 'Practice exam questions';
  }
}

// Export a singleton instance
export default new ExamService();