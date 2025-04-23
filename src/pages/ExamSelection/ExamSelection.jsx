import './ExamSelection.css';

import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Button } from '../../components/common';

const ExamSelection = ({ isSampleTest = false }) => {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  
  // Handle navigation from URL parameters for sample tests
  useEffect(() => {
    if (isSampleTest && params.examType) {
      setSelectedExamType(params.examType);
      
      if (params.grade) {
        setSelectedGrade(parseInt(params.grade));
        
        if (params.subject) {
          setSelectedSubject(params.subject);
          
          // Generate sample exam
          const sampleExam = {
            id: `sample-${params.examType}-${params.grade}-${params.subject}-1`,
            name: `Sample Exam`,
            grade: parseInt(params.grade),
            type: params.examType,
            subject: params.subject
          };
          
          setAvailableExams([sampleExam]);
        }
      }
    }
  }, [isSampleTest, params.examType, params.grade, params.subject]);

  // Define exam types
  const examTypes = [
    { id: 'naplan', name: 'NAPLAN' },
    { id: 'icas', name: 'ICAS' },
    { id: 'icas_all_stars', name: 'ICAS All Stars' }
  ];

  // Define grades
  const grades = [2, 3, 4, 5, 6];
  
  // Define subjects with their details
  const subjects = {
    naplan: [
      { id: 'reading', name: 'Reading', questions: 45, duration: 45, icon: '📚' },
      { id: 'writing', name: 'Writing', questions: 1, duration: 30, icon: '✏️' },
      { id: 'numeracy', name: 'Numeracy', questions: 35, duration: 40, icon: '🔢' },
      { id: 'language', name: 'Language Conventions', questions: 30, duration: 30, icon: '📝' }
    ],
    icas: [
      { id: 'science', name: 'Science', questions: 30, duration: 45, icon: '🧪' },
      { id: 'spelling', name: 'Spelling Bee', questions: 40, duration: 25, icon: '🐝' },
      { id: 'reading', name: 'English (Reading)', questions: 45, duration: 45, icon: '📚' },
      { id: 'writing', name: 'English (Writing)', questions: 1, duration: 30, icon: '✏️' },
      { id: 'grammar', name: 'Grammar', questions: 30, duration: 30, icon: '📝' },
      { id: 'mathematics', name: 'Mathematics', questions: 35, duration: 40, icon: '🔢' },
      { id: 'digital', name: 'Digital Technologies', questions: 30, duration: 30, icon: '💻' }
    ],
    icas_all_stars: [
      { id: 'english', name: 'English', questions: 60, duration: 60, icon: '📚' },
      { id: 'mathematics', name: 'Mathematics', questions: 60, duration: 60, icon: '🔢' },
      { id: 'science', name: 'Science', questions: 60, duration: 60, icon: '🧪' },
      { id: 'reasoning', name: 'Reasoning', questions: 60, duration: 60, icon: '🧠' },
      { id: 'general_knowledge', name: 'General Knowledge', questions: 60, duration: 60, icon: '🌍' },
      { id: 'digital_literacy', name: 'Digital Literacy', questions: 60, duration: 60, icon: '💻' }
    ]
  };

  // Handle exam type selection
  const handleExamTypeSelect = (examTypeId) => {
    setSelectedExamType(examTypeId);
    setSelectedGrade(null);
    setSelectedSubject(null);
    setAvailableExams([]);
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
    
    // Generate exams for the selected subject - typically we would fetch this from an API
    const exams = [];
    for (let i = 1; i <= 5; i++) {
      exams.push({
        id: `${selectedExamType}-${selectedGrade}-${subjectId}-${i}`,
        name: `Exam ${i}`,
        grade: selectedGrade,
        type: selectedExamType,
        subject: subjectId
      });
    }
    
    setAvailableExams(exams);
  };

  // Handle exam selection
  const handleExamSelect = (examId) => {
    // Create the URL with query parameters for exam type and grade
    const url = `/exam/${selectedSubject}?type=${selectedExamType}&year=${selectedGrade}&examId=${examId}`;
    navigate(url);
  };

  return (
    <div className="exam-selection">
      <div className="exam-selection-container">
        <div className="exam-selection-header">
          <h1 className="title">{isSampleTest ? "Sample Test" : "Select an Exam"}</h1>
          <p className="subtitle">
            <strong>Give your child the best chance of success for ICAS</strong><br />
            Our preparation tools allow your child to practise for ICAS in the most authentic way possible.
          </p>
        </div>
        
        {/* Sample Tests Section (only displayed in non-sample mode) */}
        {!isSampleTest && (
          <div className="sample-tests-section">
            <h2 className="section-title">Try Free Sample Tests</h2>
            <p>Experience our exam format with these free sample tests.</p>
            
            <div className="sample-tests-grid">
              <div className="sample-test-card" onClick={() => navigate('/sample-test/naplan')}>
                <div className="sample-test-icon">🏫</div>
                <h3>NAPLAN</h3>
                <p>Australian National Assessment Program</p>
                <div className="free-badge">Free</div>
              </div>
              
              <div className="sample-test-card" onClick={() => navigate('/sample-test/icas')}>
                <div className="sample-test-icon">🎓</div>
                <h3>ICAS</h3>
                <p>International Competitions and Assessments for Schools</p>
                <div className="free-badge">Free</div>
              </div>
              
              <div className="sample-test-card" onClick={() => navigate('/sample-test/icas_all_stars')}>
                <div className="sample-test-icon">⭐</div>
                <h3>ICAS All Stars</h3>
                <p>Advanced ICAS with comprehensive topics</p>
                <div className="free-badge">Free</div>
              </div>
            </div>
            
            <div className="section-divider"></div>
          </div>
        )}
        
        <div className="exam-selection-content">
          {/* Sample Test Flow */}
          {isSampleTest && selectedExamType && !selectedGrade && (
            <div className="selection-section">
              <div className="breadcrumb-trail">
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={() => navigate('/exam-selection')}
                  className="back-button"
                >
                  ← Back to Exam Selection
                </Button>
                <span>Sample Test: {examTypes.find(type => type.id === selectedExamType)?.name}</span>
              </div>
              
              <h2 className="section-title">Select Year Level for Sample Test</h2>
              <div className="selection-options">
                {grades.map(grade => (
                  <div 
                    key={grade}
                    className="selection-card"
                    onClick={() => navigate(`/sample-test/${selectedExamType}/year-${grade}`)}
                  >
                    <h3>Year {grade}</h3>
                    <p className="card-description">
                      Content specifically designed for Year {grade} students
                    </p>
                    <div className="free-badge">Free Sample</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isSampleTest && selectedExamType && selectedGrade && !selectedSubject && (
            <div className="selection-section">
              <div className="breadcrumb-trail">
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={() => navigate(`/sample-test/${selectedExamType}`)}
                  className="back-button"
                >
                  ← Back to Year Levels
                </Button>
                <span>
                  Sample Test: {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
                  Year {selectedGrade}
                </span>
              </div>
              
              <h2 className="section-title">Select Subject for Sample Test</h2>
              <div className="exams-grid">
                {subjects[selectedExamType]?.map(subject => (
                  <div 
                    key={subject.id}
                    className="exam-card"
                    onClick={() => navigate(`/sample-test/${selectedExamType}/year-${selectedGrade}/${subject.id}`)}
                  >
                    <div className="exam-card-content">
                      <div className="exam-card-header">
                        <span className="subject-icon">{subject.icon}</span>
                        <h3>{subject.name}</h3>
                      </div>
                      <p>
                        {subject.questions} question{subject.questions !== 1 ? 's' : ''}<br />
                        {subject.duration} minutes
                      </p>
                      <div className="free-badge">Free Sample</div>
                    </div>
                    <Button variant="primary" size="small">Select Sample Test</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isSampleTest && selectedExamType && selectedGrade && selectedSubject && (
            <div className="selection-section">
              <div className="breadcrumb-trail">
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={() => navigate(`/sample-test/${selectedExamType}/year-${selectedGrade}`)}
                  className="back-button"
                >
                  ← Back to Subjects
                </Button>
                <span>
                  Sample Test: {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
                  Year {selectedGrade} &gt; 
                  {subjects[selectedExamType]?.find(sub => sub.id === selectedSubject)?.name}
                </span>
              </div>
              
              <h2 className="section-title">Start Sample Test</h2>
              <div className="exams-grid">
                {availableExams.map(exam => (
                  <div 
                    key={exam.id}
                    className="exam-card sample-test-final"
                  >
                    <div className="exam-card-content">
                      <h3>{examTypes.find(type => type.id === exam.type)?.name} Sample Test</h3>
                      <p>
                        Year {exam.grade}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.name}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.questions} question{subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.questions !== 1 ? 's' : ''}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.duration} minutes
                      </p>
                      <div className="free-badge">Free Sample</div>
                    </div>
                    <Button 
                      variant="primary" 
                      size="large"
                      onClick={() => handleExamSelect(exam.id)}
                    >
                      Start Sample Test
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="subscription-info">
                <p>Want full access to all exams? <Link to="/pricing">View our subscription plans</Link> or <Link to="/login">login</Link> to your account.</p>
              </div>
            </div>
          )}
          
          {/* Regular Exam Selection Flow (non-sample) */}
          {!isSampleTest && !selectedExamType && (
            <div className="selection-section">
              <h2 className="section-title">Select Exam Type</h2>
              <div className="selection-options">
                {examTypes.map(examType => (
                  <div 
                    key={examType.id}
                    className={`selection-card ${selectedExamType === examType.id ? 'active' : ''}`}
                    onClick={() => handleExamTypeSelect(examType.id)}
                  >
                    <h3>{examType.name}</h3>
                    <p className="card-description">
                      {examType.id === 'naplan' && 'Australian National Assessment Program'}
                      {examType.id === 'icas' && 'International Competitions and Assessments for Schools'}
                      {examType.id === 'icas_all_stars' && 'Advanced ICAS with comprehensive topics'}
                    </p>
                    {selectedExamType === examType.id && (
                      <div className="selection-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="subscription-info">
                <p>Need full access? <Link to="/pricing">View our subscription plans</Link> or <Link to="/login">login</Link> to your account.</p>
              </div>
            </div>
          )}
          
          {!isSampleTest && selectedExamType && !selectedGrade && (
            <div className="selection-section">
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
              
              <h2 className="section-title">Select Year Level</h2>
              <div className="selection-options">
                {grades.map(grade => (
                  <div 
                    key={grade}
                    className={`selection-card ${selectedGrade === grade ? 'active' : ''}`}
                    onClick={() => handleGradeSelect(grade)}
                  >
                    <h3>Year {grade}</h3>
                    <p className="card-description">
                      Content specifically designed for Year {grade} students
                    </p>
                    {selectedGrade === grade && (
                      <div className="selection-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isSampleTest && selectedExamType && selectedGrade && !selectedSubject && (
            <div className="selection-section">
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
                  Year {selectedGrade}
                </span>
              </div>
              
              <h2 className="section-title">Select Subject</h2>
              <div className="exams-grid">
                {subjects[selectedExamType]?.map(subject => (
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
                        {subject.questions} question{subject.questions !== 1 ? 's' : ''}<br />
                        {subject.duration} minutes
                      </p>
                    </div>
                    <Button variant="primary" size="small">Select</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isSampleTest && selectedExamType && selectedGrade && selectedSubject && (
            <div className="selection-section">
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
                  {subjects[selectedExamType]?.find(sub => sub.id === selectedSubject)?.name}
                </span>
              </div>
              
              <h2 className="section-title">Available Exams</h2>
              <div className="exams-grid">
                {availableExams.map(exam => (
                  <div 
                    key={exam.id}
                    className="exam-card"
                    onClick={() => handleExamSelect(exam.id)}
                  >
                    <div className="exam-card-content">
                      <h3>{exam.name}</h3>
                      <p>
                        {examTypes.find(type => type.id === exam.type)?.name} - Year {exam.grade}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.name}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.questions} question{subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.questions !== 1 ? 's' : ''}<br />
                        {subjects[selectedExamType]?.find(s => s.id === selectedSubject)?.duration} minutes
                      </p>
                    </div>
                    <Button variant="primary" size="small">Start Exam</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamSelection;