// src/data/defaultQuestionBank.js
import { EXAM } from '../utils/constants';

const defaultQuestionBank = {
  science: [
    {
      id: 'science1',
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
      id: 'science2',
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
      id: 'science3',
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
      id: 'science4',
      type: EXAM.QUESTION_TYPES.TRUE_FALSE,
      text: 'The moon produces its own light.',
      correctAnswer: false,
      explanation: 'The moon reflects light from the sun; it does not produce its own light.'
    },
    {
      id: 'science5',
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
  ],
  
  mathematics: [
    {
      id: 'math1',
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
      id: 'math2',
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
      id: 'math3',
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
    }
  ],
  
  digital: [
    {
      id: 'digital1',
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
      id: 'digital2',
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
      id: 'digital3',
      type: EXAM.QUESTION_TYPES.TRUE_FALSE,
      text: 'Saving a file means storing it permanently on a computer.',
      correctAnswer: true,
      explanation: 'Saving a file means storing it on a storage device (like a hard drive) so it can be accessed later, even after the computer is turned off.'
    }
  ],
  
  english: [
    {
      id: 'english1',
      type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
      text: 'Which of these is a synonym for "happy"?',
      options: [
        { id: 'a', text: 'Sad' },
        { id: 'b', text: 'Angry' },
        { id: 'c', text: 'Joyful' },
        { id: 'd', text: 'Tired' }
      ],
      correctAnswer: 'c',
      explanation: '"Joyful" is a synonym for "happy" as both words describe a feeling of pleasure or contentment.'
    },
    {
      id: 'english2',
      type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
      text: 'Which sentence uses correct punctuation?',
      options: [
        { id: 'a', text: 'She went to the store she bought apples.' },
        { id: 'b', text: 'She went to the store, she bought apples.' },
        { id: 'c', text: 'She went to the store; she bought apples.' },
        { id: 'd', text: 'She went to the store. She bought apples.' }
      ],
      correctAnswer: 'd',
      explanation: 'Option D correctly uses a period to separate two complete sentences.'
    },
    {
      id: 'english3',
      type: EXAM.QUESTION_TYPES.FILL_IN_BLANK,
      text: 'The opposite of "hot" is ________.',
      correctAnswer: 'cold',
      explanation: '"Cold" is the antonym (opposite) of "hot".'
    }
  ]
};

export default defaultQuestionBank;