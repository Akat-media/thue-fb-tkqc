import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { toast } from "react-toastify";

interface AddUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    username: string;
    email: string;
    phone: string;
    role: string;
    password: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            role: '',
            password: '',
        },
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post(`${baseUrl}/user`, data);
            toast.success('Thêm người dùng thành công');
            onSuccess();
            reset();
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error.message;

            if (errorMsg?.toLowerCase().includes('email')) {
                toast.error('Email đã tồn tại');
            } else {
                toast.error('Lỗi khi thêm người dùng. Vui lòng thử lại.');
            }

            console.error('Lỗi khi thêm người dùng:', errorMsg);
        }
    };

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4"
            >
                {/* Header với gradient background */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
                    <button
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90"
                        onClick={() => {
                            onClose();
                            reset();
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-bold text-white pr-10">Thêm người dùng mới</h2>
                    <p className="text-blue-100 text-sm mt-1">Điền thông tin để tạo tài khoản</p>
                </div>

                {/* Form content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Tên người dùng
                            </label>
                            <div className="relative">
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{
                                        required: 'Tên người dùng là bắt buộc',
                                        minLength: { value: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự' },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                                                errors.username ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            placeholder="Nhập tên người dùng"
                                        />
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Email
                            </label>
                            <div className="relative">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email là bắt buộc',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Email không hợp lệ',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="email"
                                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                                                errors.email ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            placeholder="Nhập địa chỉ email"
                                        />
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        required: 'Số điện thoại là bắt buộc',
                                        pattern: {
                                            value: /^\+?\d{10,15}$/,
                                            message: 'Số điện thoại không hợp lệ',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                                                errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Role */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Vai trò
                            </label>
                            <div className="relative">
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{
                                        required: 'Vai trò là bắt buộc',
                                        validate: (value) => ['admin', 'user'].includes(value) ? true : 'Vai trò không hợp lệ',
                                    }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className={`w-full p-3 pl-10 pr-8 border-2 rounded-xl transition-all duration-200 outline-none appearance-none cursor-pointer ${
                                                errors.role ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            } bg-gray-50/50 hover:bg-white`}
                                        >
                                            <option value="">Chọn vai trò</option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.093" />
                                    </svg>
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: 'Mật khẩu là bắt buộc',
                                        minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                    }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="password"
                                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                                                errors.password ? 'border-red-400' : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                            }`}
                                            placeholder="Nhập mật khẩu"
                                        />
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    reset();
                                }}
                                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={Object.keys(errors).length > 0}
                                className={`flex-1 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                                    Object.keys(errors).length > 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                }`}
                            >
                                Thêm người dùng
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
