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
    
    // For sample exams with just a subject ID (no exam type)
    if (subjectId && !examType) {
      // Check if subject exists in any exam type
      for (const type in examsData) {
        if (examsData[type][subjectId]) {
          // Find the first available questions for this subject
          const firstExam = examsData[type][subjectId][0];
          if (firstExam && firstExam.questions) {
            // Limit to 5 questions for sample exams
            return firstExam.questions.slice(0, 5);
          }
        }
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
  // For science samples
  if (subjectId === 'science') {
    return [
      {
        id: `${subjectId}1`,
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'trueFalse',
        text: 'The moon produces its own light.',
        correctAnswer: false,
        explanation: 'The moon reflects light from the sun; it does not produce its own light.'
      },
      {
        id: `${subjectId}5`,
        type: 'multipleChoice',
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
  
  // For mathematics samples
  if (subjectId === 'mathematics') {
    return [
      {
        id: `${subjectId}1`,
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
  
  // For digital technology samples
  if (subjectId === 'digital') {
    return [
      {
        id: `${subjectId}1`,
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
        type: 'trueFalse',
        text: 'Saving a file means storing it permanently on a computer.',
        correctAnswer: true,
        explanation: 'Saving a file means storing it on a storage device (like a hard drive) so it can be accessed later, even after the computer is turned off.'
      },
      {
        id: `${subjectId}4`,
        type: 'multipleChoice',
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
        type: 'multipleChoice',
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
  
  // Generic default questions
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
    },
    {
      id: `${subjectId}5`,
      type: 'multipleChoice',
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
    
    // Default subjects for sample exams
    return [
      {
        id: 'science',
        name: 'Science',
        questionCount: 5,
        timeLimit: 0, // No time limit
        icon: '🧪'
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        questionCount: 5,
        timeLimit: 0, // No time limit
        icon: '🔢'
      },
      {
        id: 'digital',
        name: 'Digital Technologies',
        questionCount: 5,
        timeLimit: 0, // No time limit
        icon: '💻'
      },
      {
        id: 'english',
        name: 'English',
        questionCount: 5,
        timeLimit: 0, // No time limit
        icon: '📚'
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