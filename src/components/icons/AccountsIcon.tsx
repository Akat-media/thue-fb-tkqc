import React from 'react';
import { IconProps } from './types';

const AccountsIcon: React.FC<IconProps> = () => {
  return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.8125 17.2L8.21252 17.2M12.3268 28H25.6982C27.9705 28 29.8125 26.0659 29.8125 23.68V15.04C29.8125 12.6541 27.9705 10.72 25.6982 10.72H12.3268C10.0546 10.72 8.21252 12.6541 8.21252 15.04V23.68C8.21252 26.0659 10.0546 28 12.3268 28Z" stroke="#1E8CFF" stroke-width="2" />
          <path d="M11.4518 22.6H16.0804" stroke="#28E196" stroke-width="2" stroke-linecap="round" />
          <path d="M4.85198 21.28C3.23198 21.28 2.15198 19.3459 2.15198 16.96V11.56C2.15198 7.78 4.31198 4 8.63198 4H20.7177C22.9899 4 25.9996 4.5 25.9996 7" stroke="#28E196" stroke-width="2" stroke-linecap="round" />
      </svg>
  );
};

export default AccountsIcon; 