import React, { useState } from 'react';

interface ToggleProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        type="button"
        className={`
                  w-11 h-6 relative inline-flex items-center rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-offset-white
                  ${
                    isChecked
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400'
                  }
                  ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }
                `}
        onClick={handleToggle}
        disabled={disabled}
        aria-checked={isChecked}
        role="switch"
        aria-label={label || 'Toggle switch'}
      >
        <span
          className={`
            w-4 h-4 pointer-events-none inline-block rounded-full bg-white shadow-lg 
            ring-0 transition-transform duration-200 ease-in-out
            ${isChecked ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        />
      </button>

      {label && (
        <label
          className={`
                        ml-3 text-sm font-medium text-gray-900 cursor-pointer select-none
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
          onClick={!disabled ? handleToggle : undefined}
        >
          {label}
        </label>
      )}
    </div>
  );
};
interface ToggleStatusProps {
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
}

const ToggleStatus: React.FC<ToggleStatusProps> = ({
  isEnabled,
  setIsEnabled,
}) => {
  // const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="">
      <Toggle defaultChecked={isEnabled} onChange={setIsEnabled} />
    </div>
  );
};

export default ToggleStatus;
