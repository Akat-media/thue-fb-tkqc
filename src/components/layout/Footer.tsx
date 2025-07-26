import React from 'react';
import ChevronRightGradient from '../../pages/home/ChevronRightGradient.tsx';
import { Copyright, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '../icons/index.tsx';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      {/*<div className="bg-gray-200 h-28"></div>*/}
      <footer className="bg-slate-800 text-white"
      style={{
        backgroundImage: "urL(/homepage/footer/Footer.png)",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      }}>
        <div className="container mx-auto px-6 py-12">
          <div className="">
            {/* Company Info Section */}
              <div className="flex items-center gap-4 mb-6">
                {/* AKA Ads Logo */}
                <Icon name="logoNew" />
                {/* AKA Media Logo */}
                <Icon name="logoV2" />
              </div>
            <div className="flex-wrap lg:flex justify-between">
              <div className="">
                <h3 className="text-2xl font-hubot text-[#9AFFFA] font-medium mb-6">
                  {t('footer.companyName')}
                  <br />
                  {t('footer.companyName2')}
                </h3>

                {/* Partner Badges */}
                <div className="flex gap-2 mb-6">
                  <div className="text-blue-600 rounded text-xs font-medium">
                    <img src='/homepage/footer/meta.png'/>
                  </div>
                  <div className="text-blue-600 rounded text-xs font-medium">
                  <img src='/homepage/footer/meta2.png'/>
                  </div>
                  <div className="text-white rounded text-xs font-medium flex items-center gap-1">
                    <img src='/homepage/footer/tiktok.png'/>
                  </div>
                </div>
              </div>
             <div className="flex flex-col gap-4 md:flex-row md:flex lg:gap-[36px]">
               {/* Services Section */}
               <div>
                <h3 className="text-xl font-hubot text-[#9AFFFA] mb-4">{t('footer.serviceTitle')}</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>
                    <Link
                      to="/marketplace"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.services.rentBM')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/marketplace"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.services.rentAdAccount')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payments"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.services.deposit')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rentals"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.services.accountManagement')}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Support Section */}
              <div>
                <h3 className="text-xl text-[#9AFFFA] font-hubot mb-4">{t('footer.supportTitle')}</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>
                    <Link
                      to="/support"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.support.faq')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policy"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.support.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policy"
                      className="hover:text-[#9AFFFA] text-white font-hubot transition-colors"
                    >
                      {t('footer.support.privacy')}
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Contact Section */}
              <div>
                <h3 className="text-xl text-[#9AFFFA] font-hubot mb-4">{t('footer.contactTitle')}</h3>
                <div className="space-y-1 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span className='text-white font-hubot'>+84 38 595 8416</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span className='text-white font-hubot'>cskh@akamedia.vn</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 mt-1" />
                    <span className='text-white font-hubot'>
                      {t('footer.address')}
                      <br />
                      {t('footer.address2')}
                    </span>
                  </div>

                  {/* Social Media Icons */}
                  <div className="flex gap-2 ml-6">
                    <Link
                      to="#"
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Icon name="fb" className="w-4 h-4" />
                    </Link>
                    <Link
                      to="#"
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Icon name="zalo" className="w-4 h-4" />
                    </Link>
                    <Link
                      to="#"
                      className="w-8 h-8 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <Icon name="youtube" className="w-4 h-4" />
                    </Link>
                    <Link
                      to="#"
                      className="w-8 h-8 rounded flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <img className="cursor-pointer" src="/homepage/footer/insta.png" alt="instagram" />
                    </Link>
                  </div>
                </div>
              </div>
             </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="container mx-auto border-t border-[#9AFFFA]">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center text-center text-white text-[16px] font-hubot font-normal">
              <span className='mr-2'><Icon name='ccIcon'/></span>  {t('footer.footerBot')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
