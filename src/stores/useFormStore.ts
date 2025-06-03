import { create } from 'zustand';

export interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface FormErrors {
    [key: string]: string | undefined;
}

interface FormState {
    formData: FormData;
    errors: FormErrors;
    touched: Partial<Record<keyof FormData, boolean>>;
    isSubmitted: boolean;
    isLoading: boolean;
    setField: (field: keyof FormData, value: string) => void;
    setTouched: (field: keyof FormData) => void;
    validateField: (field: keyof FormData, value: string) => string | undefined;
    validateForm: () => boolean;
    submitForm: () => Promise<void>;
    resetForm: () => void;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    message: ''
};

export const useFormStore = create<FormState>((set, get) => ({
    formData: initialFormData,
    errors: {},
    touched: {},
    isSubmitted: false,
    isLoading: false,

    setField: (field, value) => {
        const error = get().validateField(field, value);
        set(state => ({
            formData: { ...state.formData, [field]: value },
            errors: error
                ? { ...state.errors, [field]: error }
                : Object.fromEntries(Object.entries(state.errors).filter(([k]) => k !== field))
        }));
    },

    setTouched: (field) => {
        set(state => ({
            touched: { ...state.touched, [field]: true }
        }));
    },

    validateField: (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return 'Họ và tên là bắt buộc';
                if (value.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
                break;
            case 'email':
                if (!value.trim()) return 'Email là bắt buộc';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
                break;
            case 'phone':
                if (!value.trim()) return 'Số điện thoại là bắt buộc';
                if (!/^[0-9+\-\s()]{10,15}$/.test(value)) return 'Số điện thoại không hợp lệ';
                break;
            case 'message':
                if (!value.trim()) return 'Tin nhắn là bắt buộc';
                if (value.length < 10) return 'Tin nhắn phải có ít nhất 10 ký tự';
                break;
        }
        return undefined;
    },

    validateForm: () => {
        const data = get().formData;
        const errors: FormErrors = {};
        let valid = true;

        for (const field in data) {
            const error = get().validateField(field as keyof FormData, data[field as keyof FormData]);
            if (error) {
                errors[field] = error;
                valid = false;
            }
        }

        set({ errors });
        return valid;
    },

    submitForm: async () => {
        if (!get().validateForm()) return;

        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ isLoading: false, isSubmitted: true });

        setTimeout(() => get().resetForm(), 3000);
    },

    resetForm: () => {
        set({
            formData: initialFormData,
            errors: {},
            touched: {},
            isSubmitted: false,
            isLoading: false
        });
    }
}));
