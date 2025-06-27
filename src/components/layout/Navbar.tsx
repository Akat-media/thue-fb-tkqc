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

type NavbarV2Props = {
  isHomePage?: boolean;
};
type NavType = {
  key: string;
  label: string;
  url: string;
  icon: JSX.Element;
}[];
// eslint-disable-next-line react-refresh/only-export-components
export const NAV_ITEMS: NavType = [
  {
    key: 'home',
    label: 'Trang chủ',
    url: '/dashboard',
    icon: <Icon name="home" />,
  },
  {
    key: 'accounts',
    label: 'Danh sách tài khoản',
    url: '/marketplace',
    icon: <Icon name="accounts" />,
  },
  {
    key: 'pricing',
    label: 'Bảng giá',
    url: '/price',
    icon: <Icon name="pricing" />,
  },
  {
    key: 'rented',
    label: 'Tài khoản đang thuê',
    url: '/rentals',
    icon: <Icon name="rented" />,
  },
  {
    key: 'topup',
    label: 'Nạp tiền',
    url: '/payments',
    icon: <Icon name="topup" />,
  },
  {
    key: 'history',
    label: 'Lịch sử giao dịch',
    url: '/admintransaction',
    icon: <Icon name="history" />,
  },
  {
    key: 'support',
    label: 'Hỗ trợ',
    url: '/support',
    icon: <Icon name="support" />,
  },
  // Thiếu chính sách
];

export default function Navbar({ isHomePage }: NavbarV2Props) {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [avatar, setAvatar] = useState('/avatar.jpg');
  const [languageDropdown, setLanguageDropdown] = useState(false);

  
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
    const stored = localStorage.getItem('user');
    if (stored) {
      const img = JSON.parse(stored)?.user?.images;
      if (img) setAvatar(`${img}?t=${Date.now()}`);
    }
  }, [user]);
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
  const role = userStorage != null ? JSON.parse(userStorage)?.user.role : '';
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
              backgroundImage: "url('/backgroundTop.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
      }
    >
      {/* PC Navigation */}
      <DesktopNavigation
        user={user}
        avatar={avatar}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setLanguageDropdown={setLanguageDropdown}
        languageDropdown={languageDropdown}
      />

      {/* SP Navigation */}
      <MobileNavigation
        isOpen={mobileNavOpen}
        user={user}
        avatar={avatar}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
        setShowRegisterModal={setShowRegisterModal}
        setLanguageDropdown={setLanguageDropdown}
        languageDropdown={languageDropdown}
        onToggle={handleMobileNavToggle}
        onClose={handleMobileNavClose}
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
