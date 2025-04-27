// src/components/ExamInterface/ConfirmationDialog/ConfirmationDialog.jsx
import React, { useState } from 'react';

import { Button } from '../../common';

/**
 * Enhanced confirmation dialog with two-step process
 * 
 * @param {Object} examInfo - Exam information object
 * @param {Function} onStart - Callback function when start is confirmed
 * @param {Function} onCancel - Callback function when canceled
 */
const ConfirmationDialog = ({ examInfo, onStart, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  
  const handleContinue = () => {
    setCurrentStep(2);
  };

  const handleGoBack = () => {
    setCurrentStep(1);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="confirmation-backdrop">
      <div className="modal-content">
        <h2>Start Exam</h2>
        <p>You are about to start the following exam:</p>

        <div className="exam-details">
          <div className="detail-row">
            <span className="detail-label">Subject:</span>
            <span className="detail-value">{examInfo?.name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Exam Type:</span>
            <span className="detail-value">{examInfo?.type?.toUpperCase() || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Year Level:</span>
            <span className="detail-value">Year {examInfo?.year || 'all'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Questions:</span>
            <span className="detail-value">{examInfo?.questionCount || 0}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time Limit:</span>
            <span className="detail-value">{examInfo?.timeLimit || 0} minutes</span>
          </div>
        </div>

        <div className="confirmation-steps">
          {/* Step 1: Review Rules */}
          <div className={`confirmation-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="confirmation-step-header">
              <div className="step-number">1</div>
              <div className="step-title">Review Exam Rules</div>
            </div>
            <div className="step-content">
              <div className="warning-box">
                <p><strong>Important:</strong> Once you start, you cannot leave this page until you submit the exam. Attempting to switch tabs, use the back button, or close the window will be recorded.</p>
                <p>During the exam:</p>
                <ul>
                  <li>No outside resources are allowed</li>
                  <li>No communication with others</li>
                  <li>Complete all questions within the time limit</li>
                  <li>You can flag questions to review later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2: Confirm Start */}
          <div className={`confirmation-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="confirmation-step-header">
              <div className="step-number">2</div>
              <div className="step-title">Confirm Start</div>
            </div>
            <div className="step-content">
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={handleCheckboxChange}
                  />
                  <span>I understand and agree to follow the exam rules</span>
                </label>
              </div>
              <p>Are you ready to begin?</p>
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <Button 
            variant="secondary" 
            onClick={currentStep === 1 ? onCancel : handleGoBack}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {currentStep === 1 ? (
            <Button 
              variant="primary"
              onClick={handleContinue}
            >
              Continue
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={onStart}
              disabled={!isChecked}
            >
              Start Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;