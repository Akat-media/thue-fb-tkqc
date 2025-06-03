import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    label: string;
    name: keyof import('../../stores/useFormStore.ts').FormData;
    type?: string;
    placeholder: string;
    icon?: React.ReactNode;
    isTextarea?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    error?: string;
}

const FormField: React.FC<Props> = ({
    label, name, type = 'text', placeholder, isTextarea = false, value, onChange, onBlur, error
}) => {
    const baseClasses =
        'w-full pl-4 pr-4 py-4 border-2 rounded-2xl focus:ring-4 transition-all duration-300 text-gray-900 placeholder-gray-400 ';

    const borderClass = error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100';

    return (
        <div className="relative mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                {/*{icon && (*/}
                {/*    <div className="absolute inset-y-0 left-4 flex items-center">*/}
                {/*        {icon}*/}
                {/*    </div>*/}
                {/*)}*/}
                {isTextarea ? (
                    <textarea
                        name={name}
                        rows={5}
                        className={`${baseClasses} ${borderClass} resize-none`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                ) : (
                    <input
                        name={name}
                        type={type}
                        className={`${baseClasses} ${borderClass}`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
                {error && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
