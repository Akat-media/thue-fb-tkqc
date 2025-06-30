'use client';
import { Menu, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import Icon from '../icons';
import { NAV_ITEMS } from '../layout/Navbar';
import { Dropdown } from 'antd';
import { LANGUAGE_ITEMS } from '../layout/Navbar';
import { useTranslation } from 'react-i18next';

interface MobileNavigationProps {
  isOpen: boolean;
  user: any;
  avatar: string;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
  setMobileNavOpen:Dispatch<SetStateAction<boolean>>;
  handleLogout: () => void;
  onToggle: () => void;
  onClose: () => void;
}

export default function MobileNavigation({
  isOpen,
  user,
  avatar,
  setShowLoginModal,
  setShowRegisterModal,
  handleLogout,
  setMobileNavOpen,
  onToggle,
  onClose,
}: MobileNavigationProps) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  
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
          <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center cursor-pointer">
            <img
              src="/logo.png"
              alt=""
              className="h-10 sm:h-12 customScreen:h-14 shrink-0"
            />
          </div>
          <div className="flex">
            {user && (
              <div className="relative">
                <div>
                  <ProfileDropdown
                    user={user}
                    avatar={avatar}
                    handleLogout={handleLogout}
                  />
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
              className='ml-2'
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
            <h3 className="text-lg font-semibold">Dịch vụ</h3>
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
              return (
                <Link
                  key={item.key}
                  to={item.url}
                  onClick={handleClick}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-700 hover:bg-[#EBEBEB] hover:text-gray-900 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <span className="text-sm font-hubot text-[#6B7280]">
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
              return (
                <Link
                  key={item.key}
                  to={item.url}
                  onClick={handleClick}
                  className="flex flex-col items-center space-y-1 cursor-pointer hover:text-blue-600 transition-all duration-200 p-2 hover:scale-110 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="text-lg text-blue-500 transition-transform duration-200">
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
