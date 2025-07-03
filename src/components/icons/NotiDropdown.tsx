import React from 'react';
import { IconProps } from './types';

const NotiDropdown: React.FC<IconProps> = ({ color = '#71717A' }) => {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={9}
        cy={9}
        r="7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.9999 5.66667H9.00824"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.1665 9H8.99984V12.3333H9.83317"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NotiDropdown;
