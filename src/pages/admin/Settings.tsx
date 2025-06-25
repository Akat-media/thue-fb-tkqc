import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import BaseHeader from '../../api/BaseHeader';

const configSchema = z.object({
  lang: z.string().default('vi').optional(),
  admin_mail: z.string().email({ message: 'Email admin không hợp lệ' }),
  user_mail: z.string().email({ message: 'Email người dùng không hợp lệ' }),
  user_mail_pass: z.string().min(1, 'Mật khẩu người dùng là bắt buộc'),
  email_app: z.string().email({ message: 'Email ứng dụng không hợp lệ' }),
  email_app_pass: z.string().min(1, 'Mật khẩu ứng dụng là bắt buộc'),
});

type ConfigFormData = z.infer<typeof configSchema>;

const SettingsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      lang: 'vi',
      admin_mail: '',
      user_mail: '',
      user_mail_pass: '',
      email_app: '',
      email_app_pass: '',
    },
    mode: 'onChange',
  });

  const currentLang = useWatch({ control, name: 'lang' });

  const toggleLang = () => {
    setValue('lang', currentLang === 'vi' ? 'en' : 'vi', { shouldDirty: true });
  };

  const onSubmit = async (data: ConfigFormData) => {
    setIsLoading(true);
    try {
      await BaseHeader({
        url: 'config',
        method: 'post',
        data,
      });
      toast.success('Cập nhật cấu hình thành công!');
      reset(data);
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error('Có lỗi xảy ra khi cập nhật cấu hình');
    } finally {
      setIsLoading(false);
    }
  };

  const LangToggle = () => (
    <button
      type="button"
      onClick={toggleLang}
      className="flex items-center justify-between w-18 px-2 py-1 rounded-full border shadow-sm bg-white hover:bg-gray-100"
    >
      {currentLang === 'vi' ? (
        <>
          <img
            src="https://flagcdn.com/w40/vn.png"
            alt="VI"
            className="w-6 h-6 rounded-full"
          />
          <span className="ml-2 font-semibold text-gray-800">VI</span>
        </>
      ) : (
        <>
          <span className="mr-2 font-semibold text-gray-800">EN</span>
          <img
            src="https://flagcdn.com/w40/gb.png"
            alt="EN"
            className="w-6 h-6 rounded-full"
          />
        </>
      )}
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Cấu Hình Hệ Thống
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-100 rounded-lg shadow-md p-6 space-y-6"
      >
        <div className="flex items-center gap-4">
          <label className="text-xl font-medium text-gray-700">Ngôn ngữ</label>
          <div className="w-20">
            <LangToggle />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin_mail"
            className="block text-xl font-medium text-gray-700"
          >
            Email admin
          </label>
          <input
            type="email"
            id="admin_mail"
            {...register('admin_mail')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="admin@domain.com"
          />
          {errors.admin_mail && (
            <p className="text-sm text-red-600">{errors.admin_mail.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="user_mail"
            className="block text-xl font-medium text-gray-700"
          >
            Email người dùng
          </label>
          <input
            type="email"
            id="user_mail"
            {...register('user_mail')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="user@domain.com"
          />
          {errors.user_mail && (
            <p className="text-sm text-red-600">{errors.user_mail.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="user_mail_pass"
            className="block text-xl font-medium text-gray-700"
          >
            Mật khẩu người dùng
          </label>
          <input
            type="password"
            id="user_mail_pass"
            {...register('user_mail_pass')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.user_mail_pass && (
            <p className="text-sm text-red-600">
              {errors.user_mail_pass.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email_app"
            className="block text-xl font-medium text-gray-700"
          >
            Email ứng dụng
          </label>
          <input
            type="email"
            id="email_app"
            {...register('email_app')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="app@domain.com"
          />
          {errors.email_app && (
            <p className="text-sm text-red-600">{errors.email_app.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email_app_pass"
            className="block text-xl font-medium text-gray-700"
          >
            Mật khẩu ứng dụng
          </label>
          <input
            type="password"
            id="email_app_pass"
            {...register('email_app_pass')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.email_app_pass && (
            <p className="text-sm text-red-600">
              {errors.email_app_pass.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !isDirty || !isValid}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isLoading || !isDirty || !isValid
                ? 'opacity-70 cursor-not-allowed'
                : ''
            }`}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
