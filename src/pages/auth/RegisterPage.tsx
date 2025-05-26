import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Bot, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const RegisterPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { register, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name) newErrors.name = "Họ tên là bắt buộc";
    if (!email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc";
    else if (!/^[0-9]{10}$/.test(phone))
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    if (!password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(name, email, phone, password);
      addNotification(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được tạo!",
        "success"
      );
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      addNotification(
        "Đăng ký thất bại",
        "Có lỗi xảy ra trong quá trình đăng ký",
        "error"
      );
    }
  };

  return (
    <>
      <div className="h-screen bg-gradient-to-br from-blue-200 via-white to-blue-200 to-transparent relative overflow-hidden">
        <Bot
          className="absolute top-10 left-10 text-blue-500 opacity-20 animate-floating"
          size={40}
        />
        <Mail
          className="absolute bottom-10 right-16 text-blue-300 opacity-20 animate-floating delay-1000"
          size={50}
        />
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
          isOpen ? "bg-black bg-opacity-0" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="bg-gradient-to-br from-white via-blue-100 to-blue rounded-lg overflow-hidden shadow-xl w-full max-w-md p-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-semibold text-[#0167F8] mb-2">
              Tạo Tài Khoản Mới
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Đăng ký ngay để sử dụng các dịch vụ của AKAds.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Họ tên
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="P Nguyễn"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Email
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
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Mật khẩu
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase text-[#0167F8]"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-2 bg-[#0167F8] text-white rounded-full hover:bg-[#005fce] transition mx-auto block shadow-md hover:shadow-lg"
              >
                Đăng ký
              </button>
            </form>
            <p className="mt-3 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-[#0167F8] hover:underline">
                Đăng nhập
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

export default RegisterPage;
