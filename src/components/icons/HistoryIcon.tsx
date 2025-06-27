import React from 'react';
import { IconProps } from './types';

const HistoryIcon: React.FC<IconProps> = () => {
  return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.2666 18L26.6007 15.3333L23.9333 18M27 16C27 22.6274 21.6274 28 15 28C8.37258 28 3 22.6274 3 16C3 9.37258 8.37258 4 15 4C19.4026 4 23.2514 6.37085 25.3393 9.90545" stroke="#1E8CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 11V17.6667L18 20.3333" stroke="#28E196" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
  );
};

export default HistoryIcon; 