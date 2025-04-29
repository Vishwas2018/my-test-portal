// src/utils/examDataIndexer.js

/**
 * Creates a mapping of exams by path for easy access
 * @param {Object} manifest - The manifest object with subject and exam info
 * @returns {Object} - Indexed data structure for exams
 */
export const createExamIndex = (manifest) => {
    try {
      const examIndex = {
        bySubject: {},
        byExamType: {},
        byYearLevel: {},
        paths: {}
      };
      
      // Process each subject from the manifest
      for (const [subjectId, subjectInfo] of Object.entries(manifest.subjects)) {
        examIndex.bySubject[subjectId] = {
          id: subjectId,
          name: subjectInfo.name,
          icon: subjectInfo.icon,
          examTypes: []
        };
        
        // Process exam types for this subject
        for (const [examTypeId, examTypeInfo] of Object.entries(subjectInfo.examTypes || {})) {
          // Add this exam type to the subject
          examIndex.bySubject[subjectId].examTypes.push(examTypeId);
          
          // Initialize exam type in global index if needed
          if (!examIndex.byExamType[examTypeId]) {
            examIndex.byExamType[examTypeId] = {
              id: examTypeId,
              name: examTypeInfo.name,
              subjects: {}
            };
          }
          
          // Add this subject to the exam type
          examIndex.byExamType[examTypeId].subjects[subjectId] = {
            id: subjectId,
            name: subjectInfo.name,
            icon: subjectInfo.icon,
            exams: []
          };
          
          // Process individual exams
          for (const exam of examTypeInfo.exams || []) {
            // Ensure exam has an ID
            if (!exam.id) continue;
            
            // Add to global paths index for fast lookup
            const path = `${subjectId}/${examTypeId}/${exam.id}`;
            examIndex.paths[path] = {
              ...exam,
              subject: subjectId,
              subjectName: subjectInfo.name,
              examType: examTypeId,
              examTypeName: examTypeInfo.name
            };
            
            // Add to exam type's subjects
            examIndex.byExamType[examTypeId].subjects[subjectId].exams.push(exam.id);
            
            // Add to year level index if available
            if (exam.year) {
              if (!examIndex.byYearLevel[exam.year]) {
                examIndex.byYearLevel[exam.year] = {
                  subjects: {}
                };
              }
              
              if (!examIndex.byYearLevel[exam.year].subjects[subjectId]) {
                examIndex.byYearLevel[exam.year].subjects[subjectId] = {
                  id: subjectId,
                  name: subjectInfo.name,
                  icon: subjectInfo.icon,
                  examTypes: {}
                };
              }
              
              if (!examIndex.byYearLevel[exam.year].subjects[subjectId].examTypes[examTypeId]) {
                examIndex.byYearLevel[exam.year].subjects[subjectId].examTypes[examTypeId] = {
                  id: examTypeId,
                  name: examTypeInfo.name,
                  exams: []
                };
              }
              
              examIndex.byYearLevel[exam.year].subjects[subjectId].examTypes[examTypeId].exams.push(exam.id);
            }
          }
        }
      }
      
      return examIndex;
    } catch (error) {
      console.error('Error creating exam index:', error);
      return {
        bySubject: {},
        byExamType: {},
        byYearLevel: {},
        paths: {}
      };
    }
  };
  
  export default {
    createExamIndex
  };