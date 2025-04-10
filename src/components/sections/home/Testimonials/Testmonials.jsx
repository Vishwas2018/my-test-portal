import './Testimonials.css';

import React, { useState } from 'react';

// Create TestimonialCard component directly in this file to fix import issues
const StarRating = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // Full star
      stars.push(
        <svg 
          key={i} 
          className="star filled" 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg 
          key={i} 
          className="star empty" 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
  }
  
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {stars}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const { name, role, avatar, content, rating } = testimonial;
  
  return (
    <div className="testimonial-card">
      <div className="quote-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      
      <div className="testimonial-content">
        <p>{content}</p>
      </div>
      
      <div className="testimonial-footer">
        <div className="testimonial-avatar">
          <img src={avatar} alt={`${name}`} />
        </div>
        <div className="testimonial-author">
          <h4>{name}</h4>
          <p>{role}</p>
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: 'Jamie Smith',
      role: 'Web Developer',
      avatar: '/api/placeholder/80/80',
      content: 'This portal is amazing! It made our team collaboration so much easier and more fun. The colorful interface makes working a joy!',
      rating: 5
    },
    {
      id: 2,
      name: 'Alex Johnson',
      role: 'Product Manager',
      avatar: '/api/placeholder/80/80',
      content: 'I\'ve tried many portals but this one is different. The intuitive design and engaging features help our team stay connected.',
      rating: 5
    },
    {
      id: 3,
      name: 'Sam Wilson',
      role: 'Graphic Designer',
      avatar: '/api/placeholder/80/80',
      content: 'As a designer, I appreciate the attention to detail in this portal. The playful elements make even mundane tasks enjoyable!',
      rating: 4
    },
    {
      id: 4,
      name: 'Taylor Reed',
      role: 'Marketing Director',
      avatar: '/api/placeholder/80/80',
      content: 'Our marketing team loves using this portal! The bright colors and friendly interface make our daily stand-ups something to look forward to.',
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
                <TestimonialCard testimonial={testimonial} />
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