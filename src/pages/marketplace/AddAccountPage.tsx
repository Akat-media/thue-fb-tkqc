import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AdAccount } from '../../types';
import { useAdAccountStore } from './adAccountStore';

const formSchema = z.object({
  adAccountType: z
    .string()
    .min(1, { message: 'Vui lòng chọn loại tài khoản quảng cáo' })
    .refine((val) => ['facebook', 'google', 'tiktok'].includes(val), {
      message:
        'Loại tài khoản quảng cáo không hợp lệ, vui lòng chọn Facebook, Google hoặc TikTok',
    }),
  name: z.string().min(1, { message: 'Vui lòng nhập tên tài khoản' }),
  accountType: z
    .string()
    .min(1, { message: 'Vui lòng chọn loại tài khoản' })
    .refine(
      (val) =>
        ['personal', 'business', 'visa', 'high_limit', 'low_limit'].includes(
          val
        ),
      {
        message:
          'Loại tài khoản không hợp lệ, vui lòng chọn Cá nhân, Doanh nghiệp, Visa, Limit cao hoặc Limit thấp',
      }
    ),
  defaultLimit: z
    .number({ invalid_type_error: 'Vui lòng nhập limit hợp lệ (số không âm)' })
    .min(0, { message: 'Limit phải là số không âm' }),
  pricePerDay: z
    .number({
      invalid_type_error: 'Vui lòng nhập giá thuê hợp lệ (số không âm)',
    })
    .min(0, { message: 'Giá thuê phải là số không âm' }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { addAccount } = useAdAccountStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adAccountType: '',
      name: '',
      accountType: '',
      defaultLimit: 0,
      pricePerDay: 0,
      notes: '',
    },
  });

  const onSubmit = (data: FormData) => {
    const newAccount: AdAccount = {
      id: Date.now().toString(),
      name: `${data.name} - ${
        data.adAccountType.charAt(0).toUpperCase() + data.adAccountType.slice(1)
      }`,
      accountType: data.accountType,
      defaultLimit: data.defaultLimit,
      pricePerDay: data.pricePerDay,
      status: 'available',
      notes: data.notes || 'Không có ghi chú',
      adAccountType: data.adAccountType,
    };

    console.log('new acc', newAccount);
    addAccount(newAccount);
    reset();
    navigate('/marketplace');
  };

  const handleCancel = () => {
    navigate('/marketplace');
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold	 text-gray-900 mb-6">
            Thêm Tài khoản Quảng cáo
          </h2>
          <form
            id="accountForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại tài khoản quảng cáo
              </label>
              <select
                {...register('adAccountType')}
                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.adAccountType ? 'border-red-500' : ''
                }`}
              >
                <option value="">Chọn loại tài khoản quảng cáo</option>
                <option value="facebook">Facebook Ads</option>
                <option value="google">Google Ads</option>
                <option value="tiktok">TikTok Ads</option>
              </select>
              {errors.adAccountType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.adAccountType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên tài khoản
              </label>
              <input
                type="text"
                {...register('name')}
                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại tài khoản
              </label>
              <select
                {...register('accountType')}
                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.accountType ? 'border-red-500' : ''
                }`}
              >
                <option value="">Chọn loại tài khoản</option>
                <option value="personal">Cá nhân</option>
                <option value="business">Doanh nghiệp</option>
                <option value="visa">Visa</option>
                <option value="high_limit">Limit cao</option>
                <option value="low_limit">Limit thấp</option>
              </select>
              {errors.accountType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.accountType.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Limit mặc định (VND)
              </label>
              <input
                type="number"
                {...register('defaultLimit', { valueAsNumber: true })}
                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.defaultLimit ? 'border-red-500' : ''
                }`}
                min="0"
                step="0.01"
              />
              {errors.defaultLimit && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.defaultLimit.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giá thuê ngày (VND)
              </label>
              <input
                type="number"
                {...register('pricePerDay', { valueAsNumber: true })}
                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                  errors.pricePerDay ? 'border-red-500' : ''
                }`}
                min="0"
                step="0.01"
              />
              {errors.pricePerDay && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.pricePerDay.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ghi chú
              </label>
              <textarea
                {...register('notes')}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Thêm tài khoản
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAccountPage;
