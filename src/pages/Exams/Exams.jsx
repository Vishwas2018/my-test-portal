// src/pages/Exams/Exams.jsx
import './Exams.css';

import React, { useCallback, useEffect, useState } from 'react';
import { getAvailableExams, getSubjects } from '../../utils/examUtils';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

const Exams = () => {
  // Core state
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // 'sampleTests' or 'fullExams'
  const [availableExams, setAvailableExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // Auth and navigation
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const examType = params.get('type');
    const grade = params.get('year');
    
    if (examType) {
      handleExamTypeSelect(examType);
      
      if (grade) {
        handleGradeSelect(Number(grade));
      }
    }
  }, [location]);
  
  // Define exam types
  const examTypes = [
    { 
      id: 'naplan', 
      name: 'NAPLAN',
      description: 'Australian National Assessment Program - preparing students for literacy and numeracy testing',
      icon: '🏫'
    },
    { 
      id: 'icas', 
      name: 'ICAS',
      description: 'International Competitions and Assessments for Schools - comprehensive assessment for high achievers',
      icon: '🎓'
    },
    { 
      id: 'icas_all_stars', 
      name: 'ICAS All Stars',
      description: 'Advanced ICAS with comprehensive topics - challenging content for talented students',
      icon: '⭐'
    }
  ];

  // Define grades
  const grades = [2, 3, 4, 5, 6, 7, 8, 9];
  
  // Handle exam type selection
  const handleExamTypeSelect = useCallback((examTypeId) => {
    setSelectedExamType(examTypeId);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedSection(null);
    setAvailableExams([]);
    
    // Load subjects for this exam type
    const subjectsList = getSubjects(examTypeId);
    setSubjects(subjectsList);
  }, []);

  // Handle grade selection
  const handleGradeSelect = useCallback((grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setAvailableExams([]);
  }, []);
  
  // Handle section selection (sample tests or full exams)
  const handleSectionSelect = useCallback((section) => {
    setSelectedSection(section);
    setSelectedSubject(null);
    setAvailableExams([]);
  }, []);

  // Handle subject selection
  const handleSubjectSelect = useCallback((subjectId) => {
    setSelectedSubject(subjectId);
    
    // Get available exams based on selection
    if (selectedSection === 'fullExams') {
      const exams = getAvailableExams(selectedExamType, subjectId, selectedGrade);
      setAvailableExams(exams);
    } else {
      // For sample tests, we'd use a different method or hardcoded sample tests
      setAvailableExams([
        { id: `sample_${subjectId}_1`, name: 'Sample Test 1', type: selectedExamType, grade: 'All' },
        { id: `sample_${subjectId}_2`, name: 'Sample Test 2', type: selectedExamType, grade: 'All' }
      ]);
    }
  }, [selectedExamType, selectedGrade, selectedSection]);

  // Handle exam selection
  const handleExamSelect = useCallback((examId) => {
    // Create the URL with query parameters for exam type and grade
    const url = `/exam/${selectedSubject}?type=${selectedExamType}&year=${selectedGrade || 'all'}&examId=${examId}`;
    navigate(url);
  }, [navigate, selectedExamType, selectedGrade, selectedSubject]);

  // Get NAPLAN subjects
  const getNaplanSubjects = () => [
    {
      id: 'reading',
      name: 'Reading',
      icon: '📚',
      description: 'Comprehension of different text types (narrative, persuasive, informative), understanding literal and inferential meaning, interpreting vocabulary in context',
      questionCount: 40,
      timeLimit: 45
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: '✍️',
      description: 'One extended writing task based on a given prompt. Task may be narrative or persuasive.',
      questionCount: 1,
      timeLimit: 40
    },
    {
      id: 'language',
      name: 'Language Conventions',
      icon: '📖',
      description: 'Grammar, punctuation, and spelling',
      questionCount: 50,
      timeLimit: 40
    },
    {
      id: 'numeracy',
      name: 'Numeracy',
      icon: '➕',
      description: 'Number and Algebra, Measurement and Geometry, Statistics and Probability',
      questionCount: 40,
      timeLimit: 50
    }
  ];

  // Get ICAS subjects
  const getIcasSubjects = () => [
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      description: 'Scientific knowledge and understanding across key areas',
      questionCount: 30,
      timeLimit: 45
    },
    {
      id: 'spelling',
      name: 'Spelling Bee',
      icon: '🐝',
      description: 'Spelling patterns, rules and conventions',
      questionCount: 40,
      timeLimit: 25
    },
    {
      id: 'english_reading',
      name: 'English (Reading)',
      icon: '📖',
      description: 'Reading comprehension and analysis',
      questionCount: 45,
      timeLimit: 45
    },
    {
      id: 'english_writing',
      name: 'English (Writing)',
      icon: '✍️',
      description: 'Narrative or persuasive writing',
      questionCount: 1,
      timeLimit: 30
    },
    {
      id: 'grammar',
      name: 'Grammar',
      icon: '📝',
      description: 'Grammar rules, structure and usage',
      questionCount: 30,
      timeLimit: 30
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: '🧮',
      description: 'Mathematical concepts, problem-solving and reasoning',
      questionCount: 35,
      timeLimit: 40
    },
    {
      id: 'digital',
      name: 'Digital Technologies',
      icon: '💻',
      description: 'Digital systems, data and computational thinking',
      questionCount: 30,
      timeLimit: 30
    }
  ];

  // Get sample test subjects (common across all exam types)
  const getSampleTestSubjects = () => [
    {
      id: 'maths',
      name: 'Mathematics',
      icon: '🧮',
      description: 'Sample mathematical problems and concepts',
      questionCount: 20,
      timeLimit: 30
    },
    {
      id: 'english',
      name: 'English',
      icon: '📚',
      description: 'Reading comprehension and language skills',
      questionCount: 20,
      timeLimit: 30
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      description: 'Scientific knowledge and inquiry skills',
      questionCount: 20,
      timeLimit: 30
    },
    {
      id: 'digital',
      name: 'Digital Technologies',
      icon: '💻',
      description: 'Digital systems and computational thinking',
      questionCount: 20,
      timeLimit: 30
    }
  ];

  // Render initial exam type selection screen
  if (!selectedExamType) {
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="exams-header">
            <h1 className="title">Exams</h1>
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

  // After selecting exam type, show section options (Sample Tests or Full Exams)
  if (selectedExamType && !selectedSection) {
    const selectedExamTypeInfo = examTypes.find(type => type.id === selectedExamType);
    
    return (
      <div className="exams-page">
        <div className="exams-container">
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
              {selectedExamTypeInfo?.name}
            </span>
          </div>
          
          <div className="category-description">
            <h2>{selectedExamTypeInfo?.name}</h2>
            <p>
              Our comprehensive platform covers all key subject areas tested in {selectedExamTypeInfo?.name} examinations. 
              Try our sample tests to experience the platform or access full exams with a subscription.
            </p>
          </div>
          
          <div className="exam-options-container">
            {/* Sample Tests Section - available to all users */}
            <div className="exam-option-card">
              <h2>Sample Tests</h2>
              <p>Try free sample tests to get familiar with our platform.</p>
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => handleSectionSelect('sampleTests')}
              >
                Start Practice Tests
              </Button>
            </div>
            
            {/* Full Exams Section - requires login */}
            <div className="exam-option-card premium-card">
              <h2>Full Exams</h2>
              <p>Complete {selectedExamTypeInfo?.name} practice exams with detailed results and progress tracking.</p>
              
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={() => handleSectionSelect('fullExams')}
                >
                  Select Full Exams
                </Button>
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
              
              <div className="premium-features">
                <h3>Premium Features</h3>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Full-length exams matching real test conditions</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Detailed performance analytics</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Progress tracking across all subjects</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Personalized learning recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For sample tests subject selection
  if (selectedExamType && selectedSection === 'sampleTests' && !selectedSubject) {
    const sampleSubjects = getSampleTestSubjects();
    
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedSection(null)}
              className="back-button"
            >
              ← Back
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
              Sample Tests
            </span>
          </div>
          
          <h2 className="section-title">Select Subject</h2>
          <div className="exams-grid">
            {sampleSubjects.map(subject => (
              <div 
                key={subject.id}
                className="exam-card"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <div className="exam-card-content">
                  <div className="exam-card-header">
                    <span className="subject-icon">{subject.icon}</span>
                    <h3>{subject.name}</h3>
                  </div>
                  <p>
                    {subject.questionCount} {subject.questionCount === 1 ? 'question' : 'questions'}<br />
                    {subject.timeLimit} minutes
                  </p>
                  <p className="subject-description">{subject.description}</p>
                </div>
                <Button variant="primary" size="small">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For full exams, first select year level if authenticated
  if (selectedExamType && selectedSection === 'fullExams' && !selectedGrade) {
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedSection(null)}
              className="back-button"
            >
              ← Back
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
              Full Exams
            </span>
          </div>
          
          <h2 className="section-title">Select Year Level</h2>
          <div className="year-buttons-grid">
            {grades.map(grade => (
              <div 
                key={grade}
                className="year-button"
                onClick={() => handleGradeSelect(grade)}
              >
                <div className="year-button-content">
                  <span className="year-text">Year {grade}</span>
                  <span className="year-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // After selecting year level for full exams, show subject selection
  if (selectedExamType && selectedSection === 'fullExams' && selectedGrade && !selectedSubject) {
    // Select appropriate subjects based on exam type
    const examSubjects = selectedExamType === 'naplan' ? getNaplanSubjects() : getIcasSubjects();
    
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => setSelectedGrade(null)}
              className="back-button"
            >
              ← Back to Year Levels
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
              Full Exams &gt; Year {selectedGrade}
            </span>
          </div>
          
          <h2 className="section-title">Select Subject</h2>
          <div className="exams-grid">
            {examSubjects.map(subject => (
              <div 
                key={subject.id}
                className="exam-card"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <div className="exam-card-content">
                  <div className="exam-card-header">
                    <span className="subject-icon">{subject.icon}</span>
                    <h3>{subject.name}</h3>
                  </div>
                  <p>
                    {subject.questionCount} {subject.questionCount === 1 ? 'question' : 'questions'}<br />
                    {subject.timeLimit} minutes
                  </p>
                  <p className="subject-description">{subject.description}</p>
                </div>
                <Button variant="primary" size="small">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // After selecting a subject, show available exams (for both sample tests and full exams)
  if (selectedExamType && selectedSubject) {
    // Find the correct subject list based on section and exam type
    let subjectList;
    if (selectedSection === 'sampleTests') {
      subjectList = getSampleTestSubjects();
    } else if (selectedExamType === 'naplan') {
      subjectList = getNaplanSubjects();
    } else {
      subjectList = getIcasSubjects();
    }
    
    const currentSubject = subjectList.find(s => s.id === selectedSubject);
    
    return (
      <div className="exams-page">
        <div className="exams-container">
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
              {selectedSection === 'fullExams' ? `Full Exams &gt; Year ${selectedGrade} &gt;` : 'Sample Tests &gt;'} 
              {currentSubject?.name}
            </span>
          </div>
          
          <h2 className="section-title">
            Available {selectedSection === 'sampleTests' ? 'Sample' : ''} Exams
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
                    <h3>{exam.name}</h3>
                    <p>
                      {examTypes.find(type => type.id === selectedExamType)?.name}
                      {selectedSection === 'fullExams' ? ` - Year ${selectedGrade}` : ''}<br />
                      {currentSubject?.name}<br />
                      {currentSubject?.questionCount} {currentSubject?.questionCount === 1 ? 'question' : 'questions'}<br />
                      {currentSubject?.timeLimit} minutes
                    </p>
                  </div>
                  <Button variant="primary" size="small">
                    Start Exam
                  </Button>
                </div>
              ))
            ) : (
              <div className="no-exams-message">
                <p>No exams available for this selection. Please try another subject or year level.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Exams;