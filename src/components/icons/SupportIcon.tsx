import React from 'react';
import { IconProps } from './types';

const SupportIcon: React.FC<IconProps> = () => {
  return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 22V16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16V21.5" stroke="#28E196" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 22.2143C4 20.4391 5.567 19 7.5 19C9.433 19 11 20.4391 11 22.2143V24.7857C11 26.5609 9.433 28 7.5 28C5.567 28 4 26.5609 4 24.7857V22.2143Z" stroke="#1E8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 22.2143C21 20.4391 22.567 19 24.5 19C26.433 19 28 20.4391 28 22.2143V24.7857C28 26.5609 26.433 28 24.5 28C22.567 28 21 26.5609 21 24.7857V22.2143Z" stroke="#1E8CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  );
};

export default SupportIcon; 
