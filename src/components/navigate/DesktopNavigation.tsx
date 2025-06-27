'use client';

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import Icon from '../icons';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import { NAV_ITEMS } from '../layout/Navbar';
import { Link } from 'react-router-dom';
type DesktopNavigationProps = {
  user: any;
  avatar:string;
  languageDropdown: boolean
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
  setLanguageDropdown: Dispatch<SetStateAction<boolean>>
  handleLogout: () => void
};
export default function DesktopNavigation({
  user,
  avatar,
  languageDropdown,
  setShowLoginModal,
  setShowRegisterModal,
  handleLogout,
  setLanguageDropdown
}: DesktopNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 300)
    }
    window.addEventListener("scroll", handleScroll)
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  console.log('isScrolled', isScrolled)
  return (
    <div className={`hidden lg:block ${isScrolled ? 'relative' : 'unset'}`}>
      {/* Desktop Header */}
      <header className="relative z-10 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon name="logo" />
            </div>

            {/* Desktop Actions - Right side */}
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <div>
                    <ProfileDropdown
                      user={user}
                      avatar={avatar}
                      handleLogout={handleLogout}
                    />
                  </div>
                </div>
              ) : (
                <Fragment>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-6 py-2 border border-gray-300 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90 transition-all duration-200 hover:scale-105"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-2 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                  >
                    Đăng nhập
                  </button>
                </Fragment>
              )}
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  className="text-white rounded-full transition-all duration-200 flex items-center hover:scale-105"
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                >
                  <Icon name="logoVietnam" />
                </button>

                {languageDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20 animate-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150">
                        Tiếng Việt
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150">
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation Menu */}
      <nav className={`${isScrolled ? 'fixed top-0 left-0 right-0 z-20' : 'pt-6'}`}>
        <div className="container mx-auto px-4">
          <div className={` backdrop-blur-sm rounded-3xl p-4 transition-all duration-300 hover:shadow-xl ${isScrolled ? 'bg-white shadow-xl' : 'bg-white/90'}`}>
            <div className="flex items-center justify-evenly space-x-8">
              {NAV_ITEMS.map((item) => {
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
                    to={item.url}
                    key={item.key}
                    onClick={handleClick}
                    className="flex flex-col items-center space-y-2 cursor-pointer hover:text-blue-600 transition-all duration-200 hover:scale-110 hover:-translate-y-1"
                  >
                    <div className="text-2xl text-blue-500 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {languageDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setLanguageDropdown(false)}
        />
      )}
    </div>
  );
}
