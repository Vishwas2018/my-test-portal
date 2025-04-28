// src/pages/Exams/Exams.jsx

import './Exams.css';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../components/common';
import { YEAR_LEVELS } from '../../utils/constants';
// Import manifest
import manifest from '../../data/category/manifest.json';
import { useAuth } from '../../contexts/AuthContext';

const Exams = () => {
  // Core state
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // 'sampleTests' or 'fullExams'
  const [availableExams, setAvailableExams] = useState([]);
  const [displaySubjects, setDisplaySubjects] = useState([]);
  
  // Auth and navigation
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load exam types
  const [examTypes, setExamTypes] = useState([]);
  useEffect(() => {
    const types = [
      { 
        id: 'naplan', 
        name: 'NAPLAN',
        description: 'Australian National Assessment Program - preparing students for literacy and numeracy testing',
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
      },
      { 
        id: 'sample', 
        name: 'Sample Tests',
        description: 'Free practice tests for all subjects',
        icon: '📝'
      }
    ];
    
    setExamTypes(types);
  }, []);

  const grades = YEAR_LEVELS;

  // Handler functions
  const handleExamTypeSelect = (examTypeId) => {
    setSelectedExamType(examTypeId);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedSection(null);
    setAvailableExams([]);
    
    // Load subjects for this exam type from manifest
    const subjects = [];
    Object.entries(manifest.subjects).forEach(([id, subject]) => {
      // Check if this subject has the selected exam type
      if (subject.examTypes && subject.examTypes[examTypeId]) {
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
    
    setDisplaySubjects(subjects);
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setAvailableExams([]);
  };
  
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setSelectedSubject(null);
    setAvailableExams([]);
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    
    // Get available exams based on selection
    if (selectedSection === 'fullExams') {
      const subject = manifest.subjects[subjectId];
      if (subject && subject.examTypes && subject.examTypes[selectedExamType]) {
        const exams = subject.examTypes[selectedExamType].exams || [];
        
        // Filter by year if needed
        if (selectedGrade) {
          const filteredExams = exams.filter(exam => exam.year === selectedGrade);
          setAvailableExams(filteredExams);
        } else {
          setAvailableExams(exams);
        }
      } else {
        setAvailableExams([]);
      }
    } else {
      // For sample tests, get exams from the sample exam type
      const subject = manifest.subjects[subjectId];
      if (subject && subject.examTypes && subject.examTypes.sample) {
        setAvailableExams(subject.examTypes.sample.exams || []);
      } else {
        setAvailableExams([]);
      }
    }
  };

  const handleExamSelect = (examId) => {
    // Create the URL with query parameters for exam type and grade
    const url = `/exam/${selectedSubject}?type=${selectedExamType}&year=${selectedGrade || 'all'}&examId=${examId}`;
    navigate(url);
  };

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

  // Get sample test subjects from manifest
  const getSampleTestSubjects = () => {
    const sampleSubjects = [];
    Object.entries(manifest.subjects).forEach(([id, subject]) => {
      if (subject.examTypes && subject.examTypes.sample) {
        sampleSubjects.push({
          id,
          name: subject.name,
          icon: subject.icon,
          description: subject.description,
          questionCount: subject.defaultQuestionCount,
          timeLimit: subject.defaultTimeLimit
        });
      }
    });
    return sampleSubjects;
  };

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
            {displaySubjects.map(subject => (
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

  // After selecting a subject, show available exams
  if (selectedExamType && selectedSubject) {
    // Find the current subject
    const currentSubject = selectedSection === 'sampleTests'
      ? getSampleTestSubjects().find(s => s.id === selectedSubject)
      : displaySubjects.find(s => s.id === selectedSubject);
    
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
                      {exam.questionCount} {exam.questionCount === 1 ? 'question' : 'questions'}<br />
                      {exam.timeLimit} minutes
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