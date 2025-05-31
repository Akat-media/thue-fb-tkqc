import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../api/BaseHeader";
import { toast } from "react-toastify";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) newErrors.email = "Vui lòng nhập email";
        if (!password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${BaseUrl}/login`, { email, password });

            const { access_token, refresh_token, ...userData } = res.data.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(userData));

            toast.success("Đăng nhập thành công!");
            onClose();

            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (err) {
            toast.error("Email hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
            <div className="bg-white  w-full max-w-5xl rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ✕
                </button>

                <div className="hidden md:block w-1/2 bg-blue-700">
                    <img
                        src="/aka2.jpg"
                        alt="Ảnh mô tả"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">Đăng nhập</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Chào mừng bạn quay lại với AKA Media
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-600">
                                Tài khoản
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-600">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
                            Quên mật khẩu?
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${
                                loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                            } text-white font-semibold py-2 rounded-lg transition flex justify-center items-center`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>

                        <div className="text-center text-sm mt-2">
                            Bạn chưa có tài khoản?{" "}
                            <span className="text-blue-600 hover:underline cursor-pointer">
                                Tạo tài khoản ngay
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
