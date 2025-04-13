import './Testimonials.css';

import React, { useState } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Jamie Smith',
      role: 'Web Developer',
      avatar: '/api/placeholder/80/80',
      content: 'This learning platform is amazing! It made learning so much easier and more fun. The colorful interface makes studying a joy!',
      rating: 5
    },
    {
      id: 2,
      name: 'Alex Johnson',
      role: 'Product Manager',
      avatar: '/api/placeholder/80/80',
      content: 'I\'ve tried many learning platforms but WonderLearn is different. The intuitive design and engaging features help kids stay connected with the material.',
      rating: 5
    },
    {
      id: 3,
      name: 'Sam Wilson',
      role: 'Graphic Designer',
      avatar: '/api/placeholder/80/80',
      content: 'As a designer, I appreciate the attention to detail in this portal. The playful elements make even mundane tasks enjoyable!',
      rating: 5
    },
    {
      id: 4,
      name: 'Taylor Reed',
      role: 'Marketing Director',
      avatar: '/api/placeholder/80/80',
      content: 'Our children love using WonderLearn! The bright colors and friendly interface make their daily learning something to look forward to.',
      rating: 5
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="testimonials">
      <div className="container testimonials-container">
        <h2 className="section-title">What Our Explorers Say</h2>
        
        <div className="testimonials-carousel">
          <button 
            className="carousel-arrow prev" 
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="testimonials-slider" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div className="testimonial-slide" key={testimonial.id}>
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  <div className="testimonial-content">
                    <p>{testimonial.content}</p>
                  </div>
                  
                  <div className="testimonial-footer">
                    <div className="testimonial-avatar">
                      <img src={testimonial.avatar} alt={`${testimonial.name}`} />
                    </div>
                    <div className="testimonial-author">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                      <div className="star-rating" aria-label="5 out of 5 stars">
                        <span className="star-text">* * * * *</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="carousel-arrow next" 
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;