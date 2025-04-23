import './PricingPage.css';

import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PricingHeader = styled.div`
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

const PricingToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2.5rem 0;
  gap: 1rem;
`;

const ToggleLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? 'var(--primary)' : 'var(--dark-gray)'};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 32px;
  border-radius: 16px;
  background: var(--gradient-fun);
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 4px;
  left: ${props => props.position === 'yearly' ? '32px' : '4px'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: white;
  transition: all 0.3s ease;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FaqSection = styled.div`
  margin-top: 5rem;
`;

/**
 * Pricing page component
 */
const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toggle between monthly and yearly billing
  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
  };
  
  // Pricing data
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for trying out practice exams',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        'Access to NAPLAN practice exams',
        '10 practice exams per month',
        'Basic progress tracking',
        'Email support',
        'Access on all devices'
      ],
      recommended: false,
      cta: 'Get Started'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Most popular choice for exam preparation',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        'Access to NAPLAN and ICAS practice exams',
        'Unlimited practice exams',
        'Detailed progress analytics',
        'Priority email support',
        'Personalized study plans',
        'Performance comparisons',
        'Access on all devices'
      ],
      recommended: true,
      cta: 'Get Started'
    },
    {
      id: 'family',
      name: 'Family',
      description: 'Great value for families with multiple students',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        'Everything in Premium',
        'Up to 4 student profiles',
        'Family progress dashboard',
        'NAPLAN, ICAS, and ICAS All Stars exams',
        'Priority support with dedicated manager',
        'Group performance insights',
        'Parent/teacher monitoring tools'
      ],
      recommended: false,
      cta: 'Get Started'
    }
  ];
  
  // Calculate savings for yearly plans
  const calculateSavings = (monthly, yearly) => {
    const monthlyCostForYear = monthly * 12;
    const savings = ((monthlyCostForYear - yearly) / monthlyCostForYear) * 100;
    return Math.round(savings);
  };
  
  // FAQ data
  const faqData = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, your new plan will take effect at the end of your current billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer free sample tests for all exam types. These give you a good idea of the content and format before you subscribe."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
    },
    {
      question: "Can I share my account with others?",
      answer: "Our Basic and Premium plans are designed for individual use. For families with multiple students, we recommend our Family plan which supports up to 4 student profiles."
    },
    {
      question: "Do you offer school or educational discounts?",
      answer: "Yes, we offer special pricing for schools and educational institutions. Please contact our support team for more information on educational licensing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and direct debit for yearly subscriptions."
    }
  ];
  
  // Filter FAQs based on search query
  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="pricing-page">
      <PricingContainer>
        <PricingHeader>
          <Title>Simple, Transparent Pricing</Title>
          <Subtitle>
            Choose the perfect plan to help your child succeed in their exams
          </Subtitle>
        </PricingHeader>
        
        <PricingToggle>
          <ToggleLabel active={billingPeriod === 'monthly'}>Monthly</ToggleLabel>
          <ToggleSwitch onClick={toggleBillingPeriod}>
            <ToggleButton position={billingPeriod} />
          </ToggleSwitch>
          <ToggleLabel active={billingPeriod === 'yearly'}>Yearly <span className="savings-badge">Save up to 17%</span></ToggleLabel>
        </PricingToggle>
        
        <PricingGrid>
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
            >
              {plan.recommended && <div className="recommended-badge">Most Popular</div>}
              <div className="pricing-card-header">
                <h2 className="plan-name">{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>
              <div className="pricing-card-price">
                <span className="currency">$</span>
                <span className="amount">
                  {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="period">
                  {billingPeriod === 'monthly' ? '/month' : '/year'}
                </span>
                
                {billingPeriod === 'yearly' && (
                  <div className="yearly-savings">
                    Save {calculateSavings(plan.monthlyPrice, plan.yearlyPrice)}%
                  </div>
                )}
              </div>
              <div className="pricing-card-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pricing-card-cta">
                <Link 
                  to={`/signup?plan=${plan.id}&billing=${billingPeriod}`} 
                  className={`btn-cta ${plan.recommended ? 'btn-cta-primary' : 'btn-cta-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </PricingGrid>
        
        <div className="guarantee-section">
          <div className="guarantee-icon">🛡️</div>
          <h2>30-Day Money-Back Guarantee</h2>
          <p>Try our platform risk-free. If you're not completely satisfied, contact us within 30 days for a full refund.</p>
        </div>
        
        <FaqSection>
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-search">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ul className="faq-accordion">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <li key={index} className="faq-item">
                  <input
                    type="checkbox"
                    id={`pricing-faq-${index}`}
                    className="faq-toggle"
                  />
                  <label htmlFor={`pricing-faq-${index}`} className="faq-question">
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
          </ul>
        </FaqSection>
        
        <div className="contact-section">
          <h2>Need Help Choosing?</h2>
          <p>Our team is here to answer your questions and help you choose the right plan for your needs.</p>
          <Link to="/contact" className="btn-contact">Contact Support</Link>
        </div>
      </PricingContainer>
    </div>
  );
};

export default PricingPage;