import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import BaseHeader from "../../api/BaseHeader";
import AtomicSpinner from "atomic-spinner";

interface CreateBMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Define validation schema with Zod
const bmSchema = z.object({
  bm_name: z.string().min(1, "Tên BM không được để trống"),
  bm_id: z
    .string()
    .min(1, "BM ID không được để trống")
    .regex(/^\d+$/, "BM ID phải là số"),
  system_user_token: z.string().min(1, "System User Token không được để trống"),
});

type BMFormData = z.infer<typeof bmSchema>;

const CreateBMModal: React.FC<CreateBMModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BMFormData>({
    resolver: zodResolver(bmSchema),
    defaultValues: {
      bm_name: "",
      bm_id: "",
      system_user_token: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: BMFormData) => {
    setIsLoading(true);
    try {
      const response = await BaseHeader({
        url: "facebook-bm",
        method: "post",
        data: {
          bm_name: data.bm_name,
          bm_id: data.bm_id,
          system_user_token: data.system_user_token,
        },
      });

      toast.success("Tạo tài khoản BM thành công!");
      if (onSuccess) {
        onSuccess();
      }
      onClose();

      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    } catch (error) {
      console.error("Error creating BM account:", error);
      toast.error("Có lỗi xảy ra khi tạo tài khoản BM");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Tạo Tài Khoản BM
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên BM
              </label>
              <input
                type="text"
                {...register("bm_name")}
                className={`w-full px-3 py-2 border ${
                  errors.bm_name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập tên BM"
                disabled={isLoading}
              />
              {errors.bm_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bm_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BM ID
              </label>
              <input
                type="text"
                {...register("bm_id")}
                className={`w-full px-3 py-2 border ${
                  errors.bm_id ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập BM ID"
                disabled={isLoading}
              />
              {errors.bm_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bm_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System User Token
              </label>
              <textarea
                {...register("system_user_token")}
                rows={5}
                className={`w-full px-3 py-2 border ${
                  errors.system_user_token
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Nhập System User Token (JSON)"
                disabled={isLoading}
              />
              {errors.system_user_token && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.system_user_token.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Đang xử lý..." : "Tạo tài khoản BM"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm bg-white/60 flex items-center justify-center">
          <AtomicSpinner size={60} color="#ffffff" />
        </div>
      )}
    </div>
  );
};

export default CreateBMModal;
