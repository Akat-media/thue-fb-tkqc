import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import BaseHeader from '../../api/BaseHeader';
import AtomicSpinner from 'atomic-spinner';
import { NotiError } from '../../components/noti';
import { Eraser } from 'lucide-react';

const storageStateSchema = z.object({
  cookies: z.array(z.any()).min(1, 'Cookies không được để trống'),
  origins: z.array(z.any()).default([]),
});

const botSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  storage_state: z
    .string()
    .min(1, { message: 'Vui lòng nhập thông tin storage state' })
    .refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Storage state phải là JSON hợp lệ',
      }
    )
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return (
            parsed &&
            typeof parsed === 'object' &&
            'cookies' in parsed &&
            Array.isArray(parsed.cookies)
          );
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Storage state phải có trường cookies là một mảng',
      }
    )
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return parsed.cookies.length > 0;
        } catch (e) {
          return false;
        }
      },
      {
        message:
          'Storage state phải là JSON hợp lệ với định dạng {cookies: [...], origins: []}',
      }
    ),
});

type BotFormData = z.infer<typeof botSchema>;

type Bot = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

const CreateBotPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoadingBots, setIsLoadingBots] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [deleteBot, setDeleteBot] = useState<Bot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<BotFormData>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      email: '',
      storage_state: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    setIsLoadingBots(true);
    try {
      const response = await BaseHeader({
        url: 'cookies',
        method: 'get',
      });
      setBots(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
      toast.error('Không thể tải danh sách bot');
      setErrorMessage('Không thể tải danh sách bot. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingBots(false);
    }
  };

  const onSubmit = async (data: BotFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      let parsedStorageState = JSON.parse(data.storage_state);
      if (!parsedStorageState.hasOwnProperty('origins')) {
        parsedStorageState.origins = [];
      }

      const response = await BaseHeader({
        url: 'cookies',
        method: 'post',
        data: {
          email: data.email,
          storage_state: parsedStorageState,
        },
      });

      toast.success('Tạo mới thành công!');
      reset();
      fetchBots();
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Có lỗi xảy ra khi tạo mới');
      setErrorMessage('Có lỗi xảy ra khi tạo mới bot. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!deleteBot) return;
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await BaseHeader({
        url: `cookies/${deleteBot.id}`,
        method: 'delete',
      });
      toast.success('Xóa bot thành công!');
      setDeleteBot(null);
      fetchBots();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bot');
      setErrorMessage('Có lỗi xảy ra khi xóa bot. Vui lòng thử lại sau.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              Quản lý Bot
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 flex-grow">
          <div className="md:col-span-4 bg-gray-100 rounded-lg shadow-md p-6 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tạo Bot Mới
            </h3>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 flex-grow flex flex-col"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col h-full justify-between">
                <div className="h-full">
                  <label
                    htmlFor="storage_state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Storage State (JSON)
                  </label>
                  <textarea
                    id="storage_state"
                    {...register('storage_state')}
                    rows={7}
                    className={`mt-1 block w-full h-[83%] min-h-[300px] px-3 py-2 border ${
                      errors.storage_state
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-md shadow-sm focus:outline-none`}
                    placeholder='{"cookies":[...],"origins":[]}'
                  />
                  {errors.storage_state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.storage_state.message}
                    </p>
                  )}
                </div>
                <div>
                  <p className="mt-1 text-xs text-gray-500">
                    Storage state phải có định dạng: {'{'}"cookies": [...],
                    "origins": []{'}'}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      // disabled={isLoading || !isDirty || !isValid}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                        isLoading || !isDirty || !isValid
                          ? 'opacity-70 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang xử lý...
                        </span>
                      ) : (
                        'Tạo mới'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="md:col-span-6 bg-gray-100 rounded-lg shadow-md p-6 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Danh sách Bot
            </h3>
            {isLoadingBots ? (
              <div className="flex justify-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : bots.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Chưa có bot nào được tạo
              </p>
            ) : (
              <div className="overflow-x-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-500">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3"></th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                      >
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bots.map((bot) => (
                      <tr key={bot.id}>
                        <td className="px-4 py-4 text-center">
                          <button
                            title="Xóa bot"
                            onClick={() => setDeleteBot(bot)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Eraser className="h-5 w-5 inline" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bot.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bot.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bot.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner size={60} color="#ffffff" />
        </div>
      )}

      {/* {errorMessage && (
        <NotiError onClose={() => setErrorMessage('')} message={errorMessage} />
      )} */}

      {deleteBot && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h4 className="text-lg font-semibold mb-2 text-blue-900">
              Xác nhận xóa
            </h4>
            <p className="mb-4">
              Bạn chắc chắn muốn xóa bot
              <span className="font-bold text-red-900"> {deleteBot.email}</span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setDeleteBot(null)}
                disabled={isDeleting}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDeleteBot}
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBotPage;
