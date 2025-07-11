import React from 'react';
import ChevronRightGradient from '../../pages/home/ChevronRightGradient.tsx';
import { Copyright } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      {/*<div className="bg-gray-200 h-28"></div>*/}
      <footer className="bg-[#2c3641] text-white">
        <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
          <div>
            <img src="/homepage/footer/aka-white.png" alt="aka-footer" />
          </div>

          <div className="flex flex-col md:flex-row md:gap-28">
            {/* Left */}
            <div className="flex flex-col p-6">
              <div className="font-hubot text-[20px] md:text-[32px] font-[700]">
                {t('footer.companyName')}
              </div>
              <div>
                <div className="flex flex-row items-center py-3">
                  <img src="/homepage/footer/location.png" alt="location" />
                  <div className="font-hubot font-[500] pl-5 max-w-[450px]">
                    {t('footer.address')}
                  </div>
                </div>
                <div className="flex flex-row items-center py-3">
                  <img src="/homepage/footer/message.png" alt="message" />
                  <div className="font-hubot font-[500] pl-5">
                    cskh@akamedia.vn
                  </div>
                </div>
                <div className="flex flex-row items-center py-3">
                  <img src="/homepage/footer/phone.png" alt="phone" />
                  <div className="font-hubot font-[500] pl-5">038 595 8416</div>
                </div>

                <div className="flex flex-row items-center py-3 gap-2 pl-14">
                  <a href="https://www.facebook.com/akamedia.giaiphapso" target="_blank" rel="noopener noreferrer">
                    <img className="cursor-pointer" src="/homepage/footer/fb.png" alt="facebook" />
                  </a>
                  <a href="https://zalo.me/0385958416" target="_blank" rel="noopener noreferrer">
                    <img className="cursor-pointer" src="/homepage/footer/zalo.png" alt="zalo" />
                  </a>
                  <a>
                    <img className="cursor-pointer" src="/homepage/footer/youtube.png" alt="youtube" />
                  </a>
                  <a>
                    <img className="cursor-pointer" src="/homepage/footer/insta.png" alt="instagram" />
                  </a>
                </div>
              </div>
            </div>

            {/*right */}
            <div className="flex md:flex-row flex-col mb-[50px] md:mb-[0px]">
              <div className="mb-5 md:mb-0">
                <div className="font-hubot text-[20px] font-[700]">
                  {t('footer.serviceTitle')}
                </div>
                <div className="flex flex-col gap-2">
                <a
                  href="/marketplace"
                  className="font-hubot font-[500] flex flex-row text-white px-2 pt-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.services.rentBM')}
                </a>
                <a
                  href="/marketplace"
                  className="font-hubot font-[500] flex flex-row text-white pl-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.services.rentAdAccount')}
                </a>
                <a
                  href="/payments"
                  className="font-hubot font-[500] flex flex-row text-white pl-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.services.deposit')}
                </a>
                <a
                  href="/rentals"
                  className="font-hubot font-[500] flex flex-row text-white pl-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.services.accountManagement')}
                </a>
                </div>
              </div>
              <div className="md:pl-8 mb-5 md:mb-0">
                <div className="font-hubot text-[20px] font-[700]">
                  {t('footer.supportTitle')}
                </div>
                <div className="flex flex-col gap-2">
                <a
                  href="/support"
                  className="font-hubot font-[500] flex flex-row text-white px-2 pt-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.support.faq')}
                </a>
                <a
                  href="/policy"
                  className="font-hubot font-[500] flex flex-row text-white pl-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.support.terms')}
                </a>
                <a
                  href="/policy"
                  className="font-hubot font-[500] flex flex-row text-white pl-2 hover:underline"
                >
                  <ChevronRightGradient
                    fillColor="white"
                    width={24}
                    height={24}
                  />
                  {t('footer.support.privacy')}
                </a>
                </div>
              </div>
            </div>
          </div>

          {/*copyright*/}
          <div className="font-hubot flex flex-row justify-center font-normal p-4 text-[16px] leading-[24px] tracking-[0.1px] text-right border-t border-white ">
            <Copyright />
            <span className="pl-2 ">{t('footer.footerBot')}</span>
          </div>
        </div>

        {/*copyright*/}
        {/*<div className="border-t border-white w-full">*/}
        {/*    <div className="font-hubot flex flex-row justify-center font-normal p-4 text-[16px] leading-[24px] tracking-[0.1px] text-right border-t border-white ">*/}
        {/*        <Copyright />*/}
        {/*        <span className="pl-2 ">AKA Media, 2025. Bảo lưu mọi quyền.</span>*/}
        {/*    </div>*/}
        {/*</div>*/}
      </footer>
    </div>
  );
};

export default Footer;
