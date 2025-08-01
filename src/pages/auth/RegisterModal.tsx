import React, { useState } from 'react';
import ReactDOM from 'react-dom';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AtomicSpinner from 'atomic-spinner';
import { Mail, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore.ts';
import { useNavigate } from 'react-router-dom';
import {usePageStore} from "../../stores/usePageStore.ts";
import {useTranslation} from "react-i18next";
import i18n from "i18next";


interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral_code, setReferral_code] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    referral_code?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const {t} = useTranslation();

  const { formatDateToVN } = usePageStore();
  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = t('modalHomepage.register.errorName');
    if (!email) newErrors.email = t('modalHomepage.register.errorEmail');
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = t('modalHomepage.register.errorEmail2');
    if (!phone) newErrors.phone = t('modalHomepage.register.errorPhone');
    else if (!/^[0-9]{10}$/.test(phone))
      newErrors.phone = t('modalHomepage.register.errorPhone2');
    if (!password) newErrors.password = t('modalHomepage.register.errorPassword');
    else if (password.length < 6)
      newErrors.password = t('modalHomepage.register.notePassword');
    if (password !== confirmPassword)
      newErrors.confirmPassword = t('modalHomepage.register.errorConfirmPassword');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const now = new Date().toISOString();
  const createdTime = formatDateToVN(now);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const registerRes = await BaseHeader({
        method: 'post',
        url: '/user',
        baseURL: BaseUrl,
        data: {
          username: name,
          email: email,
          phone: phone,
          password: password,
          role: 'user',
          code: referral_code ? referral_code : undefined,
        },
      });

      if (registerRes.status == 200) {
        const loginRes = await BaseHeader({
          method: 'post',
          url: '/login',
          baseURL: BaseUrl,
          data: {
            email: email,
            password: password,
          },
        });

        const { access_token, refresh_token, ...userData } = loginRes.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(loginRes.data.data);

        await BaseHeader({
          method: 'post',
          url: '/register-success',
          baseURL: BaseUrl,
          data: {
            email: email,
            createdTime: createdTime
          },
          headers: {
            'Accept-Language': i18n.language || 'vi',
          },
        })

        navigate('/');

        onClose();

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        toast.error(registerRes.data.message || t('modalHomepage.register.failedRegister'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage ===  t('modalHomepage.register.existedEmail')) {
          setErrors({ email: t('modalHomepage.register.existedEmail2')});
          setEmail('');
        } else {
          toast.error(errorMessage || t('modalHomepage.register.failedRegister'));
        }
      } else {
        toast.error(t('modalHomepage.register.errorCommon'));
      }
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <div className="hidden md:block w-1/2 bg-blue-700">
          <img
            src={'/seeding.jpg'}
            alt="Ảnh mô tả"
            className="w-full h-full object-inherit"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            {t('modalHomepage.register.title')}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {t('modalHomepage.register.subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-blue-600"
              >
                {t('modalHomepage.register.name')} <span className="text-red-500">(*)</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('modalHomepage.register.name')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-blue-600"
              >
                Email <span className="text-red-500">(*)</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-blue-600"
              >
                {t('modalHomepage.register.phone')} <span className="text-red-500">(*)</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-blue-600"
              >
                {t('modalHomepage.register.password')} <span className="text-red-500">(*)</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
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
              {errors.password ? (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1">
                  {t('modalHomepage.register.notePassword')}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-blue-600"
              >
                {t('modalHomepage.register.confirmPassword')} <span className="text-red-500">(*)</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              {!errors.confirmPassword && (
                <p className="text-xs text-gray-400 mt-1">
                  {t('modalHomepage.register.notePassword2')}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="referral_code"
                className="block text-sm font-semibold text-blue-600"
              >
                {t('modalHomepage.register.codeIntroduce')}
              </label>
              <div className="relative mt-1">
                <input
                  type={'text'}
                  id="referral_code"
                  value={referral_code}
                  onChange={(e) => setReferral_code(e.target.value)}
                  placeholder= {t('modalHomepage.register.codeIntroduce')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                />
              </div>
              {errors.referral_code && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.referral_code}
                </p>
              )}
              {/*{!errors.referral_code && (*/}
              {/*  <p className="text-xs text-gray-400 mt-1">*/}
              {/*    {t('modalHomepage.register.notePassword2')}*/}
              {/*  </p>*/}
              {/*)}*/}
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
              ) : (
                  t('modalHomepage.register.buttonRegister')
              )}
            </button>

            <div className="text-center text-sm mt-2">
              {t('modalHomepage.register.hadAccount')}{' '}
              <span
                onClick={() => {
                  if (onSwitchToLogin) {
                    onSwitchToLogin();
                  } else {
                    onClose();
                  }
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                 {t('modalHomepage.register.login')}
              </span>
            </div>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner atomSize={200} nucleusParticleFillColor="#ffffff" />
        </div>
      )}
    </div>,
    document.body
  );
};

export default RegisterModal;
