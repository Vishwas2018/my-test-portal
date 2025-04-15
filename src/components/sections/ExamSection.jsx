// src/components/sections/ExamSection.jsx
import React from 'react';
import SubjectCard from '../ExamInterface/SubjectCard/SubjectCard';
import { getSubjects } from '../../utils/examUtils';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 4rem 0;
  background-color: var(--off-white);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236ECFFF' fill-opacity='0.1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 1;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--dark);
`;

const SectionDescription = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
  color: var(--dark-gray);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ExamSection = () => {
  const subjects = getSubjects();
  
  return (
    <SectionContainer>
      <ContentContainer>
        <SectionTitle>Practice Exams</SectionTitle>
        <SectionDescription>
          Test your knowledge with our interactive exams. Select a subject to begin.
        </SectionDescription>
        
        <SubjectsGrid>
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </SubjectsGrid>
      </ContentContainer>
    </SectionContainer>
  );
};

export default ExamSection;