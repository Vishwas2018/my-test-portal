// src/data/examData.js
/**
 * Structured exam data organization
 * 
 * The structure follows:
 * 
 * examData = {
 *   [examType]: {                   // e.g., 'naplan', 'icas', 'icas_all_stars'
 *     metadata: {                   // Exam type metadata
 *       name: String,               // Display name
 *       description: String,        // Longer description
 *       icon: String,               // Emoji or icon class
 *     },
 *     subjects: {                   // All subjects for this exam type
 *       [subjectId]: {              // e.g., 'reading', 'mathematics'
 *         metadata: {               // Subject metadata
 *           name: String,           // Display name
 *           icon: String,           // Emoji or icon class
 *           description: String     // Description of the subject
 *         },
 *         exams: {                  // All exams for this subject
 *           [yearLevel]: [          // Array of exams for this year level
 *             {
 *               id: String,          // Unique ID for the exam
 *               title: String,       // Display title
 *               timeLimit: Number,   // Time limit in minutes
 *               questions: [         // Array of questions
 *                 {
 *                   id: String,                 // Unique question ID
 *                   type: String,               // Question type (multipleChoice, trueFalse, fillInBlank)
 *                   text: String,               // Question text
 *                   options: Array (optional),  // For multiple choice questions
 *                   correctAnswer: Any,         // Correct answer
 *                   explanation: String         // Explanation of the answer
 *                 }
 *               ]
 *             }
 *           ]
 *         }
 *       }
 *     }
 *   }
 * }
 */

import { EXAM } from '../utils/constants';

// Example of the new structure with a small subset of data
const examData = {
  naplan: {
    metadata: {
      name: 'NAPLAN',
      description: 'Australian National Assessment Program - Literacy and Numeracy',
      icon: '🏫'
    },
    subjects: {
      reading: {
        metadata: {
          name: 'Reading',
          icon: '📚',
          description: 'Reading comprehension and text analysis'
        },
        exams: {
          3: [ // Year 3
            {
              id: 'naplan-reading-year3-1',
              title: 'NAPLAN Reading - Year 3',
              timeLimit: 45,
              questions: [
                {
                  id: 'nr3-q1',
                  type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
                  text: 'Read the passage below and answer the question:\n\nMax walked to school every day. On Monday, he saw a small puppy following him. The puppy had no collar. Max picked up the puppy and carried it to school. His teacher called the animal shelter.\n\nWhy did Max pick up the puppy?',
                  options: [
                    { id: 'nr3-q1-a', text: 'Because he wanted a pet' },
                    { id: 'nr3-q1-b', text: 'Because the puppy had no collar' },
                    { id: 'nr3-q1-c', text: 'Because the puppy was injured' },
                    { id: 'nr3-q1-d', text: 'Because the puppy was hungry' }
                  ],
                  correctAnswer: 'nr3-q1-b',
                  explanation: 'The passage states \'The puppy had no collar.\' This suggests the puppy might be lost or a stray, which is why Max picked it up.'
                },
                {
                  id: 'nr3-q2',
                  type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
                  text: 'What happened after Max brought the puppy to school?',
                  options: [
                    { id: 'nr3-q2-a', text: 'The puppy ran away' },
                    { id: 'nr3-q2-b', text: 'Max took the puppy home' },
                    { id: 'nr3-q2-c', text: 'The teacher called the animal shelter' },
                    { id: 'nr3-q2-d', text: 'The puppy found its owner' }
                  ],
                  correctAnswer: 'nr3-q2-c',
                  explanation: 'The passage states \'His teacher called the animal shelter\' after Max brought the puppy to school.'
                }
                // Add more questions as needed
              ]
            }
          ],
          4: [ // Year 4
            {
              id: 'naplan-reading-year4-1',
              title: 'NAPLAN Reading - Year 4',
              timeLimit: 45,
              questions: [
                // Questions for Year 4 reading exam
              ]
            }
          ]
        }
      },
      numeracy: {
        metadata: {
          name: 'Numeracy',
          icon: '🔢',
          description: 'Mathematical and numerical skills'
        },
        exams: {
          3: [ // Year 3
            {
              id: 'naplan-numeracy-year3-1',
              title: 'NAPLAN Numeracy - Year 3',
              timeLimit: 45,
              questions: [
                {
                  id: 'nn3-q1',
                  type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
                  text: 'What is 25 + 37?',
                  options: [
                    { id: 'nn3-q1-a', text: '52' },
                    { id: 'nn3-q1-b', text: '62' },
                    { id: 'nn3-q1-c', text: '72' },
                    { id: 'nn3-q1-d', text: '42' }
                  ],
                  correctAnswer: 'nn3-q1-b',
                  explanation: '25 + 37 = (20 + 5) + (30 + 7) = (20 + 30) + (5 + 7) = 50 + 12 = 62'
                }
                // Add more questions as needed
              ]
            }
          ]
        }
      }
    }
  },
  icas: {
    metadata: {
      name: 'ICAS',
      description: 'International Competitions and Assessments for Schools',
      icon: '🎓'
    },
    subjects: {
      mathematics: {
        metadata: {
          name: 'Mathematics',
          icon: '🔢',
          description: 'Mathematical reasoning and problem-solving'
        },
        exams: {
          4: [ // Year 4
            {
              id: 'icas-mathematics-year4-1',
              title: 'ICAS Mathematics - Year 4',
              timeLimit: 45,
              questions: [
                {
                  id: 'im4-q1',
                  type: EXAM.QUESTION_TYPES.MULTIPLE_CHOICE,
                  text: 'Calculate: 37 × 5',
                  options: [
                    { id: 'im4-q1-a', text: '175' },
                    { id: 'im4-q1-b', text: '185' },
                    { id: 'im4-q1-c', text: '195' },
                    { id: 'im4-q1-d', text: '205' }
                  ],
                  correctAnswer: 'im4-q1-b',
                  explanation: '37 × 5 = (30 × 5) + (7 × 5) = 150 + 35 = 185'
                }
                // Add more questions as needed
              ]
            }
          ]
        }
      }
    }
  }
};

export default examData;