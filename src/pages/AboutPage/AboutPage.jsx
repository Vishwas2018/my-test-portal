import './AboutPage.css';

import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const AboutHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--dark);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--dark-gray);
  max-width: 700px;
  margin: 1.5rem auto 0;
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const AboutSection = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AboutImage = styled.div`
  flex: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const AboutText = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--primary);
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--gradient-fun);
    border-radius: var(--radius-full);
  }
`;

const FaqContainer = styled.div`
  margin-top: 4rem;
`;

const FaqHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FaqSearch = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  
  input {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
    }
  }
`;

const FaqList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
`;

/**
 * About page component
 */
const AboutPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // FAQ data
  const faqData = [
    {
      question: "What exams are covered in this platform?",
      answer: "Our platform covers NAPLAN, ICAS, and ICAS All Stars exams across various subjects including Mathematics, Science, English (Reading and Writing), Grammar, Spelling, and Digital Technologies."
    },
    {
      question: "How do I track my child's progress?",
      answer: "You can track your child's progress through the Dashboard. It displays statistics such as completed exams, average scores, and recent activity. You can also view detailed results for each exam taken."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer free sample tests for all exam types. You can access these from the Exam Selection page to get a feel for the platform before subscribing."
    },
    {
      question: "What age groups is this platform suitable for?",
      answer: "Our platform is designed for students in Years 2-6, with content specifically tailored to each year level's curriculum requirements."
    },
    {
      question: "How often is the content updated?",
      answer: "We regularly update our content to align with the latest curriculum standards and exam formats. All NAPLAN, ICAS, and ICAS All Stars content is kept current with recent exam patterns."
    },
    {
      question: "Can I use this platform on mobile devices?",
      answer: "Yes, our platform is fully responsive and works on desktops, laptops, tablets, and mobile phones, providing a seamless experience across all devices."
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="about-page">
      <AboutContainer>
        <AboutHeader>
          <Title>About Our Exam Preparation Platform</Title>
          <Subtitle>
            Empowering students to achieve their best through comprehensive, engaging exam preparation
          </Subtitle>
        </AboutHeader>
        
        <AboutContent>
          <AboutSection>
            <AboutImage>
              <img src="/api/placeholder/600/400" alt="Students studying" />
            </AboutImage>
            <AboutText>
              <SectionTitle>Our Mission</SectionTitle>
              <p>
                At our core, we're dedicated to providing the most effective and accessible exam preparation tools for students. 
                We believe that every child deserves the opportunity to succeed in their academic journey, 
                and our platform is designed to make that possible through engaging, tailored practice exams.
              </p>
              <br />
              <p>
                Our comprehensive preparation resources cover NAPLAN, ICAS, and ICAS All Stars examinations, 
                giving students the confidence they need to perform at their best when it counts.
              </p>
            </AboutText>
          </AboutSection>
          
          <AboutSection>
            <AboutText>
              <SectionTitle>Why Choose Us</SectionTitle>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <h3>Targeted Practice</h3>
                  <p>Content aligned with official exam formats and curriculum standards</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <h3>Progress Tracking</h3>
                  <p>Detailed analytics to monitor improvement and identify areas for growth</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <h3>Regular Updates</h3>
                  <p>Constantly updated content to reflect the latest exam patterns</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <h3>Multi-device Access</h3>
                  <p>Study anytime, anywhere on any device with our responsive platform</p>
                </div>
              </div>
            </AboutText>
            <AboutImage>
              <img src="/api/placeholder/600/400" alt="Student dashboard" />
            </AboutImage>
          </AboutSection>
          
          <FaqContainer id="faq">
            <FaqHeader>
              <SectionTitle style={{ display: 'inline-block' }}>Frequently Asked Questions</SectionTitle>
              <FaqSearch>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FaqSearch>
            </FaqHeader>
            
            <FaqList className="faq-accordion">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <li key={index} className="faq-item">
                    <input
                      type="checkbox"
                      id={`faq-${index}`}
                      className="faq-toggle"
                    />
                    <label htmlFor={`faq-${index}`} className="faq-question">
                      {faq.question}
                    </label>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="no-results">No FAQs match your search query.</p>
              )}
            </FaqList>
          </FaqContainer>
          
          <div className="cta-section">
            <h2>Ready to get started?</h2>
            <p>Try our free sample tests and see how our platform can help your child excel.</p>
            <div className="cta-buttons">
              <Link to="/sample-test/icas" className="btn-primary">Try Free Sample Test</Link>
              <Link to="/pricing" className="btn-secondary">View Pricing</Link>
            </div>
          </div>
        </AboutContent>
      </AboutContainer>
    </div>
  );
};

export default AboutPage;