import React, { useState } from "react";
import { X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import AtomicSpinner from "atomic-spinner";
import BaseHeader from "../../api/BaseHeader";

const adAccountSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  storage_state: z
    .string()
    .min(1, { message: "Vui lòng nhập thông tin storage state" }),
});

type AdAccountFormData = z.infer<typeof adAccountSchema>;

interface CreateAdAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateAdAccountModal: React.FC<CreateAdAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdAccountFormData>({
    resolver: zodResolver(adAccountSchema),
    defaultValues: {
      email: "",
      storage_state: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: AdAccountFormData) => {
    setIsLoading(true);
    try {
      // Parse storage_state as JSON
      let parsedStorageState;
      try {
        parsedStorageState = JSON.parse(data.storage_state);
      } catch (e) {
        toast.error("Storage state phải là JSON hợp lệ");
        setIsLoading(false);
        return;
      }

      const response = await BaseHeader({
        url: "ad-accounts",
        method: "post",
        data: {
          email: data.email,
          storage_state: parsedStorageState,
        },
      });

      toast.success("Tạo tài khoản quảng cáo thành công!");
      reset();
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error creating ad account:", error);
      toast.error("Có lỗi xảy ra khi tạo tài khoản quảng cáo");
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
            Tạo Tài Khoản Quảng Cáo
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@gmail.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="storage_state"
                className="block text-sm font-medium text-gray-700"
              >
                Storage State (JSON)
              </label>
              <textarea
                id="storage_state"
                {...register("storage_state")}
                rows={5}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="..."
              />
              {errors.storage_state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.storage_state.message}
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
                {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
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

export default CreateAdAccountModal;
