// src/pages/Exams/Exams.jsx

import './Exams.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../../components/common';
import StudyTips from '../../components/ExamInterface/StudyTips/StudyTips';
import { YEAR_LEVELS } from '../../utils/constants';
import examDataService from '../../services/examDataService';
import { useAuth } from '../../contexts/AuthContext';

const Exams = () => {
  // Core state
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null); // 'sampleTests' or 'fullExams'
  const [availableExams, setAvailableExams] = useState([]);
  const [displaySubjects, setDisplaySubjects] = useState([]);
  const [allExamData, setAllExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Auth and navigation
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load exam types
  const [examTypes, setExamTypes] = useState([
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
    }
  ]);

  // Separate sample exams type
  const sampleExamType = {
    id: 'sample',
    name: 'Sample Tests',
    description: 'Free practice tests for all subjects',
    icon: '📝'
  };

  // Load all exam data on component mount
  useEffect(() => {
    const loadAllExamData = async () => {
      try {
        setLoading(true);
        const data = await examDataService.getAllExams();
        setAllExamData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading exam data:', err);
        setError('Failed to load exam data');
        setLoading(false);
      }
    };

    loadAllExamData();
  }, []);

  // Handler functions
  const handleExamTypeSelect = useCallback((examTypeId) => {
    setSelectedExamType(examTypeId);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedSection(null);
    setAvailableExams([]);
    
    if (!allExamData) return;
    
    // Load subjects for this exam type
    const subjects = [];
    Object.entries(allExamData).forEach(([id, subject]) => {
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
  }, [allExamData]);

  const handleSampleExamSelect = useCallback(() => {
    setSelectedExamType('sample');
    setSelectedSection('sampleTests');
    setSelectedGrade(null);
    setSelectedSubject(null);
    setAvailableExams([]);

    // Proceed directly to sample subject selection
    if (!allExamData) return;
    
    const subjects = [];
    Object.entries(allExamData).forEach(([id, subject]) => {
      // Check if this subject has sample exams
      if (subject.examTypes && subject.examTypes.sample) {
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
  }, [allExamData]);

  const handleGradeSelect = useCallback((grade) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setAvailableExams([]);
  }, []);
  
  const handleSectionSelect = useCallback((section) => {
    setSelectedSection(section);
    setSelectedSubject(null);
    setAvailableExams([]);
  }, []);

  const handleSubjectSelect = useCallback((subjectId) => {
    setSelectedSubject(subjectId);
    
    if (!allExamData) return;
    
    // Get available exams based on selection
    if (selectedSection === 'fullExams') {
      const subject = allExamData[subjectId];
      if (subject && subject.examTypes && subject.examTypes[selectedExamType]) {
        const exams = subject.examTypes[selectedExamType].exams || [];
        
        // Filter by year if needed
        if (selectedGrade) {
          const filteredExams = exams.filter(exam => 
            exam.year === selectedGrade || exam.year === 'all' || !exam.year
          );
          setAvailableExams(filteredExams);
        } else {
          setAvailableExams(exams);
        }
      } else {
        setAvailableExams([]);
      }
    } else {
      // For sample tests, get exams from the sample exam type
      const subject = allExamData[subjectId];
      if (subject && subject.examTypes && subject.examTypes.sample) {
        setAvailableExams(subject.examTypes.sample.exams || []);
      } else {
        setAvailableExams([]);
      }
    }
  }, [allExamData, selectedExamType, selectedGrade, selectedSection]);

  const handleExamSelect = useCallback((examId) => {
    // Create the URL with query parameters for exam type and grade
    const url = `/exam/${selectedSubject}?type=${selectedExamType}&year=${selectedGrade || 'all'}&examId=${examId}`;
    navigate(url);
  }, [navigate, selectedSubject, selectedExamType, selectedGrade]);

  // Parse query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const examType = params.get('type');
    const grade = params.get('year');
    
    if (examType && allExamData) {
      if (examType === 'sample') {
        handleSampleExamSelect();
      } else {
        handleExamTypeSelect(examType);
        
        if (grade) {
          handleGradeSelect(Number(grade));
        }
      }
    }
  }, [location, allExamData, handleExamTypeSelect, handleGradeSelect, handleSampleExamSelect]);

  // Get sample test subjects from allExamData
  const getSampleTestSubjects = useCallback(() => {
    if (!allExamData) return [];
    
    const sampleSubjects = [];
    Object.entries(allExamData).forEach(([id, subject]) => {
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
  }, [allExamData]);

  // Loading state
  if (loading) {
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2>Loading exams...</h2>
            <p>Please wait while we prepare your options.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="error-container">
            <p className="error-text">{error}</p>
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render initial exam type selection screen
  if (!selectedExamType && !selectedSection) {
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

          {/* New Overview Section */}
          <div className="exams-overview">
            <div className="section-header">
              <h2>How Our Exams Work</h2>
              <p>Understanding the online evaluation process</p>
            </div>
            
            <div className="overview-content">
              <div className="overview-section">
                <h3><i className="fas fa-laptop"></i> Online Evaluation Process</h3>
                <p>Our platform uses advanced algorithms to evaluate responses in real-time. Multiple-choice and true/false questions are automatically graded, while open-ended responses are analyzed for key concepts and understanding.</p>
              </div>
              
              <div className="overview-section">
                <h3><i className="fas fa-shield-alt"></i> Anti-Cheating Measures</h3>
                <p>To maintain academic integrity, our platform monitors for suspicious activity. Switching tabs, copying content, or using browser navigation during an exam will be recorded. We want to help students develop genuine understanding through honest practice.</p>
              </div>
              
              <div className="overview-section">
                <h3><i className="fas fa-chart-line"></i> Performance Tracking</h3>
                <p>After each exam, you'll receive detailed feedback showing your performance, areas of strength, and opportunities for improvement. Track your progress over time to see how your skills develop.</p>
              </div>
            </div>
          </div>

          {/* Study Tips Section */}
          <div className="study-tips-container">
            <div className="section-header">
              <h2>Study Tips for Success</h2>
              <p>Maximize your performance with these subject-specific study strategies</p>
            </div>
            
            <div className="tips-grid">
              <div className="tip-card">
                <StudyTips subject="mathematics" defaultOpen={false} />
              </div>
              <div className="tip-card">
                <StudyTips subject="science" defaultOpen={false} />
              </div>
              <div className="tip-card">
                <StudyTips subject="english" defaultOpen={false} />
              </div>
              <div className="tip-card">
                <StudyTips subject="digital" defaultOpen={false} />
              </div>
            </div>
          </div>

          {/* Sample Tests Section */}
          <div className="section-header">
            <h2>Free Sample Exams</h2>
            <p>Try our free sample tests with no login required</p>
          </div>

          <div className="exam-types-grid" style={{ marginBottom: '3rem' }}>
            <div 
              className="exam-type-card sample-card"
              onClick={handleSampleExamSelect}
            >
              <div className="free-label">Free</div>
              <div className="exam-type-icon">
                {sampleExamType.icon}
              </div>
              <h3>{sampleExamType.name}</h3>
              <p>{sampleExamType.description}</p>
            </div>
          </div>
          
          {/* Official Exam Types Section */}
          <div className="section-header">
            <h2>Official Exam Practice</h2>
            <p>Comprehensive exam preparation for various assessment programs</p>
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

  // For sample test subject selection (direct from sample exams button)
  if (selectedExamType === 'sample' && selectedSection === 'sampleTests' && !selectedSubject) {
    const sampleSubjects = getSampleTestSubjects();
    
    return (
      <div className="exams-page">
        <div className="exams-container">
          <div className="breadcrumb-trail">
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => {
                setSelectedExamType(null);
                setSelectedSection(null);
              }}
              className="back-button"
            >
              ← Back to Exam Types
            </Button>
            <span>
              Sample Tests
            </span>
          </div>
          
          <div className="section-header">
            <h2>Sample Tests</h2>
            <p>Try our free sample exams for each subject. Upgrade for full access to comprehensive practice materials.</p>
          </div>
          
          <div className="subject-benefits-container">
            <div className="subject-benefits">
              <h3>Benefits of full subscription:</h3>
              <ul className="benefits-list">
                <li><i className="fas fa-check"></i> Access to 5 exams per subject per year level</li>
                <li><i className="fas fa-check"></i> Detailed performance analytics</li>
                <li><i className="fas fa-check"></i> Track your progress over time</li>
                <li><i className="fas fa-check"></i> Personalized study recommendations</li>
              </ul>
              <div className="upgrade-prompt">
                <Link to="/pricing" className="btn-outline">View subscription options</Link>
              </div>
            </div>
          </div>
          
          <h2 className="section-title">Select Subject</h2>
          <div className="exams-grid">
            {sampleSubjects.map(subject => (
              <div 
                key={subject.id}
                className="exam-card"
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <div className="free-label">Free Sample</div>
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
                  Try Free Sample
                </Button>
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
          
          <div className="exam-sections-container">
            {/* Sample Tests Section - available to all users */}
            <div className="exam-section-card">
              <div className="section-icon">📝</div>
              <h3>Sample Tests</h3>
              <p>Try free sample tests to get familiar with our platform.</p>
              <ul className="section-features">
                <li><i className="fas fa-check"></i> 1 free exam per subject</li>
                <li><i className="fas fa-check"></i> No registration required</li>
                <li><i className="fas fa-check"></i> Instant feedback</li>
                <li><i className="fas fa-check"></i> Basic results</li>
              </ul>
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => handleSectionSelect('sampleTests')}
              >
                Start Sample Tests
              </Button>
            </div>
            
            {/* Comprehensive Exam Practice Section - requires login */}
            <div className="exam-section-card premium-card">
              <div className="pro-badge">Premium</div>
              <div className="section-icon">🏆</div>
              <h3>Comprehensive Exam Practice</h3>
              <p>Complete exam practice with detailed results and progress tracking.</p>
              <ul className="section-features">
                <li><i className="fas fa-check"></i> 5 exams per subject per year level</li>
                <li><i className="fas fa-check"></i> Detailed analytics</li>
                <li><i className="fas fa-check"></i> Performance tracking</li>
                <li><i className="fas fa-check"></i> Personalized insights</li>
              </ul>
              
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={() => handleSectionSelect('fullExams')}
                >
                  Access Full Exams
                </Button>
              ) : (
                <div className="login-required">
                  <p>You need to be logged in to access comprehensive exams</p>
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
                  <div className="pricing-link">
                    <Link to="/pricing">View subscription options</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For sample tests subject selection from a specific exam type
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
                <div className="free-label">Free Sample</div>
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
            {YEAR_LEVELS.map(grade => (
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
              ← Back
            </Button>
            <span>
              {examTypes.find(type => type.id === selectedExamType)?.name} &gt;
              Full Exams
            </span>
          </div>

          <h2 className="section-title">Select Year Level</h2>
          <div className="year-buttons-grid">
            {YEAR_LEVELS.map(grade => (
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