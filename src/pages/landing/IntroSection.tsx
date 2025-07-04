'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function IntroSection() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { t } = useTranslation();
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/dashboard') {
        setIsScrolled(scrollPosition > 400);
      }
      }
      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])
  return (
    <div
      className={`relative ${
        isScrolled ? 'lg:pt-[92px]' : ''
      } font-[Helvetica,Arial,sans-serif]`}
    >
      <main className="relative mt-8 lg:mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" data-aos="fade-up">
              {t('mainHeading.title')}
            </h2>
            <h1 className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6 pt-2 lg:mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow-2xl" data-aos="fade-up" data-aos-delay="100">
              {t('mainHeading.titleBot')}
            </h1>
            <div className="space-y-3 lg:space-y-4 mb-8 lg:mb-16 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300" data-aos="fade-up" data-aos-delay="200">
              <p className="text-base lg:text-xl text-gray-700 leading-relaxed">
              {t('mainHeading.subtitle')}
              </p>
              <p className="text-base lg:text-xl text-gray-700 leading-relaxed">
                {t('mainHeading.subtitleBot')}
              </p>
            </div>
            <Link
              to={'/marketplace'}
              className={`
                relative inline-flex items-center justify-between
                bg-white hover:bg-gray-50
                rounded-full
                px-[3px] py-[3px]
                text-gray-800 font-medium 
                text-sm sm:text-base md:text-lg
                transition-all duration-300 ease-in-out
                hover:scale-105 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                group
                border-transparent
                bg-gradient-to-r from-[#07C8F9] to-[#0D41E1] p-[1px]
              `}
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="flex items-center justify-between w-full bg-white hover:bg-gray-50 rounded-full px-2 sm:px-2 py-[6px] sm:py-2 transition-colors duration-300">
                <span className="mx-2 font-hubot sm:mx-3 md:mx-4 text-base sm:text-lg md:text-xl font-bold text-[#193250]">
                {t('mainHeading.textButton')}
                </span>
                <div
                  className="
              flex items-center justify-center
              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
              bg-slate-700 hover:bg-slate-800
              rounded-full
              transition-all duration-300
              group-hover:scale-110
              font-bold
            "
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
