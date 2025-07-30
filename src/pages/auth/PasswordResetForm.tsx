import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import BaseHeader, { BaseUrl } from '../../api/BaseHeader.ts';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const PasswordResetForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token') || '';

  const passwordResetSchema = z.object({
    password: z
        .string()
        .min(8, t('modalHomepage.forgotPassword.strongPass.strong6'))
        .regex(/[A-Z]/, t('modalHomepage.forgotPassword.strongPass.strong7'))
        .regex(/[a-z]/, t('modalHomepage.forgotPassword.strongPass.strong8'))
        .regex(/\d/, t('modalHomepage.forgotPassword.strongPass.strong9'))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t('modalHomepage.forgotPassword.strongPass.strong10')),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('modalHomepage.forgotPassword.matchNotPass'),
    path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof passwordResetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Token không hợp lệ');
      return;
    }
    setIsLoading(true);
    try {
      const response = await BaseHeader({
        method: 'post',
        url: '/reset-password',
        baseURL: BaseUrl,
        data: {
          token,
          newPassword: data.password,
        },
        headers: {
          'Accept-Language': i18n.language || 'vi',
        },
      });

      if (response.data.success) {
        setIsLoading(false);
        setIsSuccess(true);
        toast.success(t('modalHomepage.forgotPassword.successToast'));
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage =
          error.response?.data?.message || t('modalHomepage.forgotPassword.failToast')
      toast.error(errorMessage);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {t('modalHomepage.forgotPassword.successReset')}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('modalHomepage.forgotPassword.successReset2')}
            </p>
            <button
                onClick={() => (window.location.href = '/login')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              {t('modalHomepage.forgotPassword.successReset3')}
            </button>
          </div>
        </div>
    );
  }

  // Main form
  return (
      <div className="bg-gradient-to-br from-blue-100 via-sky-200 to-cyan-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{t('modalHomepage.forgotPassword.createNew')}</h1>
              <p className="opacity-90">
                {t('modalHomepage.forgotPassword.enterNewPass')}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('profile.password.new')}
                </label>
                <div className="relative">
                  <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all border-gray-300 focus:ring-blue-500`}
                      placeholder={t('profile.password.confirm')}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}


              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modalHomepage.register.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all border-gray-300 focus:ring-blue-500`}
                      placeholder={t('profile.password.confirm')}
                  />
                  <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                      <span className="text-red-500">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm mb-1">
                      {t('modalHomepage.forgotPassword.accountSecurity')}
                    </p>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      {t('modalHomepage.forgotPassword.accountSecurity2')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      isValid && !isLoading
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                          : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{t('profile.avatar.loading')}</span>
                    </>
                ) : (
                    <span> {t('modalHomepage.forgotPassword.updatePass')}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default PasswordResetForm;
