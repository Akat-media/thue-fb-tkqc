import React from 'react';
import { IconProps } from './types';

const RentedIcon: React.FC<IconProps> = () => {
  return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.4995 24.9168H7.7615C5.13159 24.9168 2.99963 22.6782 2.99963 19.9168V9.91692C2.99963 7.15552 5.13159 4.91696 7.7615 4.91696H23.2376C25.8675 4.91696 27.9994 7.15552 27.9994 9.91692V17.4169" stroke="#1E8CFF" stroke-width="2" stroke-linecap="round" />
          <path d="M6.74951 18.6668H12.1066" stroke="#28E196" stroke-width="2" stroke-linecap="round" />
          <path d="M19.2495 24.0833L22.1662 27L27.9994 21.1667" stroke="#28E196" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="2.99963" y1="12.6667" x2="27.9994" y2="12.6667" stroke="#1E8CFF" stroke-width="2" />
      </svg>
  );
};

export default RentedIcon; 