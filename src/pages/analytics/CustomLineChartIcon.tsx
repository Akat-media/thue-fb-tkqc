// LineChartIcon.tsx
import React from 'react';

const CustomLineChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 66"
            width="100"
            height="66"
            className="w-6 h-6 text-emerald-600"
            {...props}
        >
            <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5be49b" />
                    <stop offset="100%" stopColor="#00a76f" />
                </linearGradient>
            </defs>
            <path
                d="M 0 42.12C 4.4 42.12 8.17 49.68 12.57 49.68C 16.97 49.68 20.74 35.1 25.14 35.1C 29.54 35.1 33.31 27 37.71 27C 42.11 27 45.89 9.72 50.29 9.72C 54.68 9.72 58.46 8.64 62.86 8.64C 67.26 8.64 71.03 12.42 75.43 12.42C 79.83 12.42 83.6 47.52 88 47.52"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default CustomLineChartIcon;
