import './ExamSelection.css';

import React, { useState } from 'react';

import { Button } from '../../components/common';

const ExamSelection = () => {
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);

  // Define exam types
  const examTypes = [
    { id: 'icas', name: 'ICAS' },
    { id: 'naplan', name: 'NAPLAN' }
  ];

  // Define grades
  const grades = [2, 3, 4, 5, 6];
  
  // Define subjects with their details
  const subjects = [
    { 
      id: 'science', 
      name: 'Science', 
      questions: 30, 
      duration: 45,
      icon: '🧪'
    },
    { 
      id: 'spelling', 
      name: 'Spelling Bee', 
      questions: 40, 
      duration: 25,
      icon: '🐝'
    },
    { 
      id: 'reading', 
      name: 'English (Reading)', 
      questions: 45, 
      duration: 45,
      icon: '📚'
    },
    { 
      id: 'writing', 
      name: 'English (Writing)', 
      questions: 1, 
      duration: 30,
      icon: '✏️'
    },
    { 
      id: 'grammar', 
      name: 'Grammar', 
      questions: 30, 
      duration: 30,
      icon: '📝'
    },
    { 
      id: 'mathematics', 
      name: 'Mathematics', 
      questions: 35, 
      duration: 40,
      icon: '🔢'
    },
    { 
      id: 'digital', 
      name: 'Digital Technologies', 
      questions: 30, 
      duration: 30,
      icon: '💻'
    }
  ];

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
    
    // Generate exams for the selected subject
    const exams = [];
    for (let i = 1; i <= 10; i++) {
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
    console.log(`Selected exam: ${examId}`);
    // Redirect to exam page or show exam details
    // e.g., navigate(`/exams/${examId}`);
  };

  return (
    <div className="exam-selection">
      <div className="exam-selection-container">
        <div className="exam-selection-header">
          <h1 className="title">Select an Exam</h1>
          <p className="subtitle">Choose your exam type, year level, and subject to view available exams</p>
        </div>
        
        <div className="exam-selection-content">
          {selectedExamType && selectedGrade && selectedSubject && (
            <div className="breadcrumb-trail">
              <Button 
                variant="secondary" 
                size="small" 
                onClick={() => setSelectedSubject(null)}
                className="back-button"
              >
                ← Back
              </Button>
              <span>
                {examTypes.find(type => type.id === selectedExamType)?.name} &gt; 
                Year {selectedGrade} &gt; 
                {subjects.find(sub => sub.id === selectedSubject)?.name}
              </span>
            </div>
          )}
          
          {/* Exam Type Selection */}
          {!selectedExamType && (
            <div className="selection-section">
              <h2 className="section-title">Exam Type</h2>
              <div className="selection-options">
                {examTypes.map(examType => (
                  <div 
                    key={examType.id}
                    className={`selection-card ${selectedExamType === examType.id ? 'active' : ''}`}
                    onClick={() => handleExamTypeSelect(examType.id)}
                  >
                    <h3>{examType.name}</h3>
                    {selectedExamType === examType.id && (
                      <div className="selection-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Grade Selection */}
          {selectedExamType && !selectedGrade && (
            <div className="selection-section">
              <h2 className="section-title">Year Level</h2>
              <div className="selection-options">
                {grades.map(grade => (
                  <div 
                    key={grade}
                    className={`selection-card ${selectedGrade === grade ? 'active' : ''}`}
                    onClick={() => handleGradeSelect(grade)}
                  >
                    <h3>Year {grade}</h3>
                    {selectedGrade === grade && (
                      <div className="selection-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Subject Selection */}
          {selectedExamType && selectedGrade && !selectedSubject && (
            <div className="selection-section">
              <h2 className="section-title">Subject</h2>
              <div className="exams-grid">
                {subjects.map(subject => (
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
          
          {/* Available Exams */}
          {selectedExamType && selectedGrade && selectedSubject && (
            <div className="selection-section">
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
                        {subjects.find(s => s.id === selectedSubject)?.name}<br />
                        {subjects.find(s => s.id === selectedSubject)?.questions} question{subjects.find(s => s.id === selectedSubject)?.questions !== 1 ? 's' : ''}<br />
                        {subjects.find(s => s.id === selectedSubject)?.duration} minutes
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