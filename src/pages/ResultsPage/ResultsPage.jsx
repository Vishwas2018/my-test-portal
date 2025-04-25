// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { formatTime, getExamResults, getQuestions, getSubjects } from '../../utils/examUtils';
import { useNavigate, useParams } from 'react-router-dom';

import ConfettiEffect from '../../components/ExamInterface/ConfettiEffect/ConfettiEffect';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const ResultsCard = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ResultsHeader = styled.div`
  background: var(--gradient-primary);
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const SubjectIcon = styled.div`
  font-size: 3rem;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ResultsTitle = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const ResultsDate = styled.p`
  opacity: 0.8;
  font-size: 0.9rem;
`;

const ResultsBody = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.$bgColor || 'var(--light-gray)'};
  color: ${props => props.$textColor || 'var(--dark)'};
  padding: 1.5rem;
  border-radius: var(--radius-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary)' : 'var(--dark-gray)'};
  font-weight: ${props => props.$active ? '700' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.$active ? props.$activeColor || 'var(--primary)' : 'var(--light-gray)'};
  color: ${props => props.$active ? 'white' : 'var(--dark)'};
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuestionCard = styled.div`
  background-color: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border-left: 5px solid ${props => {
    if (props.status === 'correct') return 'var(--accent)';
    if (props.status === 'incorrect') return 'var(--error)';
    return 'var(--secondary)';
  }};
`;

const QuestionHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--light-gray);
  cursor: pointer;
`;

const QuestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const QuestionNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  background-color: ${props => {
    if (props.status === 'correct') return 'var(--accent)';
    if (props.status === 'incorrect') return 'var(--error)';
    return 'var(--secondary)';
  }};
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.status === 'correct') return 'rgba(126, 217, 87, 0.2)';
    if (props.status === 'incorrect') return 'rgba(255, 87, 34, 0.2)';
    return 'rgba(255, 193, 7, 0.2)';
  }};
  color: ${props => {
    if (props.status === 'correct') return 'var(--accent-dark)';
    if (props.status === 'incorrect') return 'var(--error)';
    return 'var(--secondary-dark)';
  }};
`;

const QuestionBody = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.$bgColor || 'white'};
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const QuestionText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
`;

const AnswerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnswerCard = styled.div`
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: ${props => props.$bgColor || 'var(--light-gray)'};
  border: 1px solid ${props => props.$borderColor || 'transparent'};
`;

const AnswerLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--dark-gray)'};
`;

const AnswerText = styled.div`
  font-size: 1.1rem;
  color: ${props => props.color || 'var(--dark)'};
  font-weight: ${props => props.$bold ? '600' : '400'};
`;

const ExplanationCard = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background-color: rgba(110, 207, 255, 0.1);
  border-left: 3px solid var(--primary);
`;

const ExplanationText = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--dark);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.$primary ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$primary ? 'white' : 'var(--primary)'};
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--light-gray);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
`;

const ErrorText = styled.p`
  color: var(--error);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const ResultsPage = () => {
  const { subjectId, timestamp } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [openQuestions, setOpenQuestions] = useState({});
  
  useEffect(() => {
    const loadResult = () => {
      try {
        setLoading(true);
        
        // Get all results
        const results = getExamResults();
        
        // Find the specific result based on timestamp and subject
        const targetResult = results.find(r => {
          const resultDate = new Date(r.date).getTime();
          const targetDate = parseInt(timestamp, 10);
          
          // Allow for some time difference (within 5 minutes)
          const timeWindow = 5 * 60 * 1000; // 5 minutes in milliseconds
          
          return r.subject === subjectId && 
                 Math.abs(resultDate - targetDate) < timeWindow;
        });
        
        if (targetResult) {
          setResult(targetResult);
          
          // Load questions for this subject
          const subjectQuestions = getQuestions(
            subjectId, 
            targetResult.examType, 
            targetResult.year, 
            targetResult.examId
          );
          setQuestions(subjectQuestions);
          
          // Show confetti for scores above 80%
          if (targetResult.score >= 80) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        } else {
          setError('Result not found');
        }
      } catch (err) {
        console.error('Error loading result:', err);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    
    loadResult();
  }, [subjectId, timestamp]);
  
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  const handleFilterChange = (type) => {
    setFilterType(type);
  };
  
  const toggleQuestionOpen = (questionIndex) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };
  
  const filteredQuestions = () => {
    if (!questions || !result || !result.answers) return [];
    
    return questions.filter((question, index) => {
      const userAnswer = result.answers[index];
      const isCorrect = checkIfAnswerIsCorrect(question, userAnswer);
      const isAnswered = userAnswer !== undefined;
      
      switch (filterType) {
        case 'correct':
          return isAnswered && isCorrect;
        case 'incorrect':
          return isAnswered && !isCorrect;
        case 'unanswered':
          return !isAnswered;
        default:
          return true;
      }
    });
  };
  
  const checkIfAnswerIsCorrect = (question, answer) => {
    if (!question || answer === undefined) return false;
    
    if (question.type === 'trueFalse') {
      return (answer === 'true' && question.correctAnswer === true) ||
             (answer === 'false' && question.correctAnswer === false);
    } else {
      return answer === question.correctAnswer;
    }
  };
  
  const getAnswerDisplay = (question, userAnswer) => {
    if (userAnswer === undefined) {
      return "Not answered";
    }
    
    if (question.type === 'multipleChoice') {
      const option = question.options.find(opt => opt.id === userAnswer);
      return option ? option.text : userAnswer;
    } else if (question.type === 'trueFalse') {
      return userAnswer === 'true' ? 'True' : 'False';
    } else {
      return userAnswer;
    }
  };
  
  const getCorrectAnswerDisplay = (question) => {
    if (question.type === 'multipleChoice') {
      const option = question.options.find(opt => opt.id === question.correctAnswer);
      return option ? option.text : question.correctAnswer;
    } else if (question.type === 'trueFalse') {
      return question.correctAnswer ? 'True' : 'False';
    } else {
      return question.correctAnswer;
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <h3>Loading results...</h3>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  if (error || !result) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorText>{error || 'Result not found'}</ErrorText>
          <Button onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  const subjects = getSubjects();
  const subject = subjects.find(s => s.id === result.subject);
  const answeredQuestions = Object.keys(result.answers || {}).length;
  
  return (
    <PageContainer>
      {showConfetti && <ConfettiEffect />}
      
      <ResultsCard>
        <ResultsHeader>
          <SubjectIcon>{subject?.icon || '📝'}</SubjectIcon>
          <HeaderContent>
            <ResultsTitle>Exam Results: {subject?.name || result.subjectName}</ResultsTitle>
            <ResultsDate>
              Completed on {new Date(result.date).toLocaleDateString()} at {new Date(result.date).toLocaleTimeString()}
            </ResultsDate>
          </HeaderContent>
        </ResultsHeader>
        
        <ResultsBody>
          <StatsGrid>
            <StatCard 
              $bgColor={result.score >= 80 ? 'rgba(126, 217, 87, 0.15)' : 
                       result.score >= 60 ? 'rgba(255, 193, 7, 0.15)' : 
                       'rgba(255, 87, 34, 0.15)'}
              $textColor={result.score >= 80 ? 'var(--accent-dark)' : 
                         result.score >= 60 ? 'var(--secondary-dark)' : 
                         'var(--error)'}
            >
              <StatValue>{result.score}%</StatValue>
              <StatLabel>Overall Score</StatLabel>
            </StatCard>
            
            <StatCard $bgColor="rgba(110, 207, 255, 0.15)" $textColor="var(--primary-dark)">
              <StatValue>{result.correctCount}/{result.totalQuestions}</StatValue>
              <StatLabel>Correct Answers</StatLabel>
            </StatCard>
            
            <StatCard $bgColor="rgba(179, 157, 219, 0.15)" $textColor="#7E57C2">
              <StatValue>{formatTime(result.timeTaken)}</StatValue>
              <StatLabel>Time Taken</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <TabsContainer>
            <Tab 
              $active={activeTab === 0} 
              onClick={() => handleTabChange(0)}
            >
              Results Summary
            </Tab>
            <Tab 
              $active={activeTab === 1} 
              onClick={() => handleTabChange(1)}
            >
              Review Questions
            </Tab>
          </TabsContainer>
          
          {activeTab === 0 ? (
            <>
              <h3>Performance Summary</h3>
              <p>You attempted {answeredQuestions} out of {result.totalQuestions} questions ({Math.round((answeredQuestions / result.totalQuestions) * 100)}%).</p>
              
              <p>
                Your accuracy rate was {(result.correctCount / (answeredQuestions || 1) * 100).toFixed(1)}% 
                for attempted questions.
              </p>
              
              <p>
                {result.score >= 80 ? 'Excellent work! You\'ve demonstrated a strong understanding of the material.' : 
                 result.score >= 60 ? 'Good job! You\'re on the right track, but there\'s room for improvement.' :
                 'Keep practicing! With continued effort, you\'ll see improvement.'}
              </p>
              
              <ButtonContainer>
                <Button onClick={() => navigate('/')}>
                  Back to Dashboard
                </Button>
                
                <Button $primary onClick={() => handleTabChange(1)}>
                  Review Questions
                </Button>
              </ButtonContainer>
            </>
          ) : (
            <>
              <FilterContainer>
                <FilterButton 
                  $active={filterType === 'all'}
                  onClick={() => handleFilterChange('all')}
                >
                  All Questions
                </FilterButton>
                <FilterButton 
                  $active={filterType === 'correct'}
                  $activeColor="var(--accent)"
                  onClick={() => handleFilterChange('correct')}
                >
                  Correct
                </FilterButton>
                <FilterButton 
                  $active={filterType === 'incorrect'}
                  $activeColor="var(--error)"
                  onClick={() => handleFilterChange('incorrect')}
                >
                  Incorrect
                </FilterButton>
                <FilterButton 
                  $active={filterType === 'unanswered'}
                  $activeColor="var(--secondary)"
                  onClick={() => handleFilterChange('unanswered')}
                >
                  Unanswered
                </FilterButton>
              </FilterContainer>
              
              {filteredQuestions().length === 0 ? (
                <p>No questions match the selected filter.</p>
              ) : (
                <QuestionsList>
                  {filteredQuestions().map((question, index) => {
                    const questionIndex = questions.indexOf(question);
                    const userAnswer = result.answers[questionIndex];
                    const isAnswered = userAnswer !== undefined;
                    const isCorrect = checkIfAnswerIsCorrect(question, userAnswer);
                    const isOpen = openQuestions[questionIndex] || false;
                    
                    let status = 'unanswered';
                    if (isAnswered) {
                      status = isCorrect ? 'correct' : 'incorrect';
                    }
                    
                    return (
                      <QuestionCard key={question.id} status={status}>
                        <QuestionHeader onClick={() => toggleQuestionOpen(questionIndex)}>
                          <QuestionTitle>
                            <QuestionNumber status={status}>
                              {questionIndex + 1}
                            </QuestionNumber>
                            {question.text.length > 60 
                              ? `${question.text.substring(0, 60)}...` 
                              : question.text}
                          </QuestionTitle>
                          
                          <StatusBadge status={status}>
                            {status === 'correct' ? 'Correct' : 
                             status === 'incorrect' ? 'Incorrect' : 
                             'Unanswered'}
                          </StatusBadge>
                        </QuestionHeader>
                        
                        <QuestionBody $isOpen={isOpen}>
                          <QuestionText>{question.text}</QuestionText>
                          
                          {question.type === 'multipleChoice' && (
                            <div>
                              <div>Options:</div>
                              <ul style={{ marginTop: '0.5rem' }}>
                                {question.options.map(option => (
                                  <li 
                                    key={option.id} 
                                    style={{ 
                                      padding: '0.5rem',
                                      backgroundColor: option.id === question.correctAnswer 
                                        ? 'rgba(126, 217, 87, 0.15)' 
                                        : (option.id === userAnswer && option.id !== question.correctAnswer)
                                          ? 'rgba(255, 87, 34, 0.15)'
                                          : 'transparent',
                                      borderRadius: 'var(--radius-sm)',
                                      marginBottom: '0.5rem'
                                    }}
                                  >
                                    {option.text}
                                    {option.id === question.correctAnswer && (
                                      <span style={{ marginLeft: '0.5rem', color: 'var(--accent)', fontWeight: 'bold' }}>
                                        ✓ Correct
                                      </span>
                                    )}
                                    {option.id === userAnswer && option.id !== question.correctAnswer && (
                                      <span style={{ marginLeft: '0.5rem', color: 'var(--error)', fontWeight: 'bold' }}>
                                        ✗ Your Answer
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <AnswerGrid>
                            <AnswerCard 
                              $bgColor={
                                isAnswered 
                                  ? (isCorrect ? 'rgba(126, 217, 87, 0.15)' : 'rgba(255, 87, 34, 0.15)') 
                                  : 'rgba(255, 193, 7, 0.15)'
                              }
                              $borderColor={
                                isAnswered 
                                  ? (isCorrect ? 'var(--accent)' : 'var(--error)') 
                                  : 'var(--secondary)'
                              }
                            >
                              <AnswerLabel color={
                                isAnswered 
                                  ? (isCorrect ? 'var(--accent-dark)' : 'var(--error)') 
                                  : 'var(--secondary-dark)'
                              }>
                                Your Answer
                              </AnswerLabel>
                              <AnswerText color={
                                isAnswered 
                                  ? (isCorrect ? 'var(--accent-dark)' : 'var(--error)') 
                                  : 'var(--secondary-dark)'
                              } $bold>
                                {getAnswerDisplay(question, userAnswer)}
                              </AnswerText>
                            </AnswerCard>
                            
                            <AnswerCard
                              $bgColor="rgba(126, 217, 87, 0.15)"
                              $borderColor="var(--accent)"
                            >
                              <AnswerLabel color="var(--accent-dark)">
                                Correct Answer
                              </AnswerLabel>
                              <AnswerText color="var(--accent-dark)" $bold>
                                {getCorrectAnswerDisplay(question)}
                              </AnswerText>
                            </AnswerCard>
                          </AnswerGrid>
                          
                          {question.explanation && (
                            <ExplanationCard>
                              <AnswerLabel color="var(--primary-dark)">
                                Explanation
                              </AnswerLabel>
                              <ExplanationText>
                                {question.explanation}
                              </ExplanationText>
                            </ExplanationCard>
                          )}
                        </QuestionBody>
                      </QuestionCard>
                    );
                  })}
                </QuestionsList>
              )}
              
              <ButtonContainer>
                <Button onClick={() => handleTabChange(0)}>
                  Back to Summary
                </Button>
                
                <Button $primary onClick={() => navigate(`/exam/${result.subject}`)}>
                  Try Again
                </Button>
              </ButtonContainer>
            </>
          )}
        </ResultsBody>
      </ResultsCard>
    </PageContainer>
  );
};

export default ResultsPage;