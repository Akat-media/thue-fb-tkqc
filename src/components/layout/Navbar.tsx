import React, { useState, useEffect } from 'react';
import { Menu, X, User, CreditCard, LogOut, TicketPercent } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../../pages/auth/LoginModal.tsx';
import RegisterModal from '../../pages/auth/RegisterModal.tsx';
import { toast } from 'react-toastify';
import { useUserStore } from '../../stores/useUserStore.ts';
import socket from '../../socket/index.ts';

const ProfileDropdown: React.FC<{
  user: any;
  isProfileMenuOpen: boolean;
  handleLogout: () => void;
  onClose: () => void;
}> = ({ user, isProfileMenuOpen, handleLogout, onClose }) => {
  return (
    <div
      className={`absolute right-0 mt-2 min-w-[200px] max-w-[90vw] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform ${
        isProfileMenuOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <p className="font-semibold text-base">{user?.username || 'User'}</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <div className="px-4 py-3 text-sm text-gray-700 border-b space-y-1">
        <p className="text-gray-500 truncate">
          {user?.email || 'email@example.com'}
        </p>
        <p className="font-semibold text-green-600 mt-1">
          {user?.points?.toLocaleString('vi-VN')} điểm
        </p>
      </div>
      <Link
        to="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <User className="mr-2 h-4 w-4" /> Tài khoản
      </Link>
      <Link
        to="/ticket"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <TicketPercent className="mr-2 h-4 w-4" /> Voucher
      </Link>
      <Link
        to="/payments"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <CreditCard className="mr-2 h-4 w-4" /> Nạp tiền
      </Link>
      <button
        onClick={handleLogout}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
      </button>
    </div>
  );
};

const AuthDropdown: React.FC<{
  isAuthMenuOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}> = ({ isAuthMenuOpen, onClose, onLoginClick, onRegisterClick }) => {
  return (
    <div
      className={`absolute right-0 mt-2 min-w-[150px] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform ${
        isAuthMenuOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <p className="text-sm font-semibold">Tài khoản</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <button
        onClick={() => {
          onClose();
          onLoginClick();
        }}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Đăng nhập
      </button>
      <button
        onClick={() => {
          onClose();
          onRegisterClick();
        }}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Đăng ký
      </button>
    </div>
  );
};

const Navbar: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const { setUser } = useUserStore();
  const location = useLocation();

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
    setIsProfileMenuOpen(false);
  }, [user]);

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
  // console.log("fetchUser", fetchUser)
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState('/avatar.jpg');

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsAuthMenuOpen(false);
  };

  const toggleAuthMenu = () => {
    setIsAuthMenuOpen(!isAuthMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const menuItems = [
    {
      icon: '🏠',
      label: 'Trang chủ',
      href: '/dashboard',
      hoverColor: 'bg-gradient-to-r from-blue-400 to-blue-800',
    },
    {
      icon: '📋',
      label: 'Danh sách tài khoản',
      href: '/marketplace',
      hoverColor: 'bg-gradient-to-r from-pink-400 to-pink-600',
    },
    {
      icon: '💹',
      label: 'Bảng giá',
      href: '/price',
      hoverColor: 'bg-gradient-to-r from-orange-300 to-yellow-600',
    },
    {
      icon: '💳',
      label: 'Tài khoản đang thuê',
      href: '/rentals',
      hoverColor: 'bg-gradient-to-r from-green-400 to-green-600',
    },
    {
      icon: '💰',
      label: 'Nạp tiền',
      href: '/payments',
      hoverColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    },
    {
      icon: '📜',
      label: 'Lịch sử giao dịch',
      href: '/admintransaction',
      hoverColor: 'bg-gradient-to-r from-red-400 to-red-600',
    },
    {
      icon: '🎧',
      label: 'Hỗ trợ',
      href: '/support',
      hoverColor: 'bg-gradient-to-r from-purple-400 to-purple-600',
    },
    {
      icon: '⚙️',
      label: 'Chính sách',
      href: '/policy',
      hoverColor: 'bg-gradient-to-r from-orange-400 to-orange-600',
    },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsProfileMenuOpen(false);
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

  const userStorage = localStorage.getItem('user');
  const role = userStorage != null ? JSON.parse(userStorage)?.user.role : '';
  const hiddenPaths = ['/login', '/register'];
  if (hiddenPaths.includes(location.pathname) || role === 'admin') {
    return null;
  }

  return (
    <div>
      <nav className="bg-white shadow-sm w-full flex flex-row sm:flex-col">
        {/*text running*/}
        <div className="w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 via-sky-200 to-cyan-100">
          <style>
            {`
                    @keyframes marquee {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                    .animate-marquee {
                      animation: marquee 30s linear infinite;
                      animation-fill-mode: forwards;
                      animation-play-state: running;
                      display: inline-block; 
                      white-space: nowrap; 
                      width: 85%;
                    }
                    .group:hover .animate-marquee {
                      animation-play-state: paused;
                    }
                `}
          </style>
          <div className="w-full max-w-[1510px] mx-auto py-2">
            <div className="h-14 flex items-center justify-between space-x-2 sm:space-x-4 customScreen:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-4 customScreen:space-x-6 flex-1 min-w-0 justify-between">
                {' '}
                {/*sm:justify-start*/}
                {/* Sidebar for mobile and tablet */}
                <div className="customScreen:hidden">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-800 focus:outline-none"
                  >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                  {isSidebarOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-40 z-40"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  )}
                  <div
                    className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-gradient-to-br from-yellow-100 via-indigo-200 to-green-200 shadow-lg z-50 transform transition-transform duration-300 ${
                      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                  >
                    <div className="p-4 sm:p-5 border-b font-semibold text-blue-700 text-base sm:text-lg">
                      Menu
                    </div>
                    <nav className="flex flex-col p-4 sm:p-5 space-y-3 sm:space-y-4">
                      {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.href;

                        return (
                          <Link
                            key={index}
                            to={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                              isActive
                                ? 'bg-white text-blue-700 font-semibold'
                                : 'text-gray-800 hover:text-blue-600'
                            }`}
                          >
                            <span className="mr-2 sm:mr-3 text-base sm:text-lg">
                              {item.icon}
                            </span>
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </div>
                <img
                  src="/akamedia.png"
                  alt="User Avatar"
                  className="h-10 sm:h-12 customScreen:h-14 shrink-0"
                />
                {/* Text run on desktop only */}
                <div className="hidden customScreen:flex customScreen:items-center customScreen:relative customScreen:overflow-hidden customScreen:w-full customScreen:h-[40px]">
                  <div className="absolute right-0 whitespace-nowrap animate-marquee text-[12px] sm:text-[13px] customScreen:text-[14px]">
                    <span className="mx-4 font-[13px]">
                      {user ? (
                        <>
                          Chào mừng{' '}
                          <span className="font-bold text-blue-600">
                            {user.username}
                          </span>{' '}
                          đến với AKA MEDIA - Giải pháp nhanh chóng, an toàn và
                          đáng tin cậy trên các nền tảng số
                        </>
                      ) : (
                        'Chào mừng bạn đến với AKA MEDIA - Giải pháp nhanh chóng, an toàn và đáng tin cậy trên các nền tảng số'
                      )}
                    </span>
                  </div>
                </div>
                {/* Auth button with dropdown for mobile and tablet */}
                <div className="customScreen:hidden">
                  {user ? (
                    <button
                      onClick={toggleProfileMenu}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                    >
                      <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={toggleAuthMenu}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                    >
                      <img
                        src={avatar}
                        alt="Auth Avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}

                  {/* Dropdowns */}
                  {user ? (
                    <div>
                      {isProfileMenuOpen && (
                        <ProfileDropdown
                          user={user}
                          isProfileMenuOpen={isProfileMenuOpen}
                          handleLogout={handleLogout}
                          onClose={() => setIsProfileMenuOpen(false)}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {isAuthMenuOpen && (
                        <AuthDropdown
                          isAuthMenuOpen={isAuthMenuOpen}
                          onClose={() => setIsAuthMenuOpen(false)}
                          onLoginClick={() => setShowLoginModal(true)}
                          onRegisterClick={() => setShowRegisterModal(true)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Auth buttons for desktop */}
              <div className="hidden customScreen:flex customScreen:items-center customScreen:space-x-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={toggleProfileMenu}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                    >
                      <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div>
                      <ProfileDropdown
                        user={user}
                        isProfileMenuOpen={isProfileMenuOpen}
                        handleLogout={handleLogout}
                        onClose={() => setIsProfileMenuOpen(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="
                                px-5 py-2.5
                                bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600
                                hover:from-sky-600 hover:via-cyan-600 hover:to-sky-700
                                text-white text-sm font-semibold
                                rounded-full
                                transition-all duration-300 ease-in-out
                                transform hover:-translate-y-0.5 hover:shadow-lg
                                shadow-md
                                border-0
                                cursor-pointer
                                active:scale-95
                              "
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="
                                px-5 py-2.5
                                bg-gradient-to-r from-green-400 via-emerald-400 to-green-500
                                hover:from-green-500 hover:via-emerald-500 hover:to-green-600
                                text-white text-sm font-semibold
                                rounded-full
                                transition-all duration-300 ease-in-out
                                transform hover:-translate-y-0.5 hover:shadow-lg
                                shadow-md
                                border-0
                                cursor-pointer
                                active:scale-95
                              "
                    >
                      Đăng ký
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*navbar redirect desktop*/}
        <div className="hidden customScreen:block bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
          <nav className="relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-[shimmer_3s_ease-in-out_infinite]" />
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="flex justify-center whitespace-nowrap gap-4 max-w-[1200px] mx-auto px-2 py-6">
                {menuItems.map((item, i) => {
                  const protectedRoutes = [
                    '/rentals',
                    '/payments',
                    '/admintransaction',
                    '/support',
                  ];
                  const isProtected = protectedRoutes.includes(item.href);
                  const isActive = location.pathname === item.href;

                  const handleClick = (e: React.MouseEvent) => {
                    if (!user && isProtected) {
                      e.preventDefault();
                      setShowLoginModal(true);
                    }
                  };

                  return (
                    <Link
                      key={i}
                      to={item.href}
                      onClick={handleClick}
                      className={`group relative flex items-center gap-2 text-white font-medium text-base
                          px-5 py-3 rounded-full border
                          transition duration-300 ease-in-out
                          hover:scale-105 hover:-translate-y-1 active:scale-100
                          shadow-md bg-white/10 border-white/20 hover:shadow-xl
                          ${
                            isActive ? 'scale-105 -translate-y-1 shadow-xl' : ''
                          }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-full ${
                          isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        } transition-opacity duration-300 ${
                          item.hoverColor
                        } z-[-1]`}
                      />
                      <span className="text-base drop-shadow">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
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
            </div>
          </nav>
        </div>
      </nav>

      <div className="customScreen:hidden bg-blue-100">
        <style>
          {`
              @keyframes marquee-infinite {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-container {
                display: inline-block;
                white-space: nowrap;
                width: fit-content;
              }
              .marquee-content {
                display: inline-block;
                animation: marquee-infinite 20s linear infinite;
                animation-play-state: running;
              }
              .group:hover .marquee-content {
                animation-play-state: paused;
              }
              .marquee-item {
                display: inline-block;
                padding-right: 10rem; /* Khoảng cách giữa các bản sao */
              }
              /* Thêm style để căn giữa text theo chiều dọc */
              .center-text {
                display: flex;
                align-items: center; /* Căn giữa theo chiều dọc */
                height: 100%; /* Đảm bảo chiếm toàn bộ chiều cao */
              }
            `}
        </style>

        <div className="flex items-center relative overflow-hidden w-full h-[40px] group">
          <div className="absolute top-0 left-0 w-full h-full center-text">
            <div className="marquee-container">
              <div className="marquee-content">
                {/* Tạo 4 bản sao để đảm bảo chạy liên tục */}
                {[...Array(4)].map((_, index) => (
                  <span
                    key={index}
                    className="marquee-item text-[12px] sm:text-[13px] customScreen:text-[14px]"
                  >
                    {user ? (
                      <>
                        Chào mừng{' '}
                        <span className="font-bold text-blue-600">
                          {user.username}
                        </span>{' '}
                        đến với AKA MEDIA - Giải pháp nhanh chóng, an toàn và
                        đáng tin cậy trên các nền tảng số
                      </>
                    ) : (
                      'Chào mừng bạn đến với AKA MEDIA - Giải pháp nhanh chóng, an toàn và đáng tin cậy trên các nền tảng số'
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
