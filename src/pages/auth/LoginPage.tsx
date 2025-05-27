import React, { useState, useEffect } from "react";
import { Mail, Lock, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import axios from "axios";
import { BaseUrl } from "../../api/BaseHeader";

const LoginPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
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
      await axios
        .post(`${BaseUrl}/login`, {
          email: email,
          password: password,
        })
        .then((res) => {
          navigate("/");
          localStorage.setItem("access_token", res.data.data.access_token);
          localStorage.setItem("refresh_token", res.data.data.refresh_token);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          addNotification(
            "Đăng nhập thành công",
            "Chào mừng bạn quay trở lại!",
            "success"
          );
        });

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
      <div className="h-screen bg-gradient-to-br from-white via-blue-200 to-transparent relative overflow-hidden">
        <Mail
          className="absolute top-10 left-10 text-blue-500 opacity-20 animate-floating"
          size={40}
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
        <div className="bg-gradient-to-br from-blue-200 via-white to-blue rounded-lg overflow-hidden shadow-xl max-w-md w-full p-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-[#0167F8] mb-2">
              Chào Mừng Bạn Quay Trở Lại
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
          {/* <div className="hidden md:flex w-1/2 max-w-[400px] items-center justify-center overflow-hidden">
            <Link to="/" className="block w-full h-auto">
              <img
                src="src/public/AKA.png"
                alt="AKAds Logo"
                className="object-contain w-full max-h-[400px] rounded"
                loading="eager"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
