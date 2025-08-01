'use client';
import { Bell, Eye, EyeOff, Menu, Star, X } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import Icon from '../icons';
import { NAV_ITEMS } from '../layout/Navbar';
import { Dropdown } from 'antd';
import { LANGUAGE_ITEMS } from '../layout/Navbar';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../../stores/notificationStore';

interface MobileNavigationProps {
  isOpen: boolean;
  user: any;
  showBalance:boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
  setMobileNavOpen:Dispatch<SetStateAction<boolean>>;
  setShowBalance: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => void;
  onToggle: () => void;
  onClose: () => void;
}

export default function MobileNavigation({
  isOpen,
  user,
  showBalance,
  setShowBalance,
  setShowLoginModal,
  setShowRegisterModal,
  handleLogout,
  setMobileNavOpen,
  onToggle,
  onClose,
}: MobileNavigationProps) {
  const { i18n, t } = useTranslation();
  const { openNotification, notificationsList, overlaySize } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const unReadNoti = useMemo(() => {
    return notificationsList.filter((item) => !item.is_read);
  }, [notificationsList]);
  
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile menu button - Left side */}
          <button
            className={`p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 ${
              isOpen ? 'rotate-90' : 'rotate-0'
            }`}
            onClick={onToggle}
          >
            <Menu className="w-6 h-6 transition-transform duration-200" />
          </button>
          {/* <div
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center cursor-pointer"
          >
            <img
              src="/logo.png"
              alt=""
              className="h-10 sm:h-12 customScreen:h-14 shrink-0"
            />
          </div> */}
          <div className="flex">
            {user && (
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="bg-white/98 backdrop-blur-xl rounded-2xl px-2 py-2 border-2 border-white shadow-2xl ring-4 ring-white/20">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-2 items-start">
                        <p className='text-sm font-hubot font-bold'>{t('profile.menu.points')}</p>
                        <div className="flex text-right">
                          <div className="text-sm font-black text-gray-900 drop-shadow-sm text-nowrap">
                            {showBalance ? (
                              <span>
                                {user?.points?.toLocaleString('vi-VN')}{' '}
                                <span className="text-sm">
                                </span>
                              </span>
                            ) : (
                              <span className="font-mono text-[10px]">
                                ••••••••
                              </span>
                            )}
                          </div>
                        <div
                          onClick={() => setShowBalance(!showBalance)}
                          className="cursor-pointer ml-2"
                        >
                          {showBalance ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
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
            )}
            {/* Language Dropdown */}
            <Dropdown
              menu={{
                items: LANGUAGE_ITEMS(i18n.language, t),
                onClick: ({ key }) => {
                  i18n.changeLanguage(key);
                },
              }}
              placement="topRight"
              className="ml-2"
            >
              <button className="text-white rounded-full transition-all duration-200 flex items-center">
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

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-sm shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{t('subTextNavbar')}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {NAV_ITEMS.slice(5).map((item) => {
              const protectedRoutes = [
                '/rentals',
                '/payments',
                '/admintransaction',
                '/support',
              ];
              const isProtected = protectedRoutes.includes(item.url);
              const handleClick = (e: React.MouseEvent) => {
                if (!user && isProtected) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
                setMobileNavOpen(false);
              };
              const isActive = location.pathname.startsWith(item.url);
              return (
                <Link
                  key={item.key}
                  to={item.url}
                  onClick={handleClick}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-[#B3D8FF] text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-[#EBEBEB] hover:text-gray-900'
                    }`}
                >
                  <div
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      isActive ? 'text-blue-600' : 'group-hover:scale-110'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-sm font-hubot ${
                      isActive ? 'text-blue-600' : 'text-[#6B7280]'
                    }`}
                  >
                    {t(item.i18nKey)}
                  </span>
                </Link>
              );
            })}
          </div>
          {!user && (
            <div className="space-y-4 mt-4">
              <button
                onClick={() => {
                  onClose();
                  setShowRegisterModal(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Đăng ký
              </button>
              <button
                onClick={() => {
                  onClose();
                  setShowLoginModal(true);
                }}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-2 z-20 animate-in slide-in-from-bottom duration-500">
        <div className="container mx-auto">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.slice(0, 5).map((item, index) => {
              const protectedRoutes = [
                '/rentals',
                '/payments',
                '/admintransaction',
                '/support',
              ];
              const isProtected = protectedRoutes.includes(item.url);
              const handleClick = (e: React.MouseEvent) => {
                if (!user && isProtected) {
                  e.preventDefault();
                  setShowLoginModal(true);
                }
              };
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.key}
                  to={item.url}
                  onClick={handleClick}
                  className={`flex flex-col items-center space-y-1 cursor-pointer transition-all duration-200 p-2 rounded-lg
                    ${
                      isActive
                        ? 'bg-[#B3D8FF] text-blue-600 font-semibold'
                        : 'hover:text-blue-600'
                    }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`text-lg transition-transform duration-200 ${
                      isActive ? 'text-blue-600' : 'text-blue-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
