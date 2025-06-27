'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import IntroSection from './IntroSection';
import { Card, CardContent } from '../../components/ui/Card';
import { ChevronRight, Clock, DollarSign, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Counter from '../../components/ui/Counter';
import metalogo from '../../public/metalogo.png';
import InfiniteLogoScroll from '../home/InfiniteLogoScroll';
import ChevronRightGradient from "../home/ChevronRightGradient.tsx";

export default function MainHero() {
  const [isHomePage] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalSlides = 1;
  const [currentSlide, setCurrentSlide] = useState(0);
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

  return (
    <div className="">
      <div
        className="min-h-[500px] lg:min-h-[800px] relative overflow-hidden font-[Helvetica,Arial,sans-serif]"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
        }}
      >
        <Navbar isHomePage={isHomePage} />
        <IntroSection />
      </div>
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-blue-900">AKADS</h2>
            <p className="mt-4 max-w-3xl mx-auto text-gray-500">
              Chúng tôi cung cấp dịch vụ cho thuê tài khoản quảng cáo Facebook
              với nhiều ưu điểm vượt trội, đảm bảo quyền riêng tư và an toàn cho
              tài khoản của cả người cho thuê và người thuê.
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
                    Hệ thống bảo mật cao, đảm bảo quyền riêng tư và an toàn cho
                    tài khoản của cả người cho thuê và người thuê.
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
                    Đăng ký, thuê tài khoản và bắt đầu chạy quảng cáo chỉ trong
                    vài phút với quy trình đơn giản, dễ dàng.
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
                    sinh chi phí ẩn và được hoàn tiền nếu không sử dụng hết hạn
                    mức.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Dịch vụ sản phẩm hiệu quả</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center h-full">
              <div className="bg-blue-800 p-8 rounded-xl w-full h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Cho Thuê Tài Khoản Facebook
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Giải pháp nhanh chóng, an toàn và đáng tin cậy để tiếp cận
                    tài khoản quảng cáo Facebook khi tài khoản của bạn bị khóa
                    hoặc hạn chế.
                  </p>
                </div>
                <div>
                  <Link to="/marketplace">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-2 flex items-center">
                      Tìm hiểu thêm <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center h-full">
              <div className="bg-blue-800 p-8 rounded-xl w-full h-full transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">Quản lý tài khoản</h3>
                  <p className="text-blue-100 mb-6">
                    Hệ thống quản lý tài khoản quảng cáo hiệu quả, giúp bạn theo
                    dõi và tối ưu hóa chiến dịch quảng cáo của mình.
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
      {/*image logo*/}
      <InfiniteLogoScroll />

      {/*blog*/}
      <div className="py-12 md:pt-24 md:pb-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center mb-8">
            <div className="w-[107px] h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] flex flex-row items-center justify-between">
              <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400  "></div>
              <div className="font-hubot font-normal md:text-[16px] text-[14px]">BLOG</div> {/*font-hubot*/}
            </div>
            <div className="flex flex-col items-end w-full">
              <div className="font-hubot font-medium text-[20px] md:text-[40px] leading-[1] pb-2"> {/*tracking-[0.03em]*/}
                Cập Nhật Tin Tức Mới Nhất
              </div>
              <div className="font-hubot font-medium text-[20px] md:text-[38px] leading-[1] ">
                <span>Từ </span>
                <span className="text-blue-600">Thị Trường & Nền Tảng</span>
              </div>
            </div>

            {/*fake div*/}
            <div className="hidden md:flex w-[107px] h-[52px] gap-[10px] rounded-[60px] border border-solid border-black flex-row items-center justify-between invisible">
              <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400" />
              <div className="font-normal font-[400] text-[16px]">BLOG</div>
            </div>
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
                    <div className="flex md:flex-row flex-col gap-8 items-start">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
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
                                      <div className="font-hubot text-sm text-gray-500 mb-2">
                                        {article.date}
                                      </div>
                                      <h3 className="max-w-full text-[#676767] font-hubot text-[20px] font-bold leading-[24px] tracking-[0.25px] mt-[15px] mb-[15px] ">
                                        {article.title}
                                      </h3>
                                      <p className="text-[#676767] font-hubot text-[16px] leading-[24px] tracking-[0.25px] line-clamp-2 mb-4">
                                        {article.excerpt}
                                      </p>
                                    </div>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm font-medium mt-auto"
                                    >
                                      {/* Gradient wrapper */}
                                      <span className="font-hubot inline-flex items-center bg-gradient-to-r from-[#00EFBF] via-[#00EAEA] to-[#00F2F6] bg-clip-text text-transparent">
                                          Đọc thêm
                                          <ChevronRightGradient className="ml-1 h-4 w-4" />
                                        </span>
                                    </a>
                                  </CardContent>
                                </Card>
                            ))}
                      </div>
                      <button
                          className="ml-4 mt-4 self-center p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-600" />
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
