// src/utils/examUtils.js
import { EXAM, STORAGE_KEYS } from './constants';

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
    console.log(`Loading questions for: Subject: ${subjectId}, Type: ${examType}, Year: ${year}, Exam: ${examId}`);
    
    // If we have a specific examId and complete parameters
    if (examType && subjectId && year && examId) {
      // Check if this exam exists in our data structure
      if (
        examData[examType] && 
        examData[examType].subjects && 
        examData[examType].subjects[subjectId] && 
        examData[examType].subjects[subjectId].exams && 
        examData[examType].subjects[subjectId].exams[year]
      ) {
        // Try to find the exact exam
        const examsForYear = examData[examType].subjects[subjectId].exams[year];
        const exactExam = examsForYear.find(e => e.id === examId);
        
        if (exactExam && exactExam.questions) {
          return exactExam.questions;
        }
      }
    }
    
    // If we have type, year, and subject (but no specific exam ID)
    if (examType && year && subjectId) {
      if (
        examData[examType] && 
        examData[examType].subjects && 
        examData[examType].subjects[subjectId] && 
        examData[examType].subjects[subjectId].exams && 
        examData[examType].subjects[subjectId].exams[year] &&
        examData[examType].subjects[subjectId].exams[year].length > 0
      ) {
        // Return the first exam's questions for this combination
        return examData[examType].subjects[subjectId].exams[year][0].questions;
      }
    }
    
    // Fallback to default questions
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
  // Science sample questions
  if (subjectId === 'science') {
    return [
      {
        id: `${subjectId}1`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is a living thing?',
        options: [
          { id: 'a', text: 'Rock' },
          { id: 'b', text: 'Sun' },
          { id: 'c', text: 'Water' },
          { id: 'd', text: 'Tree' }
        ],
        correctAnswer: 'd',
        explanation: 'A tree is a living thing because it grows, reproduces, and responds to its environment.'
      },
      {
        id: `${subjectId}2`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'What is the function of roots in a plant?',
        options: [
          { id: 'a', text: 'To make food using sunlight' },
          { id: 'b', text: 'To absorb water and nutrients from soil' },
          { id: 'c', text: 'To produce flowers and fruits' },
          { id: 'd', text: 'To release oxygen into the air' }
        ],
        correctAnswer: 'b',
        explanation: 'Roots absorb water and nutrients from the soil, which are essential for the plant\'s growth and survival.'
      },
      {
        id: `${subjectId}3`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which state of matter takes the shape of its container but has a fixed volume?',
        options: [
          { id: 'a', text: 'Solid' },
          { id: 'b', text: 'Liquid' },
          { id: 'c', text: 'Gas' },
          { id: 'd', text: 'Plasma' }
        ],
        correctAnswer: 'b',
        explanation: 'Liquids have a fixed volume but take the shape of their container.'
      },
      {
        id: `${subjectId}4`,
        type: EXAM.QUESTION_TYPES.TRUE_FALSE,
        text: 'The moon produces its own light.',
        correctAnswer: false,
        explanation: 'The moon reflects light from the sun; it does not produce its own light.'
      },
      {
        id: `${subjectId}5`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these objects would sink in water?',
        options: [
          { id: 'a', text: 'A wooden block' },
          { id: 'b', text: 'A plastic bottle with the cap on' },
          { id: 'c', text: 'A metal coin' },
          { id: 'd', text: 'A rubber duck' }
        ],
        correctAnswer: 'c',
        explanation: 'A metal coin would sink in water because it has a higher density than water.'
      }
    ];
  }
  
  // Mathematics sample questions
  if (subjectId === 'mathematics') {
    return [
      {
        id: `${subjectId}1`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Calculate: 37 × 5',
        options: [
          { id: 'a', text: '175' },
          { id: 'b', text: '185' },
          { id: 'c', text: '195' },
          { id: 'd', text: '205' }
        ],
        correctAnswer: 'b',
        explanation: '37 × 5 = (30 × 5) + (7 × 5) = 150 + 35 = 185'
      },
      {
        id: `${subjectId}2`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'A rectangle has a length of 12 cm and a width of 7 cm. What is its perimeter?',
        options: [
          { id: 'a', text: '19 cm' },
          { id: 'b', text: '38 cm' },
          { id: 'c', text: '48 cm' },
          { id: 'd', text: '84 cm' }
        ],
        correctAnswer: 'b',
        explanation: 'Perimeter = 2 × (length + width) = 2 × (12 + 7) = 2 × 19 = 38 cm'
      },
      {
        id: `${subjectId}3`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'What is 25 + 37?',
        options: [
          { id: 'a', text: '52' },
          { id: 'b', text: '62' },
          { id: 'c', text: '72' },
          { id: 'd', text: '42' }
        ],
        correctAnswer: 'b',
        explanation: '25 + 37 = (20 + 5) + (30 + 7) = (20 + 30) + (5 + 7) = 50 + 12 = 62'
      },
      {
        id: `${subjectId}4`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Sarah had $45. She spent $18 on a book and $12 on lunch. How much money does she have left?',
        options: [
          { id: 'a', text: '$10' },
          { id: 'b', text: '$15' },
          { id: 'c', text: '$20' },
          { id: 'd', text: '$25' }
        ],
        correctAnswer: 'b',
        explanation: 'Sarah spent a total of $18 + $12 = $30. She had $45, so she has $45 - $30 = $15 left.'
      },
      {
        id: `${subjectId}5`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which number comes next in this pattern: 2, 4, 6, 8, __?',
        options: [
          { id: 'a', text: '9' },
          { id: 'b', text: '10' },
          { id: 'c', text: '12' },
          { id: 'd', text: '16' }
        ],
        correctAnswer: 'b',
        explanation: 'This is a pattern of counting by 2s (even numbers): 2, 4, 6, 8, 10.'
      }
    ];
  }
  
  // Digital technologies sample questions
  if (subjectId === 'digital') {
    return [
      {
        id: `${subjectId}1`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is an input device?',
        options: [
          { id: 'a', text: 'Printer' },
          { id: 'b', text: 'Monitor' },
          { id: 'c', text: 'Speaker' },
          { id: 'd', text: 'Keyboard' }
        ],
        correctAnswer: 'd',
        explanation: 'A keyboard is an input device because it allows users to input data into a computer.'
      },
      {
        id: `${subjectId}2`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'What does "URL" stand for?',
        options: [
          { id: 'a', text: 'Universal Resource Locator' },
          { id: 'b', text: 'Uniform Resource Locator' },
          { id: 'c', text: 'United Resource Link' },
          { id: 'd', text: 'Universal Reference Link' }
        ],
        correctAnswer: 'b',
        explanation: 'URL stands for Uniform Resource Locator, which is the address used to access websites on the internet.'
      },
      {
        id: `${subjectId}3`,
        type: EXAM.QUESTION_TYPES.TRUE_FALSE,
        text: 'Saving a file means storing it permanently on a computer.',
        correctAnswer: true,
        explanation: 'Saving a file means storing it on a storage device (like a hard drive) so it can be accessed later, even after the computer is turned off.'
      },
      {
        id: `${subjectId}4`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'Which of these is NOT a way to stay safe online?',
        options: [
          { id: 'a', text: 'Use strong passwords' },
          { id: 'b', text: 'Share personal information with everyone' },
          { id: 'c', text: 'Only visit trusted websites' },
          { id: 'd', text: 'Ask an adult before downloading files' }
        ],
        correctAnswer: 'b',
        explanation: 'Sharing personal information with everyone online is not safe. Personal information should be kept private to protect your identity and safety.'
      },
      {
        id: `${subjectId}5`,
        type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
        text: 'What is an algorithm?',
        options: [
          { id: 'a', text: 'A type of computer virus' },
          { id: 'b', text: 'A set of step-by-step instructions to complete a task' },
          { id: 'c', text: 'A special type of keyboard' },
          { id: 'd', text: 'A computer game' }
        ],
        correctAnswer: 'b',
        explanation: 'An algorithm is a set of step-by-step instructions designed to perform a specific task or solve a problem.'
      }
    ];
  }
  
  // Default generic questions
  return [
    {
      id: `${subjectId}1`,
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
      id: `${subjectId}2`,
      type: EXAM.QUESTION_TYPES.TRUE_FALSE,
      text: 'The Earth revolves around the Sun.',
      correctAnswer: true,
      explanation: 'The Earth revolves around the Sun in an elliptical orbit.'
    },
    {
      id: `${subjectId}3`,
      type: EXAM.QUESTION_TYPES.FILL_IN_BLANK,
      text: 'The largest planet in our solar system is ________.',
      correctAnswer: 'Jupiter',
      explanation: 'Jupiter is the largest planet in our solar system.'
    },
    {
      id: `${subjectId}4`,
      type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
      text: 'Which of these is not a programming language?',
      options: [
        { id: 'a', text: 'Python' },
        { id: 'b', text: 'Java' },
        { id: 'c', text: 'WebFlow' },
        { id: 'd', text: 'Ruby' }
      ],
      correctAnswer: 'c',
      explanation: 'WebFlow is a web design tool, not a programming language.'
    },
    {
      id: `${subjectId}5`,
      type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
      text: 'Which gas do plants absorb from the atmosphere?',
      options: [
        { id: 'a', text: 'Oxygen' },
        { id: 'b', text: 'Carbon Dioxide' },
        { id: 'c', text: 'Nitrogen' },
        { id: 'd', text: 'Hydrogen' }
      ],
      correctAnswer: 'b',
      explanation: 'Plants absorb carbon dioxide from the atmosphere during photosynthesis.'
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
    if (examType && examData[examType]) {
      // Extract subjects from our new data structure
      const examTypeData = examData[examType];
      const subjects = Object.keys(examTypeData.subjects).map(subjectId => {
        const subjectData = examTypeData.subjects[subjectId];
        const metadata = subjectData.metadata;
        
        // Find the first exam to get question count and time limit
        let questionCount = 0;
        let timeLimit = EXAM.DEFAULT_TIME_LIMIT;
        
        // Loop through all year levels to find at least one exam
        const yearLevels = Object.keys(subjectData.exams);
        if (yearLevels.length > 0) {
          const firstYearExams = subjectData.exams[yearLevels[0]];
          if (firstYearExams && firstYearExams.length > 0) {
            const firstExam = firstYearExams[0];
            questionCount = firstExam.questions ? firstExam.questions.length : 0;
            timeLimit = firstExam.timeLimit || EXAM.DEFAULT_TIME_LIMIT;
          }
        }
        
        return {
          id: subjectId,
          name: metadata.name,
          icon: metadata.icon,
          questionCount,
          timeLimit,
          description: metadata.description
        };
      });
      
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
    if (!examType || !subjectId || !year) {
      return [];
    }
    
    // Check if this combination exists in our data structure
    if (
      examData[examType] && 
      examData[examType].subjects && 
      examData[examType].subjects[subjectId] && 
      examData[examType].subjects[subjectId].exams && 
      examData[examType].subjects[subjectId].exams[year]
    ) {
      // Map the exams to the required format
      return examData[examType].subjects[subjectId].exams[year].map(exam => ({
        id: exam.id,
        name: exam.title,
        grade: parseInt(year, 10),
        type: examType,
        subject: subjectId,
        questionCount: exam.questions ? exam.questions.length : 0,
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
 * Save exam result to localStorage
 * @param {Object} result - The exam result to save
 */
export const saveExamResult = (result) => {
  try {
    // Add date to result if not present
    const resultWithDate = {
      ...result,
      date: result.date || new Date().toISOString()
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