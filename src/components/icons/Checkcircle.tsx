import React from 'react';
import { IconProps } from './types';

const Checkcircle: React.FC<IconProps> = () => {
  return (
    <svg
      width="25"
      height="26"
      viewBox="0 0 25 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.3628C16.9706 21.3628 21 17.3334 21 12.3628C21 7.39223 16.9706 3.36279 12 3.36279C7.02944 3.36279 3 7.39223 3 12.3628C3 17.3334 7.02944 21.3628 12 21.3628Z"
        fill="#C9FFF3"
      />
      <path
        d="M8.5 12.7513L10.8885 15.1398L15.6655 10.3628"
        stroke="#193250"
        stroke-width="1.59234"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Checkcircle;
