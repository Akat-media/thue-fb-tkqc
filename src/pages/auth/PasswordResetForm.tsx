import React, { useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import Layout from "../../components/layout/Layout.tsx";
// import axios from "axios";
import BaseHeader, { BaseUrl } from "../../api/BaseHeader.ts";
import { toast } from "react-toastify";
import { create } from "zustand";

interface PasswordResetState {
  password: string;
  confirmPassword: string;
  errors: Record<string, string>;
  isValid: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  validatePassword: () => void;
  validateConfirmPassword: () => void;
  resetPassword: (token: string) => Promise<void>;
  reset: () => void;
}

const validatePasswordStrength = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Ít nhất 8 ký tự");
  if (!/[A-Z]/.test(password)) errors.push("Ít nhất 1 chữ hoa");
  if (!/[a-z]/.test(password)) errors.push("Ít nhất 1 chữ thường");
  if (!/\d/.test(password)) errors.push("Ít nhất 1 số");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push("Ít nhất 1 ký tự đặc biệt");
  return errors;
};

// Tạo Zustand store
const usePasswordResetStore = create<PasswordResetState>((set, get) => ({
  password: "",
  confirmPassword: "",
  errors: {},
  isValid: false,
  isLoading: false,
  isSuccess: false,
  showPassword: false,
  showConfirmPassword: false,

  setPassword: (password: string) => set({ password }),
  setConfirmPassword: (confirmPassword: string) => set({ confirmPassword }),
  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),
  toggleShowConfirmPassword: () =>
    set((state) => ({ showConfirmPassword: !state.showConfirmPassword })),

  validatePassword: () => {
    const errors = validatePasswordStrength(get().password);
    set({
      errors: {
        ...get().errors,
        password: errors.length > 0 ? errors.join(", ") : "",
      },
    });
  },

  validateConfirmPassword: () => {
    const error =
      get().password !== get().confirmPassword ? "Mật khẩu không khớp" : "";
    set({
      errors: {
        ...get().errors,
        confirmPassword: error,
      },
    });
  },

  resetPassword: async (token: string) => {
    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }

    set({ isLoading: true });

    try {
      const response = await BaseHeader({
        method: "post",
        url: "/reset-password",
        baseURL: BaseUrl,
        data: {
          token,
          newPassword: get().password,
        },
      });

      if (response.data.success) {
        set({
          isLoading: false,
          isSuccess: true,
        });
        toast.success("Đặt lại mật khẩu thành công!");
      }
    } catch (error: any) {
      set({ isLoading: false });
      const errorMessage =
        error.response?.data?.message ||
        "Đã có lỗi xảy ra khi đặt lại mật khẩu";
      toast.error(errorMessage);
    }
  },

  reset: () =>
    set({
      password: "",
      confirmPassword: "",
      errors: {},
      isValid: false,
      isLoading: false,
      isSuccess: false,
      showPassword: false,
      showConfirmPassword: false,
    }),
}));

const PasswordResetForm: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token") || "";

  // Sử dụng Zustand store
  const {
    password,
    confirmPassword,
    errors,
    isValid,
    isLoading,
    isSuccess,
    showPassword,
    showConfirmPassword,
    setPassword,
    setConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    validatePassword,
    validateConfirmPassword,
    resetPassword,
  } = usePasswordResetStore();

  // Validate form khi password hoặc confirmPassword thay đổi
  useEffect(() => {
    if (password) validatePassword();
    if (confirmPassword) validateConfirmPassword();

    const isValid =
      password.length >= 8 &&
      validatePasswordStrength(password).length === 0 &&
      password === confirmPassword;

    usePasswordResetStore.setState({ isValid });
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      await resetPassword(token);
    }
  };

  const getPasswordStrength = () => {
    const errors = validatePasswordStrength(password);
    if (password.length === 0)
      return { level: 0, text: "", color: "bg-gray-200" };
    if (errors.length >= 4)
      return { level: 1, text: "Yếu", color: "bg-red-500" };
    if (errors.length >= 2)
      return { level: 2, text: "Trung bình", color: "bg-yellow-500" };
    if (errors.length >= 1)
      return { level: 3, text: "Khá", color: "bg-blue-500" };
    return { level: 4, text: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đặt lại mật khẩu thành công!
          </h1>
          <p className="text-gray-600 mb-8">
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu
            mới.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-100 via-sky-200 to-cyan-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Tạo mật khẩu mới</h1>
              <p className="opacity-90">
                Vui lòng nhập mật khẩu mới cho tài khoản{" "}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        Độ mạnh mật khẩu
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.level >= 3
                            ? "text-green-600"
                            : passwordStrength.level >= 2
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.level / 4) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {password && (
                  <div className="mt-3 space-y-1">
                    {validatePasswordStrength(password).map((error, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-red-600"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {validatePasswordStrength(password).length === 0 &&
                      password.length >= 8 && (
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Mật khẩu đạt yêu cầu</span>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}

                {confirmPassword && !errors.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Mật khẩu khớp</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium text-sm mb-1">
                      Bảo mật tài khoản
                    </p>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      Mật khẩu mới sẽ được áp dụng ngay lập tức. Vui lòng sử
                      dụng mật khẩu mạnh để bảo vệ tài khoản.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                  isValid && !isLoading
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Cập nhật mật khẩu</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordResetForm;
