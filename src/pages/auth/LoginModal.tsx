import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AtomicSpinner from "atomic-spinner";
import { Mail, Eye, EyeOff } from 'lucide-react';
import {useTranslation} from "react-i18next";
import {useUserStore} from "../../stores/useUserStore.ts";
import {useNavigate} from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const {t,i18n} = useTranslation();
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = t('modalHomepage.login.validateEmail');
    if (!password.trim()) newErrors.password = t('modalHomepage.login.validatePassword');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await BaseHeader({
        method: 'post',
        url: '/login',
        baseURL: BaseUrl,
        data: { email, password },
      });

      const { access_token, refresh_token, ...userData } = res.data.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      onClose();

      setUser(res.data.data.user);
      navigate('/');

      // if (onLoginSuccess) {
      //   onLoginSuccess();
      // }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || t('modalHomepage.login.error')
      );
    } finally {
      setLoading(false);
    }
  };

  // form quên mật khẩu
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: { email?: string } = {};
    if (!email.trim()) newErrors.email =  t('modalHomepage.login.validateEmail');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await BaseHeader({
        method: 'post',
        url: '/forgot-password',
        baseURL: BaseUrl,
        data: { email },
        headers: {
          'Accept-Language': i18n.language || 'vi',
        },
      });
      toast.success(t('modalHomepage.login.toastSuccess'));
      setIsForgotPassword(false); // Quay lại form đăng nhập
      setEmail(''); // Xóa email sau khi gửi
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || t('modalHomepage.login.error')
      );
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden relative">
        <button
          // onClick={onClose}
          onClick={() => {
            setIsForgotPassword(false); // Reset về form đăng nhập khi đóng
            setEmail('');
            setPassword('');
            setErrors({});
            onClose();
          }}
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
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            {isForgotPassword ? t('modalHomepage.login.forgotPassword') : t('modalHomepage.login.title')}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isForgotPassword
              ? t('modalHomepage.login.subTitle2')
              : t('modalHomepage.login.subTitle')
            }
          </p>

          {/*<form onSubmit={handleSubmit} className="space-y-4">*/}
          <form
            onSubmit={
              isForgotPassword ? handleForgotPasswordSubmit : handleLoginSubmit
            }
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-600"
              >
                Email
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {!isForgotPassword && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-600"
                >
                  {t('modalHomepage.login.password')}
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
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
            )}

            <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
              <span onClick={() => setIsForgotPassword(!isForgotPassword)}>
                {isForgotPassword ? t('modalHomepage.login.backToLogin') : t('modalHomepage.login.forgotPassword')}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
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
              ) : isForgotPassword ? (
                t('modalHomepage.login.sendRequest')
              ) : (
               t('modalHomepage.login.title')
              )}
            </button>

            {!isForgotPassword && (
              <div className="text-center text-sm mt-2">
                {t('modalHomepage.login.footer1')}{' '}
                <span
                  onClick={() => {
                    if (onSwitchToRegister) {
                      onSwitchToRegister();
                    } else {
                      onClose();
                      window.location.href = '/register';
                    }
                  }}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {t('modalHomepage.login.footer2')}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
