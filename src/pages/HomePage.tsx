import React from "react";
import { Link } from "react-router-dom";
import { DollarSign, Shield, Clock, Bell, Settings, User } from "lucide-react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import FacebookIcon from "./dashboard/FacebookIcon";
import StatCard from "./analytics/StatCard.tsx";
import StatsCharts from "./analytics/StatsCharts.tsx";
import ChartDashboard from "./analytics/ChartDashboard.tsx";

const HomePage: React.FC = () => {
  const user = localStorage.getItem("user");
  const role = typeof user === "string" ? JSON.parse(user)?.user.role : "";

  return (
    <Layout>
      {
        role !== "admin" && (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                  <div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                      Cho Thuê Tài Khoản Quảng Cáo Facebook
                    </h1>
                    <p className="mt-6 text-xl max-w-3xl">
                      Giải pháp nhanh chóng, an toàn và đáng tin cậy để tiếp cận tài
                      khoản quảng cáo Facebook khi tài khoản của bạn bị khóa hoặc hạn
                      chế.
                    </p>
                    <div className="mt-10 flex space-x-4">
                      <Link to="/marketplace">
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-blue-500 border-white hover:bg-blue-700 hover:text-white"
                        >
                          Xem danh sách BM
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-blue-500 border-white hover:bg-blue-700 hover:text-white"
                        >
                          Đăng ký ngay
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/*<div className="mt-20 lg:mt-0 flex justify-center animate-bounce">*/}
                  {/*  <div className="relative">*/}
                  {/*    <div className="absolute inset-0 flex items-center justify-center">*/}
                  {/*      <div className="h-64 w-64 bg-blue-500 bg-opacity-30 rounded-full animate-pulse"></div>*/}
                  {/*    </div>*/}
                  {/*    <Facebook className="relative h-48 w-48 text-white" />*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                  <div className="flex justify-center items-center">
                    <FacebookIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Tại sao chọn dịch vụ của chúng tôi?
                  </h2>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    Chúng tôi cung cấp dịch vụ cho thuê tài khoản quảng cáo Facebook
                    với nhiều ưu điểm vượt trội.
                  </p>
                </div>

                <div className="mt-16">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="pt-6">
                      <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                        <div className="-mt-6">
                          <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Shield className="h-6 w-6 text-white" />
                      </span>
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                            An toàn & Bảo mật
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Hệ thống bảo mật cao, đảm bảo quyền riêng tư và an toàn
                            cho tài khoản của cả người cho thuê và người thuê.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                        <div className="-mt-6">
                          <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </span>
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                            Nhanh chóng & Tiện lợi
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Đăng ký, thuê tài khoản và bắt đầu chạy quảng cáo chỉ
                            trong vài phút với quy trình đơn giản, dễ dàng.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                        <div className="-mt-6">
                          <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </span>
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                            Giá cả hợp lý
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            Chi phí thuê tài khoản cạnh tranh, minh bạch, không phát
                            sinh chi phí ẩn và được hoàn tiền nếu không sử dụng hết
                            hạn mức.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Cách thức hoạt động
                  </h2>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                    Quy trình đơn giản để bắt đầu sử dụng dịch vụ của chúng tôi
                  </p>
                </div>

                <div className="mt-16">
                  <div className="relative">
                    {/* Steps */}
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                      <div className="relative">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                          1
                        </div>
                        <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                          Đăng ký tài khoản
                        </h3>
                        <p className="mt-2 text-base text-gray-500 text-center">
                          Tạo tài khoản trên hệ thống của chúng tôi chỉ với email và
                          mật khẩu.
                        </p>
                      </div>

                      <div className="mt-10 lg:mt-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                          2
                        </div>
                        <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                          Nạp tiền và thuê tài khoản
                        </h3>
                        <p className="mt-2 text-base text-gray-500 text-center">
                          Nạp tiền vào tài khoản và chọn BM/tài khoản quảng cáo phù
                          hợp với nhu cầu của bạn.
                        </p>
                      </div>

                      <div className="mt-10 lg:mt-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                          3
                        </div>
                        <h3 className="mt-6 text-center text-lg font-medium text-gray-900">
                          Bắt đầu chạy quảng cáo
                        </h3>
                        <p className="mt-2 text-base text-gray-500 text-center">
                          Nhận quyền truy cập và bắt đầu chạy quảng cáo ngay lập tức
                          sau khi thanh toán.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block">Bạn cần chạy quảng cáo Facebook?</span>
                  <span className="block text-blue-200">Bắt đầu ngay hôm nay.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <Link to="/marketplace">
                      <Button
                          variant="outline"
                          size="lg"
                          className="text-blue-500 border-white hover:bg-blue-700 hover:text-white"
                      >
                        Xem danh sách BM
                      </Button>
                    </Link>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <Link to="/register">
                      <Button
                          variant="outline"
                          size="lg"
                          className="text-blue-500 border-white hover:bg-blue-700 hover:text-white"
                      >
                        Đăng ký ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Khách hàng nói gì về chúng tôi
                  </h2>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="flex flex-col justify-between h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold	">
                          TH
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium">Trần Hùng</h4>
                          <p className="text-gray-500">Chủ shop thời trang</p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        "Dịch vụ rất tốt, sau khi tài khoản quảng cáo của tôi bị khóa,
                        tôi đã thuê BM tại đây và tiếp tục chạy quảng cáo mà không gặp
                        vấn đề gì."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="flex flex-col justify-between h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold	">
                          NL
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium">Nguyễn Linh</h4>
                          <p className="text-gray-500">Marketing Manager</p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        "Hệ thống nạp tiền tự động hoạt động rất tốt, giúp tôi nhanh
                        chóng bắt đầu chiến dịch quảng cáo khi cần gấp. Dịch vụ hỗ trợ
                        cũng rất nhiệt tình."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="flex flex-col justify-between h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold	">
                          PT
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium">Phạm Thảo</h4>
                          <p className="text-gray-500">Chủ doanh nghiệp</p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        "Giá cả hợp lý và minh bạch. Tôi đặc biệt ấn tượng với việc
                        hoàn tiền phần limit chưa sử dụng, điều này giúp tôi tiết kiệm
                        được chi phí đáng kể."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className="h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        )
      }

      {
        role === "admin" && (
            <>
              <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-300"/>
                  <span className="font-medium font-sans">AKA Media</span>
                </div>
                <div className="flex items-center gap-6 max-md:hidden">
                  <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 dark:bg-white/5 dark:inset-ring-white/2"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        className="-ml-0.5 size-4 fill-gray-600 dark:fill-gray-500"
                    >
                      <path
                          fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"
                      ></path>
                    </svg>
                    <kbd className="font-sans text-xs/4 text-gray-500 not-[.os-macos_&]:block dark:text-gray-400">
                      Ctrl K
                    </kbd>
                  </button>
                  <Settings className="w-5 h-5 text-gray-600 cursor-pointer"/>
                  <User className="w-5 h-5 text-gray-600 cursor-pointer"/>
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div
                    className="w-full max-w-screen-3xl mx-auto box-border px-0 sm:px-10 pt-[var(--layout-dashboard-content-pt)] pb-[var(--layout-dashboard-content-pb)] flex flex-col flex-[1_1_auto]"
                >
                  <div className="mb-10 text-xl font-bold leading-6 font-sans">
                    Hi, Welcome back 👋
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
                    <StatCard
                        title="Doanh thu"
                        value="2.890.000.000 VND"
                        icon="/ic-glass-bag.svg"
                        trend={2.6}
                        color="bg-green-300 text-green-800"
                    />
                    <StatCard
                        title="Số lượng tài khoản quảng cáo "
                        value="289.500"
                        icon="/ic-glass-users.svg"
                        trend={-0.1}
                        color="bg-purple-300 text-purple-800"
                    />
                    <StatCard
                        title="Số lượng người dùng đăng ký"
                        value="2.400.000"
                        icon="/ic-glass-buy.svg"
                        trend={2.8}
                        color="bg-yellow-300 text-yellow-800"
                    />
                    <StatCard
                        title="Số lượng chiến dịch"
                        value="89.200"
                        icon="/ic-glass-message.svg"
                        trend={3.6}
                        color="bg-red-300 text-red-800"
                    />
                  </div>

                  <div className="bg-gray-50">
                    <StatsCharts />
                  </div>

                  <div className=" bg-gray-50">
                    <ChartDashboard />
                  </div>
                </div>
              </div>
            </>
          )
      }
    </Layout>
  );
};

export default HomePage;
