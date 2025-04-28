// src/services/examService.js

import dataLoader from '../utils/dataLoader';
import manifest from '../data/category/manifest.json';

const examService = {
  getExamTypes() {
    return [
      { id: 'naplan', name: 'NAPLAN', description: 'Australian National Assessment Program', icon: '🏫' },
      { id: 'icas', name: 'ICAS', description: 'International Competitions and Assessments for Schools', icon: '🎓' },
      { id: 'icas_all_stars', name: 'ICAS All Stars', description: 'Advanced ICAS with comprehensive topics', icon: '⭐' },
      { id: 'sample', name: 'Sample Tests', description: 'Free practice tests for all subjects', icon: '📝' }
    ];
  },
  
  getSubjects(examType) {
    if (!examType) return [];
    
    const subjects = [];
    // Extract subjects from manifest that have the specified exam type
    Object.entries(manifest.subjects).forEach(([id, subject]) => {
      if (subject.examTypes && subject.examTypes[examType]) {
        subjects.push({
          id,
          name: subject.name,
          icon: subject.icon,
          description: subject.description,
          questionCount: subject.defaultQuestionCount,
          timeLimit: subject.defaultTimeLimit
        });
      }
    });
    
    return subjects;
  },
  
  async getQuestions(examType, subjectId, year, examId) {
    try {
      // Load exam data using dataLoader
      const examData = await dataLoader.loadExam(subjectId, examType || 'sample', examId);
      return examData?.questions || [];
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  },
  
  async getAvailableExams(examType, subjectId, year) {
    try {
      const exams = dataLoader.loadAvailableExams(subjectId, examType);
      
      // Filter by year if provided
      if (year && exams.length > 0) {
        return exams.filter(exam => !exam.year || exam.year === parseInt(year));
      }
      
      return exams;
    } catch (error) {
      console.error('Error getting available exams:', error);
      return [];
    }
  }
};

export default examService;