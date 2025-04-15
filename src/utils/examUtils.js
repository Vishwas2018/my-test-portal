// src/utils/examUtils.js

/**
 * Get questions for a subject
 * @param {string} subjectId - The subject ID
 * @returns {Array} Array of questions
 */
export const getQuestions = (subjectId) => {
    // For a real app, this would fetch from an API or database
    // For now, we'll return some sample questions
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
      }
    ];
  };
  
  /**
   * Get exam subjects
   * @returns {Array} Array of subjects
   */
  export const getSubjects = () => {
    return [
      {
        id: 'math',
        name: 'Mathematics',
        questionCount: 20,
        timeLimit: 30,
        icon: '🧮'
      },
      {
        id: 'science',
        name: 'Science',
        questionCount: 25,
        timeLimit: 40,
        icon: '🔬'
      },
      {
        id: 'english',
        name: 'English',
        questionCount: 30,
        timeLimit: 45,
        icon: '📚'
      },
      {
        id: 'coding',
        name: 'Coding',
        questionCount: 15,
        timeLimit: 30,
        icon: '💻'
      }
    ];
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
      const existingResultsStr = localStorage.getItem('exam_results');
      const existingResults = existingResultsStr ? JSON.parse(existingResultsStr) : [];
      
      // Add new result
      const updatedResults = [resultWithDate, ...existingResults];
      
      // Save back to localStorage
      localStorage.setItem('exam_results', JSON.stringify(updatedResults));
      
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
      const resultsStr = localStorage.getItem('exam_results');
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
      const streakDataStr = localStorage.getItem('streak_data');
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
      localStorage.setItem('streak_data', JSON.stringify(streakData));
      
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