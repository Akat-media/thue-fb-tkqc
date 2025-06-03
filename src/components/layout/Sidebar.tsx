import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  ShoppingCart,
  CreditCard,
  Users,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  PanelRightOpen,
  PanelRightClose,
  AlignStartHorizontal,
  PackagePlus,
  CircleDollarSign,
  Archive,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket";
import { useUserStore } from "../../stores/useUserStore";

const Sidebar: React.FC<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}> = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const isAdsMenuActive =
    location.pathname.startsWith("/adsaccountmanager") ||
    location.pathname === "/add-account" ||
    location.pathname === "/usermanage";
  const [openAdsSubmenu, setOpenAdsSubmenu] = useState(isAdsMenuActive);
  const toggleProfileMenu = () => setOpenProfileMenu(!openProfileMenu);

  const links = [
    { label: "Trang chủ", icon: LayoutDashboard, path: "/analytics" },
    { label: "Danh sách BM", icon: Briefcase, path: "/marketplace" },
    { label: "Tài khoản đang thuê", icon: ShoppingCart, path: "/rentals" },
    { label: "Nạp tiền", icon: CircleDollarSign, path: "/payments" },
    // { label: "QR Here", icon: QrCode, path: "/deposit" },
    // { label: "Quản lý giao dịch", icon: CreditCard, path: "/admintransaction" },
    // { label: "Quản lý người dùng", icon: Users, path: "/usermanage" },
  ];

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        toggleSidebar();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen, toggleSidebar]);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const userobj = useUserStore((state) => state.user);
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinRoom");
    });
    socket.on("payment_success", (data) => {
      console.log("Payment thành công:", data);
      fetchUser();
    });
    return () => {
      socket.off("payment_success");
    };
  }, [fetchUser]);

  const { setUser } = useUserStore();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }
  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen bg-white border-r flex flex-col justify-between py-6 px-4 shadow-sm z-40 transition-all duration-500",
        isSidebarOpen ? "w-64" : "w-14"
      )}
    >
      <div>
        <div
          className={clsx(
            "flex items-center mb-6 transition-all duration-300",
            isSidebarOpen ? "justify-between px-2" : "justify-center"
          )}
        >
          <Link
            to="/analytics"
            className={clsx(
              "text-2xl font-semibold text-blue-600 hover:underline transition-all duration-300",
              !isSidebarOpen && "opacity-0 w-0 overflow-hidden"
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
          {links.slice(0, 5).map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "group flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-all duration-300",
                location.pathname === path && "bg-blue-100 font-semibold"
              )}
            >
              <div className="w-12 flex justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={clsx(
                  "transition-all whitespace-nowrap overflow-hidden duration-300",
                  isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                )}
              >
                {label}
              </span>
            </Link>
          ))}
          <button
            onClick={() => {
              if (!isSidebarOpen) {
                toggleSidebar();
              } else {
                setOpenAdsSubmenu(!openAdsSubmenu);
              }
            }}
            className={clsx(
              "group flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-all duration-300 w-full",
              isAdsMenuActive && "bg-blue-100 font-semibold"
            )}
          >
            <div className="w-12 flex justify-center">
              <AlignStartHorizontal className="w-5 h-5" />
            </div>
            <span
              className={clsx(
                "transition-all whitespace-nowrap overflow-hidden duration-300",
                isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}
            >
              Quản lý hệ thống
            </span>
            {isSidebarOpen && (
              <ChevronDown
                className={clsx(
                  "ml-auto w-4 h-4 transition-transform",
                  openAdsSubmenu && "rotate-180"
                )}
              />
            )}
          </button>

          <div
            className={clsx(
              "transition-all duration-1000 ease-in-out overflow-hidden transform origin-top",
              openAdsSubmenu && isSidebarOpen
                ? "max-h-40 opacity-100 scale-y-100 mt-1"
                : "max-h-0 opacity-0 scale-y-95"
            )}
          >
            <div className="ml-10 space-y-1">
              <Link
                to="/adsaccountmanager"
                className={clsx(
                  "flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700",
                  location.pathname === "/adsaccountmanager" &&
                    "bg-blue-100 font-semibold"
                )}
              >
                <div className="w-8 flex justify-center">
                  <Archive className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý giao dịch</span>
              </Link>
              <Link
                to="/add-account"
                className={clsx(
                  "flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700",
                  location.pathname === "/add-account" &&
                    "bg-blue-100 font-semibold"
                )}
              >
                <div className="w-8 flex justify-center">
                  <PackagePlus className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Thêm TKQC</span>
              </Link>
              <Link
                to="/usermanage"
                className={clsx(
                  "flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700",
                  location.pathname === "/usermanage" &&
                    "bg-blue-100 font-semibold"
                )}
              >
                <div className="w-8 flex justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-gray-600">Quản lý người dùng</span>
              </Link>
            </div>
          </div>

          {links.slice(5).map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={clsx(
                "group flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-all duration-300",
                location.pathname === path && "bg-blue-100 font-semibold"
              )}
            >
              <div className="w-12 flex justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={clsx(
                  "transition-all whitespace-nowrap overflow-hidden duration-300",
                  isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
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
          to="/help"
          className="flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-all duration-300"
        >
          <div className="w-12 flex justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span
            className={clsx(
              "transition-all whitespace-nowrap overflow-hidden duration-300",
              isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}
          >
            Hỗ Trợ
          </span>
        </Link>

        <Link
          to="/notifications"
          className="flex items-center py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-all duration-300"
        >
          <div className="w-12 flex justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <span
            className={clsx(
              "transition-all whitespace-nowrap overflow-hidden duration-300",
              isSidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}
          >
            Thông báo
          </span>
        </Link>

        {/* User profile (nếu đang đăng nhập) */}
        {userobj && isSidebarOpen && (
          <div className="relative mt-2">
            <button
              onClick={toggleProfileMenu}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 -ml-1">
                  {userobj?.username?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">
                    {userobj?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userobj?.email}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-6 h-4 text-gray-400 ml-2" />
            </button>

            {openProfileMenu && (
              <div className="absolute left-0 bottom-12 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="px-4 py-3 text-sm text-gray-700 border-b">
                  <p className="font-semibold text-base">{userobj?.username}</p>
                  <p className="text-gray-500">{userobj?.email}</p>
                  <p className="font-semibold text-green-600 mt-1">
                    {userobj?.points} points
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
                    handleLogout()
                    navigate("/login");
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
