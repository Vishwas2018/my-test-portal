import './ExamSelection.css';

import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAvailableExams, getSubjects } from '../../utils/examUtils';

import { Button } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

const ExamSelection = ({ isSampleTest = false }) => {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  
  // Handle navigation from URL parameters for sample tests
  useEffect(() => {
    if (isSampleTest && params.examType) {
      setSelectedExamType(params.examType);
      
      if (params.grade) {
        const gradeNum = parseInt(params.grade.replace('year-', ''));
        setSelectedGrade(gradeNum);
        
        // Load subjects for this exam type
        const subjectsList = getSubjects(params.examType);
        setSubjects(subjectsList);
        
        if (params.subject) {
          setSelectedSubject(params.subject);
          
          // Generate or get available sample exams
          const exams = getAvailableExams(params.examType, params.subject, gradeNum);
          
          // For sample test, show only the first exam
          const sampleExam = {
            id: `sample-${params.examType}-${gradeNum}-${params.subject}-1`,
            name: `Sample Exam`,
            grade: gradeNum,
            type: params.examType,
            subject: params.subject
          };
          
          setAvailableExams(exams.length > 0 ? [exams[0]] : [sampleExam]);
        }
      }
    }
  }, [isSampleTest, params.examType, params.grade, params.subject]);

  // Define exam types
  const examTypes = [
    { 
      id: 'naplan', 
      name: 'NAPLAN',
      description: 'Australian National Assessment Program',
      icon: '🏫'
    },
    { 
      id: 'icas', 
      name: 'ICAS',
      description: 'International Competitions and Assessments for Schools',
      icon: '🎓'
    },
    { 
      id: 'icas_all_stars', 
      name: 'ICAS All Stars',
      description: 'Advanced ICAS with comprehensive topics',
      icon: '⭐'
    }
  ];

  // Define grades
  const grades = [2, 3, 4, 5, 6];
  
  // Handle exam type selection
  const handleExamTypeSelect = (examTypeId) => {
    setSelectedExamType(examTypeId);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setAvailableExams([]);
    
    // Load subjects for this exam type
    const subjectsList = getSubjects(examTypeId);
    setSubjects(subjectsList);
  };

  // Handle grade selection
  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setAvailableExams([]);
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    
    // Get available exams for this subject, exam type, and year
    const exams = getAvailableExams(selectedExamType, subjectId, selectedGrade);
    setAvailableExams(exams);
  };

  // Handle exam selection
  const handleExamSelect = (examId) => {
    // Create the URL with query parameters for exam type and grade
    const url = `/exam/${selectedSubject}?type=${selectedExamType}&year=${selectedGrade}&examId=${examId}`;
    navigate(url);
  };

  // Render initial exam type selection screen
  if (!selectedExamType) {
    return (
      <div className="exam-selection">
        <div className="exam-selection-container">
          <div className="exam-selection-header">
            <h1 className="title">Select an Exam Type</h1>
            <p className="subtitle">
              <strong>Give your child the best chance of success</strong><br />
              Choose an exam type to begin exploring available practice tests
            </p>
          </div>
          
          <div className="exam-types-grid">
            {examTypes.map(examType => (
              <div 
                key={examType.id}
                className="exam-type-card"
                onClick={() => handleExamTypeSelect(examType.id)}
              >
                <div className="exam-type-icon">
                  {examType.icon}
                </div>
                <h3>{examType.name}</h3>
                <p>{examType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // After selecting exam type, show options for free samples vs full exams
  if (selectedExamType && !selectedGrade) {
    return (
      <div className="exam-selection">
        <div className="exam-selection-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedExamType(null)}
              className="back-button"
            >
              ← Back to Exam Types
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name}
            </span>
          </div>
          
          <div className="exam-options-container">
            {/* Sample Tests Section */}
            <div className="exam-option-card">
              <h2>Free Sample Tests</h2>
              <p>Try our sample tests to get familiar with the exam format. No account required.</p>
              <div className="year-buttons">
                {grades.map(grade => (
                  <Button 
                    key={grade}
                    variant="primary" 
                    size="medium"
                    onClick={() => navigate(`/sample-test/${selectedExamType}/year-${grade}`)}
                  >
                    Year {grade}
                  </Button>
                ))}
              </div>
              <div className="sample-badges">
                <span className="badge">Free</span>
                <span className="badge">No Registration Required</span>
              </div>
            </div>
            
            {/* Full Exams Section - requires login */}
            <div className="exam-option-card">
              <h2>Full Practice Exams</h2>
              <p>Access our complete collection of practice exams with detailed results and progress tracking.</p>
              <div className="year-buttons">
                {isAuthenticated ? (
                  grades.map(grade => (
                    <Button 
                      key={grade}
                      variant="secondary" 
                      size="medium"
                      onClick={() => handleGradeSelect(grade)}
                    >
                      Year {grade}
                    </Button>
                  ))
                ) : (
                  <div className="login-required">
                    <p>You need to be logged in to access full practice exams</p>
                    <div className="login-buttons">
                      <Button 
                        variant="primary" 
                        size="medium"
                        onClick={() => navigate('/login')}
                      >
                        Log In
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="medium"
                        onClick={() => navigate('/signup')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="premium-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Detailed Analytics</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Progress Tracking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Personalized Feedback</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a grade has been selected, show the subjects
  if (selectedExamType && selectedGrade && !selectedSubject) {
    return (
      <div className="exam-selection">
        <div className="exam-selection-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedGrade(null)}
              className="back-button"
            >
              ← Back to Options
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
              Year {selectedGrade} &gt; 
              {isSampleTest ? 'Sample Test' : 'Full Practice Exams'}
            </span>
          </div>
          
          <h2 className="section-title">Select Subject</h2>
          <div className="exams-grid">
            {subjects.map(subject => (
              <div 
                key={subject.id}
                className="exam-card"
                onClick={() => isSampleTest 
                  ? navigate(`/sample-test/${selectedExamType}/year-${selectedGrade}/${subject.id}`)
                  : handleSubjectSelect(subject.id)
                }
              >
                <div className="exam-card-content">
                  <div className="exam-card-header">
                    <span className="subject-icon">{subject.icon}</span>
                    <h3>{subject.name}</h3>
                  </div>
                  <p>
                    {subject.questionCount} question{subject.questionCount !== 1 ? 's' : ''}<br />
                    {subject.timeLimit} minutes
                  </p>
                  {isSampleTest && <div className="free-badge">Free Sample</div>}
                </div>
                <Button variant="primary" size="small">
                  {isSampleTest ? 'Select Sample Test' : 'Select'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If a subject has been selected, show available exams
  if (selectedExamType && selectedGrade && selectedSubject) {
    return (
      <div className="exam-selection">
        <div className="exam-selection-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedSubject(null)}
              className="back-button"
            >
              ← Back to Subjects
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
              Year {selectedGrade} &gt; 
              {subjects.find(sub => sub.id === selectedSubject)?.name}
            </span>
          </div>
          
          <h2 className="section-title">
            {isSampleTest ? 'Sample Test' : 'Available Exams'}
          </h2>
          <div className="exams-grid">
            {availableExams.length > 0 ? (
              availableExams.map(exam => (
                <div 
                  key={exam.id}
                  className="exam-card"
                  onClick={() => handleExamSelect(exam.id)}
                >
                  <div className="exam-card-content">
                    <h3>{isSampleTest ? 'Sample Test' : exam.name}</h3>
                    <p>
                      {examTypes.find(type => type.id === exam.type)?.name} - Year {exam.grade}<br />
                      {subjects.find(s => s.id === selectedSubject)?.name}<br />
                      {subjects.find(s => s.id === selectedSubject)?.questionCount} question{subjects.find(s => s.id === selectedSubject)?.questionCount !== 1 ? 's' : ''}<br />
                      {subjects.find(s => s.id === selectedSubject)?.timeLimit} minutes
                    </p>
                    {isSampleTest && <div className="free-badge">Free Sample</div>}
                  </div>
                  <Button variant="primary" size="small">
                    {isSampleTest ? 'Start Sample Test' : 'Start Exam'}
                  </Button>
                </div>
              ))
            ) : (
              <div className="no-exams-message">
                <p>No exams available for this selection. Please try another subject or year level.</p>
              </div>
            )}
          </div>
          
          {isSampleTest && (
            <div className="subscription-info">
              <p>Want full access to all exams? <Link to="/pricing">View our subscription plans</Link> or <Link to="/login">login</Link> to your account.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ExamSelection;