import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Bot, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { BaseUrl } from "../../api/BaseHeader";
import axios from "axios";
import AtomicSpinner from "atomic-spinner";

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

  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      // await register(name, email, phone, password);
      const registerRes = await axios.post(`${BaseUrl}/user`, {
        username: name,
        email: email,
        phone: phone,
        password: password,
        role: "user",
      });
      if (registerRes.status == 200) {
        addNotification(
          "Đăng ký thành công",
          "Tài khoản của bạn đã được tạo!",
          "success"
        );
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
          });
      } else {
        addNotification("Đăng ký thất bại", registerRes.data.message, "error");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage === "Email đã tồn tại") {
          setErrors({ email: "Email đã tồn tại. Vui lòng nhập email khác." });
          setEmail("");
        } else {
          addNotification("Đăng ký thất bại", errorMessage, "error");
        }
      } else {
        addNotification(
          "Đăng ký thất bại",
          "Có lỗi xảy ra trong quá trình đăng ký",
          "error"
        );
      }

      setIsLoading(false); // đảm bảo tắt loading trong catch
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="src/public/sand.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-l from-transparent via-blue-100/70 to-white backdrop-blur-sm relative">
        <Link
          to="/"
          className="absolute top-5 right-9 text-[#0167F8] font-bold text-3xl hover:underline"
        >
          AKAds
        </Link>

        <div className="max-w-lg w-full p-10 mt-10 rounded-lg">
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
          <p className="mt-4 text-center text-xs text-gray-400">
            © Bản quyền thuộc về AKA Media
          </p>
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

export default RegisterPage;
