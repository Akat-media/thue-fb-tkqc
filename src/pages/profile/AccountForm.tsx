import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import BaseHeader, { BaseUrl } from "../../api/BaseHeader.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Định nghĩa schema validate với zod
const userSchema = z.object({
  username: z
    .string()
    .min(1, "Tên người dùng không được để trống")
    .max(50, "Tên người dùng không được dài quá 50 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"),
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9]{10,15}$/, "Số điện thoại phải có từ 10-15 chữ số"),
  percentage: z
    .number({ invalid_type_error: "Phần trăm phải là số" })
    .min(0, "Phần trăm không được nhỏ hơn 0")
    .max(100, "Phần trăm không được lớn hơn 100"),
  points: z
    .number({ invalid_type_error: "Điểm phải là số" })
    .min(0, "Điểm không được nhỏ hơn 0"),
});

// Định nghĩa kiểu dữ liệu từ schema
type UserFormData = z.infer<typeof userSchema>;

// Interface cho dữ liệu từ localStorage
interface User {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  percentage?: number;
  points?: number;
}

const FloatingInput = ({
  label,
  name,
  type = "text",
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
        {...register(name, { valueAsNumber: type === "number" })}
        className={`
                    w-full
                    rounded-md
                    border
                    ${error ? "border-red-500" : "border-gray-300"}
                    px-3
                    pt-[14px] pb-[10px]
                    text-gray-900
                    focus:outline-none
                    focus:ring-2
                    ${
                      readOnly
                        ? "bg-gray-100 cursor-not-allowed"
                        : "focus:ring-blue-500"
                    }
                `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const AccountForm: React.FC = () => {
  const user = localStorage.getItem("user");
  const initialUser: User =
    typeof user === "string" ? JSON.parse(user).user : {};

  // Khởi tạo react-hook-form với zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialUser.username || "",
      email: initialUser.email || "",
      phone: initialUser.phone || "",
      percentage: initialUser.percentage || 0,
      points: initialUser.points || 0,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if (!initialUser.id) {
      toast.error("Không tìm thấy ID người dùng trong localStorage!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await BaseHeader({
        method: "put",
        url: `/user/${initialUser.id}`,
        baseURL: BaseUrl,
        data,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("data saved: ", response.data);
      toast.success("Cập nhật thông tin thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Cập nhật localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ user: { ...initialUser, ...data } })
      );
    } catch (error: any) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Có lỗi xảy ra khi lưu dữ liệu!";
      toast.error(apiMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex-1 font-roboto">
      <ToastContainer />
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
        <FloatingInput
          label="Phần trăm"
          name="percentage"
          type="number"
          register={register}
          error={errors.percentage?.message}
          readOnly={true}
        />
        <FloatingInput
          label="Điểm"
          name="points"
          type="number"
          register={register}
          error={errors.points?.message}
          readOnly={true}
        />
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
