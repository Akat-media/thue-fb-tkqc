import React, { useState, useEffect } from "react";
import { Mail, Lock, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const LoginPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { login, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(email, password);
      addNotification(
        "Đăng nhập thành công",
        "Chào mừng bạn quay trở lại!",
        "success"
      );
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      addNotification(
        "Đăng nhập thất bại",
        "Email hoặc mật khẩu không chính xác",
        "error"
      );
    }
  };

  return (
    <>
      <div className="h-screen bg-[#e0f2fe] relative overflow-hidden">
        <Mail
          className="absolute top-10 left-10 text-blue-500 opacity-20 animate-floating"
          size={40}
        />
        <Bot
          className="absolute top-1/2 left-1/3 text-blue-400 opacity-20 animate-floating delay-2000"
          size={30}
        />
        <Lock
          className="absolute bottom-10 right-16 text-blue-300 opacity-20 animate-floating delay-1000"
          size={50}
        />
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isOpen ? "bg-black bg-opacity-0" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-4xl w-full flex">
          <div className="flex-1 p-8 flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-[#0167F8] mb-2">
              Welcome Back 💙
            </h1>
            <h3 className="text-sm text-gray-800 mb-6">
              AKAds - Cong ty cong nghe dau hang Viet Nam{" "}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Tài Khoản
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Mật Khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Quên Mật Khẩu?
                </Link>
              </div>
              <button
                type="submit"
                className="px-8 py-2 bg-[#0167F8] text-white rounded-full hover:bg-[#005fce] transition mx-auto block shadow-md hover:shadow-lg"
              >
                Đăng Nhập
              </button>
            </form>
            <p className="mt-6 text-center text-sm">
              Chưa Có Tài Khoản?{" "}
              <Link to="/register" className="text-[#0167F8] hover:underline">
                Đăng Ký Ngay
              </Link>
            </p>
          </div>
          <div className="hidden md:block flex-1 overflow-hidden min-h-[400px]">
            <Link to="/" className="block w-full h-full">
              <img
                src="src/public/AKA.png"
                className="w-full h-full min-h-[400px] object-cover animate-spin-slow"
                alt=""
                loading="eager"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
