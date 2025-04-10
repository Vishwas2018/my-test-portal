import './Categories.css';

import { Link } from 'react-router-dom';
import React from 'react';

const CategoryCard = ({ title, icon, color, link }) => {
  return (
    <Link to={link} className={`category-card ${color}`}>
      <div className="category-icon">{icon}</div>
      <h3 className="category-title">{title}</h3>
    </Link>
  );
};

const Categories = () => {
  const categories = [
    {
      id: 'math',
      title: 'Mathematics',
      icon: '➗',
      color: 'blue',
      link: '/category/math'
    },
    {
      id: 'science',
      title: 'Science',
      icon: '🔬',
      color: 'green',
      link: '/category/science'
    },
    {
      id: 'language',
      title: 'Language Arts',
      icon: '📚',
      color: 'purple',
      link: '/category/language'
    },
    {
      id: 'history',
      title: 'History',
      icon: '🏛️',
      color: 'orange',
      link: '/category/history'
    },
    {
      id: 'tech',
      title: 'Technology',
      icon: '💻',
      color: 'teal',
      link: '/category/tech'
    },
    {
      id: 'art',
      title: 'Arts & Crafts',
      icon: '🎨',
      color: 'pink',
      link: '/category/art'
    }
  ];

  return (
    <section className="categories-section">
      <div className="container categories-container">
        <h2 className="section-title">Explore Categories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              title={category.title}
              icon={category.icon}
              color={category.color}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;