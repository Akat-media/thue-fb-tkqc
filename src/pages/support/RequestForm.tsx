import React, { useState } from 'react';
import {
  AlertCircle,
  Send,
  Upload,
  X,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import BaseHeader from '../../api/BaseHeader';
import { useUserStore } from '../../stores/useUserStore.ts';
// import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

// interface FormData {
//     fullName: string;
//     email: string;
//     phone: string;
//     title: string;
//     department: string;
//     content: string;
// }

const supportRequestSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  department: z
    .string()
    .refine((val) => ['tech', 'sales', 'hr'].includes(val), {
      message: 'Vui lòng chọn bộ phận',
    }),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  priority: z
    .string()
    .refine((val) => ['low', 'medium', 'high', 'urgent'].includes(val), {
      message: 'Vui lòng chọn mức độ ưu tiên hợp lệ',
    }),
  category: z
    .string()
    .refine((val) => ['account', 'pay', 'recover', 'other'].includes(val), {
      message: 'Vui lòng chọn danh mục hợp lệ',
    }),
  status: z.string().optional(),
  user_id: z.string().uuid().optional(),
  attachments: z.array(z.string()).optional(),
});

type SupportRequestFormData = z.infer<typeof supportRequestSchema>;

const RequestForm: React.FC = () => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const user = useUserStore((state) => state.user);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportRequestFormData>({
    resolver: zodResolver(supportRequestSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      title: '',
      department: '',
      content: '',
      priority: '',
      category: '',
      status: 'new',
    },
  });

  const departments = React.useMemo(
    () => [
      { value: '', label: t('createRequest.form.department2') },
      { value: 'tech', label: t('createRequest.form.department3') },
      { value: 'sales', label: t('createRequest.form.department4') },
      { value: 'hr', label: t('createRequest.form.department5') },
    ],
    [t]
  );

  const priorities = [
    { value: '', label: t('createRequest.form.priority1b') },
    { value: 'low', label: t('createRequest.form.priority2') },
    { value: 'medium', label: t('createRequest.form.priority3') },
    { value: 'high', label: t('createRequest.form.priority4') },
    { value: 'urgent', label: t('createRequest.form.priority5') },
  ];

  const categories = [
    { value: '', label: t('createRequest.form.category2') },
    { value: 'account', label: t('createRequest.form.category3') },
    { value: 'pay', label: t('createRequest.form.category4') },
    { value: 'recover', label: t('createRequest.form.category5') },
    { value: 'other', label: t('createRequest.form.category6') },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(
          t('createRequest.form.fileTooLarge', {
            fileName: file.name,
          })
        );
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(
          t('createRequest.form.fileNotSupport', {
            fileName: file.name,
          })
        );
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  function formatDateToVN(isoString: any) {
    const date = new Date(isoString);
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const hours = vnDate.getUTCHours().toString().padStart(2, '0');
    const minutes = vnDate.getUTCMinutes().toString().padStart(2, '0');
    const day = vnDate.getUTCDate();
    const month = vnDate.getUTCMonth() + 1; // Tháng bắt đầu từ 0
    const year = vnDate.getUTCFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  const now = new Date().toISOString();
  const formattedNow = formatDateToVN(now);

  const onSubmit: SubmitHandler<SupportRequestFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('title', data.title);
      formData.append('department', data.department);
      formData.append('content', data.content);
      attachments?.forEach((file) => formData.append('attachments', file));
      formData.append('priority', data.priority);
      formData.append('category', data.category);

      const userId = user?.id;
      if (userId) {
        formData.append('user_id', userId);
      }
      console.log('Payload gửi đi:', Object.fromEntries(formData.entries()));

      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem('token');

      const [supportResponse, mailResponse] = await Promise.all([
        BaseHeader({
          method: 'post',
          url: '/support',
          baseURL: baseUrl,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
        BaseHeader({
          method: 'post',
          url: '/support/mail-admin',
          data: {
            email: data.email,
            priority: data.priority,
            category: data.category,
            content: data.content,
            title: data.title,
            created_at: formattedNow,
          },
          headers: {
            'Accept-Language': i18n.language || 'vi',
          },
        }),
      ]);

      if (
        supportResponse.status === 200 &&
        mailResponse.status === 200 &&
        supportResponse.data.data !== null
      ) {
        toast.success(t('createRequest.form.successToast'));
        setSubmitSuccess(true);
        setAttachments([]);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error(t('createRequest.form.error1'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(t('createRequest.form.error2'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-time justify-center p-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('createRequest.form.successMessage')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('createRequest.form.successMessage2')}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('createRequest.form.successMessage3')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <button
            onClick={() => navigate('/support')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('createRequest.header.header1')}
          </button>

          <div className="backdrop-blur-sm border-b border-white/20 z-50">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
                      {t('createRequest.header.header2')}
                    </h2>
                    <p className="mt-1 text-base text-gray-500">
                      <span>{t('createRequest.header.header3')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Họ và tên + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('createRequest.form.name')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.fullName
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder={t('createRequest.form.name2')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Số điện thoại + Bộ phận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('createRequest.form.phone')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phone
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="0923456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('createRequest.form.department')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    {...register('department')}
                    className={`appearance-none w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.department
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Danh mục + Mức độ ưu tiên */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('createRequest.form.category')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    {...register('category')}
                    className={`appearance-none w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.category
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    {t('createRequest.form.priority')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="priority"
                    {...register('priority')}
                    className={`appearance-none w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.priority
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {priorities.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tiêu đề */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t('createRequest.form.title')}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.title
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder={t('createRequest.form.title2')}
                />
              </div>

              {/* Nội dung */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  {t('createRequest.form.content')}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  rows={5}
                  {...register('content')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                    errors.content
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder={t('createRequest.form.content2')}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.content ? (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.content.message}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {t('createRequest.form.content3')}
                    </span>
                  )}
                </div>
              </div>

              {/* Đính kèm tệp */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  {t('createRequest.form.upload')}
                </label>

                <div
                  className={`border-2 border-dashed p-6 text-center rounded-lg transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onDragOver={(e) => {
                    //  drop file vào vùng HTML.
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragEnter={() => setIsDragOver(true)} // kéo file vào vùng drop
                  onDragLeave={() => setIsDragOver(false)} //  khi rời khỏi vùng đó.
                  onDrop={(e) => {
                    // Kích hoạt khi người dùng thả file vào vùng này.
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);

                    const files = Array.from(e.dataTransfer.files || []);
                    const maxSize = 5 * 1024 * 1024;
                    const allowedTypes = [
                      'image/jpeg',
                      'image/png',
                      'image/gif',
                      'application/pdf',
                      'text/plain',
                    ];

                    const validFiles = files.filter((file) => {
                      if (file.size > maxSize) {
                        alert(
                          t('createRequest.form.fileTooLarge', {
                            fileName: file.name,
                          })
                        );
                        return false;
                      }
                      if (!allowedTypes.includes(file.type)) {
                        alert(
                          t('createRequest.form.fileNotSupport', {
                            fileName: file.name,
                          })
                        );
                        return false;
                      }
                      return true;
                    });

                    setAttachments((prev) => [...prev, ...validFiles]);
                  }}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    {t('createRequest.form.dragFile')}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    {t('createRequest.form.dragFile2')}
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.txt"
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-flex items-center justify-between border border-cyan-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-cyan-100"
                  >
                    <span>{t('createRequest.form.chooseFile')}</span>
                    <span className="ml-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-600 text-white">
                      <Upload className="w-4 h-4" />
                    </span>
                  </label>
                </div>

                {/* Danh sách file đã chọn */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                            <Upload className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 w-fit mx-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#193250] hover:bg-[#1F3E68] text-[#24F9FB] py-3 px-6 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      {t('createRequest.form.send1')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('createRequest.form.send2')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestForm;
