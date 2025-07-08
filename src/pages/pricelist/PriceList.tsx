import React, { useEffect, useState } from 'react';
import PricingPage from './PricingPage.tsx';

const PriceList: React.FC = () => {
  const language = localStorage.getItem('i18nextLng');
  const langParse = language ? language : 'vi';

  return (
    <div className="font-sans">
      {/*banner*/}
      <div className="text-center sm:pt-14 px-8 sm:pb-14 pt-[24px] pb-[24px] bg-gradient-to-br from-cyan-400 via-transparent to-violet-200">
        {langParse === 'vi' ? (
          <h1 className="text-[32px] sm:text-5xl font-bold">
            Thuê{' '}
            <span className="text-[32px] sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              tài khoản
            </span>{' '}
            với gói đăng ký phù hợp
          </h1>
        ) : (
          <h1 className="text-[32px] sm:text-5xl font-bold">
            Rent{' '}
            <span className="text-[32px] sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              accounts
            </span>{' '}
            with the right package
          </h1>
        )}
      </div>

      {/*pick fee*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*fee*/}
        <div className="flex justify-center">
          <PricingPage />
        </div>

        {/*aka media*/}
        <div className="rounded-[15px] py-12 px-6 md:py-[64px] md:px-[32px] bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
          <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 md:p-[30px] flex flex-col justify-center">
              <div className="text-[24px] leading-[32px] md:text-[32px] md:leading-[42px] font-bold mb-4 bg-gradient-to-r from-cyan-500 to-purple-300 bg-clip-text text-transparent">
                AKA MEDIA
              </div>
              <div className="text-[16px] leading-[22px] md:text-[16px] md:leading-[26px] mb-4">
                {langParse === 'vi' ? (
                  <>
                    AKA Media là đơn vị cung cấp giải pháp truyền thông số tại
                    Việt Nam, chuyên về quảng cáo đa nền tảng như Facebook,
                    TikTok, YouTube, Google và Zalo. Công ty nổi bật với các
                    dịch vụ như xác minh tích xanh, khôi phục tài khoản, gỡ vi
                    phạm và seeding chuyên sâu. AKA Media đã đồng hành cùng hàng
                    nghìn doanh nghiệp và cá nhân trên toàn quốc.
                  </>
                ) : (
                  <>
                    AKA Media is a leading provider of digital media solutions
                    in Vietnam, specializing in multi-platform advertising on
                    Facebook, TikTok, YouTube, Google, and Zalo. The company
                    stands out with services such as blue tick verification,
                    account recovery, policy violation resolution, and advanced
                    seeding. AKA Media has supported thousands of businesses and
                    individuals nationwide.
                  </>
                )}
              </div>
            </div>
            <div className="p-4 md:p-[30px] flex items-center justify-center">
              <img
                className="w-full max-w-[580px] h-auto"
                src="/homepage.png"
                alt="akamedia"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
