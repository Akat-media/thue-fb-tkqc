'use client';

import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import IntroSection from './IntroSection';
import { ChevronRight} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import InfiniteLogoScroll from '../home/InfiniteLogoScroll';
import Blog from "../home/Blog.tsx";
import WhyChoose from "../home/WhyChoose.tsx";

export default function MainHero() {
  const [isHomePage] = useState(true);

  return (
    <div className="">
      <div
        className="min-h-[500px] lg:min-h-[800px] relative overflow-hidden font-[Helvetica,Arial,sans-serif]"
        style={{
          backgroundImage: "url('/homepage/header/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
        }}
      >
        <Navbar isHomePage={isHomePage} />
        <IntroSection />
      </div>

      {/*why choose*/}
      <WhyChoose />

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
      <Blog />

    </div>
  );
}
