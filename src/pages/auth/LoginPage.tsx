import React, { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import { useNotification } from '../../context/NotificationContext';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../api/BaseHeader';
import AtomicSpinner from 'atomic-spinner';
import { useUserStore } from '../../stores/useUserStore';
// import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginimg from '../../public/login.jpg';
import axios from 'axios';
import logo1 from '/public/logo.png';

const LoginPage: React.FC = () => {
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
      const res = await axios.post(
        '/login',
        {
          email: email,
          password: password,
        },
        {
          baseURL: BaseUrl,
        }
      );
      if (res.status == 200) {
        setIsLoading(false);
        setUser(res.data.data.user);
        navigate('/');
        localStorage.setItem('access_token', res.data.data.access_token);
        localStorage.setItem('refresh_token', res.data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        toast.success('Đăng nhập thành công!');
      } else {
        setIsLoading(false);
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await BaseHeader({
        method: 'post',
        url: '/forgot-password',
        baseURL: BaseUrl,
        data: { email },
      });
      toast.success('Email đặt lại mật khẩu đã được gửi!');
      setShowForgotPassword(false); // Quay lại login
      setEmail('');
    } catch (err: any) {
      toast.error(
          err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginimg})` }}
    >
      <img
        onClick={() => navigate('/')}
        src={logo1}
        alt="Logo"
        className="absolute top-0 left-6 w-52 h-59 object-contain z-20 mt-6 cursor-pointer"
      />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 z-10">
        <div className="mb-6">
          <h1
            className="relative inline-block text-3xl font-bold text-[#0f172a] 
              before:content-[''] before:absolute before:-right-3 before:-left-1 before:inset-x-0 before:bottom-0 before:h-1/2
              before:bg-gradient-to-r before:from-[#6cffd8] before:to-[#c1f4ff]
              before:-z-10"
          >
            Đăng nhập
          </h1>
          <p className="text-sm font-thin text-gray-800 mt-1">
            Chào mừng bạn quay lại với AKAds
          </p>
        </div>

        <form
            onSubmit={showForgotPassword ? handleForgotPasswordSubmit : handleSubmit}
            className="space-y-4"
        >
          {/*tai khoan field*/}
          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              Tài khoản
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/*mat khau field*/}
          {!showForgotPassword && (
          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          )}

          <div className="text-sm text-left">
            {!showForgotPassword ? (
                <span
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#42e1b6] hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </span>
              ) : (
                <span
                    onClick={() => setShowForgotPassword(false)}
                    className="text-[#42e1b6] hover:underline cursor-pointer"
                >
                  Quay lại đăng nhập
                </span>
              )
            }
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0a1f38] text-white rounded-full font-semibold hover:bg-[#062b57] transition"
          >
            {showForgotPassword ? 'Gửi yêu cầu' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-800">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#42e1b6] hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        <p className="mt-6 text-center text-base text-gray-500">
          © AKA Media, 2025. Bảo lưu mọi quyền.
        </p>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner atomSize={200} nucleusParticleFillColor="#ffffff" />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
