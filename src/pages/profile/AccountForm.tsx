import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../api/BaseHeader.ts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '../../stores/useUserStore.ts';
import { message, Tooltip } from 'antd';
import { Copy } from 'lucide-react';

// Định nghĩa schema validate với zod
const userSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên người dùng không được để trống')
    .max(50, 'Tên người dùng không được dài quá 50 ký tự'),
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(1, 'Email không được để trống'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(/^[0-9]{10,15}$/, 'Số điện thoại phải có từ 10-15 chữ số'),
  percentage: z
    .number({ invalid_type_error: 'Phần trăm phải là số' })
    .min(0, 'Phần trăm không được nhỏ hơn 0')
    .max(100, 'Phần trăm không được lớn hơn 100'),
  points: z
    .number({ invalid_type_error: 'Điểm phải là số' })
    .min(0, 'Điểm không được nhỏ hơn 0'),
  code: z.string().min(1, 'code không được để trống'),
});

// Định nghĩa kiểu dữ liệu từ schema
type UserFormData = z.infer<typeof userSchema>;

const FloatingInput = ({
  label,
  name,
  type = 'text',
  register,
  error,
  readOnly = false,
}: {
  label: string;
  name: keyof UserFormData;
  type?: string;
  register: any;
  error?: string;
  readOnly?: boolean;
}) => {
  return (
    <div className="relative mt-6">
      <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 z-10">
        {label}
      </label>
      <input
        type={type}
        readOnly={readOnly}
        {...register(name, { valueAsNumber: type === 'number' })}
        className={`
                    w-full
                    rounded-md
                    border
                    ${error ? 'border-red-500' : 'border-gray-300'}
                    px-3
                    pt-[14px] pb-[10px]
                    text-gray-900
                    focus:outline-none
                    focus:ring-2
                    ${
                      readOnly
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'focus:ring-blue-500'
                    }
                `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const AccountForm: React.FC = () => {
  const { user, setUser } = useUserStore();
  // Khởi tạo react-hook-form với zod resolver
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      percentage: user?.percentage || 0,
      points: user?.points || 0,
      code: user?.referral_code || '',
    },
  });
  function generateRandomId() {
    return (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
    );
  }
  // Thêm useEffect này để cập nhật form khi user thay đổi
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        percentage: user.percentage || 0,
        points: user.points || 0,
        code: user?.referral_code || '',
      });
    }
  }, [user, reset]);
  const onSubmit = async (data: UserFormData) => {
    if (!user?.id) {
      toast.error('Không tìm thấy ID người dùng trong localStorage!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await BaseHeader({
        method: 'put',
        url: `/user/${user.id}`,
        data: {
          username: data.username,
          email: data.email,
          phone: data.phone,
        },
      });
      console.log('data saved: ', response.data);
      toast.success('Cập nhật thông tin thành công!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setUser({ ...user, ...data });
      const sessionData = {
        id: generateRandomId(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { ...user, ...data },
      };
      localStorage.setItem('user', JSON.stringify(sessionData));
    } catch (error: any) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Có lỗi xảy ra khi lưu dữ liệu!';
      toast.error(apiMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  const code = watch('code');

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      message.success('Đã sao chép mã giới thiệu!');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex-1 font-roboto">
      <h3 className="text-[20px] font-semibold">Thông tin</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
      >
        <FloatingInput
          label="Tên người dùng"
          name="username"
          register={register}
          error={errors.username?.message}
        />
        <FloatingInput
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />
        <FloatingInput
          label="Số điện thoại"
          name="phone"
          register={register}
          error={errors.phone?.message}
        />
        {/* <FloatingInput
          label="Phần trăm"
          name="percentage"
          type="number"
          register={register}
          error={errors.percentage?.message}
          readOnly={true}
        /> */}
        <FloatingInput
          label="Điểm"
          name="points"
          type="number"
          register={register}
          error={errors.points?.message}
          readOnly={true}
        />
        <div className="relative">
          <FloatingInput
            label="Mã giới thiệu"
            name="code"
            register={register}
            error={errors.code?.message}
            readOnly={true}
          />
          <Tooltip title="Sao chép" className="absolute top-[50%] right-[10px]">
            <Copy
              style={{ cursor: 'pointer', fontSize: 10 }}
              onClick={handleCopy}
            />
          </Tooltip>
        </div>
        <div className="md:col-span-2 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
