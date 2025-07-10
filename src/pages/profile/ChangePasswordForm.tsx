import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import BaseHeader from '../../api/BaseHeader.ts';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useUserStore } from '../../stores/useUserStore';
import { useTranslation } from 'react-i18next';

interface User {
  id?: string;
  password?: string;
}

const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const user = localStorage.getItem('user');
  const initialUser: User =
    typeof user === 'string' ? JSON.parse(user).user : {};
  const { fetchUser } = useUserStore();

  const schema = z
    .object({
      oldPassword: z.string().min(1, t('profile.password.validate.oldRequired')),
      newPassword: z.string().min(6, t('profile.password.validate.newMin')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('profile.password.validate.confirmMismatch'),
      path: ['confirmPassword'],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: t('profile.password.validate.sameAsOld'),
      path: ['newPassword'],
    });

  type ChangePasswordData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: ChangePasswordData) => {
    if (!initialUser.id) {
      toast.error(t('profile.password.toast.noUserId'), { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const response = await BaseHeader({
        method: 'put',
        url: `/user/${initialUser.id}`,
        data: {
          password: data.newPassword,
          oldPassword: data.oldPassword,
        },
      });

      if (response?.data?.success) {
        toast.success(t('profile.password.toast.success'), {
          position: 'top-right',
          autoClose: 3000,
        });

        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.user.password = data.newPassword;
          localStorage.setItem('user', JSON.stringify(parsed));
        }

        await fetchUser();
      } else {
        let apiMsg = response?.data?.message;
        if (apiMsg === 'Refresh token không được để trống') {
          apiMsg = t('profile.password.toast.wrongPassword');
        }
        toast.error(apiMsg || t('profile.password.toast.defaultError'), {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      let apiMessage = error?.response?.data?.message;
      if (apiMessage === 'Refresh token không được để trống') {
        apiMessage = t('profile.password.toast.wrongPassword');
      }
      toast.error(apiMessage || t('profile.password.toast.defaultError'), {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const eyeIcon = (visible: boolean) => (visible ? <FiEyeOff size={20} /> : <FiEye size={20} />);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Old Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="oldPassword">
            {t('profile.password.old')}
          </label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder={t('profile.password.placeholder.old')}
              {...register('oldPassword')}
              className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowOld((prev) => !prev)}
            >
              {eyeIcon(showOld)}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="newPassword">
            {t('profile.password.new')}
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder={t('profile.password.placeholder.new')}
              {...register('newPassword')}
              className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowNew((prev) => !prev)}
            >
              {eyeIcon(showNew)}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="confirmPassword">
            {t('profile.password.confirm')}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder={t('profile.password.placeholder.confirm')}
              {...register('confirmPassword')}
              className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {eyeIcon(showConfirm)}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {t('profile.password.button')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
