import React from 'react';
import { IconProps } from './types';

const VietnameseFlag: React.FC<IconProps> = ({ width = 25, height = 25 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 513 343"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_301_64)">
        <path
          d="M197.025 0.960205H0V342.953H513V0.960205H197.025Z"
          fill="#D80027"
        />
        <path
          d="M256.5 73.0427L279.207 142.926H352.688L293.24 186.116L315.948 256.001L256.5 212.81L197.052 256.001L219.76 186.116L160.312 142.926H233.793L256.5 73.0427Z"
          fill="#FFDA44"
        />
      </g>
      <defs>
        <clipPath id="clip0_301_64">
          <rect
            width="513"
            height="342"
            fill="white"
            transform="translate(0 0.956299)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default VietnameseFlag;
