import React from 'react';
import { IconProps } from './types';

const TopupIcon: React.FC<IconProps> = () => {
  return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7644 25H26.4746C28.6372 25 30.3863 23.2391 30.3717 21.0764L30.3383 16.1175C30.3238 13.9754 28.5832 12.2465 26.4411 12.2465H25.6564H22.2489H11.7644M28.4326 5C23.7454 5 12.5668 5 10.3958 5C7.77471 5 5.65845 6.69151 5.65845 9.27948V12.2465" stroke="#28E196" stroke-width="2.07043" stroke-linecap="round" />
          <path d="M5.63318 25.6544L10.2667 21.0209L5.63318 16.3873" stroke="#1E8CFF" stroke-width="2.07043" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2.03487 21.0209L10.2665 21.0211" stroke="#1E8CFF" stroke-width="2.07043" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
  );
};

export default TopupIcon; 