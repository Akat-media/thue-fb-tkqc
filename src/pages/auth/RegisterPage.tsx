import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Phone, Eye, EyeOff, Bookmark } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { BaseUrl } from '../../api/BaseHeader';
import BaseHeader from '../../api/BaseHeader';
import AtomicSpinner from 'atomic-spinner';
// import registerimg from '../../public/sand.jpg';
import axios from 'axios';
import logo1 from '/public/logo.png';
import loginimg from '../../public/login.jpg';
import {usePageStore} from "../../stores/usePageStore.ts";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import i18n from "i18next";

const RegisterPage: React.FC = () => {
  // const [isOpen, setIsOpen] = useState(true);
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
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const { formatDateToVN } = usePageStore();
  const {t} = useTranslation();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = t('modalHomepage.register.errorName')
    if (!email) newErrors.email = t('modalHomepage.register.errorEmail')
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = t('modalHomepage.register.errorEmail2')
    if (!phone) newErrors.phone = t('modalHomepage.register.errorPhone')
    else if (!/^[0-9]{10}$/.test(phone))
      newErrors.phone = t('modalHomepage.register.errorPhone2')
    if (!password) newErrors.password = t('modalHomepage.register.errorPassword')
    else if (password.length < 6)
      newErrors.password = t('modalHomepage.register.notePassword')
    if (password !== confirmPassword)
      newErrors.confirmPassword = t('modalHomepage.register.errorConfirmPassword')
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
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

      const now = new Date().toISOString();
      const createdTime = formatDateToVN(now);
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

      if (registerRes.status === 200) {
        setIsLoading(false);
        addNotification(
          t('registerPage.successRegister'),
          t('registerPage.successRegister2'),
          'success'
        );
        // toast.success(t('registerPage.successRegister'))
        const loginRes = await axios.post(
          '/login',
          {
            email: email,
            password: password,
          },
          {
            baseURL: BaseUrl,
          }
        );
        navigate('/');
        localStorage.setItem('access_token', loginRes.data.data.access_token);
        localStorage.setItem('refresh_token', loginRes.data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(loginRes.data.data));
      } else {
        setIsLoading(false);
        addNotification(t('modalHomepage.register.failedRegister'), registerRes.data.message, 'error');
        toast.error("error")
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        toast.error(t('modalHomepage.register.existedEmail'));

        if (errorMessage === t('modalHomepage.register.existedEmail')) {
          setErrors({ email: t('modalHomepage.register.existedEmail2')});
          setEmail('');
        } else {
          addNotification(t('modalHomepage.register.failedRegister'), errorMessage, 'error');
        }
      } else {
        toast.error(t('modalHomepage.register.failedRegister'));
        addNotification(
          t('modalHomepage.register.failedRegister'),
          t('modalHomepage.register.errorCommon'),
          'error'
        );
      }

      setIsLoading(false);
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
          <h1 className="relative inline-block text-3xl font-bold text-[#0f172a] before:content-[''] before:absolute before:-right-3 before:-left-1 before:inset-x-0 before:bottom-0 before:h-1/2 before:bg-gradient-to-r before:from-[#6cffd8] before:to-[#c1f4ff] before:-z-10">
            {t('modalHomepage.register.title')}
          </h1>
          <p className="text-sm font-thin text-gray-800 mt-1">
            {t('modalHomepage.register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              {t('modalHomepage.register.name')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder= {t('modalHomepage.register.name')}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              Email
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

          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              {t('modalHomepage.register.phone')}
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder= {t('modalHomepage.register.phone')}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              {t('modalHomepage.register.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder= "••••••••"
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

          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              {t('modalHomepage.register.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold uppercase text-black mb-1">
              {t('modalHomepage.register.codeIntroduce')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={referral_code}
                onChange={(e) => setReferral_code(e.target.value)}
                placeholder={t('modalHomepage.register.codeIntroduce')}
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:border-[#f2f2f2] pr-10 text-base"
              />
              <Bookmark className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0a1f38] text-white rounded-full font-semibold hover:bg-[#062b57] transition"
          >
            {t('modalHomepage.register.buttonRegister')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-800">
          {t('modalHomepage.register.hadAccount')}{' '}
          <Link to="/login" className="text-[#42e1b6] hover:underline">
            {t('modalHomepage.register.login')}
          </Link>
        </p>

        <p className="mt-6 text-center text-base text-gray-500">
          {t('loginPage.allRightReserved')}
        </p>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner atomSize={200} nucleusParticleFillColor="#ffffff" />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
