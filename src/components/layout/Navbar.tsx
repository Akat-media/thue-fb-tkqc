'use client';

import { useEffect, useState } from 'react';
import Icon from '../icons';
import LoginModal from '../../pages/auth/LoginModal';
import { useUserStore } from '../../stores/useUserStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../../pages/auth/RegisterModal';
import socket from '../../socket';
import DesktopNavigation from '../navigate/DesktopNavigation';
import MobileNavigation from '../navigate/MobileNavigation';
import { MenuProps } from 'antd';
import { TFunction } from 'i18next';
import { useNotificationStore } from '../../stores/notificationStore';
type NavbarV2Props = {
  isHomePage?: boolean;
};
type NavType = {
  key: string;
  i18nKey: string;
  url: string;
  icon: JSX.Element;
}[];
// eslint-disable-next-line react-refresh/only-export-components
  export const LANGUAGE_ITEMS = (currentLang: string, t: TFunction): MenuProps['items'] => [
  {
    key: 'vi',
    label: (
      <div className="flex justify-between items-center">
        <span className={currentLang === 'vi' ? 'font-semibold text-blue-600' : ''}>
        {t('language.vi')}
        </span>
      </div>
    ),
  },
  {
    key: 'en',
    label: (
      <div className="flex justify-between items-center">
        <span className={currentLang === 'en' ? 'font-semibold text-blue-600' : ''}>
        {t('language.en')}
        </span>
      </div>
    )
  },
]
// eslint-disable-next-line react-refresh/only-export-components
export const NAV_ITEMS:NavType = [
  {
    key: 'home',
    i18nKey: 'nav.home',
    url: '/dashboard',
    icon: <Icon name="home" />,
  },
  {
    key: 'accounts',
    i18nKey: 'nav.accounts',
    url: '/marketplace',
    icon: <Icon name="accounts" />,
  },
  {
    key: 'pricing',
    i18nKey: 'nav.pricing',
    url: '/price',
    icon: <Icon name="pricing" />,
  },
  {
    key: 'rented',
    i18nKey: 'nav.rented',
    url: '/rentals',
    icon: <Icon name="rented" />,
  },
  {
    key: 'topup',
    i18nKey: 'nav.topup',
    url: '/payments',
    icon: <Icon name="topup" />,
  },
  {
    key: 'history',
    i18nKey: 'nav.history',
    url: '/admintransaction',
    icon: <Icon name="history" />,
  },
  {
    key: 'support',
    i18nKey: 'nav.support',
    url: '/support',
    icon: <Icon name="support" />,
  },
  {
    key: 'policy',
    i18nKey: 'nav.policy',
    url: '/policy',
    icon: <img className="h-8 w-8" src="/homepage/header/policyIcon.png" alt="" />,
  },
];
export default function Navbar({ isHomePage }: NavbarV2Props) {
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();
  const userInfo = JSON.parse(localStorage.getItem('user') || 'null')
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBalance, setShowBalance] = useState(false)

  // Notification fetch logic
  const { fetchNotifications, notificationsList } = useNotificationStore();
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.user_id && notificationsList.length === 0) {
          fetchNotifications(userObj.user_id);
        }
      } catch (e) {
        console.log('Lỗi khi fetch noti', e)
      }
    }
  }, [localStorage.getItem('user')]);
  // Side effect   
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  // xử lý khi nhấn Back/Forward
  useEffect(() => {
    const handlePopstate = () => {
      fetchUser(); // Cập nhật lại user khi ấn nút back trên browser
    };
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [fetchUser]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('joinRoom');
    });
    socket.on('payment_success', (data) => {
      console.log('Payment thành công:', data);
      fetchUser();
    });
    return () => {
      socket.off('payment_success');
    };
  }, [fetchUser]);

  //   handle functions
  const handleMobileNavToggle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleMobileNavClose = () => {
    setMobileNavOpen(false);
  };
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    //   setIsProfileMenuOpen(false);
    fetchUser();
    toast.success('Đăng nhập thành công!');
    if (location.pathname === '/login') {
      navigate('/');
    }
    window.location.reload();
  };
  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    fetchUser();
    toast.success('Đăng ký thành công! Bạn đã được đăng nhập tự động.');
    if (location.pathname === '/register') {
      navigate('/');
    }
    window.location.reload();
  };
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  const userStorage = localStorage.getItem('user');
  const role = userStorage != null ? JSON.parse(userStorage)?.user?.role : '';
  const hiddenPaths = ['/login', '/register'];
  if (hiddenPaths.includes(location.pathname) || role === 'admin') {
    return null;
  }

  return (
    <div
      className="relative"
      style={
        isHomePage
          ? {}
          : {
              backgroundImage: "url('/homepage/header/backgroundTop.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
      }
    >
      {/* PC Navigation */}
      <DesktopNavigation
        user={user}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setShowBalance={setShowBalance}
        showBalance={showBalance}
      />

      {/* SP Navigation */}
      <MobileNavigation
        isOpen={mobileNavOpen}
        user={user}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setMobileNavOpen={setMobileNavOpen}
        onToggle={handleMobileNavToggle}
        onClose={handleMobileNavClose}
        setShowBalance={setShowBalance}
        showBalance={showBalance}
      />
      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
}
