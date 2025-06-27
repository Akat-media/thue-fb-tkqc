import React from "react";

interface ChevronRightIconProps extends React.SVGProps<SVGSVGElement> {
    isBlack?: boolean;
}

const ChevronRightGradient = ({ isBlack = false, ...props }: ChevronRightIconProps) => (
    <svg
        {...props}
        fill={isBlack ? "black" : "url(#gradient)"}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
    >
        {!isBlack && (
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                    <stop offset="0%" stopColor="#00EFBF" />
                    <stop offset="50%" stopColor="#00EAEA" />
                    <stop offset="100%" stopColor="#00F2F6" />
                </linearGradient>
            </defs>
        )}
        <path
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        />
    </svg>
);

export default ChevronRightGradient;
