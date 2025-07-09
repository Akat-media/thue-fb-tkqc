'use client';

import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from '../icons';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import { NAV_ITEMS } from '../layout/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import { LANGUAGE_ITEMS } from '../layout/Navbar';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
type DesktopNavigationProps = {
  user: any;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => void;
};
export default function DesktopNavigation({
  user,
  setShowLoginModal,
  setShowRegisterModal,
  handleLogout,
}: DesktopNavigationProps) {
  const { i18n, t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const { openNotification, notificationsList, overlaySize } = useNotificationStore();
  // Thêm ref cho phần tử active
  const activeElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/dashboard') {
        setIsScrolled(scrollPosition > 400);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };
    updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeItem]);

  // ResizeObserver cho phần tử active
  useEffect(() => {
    // Cập nhật ref mỗi khi activeItem thay đổi
    if (navRef.current) {
      activeElementRef.current = navRef.current.querySelector(
        `[data-key="${activeItem}"]`
      ) as HTMLElement;
    }
    if (!activeElementRef.current) return;
    const observer = new window.ResizeObserver(() => {
      updateIndicator();
    });
    observer.observe(activeElementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [activeItem, navRef.current]);

  const updateIndicator = () => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector(
        `[data-key="${activeItem}"]`
      ) as HTMLElement;
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }
  };

  // Helper: map pathname to NAV_ITEMS key
  const getKeyFromPath = (path: string) => {
    const found = NAV_ITEMS.find((item) => item.url === path);
    return found ? found.key : 'home';
  };

  useEffect(() => {
    setActiveItem(getKeyFromPath(location.pathname));
  }, [location.pathname]);

  const handleItemClick = (
    item: (typeof NAV_ITEMS)[0],
    e: React.MouseEvent
  ) => {
    const protectedRoutes = [
      '/rentals',
      '/payments',
      '/admintransaction',
      '/support',
    ];
    const isProtected = protectedRoutes.includes(item.url);
    if (!user && isProtected) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    console.log('item111', item);
  };
  const unReadNoti = useMemo(() => {
    return notificationsList.filter((item) => !item.is_read);
  }, [notificationsList]);

  return (
    <div className={`hidden lg:block ${isScrolled ? 'relative' : 'unset'}`}>
      {/* Desktop Header */}
      <header className="relative z-10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center cursor-pointer"
            >
              <Icon name="logo" />
            </div>

            {/* Desktop Actions - Right side */}
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className='relative'>
                    <Bell
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => openNotification('third')}
                    />
                    {unReadNoti.length > 0 && (
                      <div className="absolute top-0 left-3 transform -translate-y-1/2 translate-x-[calc(50%-10px)] bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 min-w-[16px] flex items-center justify-center px-[4px]">
                        {unReadNoti.length}
                      </div>
                    )}
                    </div>
                    <ProfileDropdown handleLogout={handleLogout} />
                  </div>
                </div>
              ) : (
                <Fragment>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-2 border border-gray-300 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-105"
                  >
                    {t('authen.login')}
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-6 py-2 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                  >
                    {t('authen.register')}
                  </button>
                </Fragment>
              )}
              {/* Language Dropdown */}
              <Dropdown
                menu={{
                  items: LANGUAGE_ITEMS(i18n.language, t),
                  onClick: ({ key }) => {
                    i18n.changeLanguage(key);
                    localStorage.setItem('languageChoose', key);
                  },
                }}
                placement="topRight"
              >
                <button className="bg-white rounded-full transition-all duration-200 flex items-center p-[4px]">
                  {i18n.language === 'vi' ? (
                    <Icon name="logoVietnam" />
                  ) : (
                    <Icon name="logoEL" />
                  )}
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation Menu */}
      <nav
        className={`z-[1000] ${
          isScrolled
            ? 'fixed top-0 left-0 right-0 nav-sticky'
            : 'pt-6 nav-unsticky'
        } transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        <div className="container mx-auto pb-3 px-4">
          <div
            className={`rounded-3xl p-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isScrolled
                ? 'bg-white/95 shadow-2xl backdrop-blur-xl scale-[1.03]'
                : 'bg-white/90 backdrop-blur-sm'
            }`}
          >
            <div className="relative" ref={navRef}>
              {/* Active Indicator */}
              <div
                className="absolute top-0 h-full rounded-2xl transition-all duration-500 ease-out opacity-100 shadow-lg"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  background:
                    'linear-gradient(90deg, #D0E8FF 0%, #B3D8FF 100%)',
                  boxShadow: '0 4px 24px 0 rgba(64,160,255,0.10)',
                  opacity: 0.25,
                  transform: 'translateY(0)',
                }}
              />

              {/* Glowing Active Indicator */}
              <div
                className="absolute top-0 h-full rounded-2xl transition-all duration-500 ease-out blur-md"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  background:
                    'linear-gradient(90deg, #D0E8FF 0%, #B3D8FF 100%)',
                  opacity: 0.5,
                }}
              />

              <div className="flex items-center justify-evenly relative z-10">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = activeItem === item.key;
                  return (
                    <Link
                      to={item.url}
                      key={item.key}
                      data-key={item.key}
                      onClick={(e) => handleItemClick(item, e)}
                      className={`
                        flex flex-col items-center space-y-2 cursor-pointer 
                        transition-all duration-300 ease-out
                        hover:scale-110 hover:-translate-y-1
                        px-4 py-3 rounded-2xl
                        group relative overflow-hidden
                        ${
                          isActive
                            ? 'shadow-[0_4px_24px_0_rgba(64,160,255,0.20)] scale-105 bg-white'
                            : ''
                        }
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div
                        className={`
                          relative transition-all duration-300 ease-out
                          ${
                            isActive
                              ? 'text-[#4F8CFF] scale-110 drop-shadow-md'
                              : 'text-blue-400 group-hover:text-[#4F8CFF] group-hover:scale-105'
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute inset-0 text-[#B3D8FF] opacity-60">
                            {item.icon}
                          </div>
                        )}
                        <div className="relative z-10">{item.icon}</div>
                      </div>

                      <span
                        className={`
                          text-sm whitespace-nowrap font-medium transition-all duration-300 font-hubot
                          ${
                            isActive
                              ? 'text-[#3399FF] font-semibold drop-shadow-md'
                              : 'text-gray-600'
                          }
                        `}
                      >
                        {t(item.i18nKey)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <style>{`
        .nav-sticky {
          backdrop-filter: blur(16px) saturate(180%);
          transform: translateY(0) scale(1.01);
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-unsticky {
          backdrop-filter: blur(4px) saturate(120%);
          transform: translateY(0) scale(1);
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
