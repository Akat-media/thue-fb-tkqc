import React, { useState } from "react";
import Layout from "../../components/layout/Layout.tsx";
import { Mail, Phone, Send, X, Timer } from "lucide-react";
import styled from "styled-components";
import url from "../../assets/bg.svg";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Support: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập đúng định dạng email.";
    }
    if (!formData.message.trim())
      newErrors.message = "Vui lòng nhập nội dung cần hỗ trợ!.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-cyan-100">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
              Chúng Tôi Ở Đây Để Hỗ Trợ Bạn
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Liên hệ với chúng tôi qua form dưới đây hoặc thông tin liên hệ
              trực tiếp.
              <br /> Đội ngũ hỗ trợ của AKA MEDIA sẽ phản hồi trong thời gian
              sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <CardContainer url={url}>
              <div className="relative main-card h-full flex flex-col bg-white rounded-xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <div className="p-6 flex-grow relative z-10">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    Gửi Yêu Cầu Hỗ Trợ
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Họ và Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                        placeholder="Nhập họ và tên"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                        placeholder="Nhập email của bạn"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nội dung <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                        placeholder="Mô tả vấn đề của bạn"
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !formData.name.trim() ||
                        !formData.email.trim() ||
                        !formData.message.trim()
                      }
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        (!formData.name.trim() ||
                          !formData.email.trim() ||
                          !formData.message.trim()) &&
                        "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Gửi Yêu Cầu
                    </button>
                  </div>
                  {isSubmitted && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
                      <span>Yêu cầu của bạn đã được gửi thành công!</span>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="ml-auto focus:outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <img className="w-full" src={url} alt="background" />
                </div>
              </div>
            </CardContainer>

            {/* Contact Info */}
            <CardContainer url={url}>
              <div className="relative main-card h-full flex flex-col bg-white rounded-xl shadow-xl hover:shadow-lg transition-shadow duration-200">
                <div className="p-6 flex-grow relative z-10">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    Thông Tin Liên Hệ
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Email
                        </p>
                        <a
                          href="mailto:support@akamedia.com"
                          className="text-blue-600 hover:underline"
                        >
                          support@akamedia.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Hotline
                        </p>
                        <a
                          href="tel:+84234567890"
                          className="text-blue-600 hover:underline"
                        >
                          +84 234 567 890
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Timer className="w-6 h-6 text-blue-600 mr-3" />
                        <p className="text-lg font-medium text-gray-700">
                          Giờ làm việc
                        </p>
                      </div>
                      <a
                        className="block mt-1 pl-9 text-gray-600"
                        href="tel:+Thứ 2 - Thứ 6: 9:00 SA - 17:00 CH"
                      >
                        Thứ 2 - Thứ 7: 9:00 SA - 17:00 CH
                      </a>
                      {/* <a
                        className="block pl-9 text-gray-600"
                        href="tel:+Thứ 7: 9:00 SA - 12:00 CH"
                      >
                        Thứ 7: 9:00 - 17:00
                      </a> */}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <img className="w-full" src={url} alt="background" />
                </div>
              </div>
            </CardContainer>
          </div>
        </main>
      </div>
    </Layout>
  );
};

const CardContainer = styled.div<{ url: any }>``;

export default Support;
