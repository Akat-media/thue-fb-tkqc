import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  CircleDollarSign,
  Users,
  Bot,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  PanelRightOpen,
  PanelRightClose,
  AlignStartHorizontal,
  Archive,
  FileText,
  TrendingUp,
  Settings,
  TicketPercent,
  QrCode,
  Mail,
  ClipboardList,
  Wallet,
  BadgeCheck,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import socket from '../../socket';
import { useUserStore } from '../../stores/useUserStore';
import { useNotificationStore } from '../../stores/notificationStore';

const Sidebar: React.FC<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [avatar, setAvatar] = useState('/avatar.jpg');
  const { openNotification, notificationsList, overlaySize } =
    useNotificationStore();

  const unReadNoti = useMemo(() => {
    return notificationsList.filter((item) => !item.is_read);
  }, [notificationsList]);
  const isAdsMenuActive =
    location.pathname.startsWith('/adsaccountmanager') ||
    location.pathname === '/add-account' ||
    location.pathname === '/admin/account' ||
    location.pathname === '/admin/policy' ||
    location.pathname === '/admin/princing' ||
    location.pathname === '/admin/voucher';
  const [openAdsSubmenu, setOpenAdsSubmenu] = useState(isAdsMenuActive);
  const toggleProfileMenu = () => setOpenProfileMenu(!openProfileMenu);

  const links = [
    { label: 'Trang chủ', icon: LayoutDashboard, path: '/' },
    { label: 'Danh sách tài khoản', icon: Briefcase, path: '/marketplace' },
    { label: 'Danh sách ví', icon: Wallet, path: '/wallet' },
    { label: 'Chi tiết ví', icon: BadgeCheck, path: '/wallet-detail' },
    {
      label: 'Quản lý quảng cáo',
      icon: ClipboardList,
      path: '/admin/advertisement',
    },
    // {
    //   label: 'Trạng thái tài khoản',
    //   icon: ShoppingCart,
    //   path: '/admin/rentals',
    // },
    { label: 'Nạp tiền', icon: CircleDollarSign, path: '/payments' },
    // { label: 'Quản lý bot', icon: Bot, path: '/create-bot' },
    { label: 'Quản lý Cashback', icon: QrCode, path: '/admin-cashback' },

    // { label: "Quản lý giao dịch", icon: CreditCard, path: "/admintransaction" },
    // { label: "Quản lý người dùng", icon: Users, path: "/usermanage" },
  ];
  const linksMarketing = [
    { label: 'Trang chủ', icon: LayoutDashboard, path: '/' },
    { label: 'Chi tiết ví', icon: BadgeCheck, path: '/wallet-detail' },
    {
      label: 'Quản lý quảng cáo',
      icon: ClipboardList,
      path: '/admin/advertisement',
    },
    // { label: 'Nạp tiền', icon: CircleDollarSign, path: '/payments' },
    { label: 'Quản lý Cashback', icon: QrCode, path: '/admin-cashback' },
  ];
  const linksMarketingUser = [
    { label: 'Trang chủ', icon: LayoutDashboard, path: '/' },
    {
      label: 'Quản lý quảng cáo',
      icon: ClipboardList,
      path: '/admin/advertisement',
    },
    // { label: 'Nạp tiền', icon: CircleDollarSign, path: '/payments' },
    // { label: 'Quản lý Cashback', icon: QrCode, path: '/admin-cashback' },
  ];
  const fetchUser = useUserStore((state) => state.fetchUser);
  const userobj = useUserStore((state) => state.user);
  const CheckLink = useCallback(() => {
    if (userobj?.role === 'super_admin') {
      return links;
    } else if (userobj?.role === 'admin') {
      return linksMarketing;
    } else if (userobj?.role === 'user') {
      return linksMarketingUser;
    } else {
      return linksMarketingUser;
    }
  }, [userobj]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        toggleSidebar();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  console.log('userobj', userobj);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const img = JSON.parse(stored)?.user?.images;
      if (img) setAvatar(`${img}?t=${Date.now()}`);
    }
  }, []);

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

  const { setUser } = useUserStore();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 h-screen bg-gradient-to-br from-yellow-100 via-indigo-200 to-green-200 border-r flex flex-col justify-between py-6 px-4 shadow-sm z-40 transition-all duration-500',
        isSidebarOpen ? 'w-64' : 'w-14'
      )}
    >
      <div>
        <div
          className={clsx(
            'flex items-center mb-6 transition-all duration-300',
            isSidebarOpen ? 'justify-between px-2' : 'justify-center'
          )}
        >
          <Link
            to="/"
            className={clsx(
              'text-2xl font-semibold text-blue-600 hover:underline transition-all duration-300',
              !isSidebarOpen && 'opacity-0 w-0 overflow-hidden'
            )}
          >
            AKAds
          </Link>

          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-600 rounded hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelRightClose size={20} />
            )}
          </button>
        </div>

        <nav className="space-y-2">
          {CheckLink()
            .slice(0, 5)
            .map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'group flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300',
                  location.pathname === path && 'bg-white font-semibold'
                )}
              >
                <div className="w-12 flex justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={clsx(
                    'transition-all whitespace-nowrap overflow-hidden duration-300',
                    isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  )}
                >
                  {label}
                </span>
              </Link>
            ))}
          {userobj?.role === 'super_admin' && (
            <button
              onClick={() => {
                if (!isSidebarOpen) {
                  toggleSidebar();
                } else {
                  setOpenAdsSubmenu(!openAdsSubmenu);
                }
              }}
              className={clsx(
                'group flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300 w-full',
                isAdsMenuActive && 'bg-white font-semibold'
              )}
            >
              <div className="w-12 flex justify-center">
                <AlignStartHorizontal className="w-5 h-5" />
              </div>
              <span
                className={clsx(
                  'transition-all whitespace-nowrap overflow-hidden duration-300',
                  isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                )}
              >
                Quản lý hệ thống
              </span>
              {isSidebarOpen && (
                <ChevronDown
                  className={clsx(
                    'ml-auto mr-2 w-4 h-4 transition-transform',
                    openAdsSubmenu && 'rotate-180'
                  )}
                />
              )}
            </button>
          )}
          {/* Thêm max-height nếu thêm item */}
          <div
            className={clsx(
              'transition-all duration-1000 ease-in-out overflow-hidden transform origin-top',
              openAdsSubmenu && isSidebarOpen
                ? 'max-h-50 opacity-100 scale-y-100 mt-1'
                : 'max-h-0 opacity-0 scale-y-95'
            )}
          >
            <div className="ml-10 space-y-1">
              <Link
                to="/adsaccountmanager"
                className={clsx(
                  'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700',
                  location.pathname === '/adsaccountmanager' &&
                    'bg-white font-semibold'
                )}
              >
                <div className="w-8 flex justify-center">
                  <Archive className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý giao dịch</span>
              </Link>
              <Link
                to="/admin/account"
                className={clsx(
                  'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700',
                  location.pathname === '/admin/account' &&
                    'bg-white font-semibold'
                )}
              >
                <div className="w-8 flex justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý người dùng</span>
              </Link>
              <Link
                to="/admin/policy"
                className={clsx(
                  'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700',
                  location.pathname === '/admin/policy' &&
                    'bg-white font-semibold'
                )}
              >
                <div className="w-8 flex justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý chính sách</span>
              </Link>
              <Link
                to="/admin/princing"
                className={clsx(
                  'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700',
                  location.pathname === '/admin/princing' &&
                    'bg-white font-semibold'
                )}
              >
                <div className="w-8 flex justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý ngân sách</span>
              </Link>
              <Link
                to="/admin/voucher"
                className={clsx(
                  'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700',
                  location.pathname === '/admin/voucher' &&
                    'bg-white font-semibold'
                )}
              >
                <div className="w-8 flex justify-center">
                  <TicketPercent className=" h-4 w-4" />
                </div>
                <span className="text-gray-600">Quản lý voucher</span>
              </Link>
            </div>
          </div>

          {CheckLink()
            .slice(5)
            .map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'group flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300',
                  location.pathname === path && 'bg-white font-semibold'
                )}
              >
                <div className="w-12 flex justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={clsx(
                    'transition-all whitespace-nowrap overflow-hidden duration-300',
                    isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                  )}
                >
                  {label}
                </span>
              </Link>
            ))}
        </nav>
      </div>

      <div className="space-y-2 mt-6">
        <Link
          to="/admin/settings"
          className={clsx(
            'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300',
            location.pathname === '/admin/settings' && 'bg-white font-semibold'
          )}
        >
          <div className="w-12 flex justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <span
            className={clsx(
              'transition-all whitespace-nowrap overflow-hidden duration-300',
              isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            )}
          >
            Cài đặt
          </span>
        </Link>
        <Link
          to="/admin/support"
          className={clsx(
            'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300',
            location.pathname === '/admin/support' && 'bg-white font-semibold'
          )}
        >
          <div className="w-12 flex justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span
            className={clsx(
              'transition-all whitespace-nowrap overflow-hidden duration-300',
              isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            )}
          >
            Hỗ Trợ
          </span>
        </Link>
        <Link
          to="/admin/messages"
          className={clsx(
            'flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300',
            location.pathname === '/admin/messages' && 'bg-white font-semibold'
          )}
        >
          <div className="w-12 flex justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <span
            className={clsx(
              'transition-all whitespace-nowrap overflow-hidden duration-300',
              isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            )}
          >
            Tin nhắn
          </span>
        </Link>

        <button
          onClick={() => openNotification('third')}
          className="flex items-center py-2 rounded-lg hover:bg-white text-sm text-gray-700 transition-all duration-300 w-full relative"
        >
          <div className="w-12 flex justify-center relative">
            <Bell className="w-5 h-5" />
            {unReadNoti.length > 0 && (
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-[calc(50%-10px)] bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 min-w-[16px] flex items-center justify-center px-[4px]">
                {unReadNoti.length}
              </div>
            )}
          </div>
          <span
            className={clsx(
              'transition-all whitespace-nowrap overflow-hidden duration-300',
              isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'
            )}
          >
            Thông báo
          </span>
        </button>

        {/* User profile (nếu đang đăng nhập) */}
        {userobj && isSidebarOpen && (
          <div className="relative mt-2">
            <button
              onClick={toggleProfileMenu}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover border shrink-0"
                />
                <div className="flex flex-col text-left max-w-[120px]">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {userobj?.username}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {userobj?.email}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-6 h-4 text-gray-400 ml-2" />
            </button>

            {openProfileMenu && (
              <div className="absolute left-0 bottom-12 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="px-4 py-3 text-sm text-gray-700 border-b">
                  <p className="font-semibold text-base truncate">
                    {userobj?.username}
                  </p>
                  <p className="text-gray-500 truncate">{userobj?.email}</p>
                  <p className="font-semibold text-green-600 mt-1">
                    {userobj?.points?.toLocaleString('vi-VN')} điểm
                  </p>
                </div>
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tài khoản
                </Link>
                <Link
                  to="/payments"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Nạp tiền
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
