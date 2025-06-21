import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../api/BaseHeader';
import AtomicSpinner from 'atomic-spinner';
import { useUserStore } from '../../stores/useUserStore';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginimg from '../../public/login.jpg';

const LoginPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { setUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await BaseHeader({
        method: 'post',
        url: '/login',
        baseURL: BaseUrl,
        data: {
          email: email,
          password: password,
        },
      });
      setUser(res.data.data.user);
      navigate('/');
      localStorage.setItem('access_token', res.data.data.access_token);
      localStorage.setItem('refresh_token', res.data.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-transparent via-blue-100/70 to-white backdrop-blur-sm relative">
        <Link
          to="/"
          className="absolute top-6 left-6 text-[#0167F8] font-semibold	 text-3xl hover:underline"
        >
          AKAds
        </Link>
        <div className="w-[420px] p-8 mt-10 rounded-lg">
          <h1 className="text-2xl font-semibold text-[#0167F8] mb-2">
            Vui Lòng Đăng Nhập
          </h1>
          <h3 className="text-sm text-gray-500 mb-6"> RPA </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase text-[#0167F8]"
              >
                Tài Khoản
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8] pr-10"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase text-[#0167F8]"
              >
                Mật Khẩu
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8] pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:underline"
              >
                Quên Mật Khẩu?
              </button>
              {showForgotPassword && (
                <ForgotPasswordModal
                  isOpen={showForgotPassword}
                  onClose={() => setShowForgotPassword(false)}
                  onSwitchToLogin={() => {
                    setShowForgotPassword(false);
                  }}
                />
              )}
            </div>
            <button
              type="submit"
              className="px-8 py-2 bg-[#0167F8] text-white rounded-full hover:bg-[#005fce] transition mx-auto block shadow-md hover:shadow-lg"
            >
              Đăng Nhập
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            Chưa Có Tài Khoản?{' '}
            <Link to="/register" className="text-[#0167F8] hover:underline">
              Đăng Ký Ngay
            </Link>
          </p>
          <p className="mt-4 text-center text-xs text-gray-400">
            © Bản quyền thuộc về AKA Media
          </p>
        </div>
      </div>
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={loginimg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner size={60} color="#ffffff" />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
