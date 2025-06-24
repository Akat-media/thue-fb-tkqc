import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Shield,
  Clock,
  Bell,
  Settings,
  User,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import StatCard from './analytics/StatCard.tsx';
import StatsCharts from './analytics/StatsCharts.tsx';
import ChartDashboard from './analytics/ChartDashboard.tsx';
import Counter from '../components/ui/Counter';
import axios from 'axios';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { createGlobalStyle } from 'styled-components';
import img1 from '../public/homepage.png';
import metalogo from '../public/metalogo.png';
import { toast } from 'react-toastify';
import BaseHeader from '../api/BaseHeader.ts';
import { useTranslation } from 'react-i18next';

type MonthlyTotal = {
  totalRevenue: number;
  totalUsers: number;
  totalTransaction: number;
  totalAdsAccounts: number;
  growUser: number;
  growTransaction: number;
  growAdsAccount: number;
  growRevenue: number;
};
type MonthlyStatsItem = {
  month: string;
  revenue: number;
  newUsers: number;
  newAdsAccounts: number;
  countTransactions: number;
};
export type UserInfo = {
  username: string;
  totalAmount: number;
};
export type MonthlyStats = {
  monthlyStats: MonthlyStatsItem[];
  totals: MonthlyTotal;
  userList: UserInfo[];
};
const GlobalStyle = createGlobalStyle`
   @media (max-width: 768px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

const HomePage: React.FC = () => {
  const user = localStorage.getItem('user');
  const role = typeof user === 'string' ? JSON.parse(user)?.user.role : '';
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [statsMonthly, setStatsMonthly] = useState<MonthlyStats>({
    monthlyStats: [],
    userList: [],
    totals: {
      totalRevenue: 0,
      totalUsers: 0,
      totalTransaction: 0,
      totalAdsAccounts: 0,
      growUser: 0,
      growTransaction: 0,
      growAdsAccount: 0,
      growRevenue: 0,
    },
  });
  const [dateRange, setDateRange] = useState({
    targetFrom: dayjs()
      .subtract(5, 'month')
      .startOf('month')
      .format('YYYY/MM/DD'),
    targetTo: dayjs().startOf('month').format('YYYY/MM/DD'),
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await BaseHeader({
          method: 'get',
          url: '/statistics',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    if (role === 'admin') fetchStats();
  }, [role]);

  const newsArticles = [
    {
      id: 1,
      title: 'Thuê tài khoản quảng cáo Facebook',
      date: '25/04/2025',
      excerpt:
        'Giải pháp thuê tài khoản quảng cáo Facebook an toàn, hiệu quả cho doanh nghiệp.',
      url: 'https://akamedia.vn/thue-tai-khoan-quang-cao-facebook',
      image:
        'https://akamedia.vn/assets/images/news-and-events/content/thue-tai-khoan-quang-cao-facebook.png',
    },
    {
      id: 2,
      title: 'Tài Khoản Quảng Cáo Facebook: Hướng Dẫn Chi Tiết Cho Người Mới',
      date: '06/05/2025',
      excerpt:
        'Trong thời đại số hóa ngày nay, việc quảng bá sản phẩm và dịch vụ trên các nền tảng mạng xã hội trở nên quan trọng hơn bao giờ hết. Facebook có hơn 2,9 tỷ người dùng hoạt động hàng tháng.',
      url: 'https://akamedia.vn/tai-khoan-quang-cao-facebook',
      image:
        'https://akamedia.vn/assets/images/news-and-events/content/T%C3%A0i%20kho%E1%BA%A3n%20qu%E1%BA%A3ng%20c%C3%A1o%20Facebook.png',
    },
    {
      id: 3,
      title: 'Chạy quảng cáo Facebook giá rẻ',
      date: '15/05/2025',
      excerpt:
        'Chiến lược tối ưu ngân sách khi chạy quảng cáo Facebook với chi phí thấp nhất.',
      url: 'https://akamedia.vn/chay-quang-cao-facebook-gia-re',
      image:
        'https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png',
    },
  ];
  const totalSlides = 1;
  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dateStrings.length === 2) {
      const targetDayFrom = dateStrings[0];
      const targetDayTo = dateStrings[1];
      setDateRange({
        targetFrom: targetDayFrom,
        targetTo: targetDayTo,
      });
      if (role === 'admin') fetchDataChart(targetDayFrom, targetDayTo);
    }
  };
  const fetchDataChart = async (targetDayFrom: string, targetDayTo: string) => {
    try {
      const response = await BaseHeader(
        `/monthlyStatistics?targetDayFrom=${targetDayFrom}&targetDayTo=${targetDayTo}`
      );
      setStatsMonthly(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê'
      );
    }
  };
  useEffect(() => {
    if (role === 'admin')
      fetchDataChart(dateRange.targetFrom, dateRange.targetTo);
  }, []);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      {role !== 'admin' && (
        <>
          <h1>{t('welcome')}</h1>
          <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
          <button onClick={() => changeLanguage('en')}>English</button>
          {/* phần translate xóa khi dùng xong */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                    Cho Thuê Tài Khoản Quảng Cáo Facebook
                  </h1>
                  <p className="mt-4 text-xl max-w-3xl opacity-90">
                    Giải pháp nhanh chóng, an toàn và đáng tin cậy để tiếp cận
                    tài khoản quảng cáo Facebook khi tài khoản của bạn bị khóa
                    hoặc hạn chế.
                  </p>
                  <div className="mt-8">
                    <Link to="/marketplace">
                      <Button className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-6 py-2 flex items-center">
                        Xem thêm <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center items-center mt-10 lg:mt-0">
                  <div className="relative">
                    <div className="w-68 h-68 rounded-full flex items-center justify-center animate-float">
                      <img
                        src={img1}
                        alt="Meta Logo"
                        className="w-68 h-68 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 120"
                className="w-full"
              >
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-blue-900">AKADS</h2>
                <p className="mt-4 max-w-3xl mx-auto text-gray-500">
                  Chúng tôi cung cấp dịch vụ cho thuê tài khoản quảng cáo
                  Facebook với nhiều ưu điểm vượt trội, đảm bảo quyền riêng tư
                  và an toàn cho tài khoản của cả người cho thuê và người thuê.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        An toàn & Bảo mật
                      </h3>
                      <p className="text-gray-500">
                        Hệ thống bảo mật cao, đảm bảo quyền riêng tư và an toàn
                        cho tài khoản của cả người cho thuê và người thuê.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nhanh chóng & Tiện lợi
                      </h3>
                      <p className="text-gray-500">
                        Đăng ký, thuê tài khoản và bắt đầu chạy quảng cáo chỉ
                        trong vài phút với quy trình đơn giản, dễ dàng.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Giá cả hợp lý
                      </h3>
                      <p className="text-gray-500">
                        Chi phí thuê tài khoản cạnh tranh, minh bạch, không phát
                        sinh chi phí ẩn và được hoàn tiền nếu không sử dụng hết
                        hạn mức.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Dark Blue Product Section */}
          <div className="py-16 bg-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">
                  Dịch vụ sản phẩm hiệu quả
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex items-center h-full">
                  <div className="bg-blue-800 p-8 rounded-xl w-full h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        Cho Thuê Tài Khoản Facebook
                      </h3>
                      <p className="text-blue-100 mb-6">
                        Giải pháp nhanh chóng, an toàn và đáng tin cậy để tiếp
                        cận tài khoản quảng cáo Facebook khi tài khoản của bạn
                        bị khóa hoặc hạn chế.
                      </p>
                    </div>
                    <div>
                      <Link to="/marketplace">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2 flex items-center">
                          Tìm hiểu thêm{' '}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center h-full">
                  <div className="bg-blue-800 p-8 rounded-xl w-full h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        Quản lý tài khoản
                      </h3>
                      <p className="text-blue-100 mb-6">
                        Hệ thống quản lý tài khoản quảng cáo hiệu quả, giúp bạn
                        theo dõi và tối ưu hóa chiến dịch quảng cáo của mình.
                      </p>
                    </div>
                    <div>
                      <Link to="/rentals">
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2 flex items-center">
                          Tìm hiểu thêm
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Section with Slider */}
          <div className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900">Cẩm nang</h2>
              </div>

              <div ref={sliderRef} className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    width: `${totalSlides * 100}%`,
                    transform: `translateX(-${
                      currentSlide * (100 / totalSlides)
                    }%)`,
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="flex-shrink-0"
                      style={{ width: `${100 / totalSlides}%` }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {newsArticles
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((article) => (
                            <Card
                              key={article.id}
                              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                            >
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-68 object-cover"
                              />
                              <CardContent className="p-6 flex flex-col flex-grow">
                                <div className="flex flex-col flex-grow">
                                  <div className="text-sm text-gray-500 mb-2">
                                    {article.date}
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {article.title}
                                  </h3>
                                  <p className="text-gray-600 line-clamp-2 mb-4 flex-grow">
                                    {article.excerpt}
                                  </p>
                                </div>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium mt-auto"
                                >
                                  Đọc thêm{' '}
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </a>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="py-16 bg-gradient-to-b from-white via-blue-300 to-white impressive-numbers-wrapper">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-blue-900 text-center mb-8">
                Thành Tựu
              </h2>

              <div className="text-gray-600 text-center mb-10 max-w-4xl mx-auto">
                <p>
                  AKAds là nền tảng cho thuê tài khoản quảng cáo Facebook uy tín
                  thuộc AKA Media – công ty chuyên cung cấp các dịch vụ trên nền
                  tảng số tại Việt Nam. Với hơn 9 năm kinh nghiệm trong ngành và
                  sự tin tưởng của 1000+ doanh nghiệp lớn nhỏ, AKA Media cam kết
                  đem đến giải pháp quảng cáo hiệu quả, an toàn và tối ưu chi
                  phí cho doanh nghiệp.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-blue-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <Counter end={5000} suffix=" +" />
                  <div className="text-xl font-medium text-blue-900 mb-2">
                    Tài khoản quảng cáo Meta uy tín
                  </div>
                  <div className="text-gray-600">
                    Hệ thống tài khoản được xác thực và kiểm soát chất lượng bởi
                    AKAds – giúp chiến dịch quảng cáo hoạt động ổn định và hiệu
                    quả.
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <Counter end={9} prefix="+ " suffix=" năm kinh nghiệm" />
                  <div className="text-xl font-medium text-blue-900 mb-2">
                    Đồng hành cùng{' '}
                    <Counter
                      end={1000}
                      suffix=" +"
                      className="inline text-blue-600 font-bold"
                    />{' '}
                    thương hiệu lớn, nhỏ
                  </div>
                  <div className="text-gray-600">
                    AKAds là lựa chọn hàng đầu của các doanh nghiệp trong và
                    ngoài nước trong việc mở rộng thị trường kỹ thuật số qua
                    quảng cáo Facebook hiệu quả.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    Công cụ bảo vệ tài khoản mạnh mẽ
                  </div>
                  <div className="text-xl font-medium text-blue-900 mb-2">
                    Bảo mật tối ưu – kết nối an toàn
                  </div>
                  <div className="text-gray-600">
                    AKAds tích hợp hệ thống bảo mật tiên tiến, đảm bảo tài khoản
                    quảng cáo an toàn tuyệt đối và thông tin doanh nghiệp được
                    bảo vệ toàn diện.
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-68 h-68 rounded-full flex items-center justify-center animate-float">
                    <img
                      src={metalogo}
                      alt="Meta Logo"
                      className="w-68 h-68 object-contain"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl hover:shadow-md transition-shadow">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    Xu hướng mới
                  </div>
                  <div className="text-xl font-medium text-gray-900 mb-2">
                    Được nhiều doanh nghiệp nhanh chóng đón nhận
                  </div>
                  <div className="text-gray-600">
                    AKAds đang trở thành lựa chọn hàng đầu cho các doanh nghiệp
                    muốn tối ưu chi phí và nâng cao hiệu quả quảng cáo Meta.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              className="w-full"
            >
              <path
                fill="#1e40af"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              ></path>
            </svg>
          </div>
        </>
      )}

      {role === 'admin' && (
        <>
          <div className="flex flex-col mb-7 md:flex-row flex-1 max-w-screen-3xl mx-auto box-border px-4 sm:px-10 items-start md:items-center justify-between gap-2 mt-4">
            <GlobalStyle />
            <RangePicker
              defaultValue={[
                dayjs(dateRange.targetFrom, dateFormat),
                dayjs(dateRange.targetTo, dateFormat),
              ]}
              format="YYYY/MM/DD"
              onChange={handleRangeChange}
            />
            <div className="flex h-14 items-center justify-between gap-8 sm:px-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-red-600 font-sans">
                  {new Date().toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {/*<div className="flex items-center gap-6 max-md:hidden">*/}
              {/*  <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />*/}
              {/*  <User className="w-5 h-5 text-gray-600 cursor-pointer" />*/}
              {/*</div>*/}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="w-full max-w-screen-3xl mx-auto box-border px-0 sm:px-10 pt-[var(--layout-dashboard-content-pt)] pb-[var(--layout-dashboard-content-pb)] flex flex-col flex-[1_1_auto] px-4 sm:px-4">
              <div className="mb-10 text-xl text-blue-600 font-bold leading-6 font-sans">
                Hi, Welcome back 👋
              </div>

              <div
                className="
                  grid grid-cols-1 
                  max-[630px]:grid-cols-1
                  min-[1000px]:grid-cols-2 
                  max-[1179px]:grid-cols-2 
                  min-[1179px]:grid-cols-4 
                  gap-6 w-full mx-auto"
              >
                <StatCard
                  title="Doanh thu"
                  value={
                    statsMonthly
                      ? `${statsMonthly.totals.totalRevenue?.toLocaleString(
                          'vi-VN'
                        )} VND`
                      : 'Loading...'
                  }
                  icon="/ic-glass-bag.svg"
                  trend={statsMonthly ? statsMonthly.totals.growRevenue : 0}
                  color="bg-green-300 text-green-800"
                />
                <StatCard
                  title="Số lượng tài khoản quảng cáo"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalAdsAccounts?.toLocaleString(
                          'vi-VN'
                        )
                      : 'Loading...'
                  }
                  icon="/ic-glass-users.svg"
                  trend={statsMonthly ? statsMonthly.totals.growAdsAccount : 0}
                  color="bg-purple-300 text-purple-800"
                />
                <StatCard
                  title="Số lượng người dùng đăng ký"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalUsers?.toLocaleString('vi-VN')
                      : 'Loading...'
                  }
                  icon="/ic-glass-buy.svg"
                  trend={statsMonthly ? statsMonthly.totals.growUser : 0}
                  color="bg-yellow-300 text-yellow-800"
                />
                <StatCard
                  title="Số lượng giao dịch"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalTransaction?.toLocaleString(
                          'vi-VN'
                        )
                      : 'Loading...'
                  }
                  icon="/ic-glass-message.svg"
                  trend={statsMonthly ? statsMonthly.totals.growTransaction : 0}
                  color="bg-red-300 text-red-800"
                />
              </div>

              <div>
                <StatsCharts data={statsMonthly} />
              </div>

              <div>
                <ChartDashboard data={statsMonthly} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
