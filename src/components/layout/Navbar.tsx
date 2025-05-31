import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Bell, User, CreditCard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useUserStore } from "../../stores/useUserStore.ts";
import socket from "../../socket/index.ts";

const ProfileDropdown: React.FC<{
  user: any;
  isProfileMenuOpen: boolean;
  // logout: () => void;
  handleLogout: () => void;
}> = ({ user, isProfileMenuOpen, handleLogout }) => {
  return (
    <div
      className={`absolute right-0 mt-2 min-w-[200px] max-w-[90vw] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform ${
        isProfileMenuOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="px-4 py-3 text-sm text-gray-700 border-b space-y-1">
        <p className="font-semibold text-base">{user?.username || "User"}</p>
        <p className="text-gray-500 truncate">
          {user?.email || "email@example.com"}
        </p>
        <p className="font-semibold text-green-600 mt-1">
          {user?.points || 0} điểm
        </p>
      </div>
      <Link
        to="/profile"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <User className="mr-2 h-4 w-4" /> Tài khoản
      </Link>
      <Link
        to="/payments"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <CreditCard className="mr-2 h-4 w-4" /> Nạp tiền
      </Link>
      <button
        onClick={handleLogout}
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
      >
        <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
      </button>
    </div>
  );
};

const Navbar: React.FC = () => {
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
  // console.log("fetchUser", fetchUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        profileButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="flex justify-center items-center h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-10 text-gray-700 text-lg font-sans font-medium">
            <div>
              <Link to="/" className="text-blue-600 text-3xl font-semibold">
                AKAds
              </Link>
            </div>

            <div className="hidden sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="nav-link hover:text-blue-600 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/marketplace"
                className="nav-link hover:text-blue-600 transition-colors"
              >
                Danh sách BM
              </Link>
              <Link
                to="/rentals"
                className="nav-link hover:text-blue-600 transition-colors"
              >
                Tài khoản đang thuê
              </Link>
              <Link
                to="/payments"
                className="nav-link hover:text-blue-600 transition-colors"
              >
                Nạp tiền
              </Link>
              <Link
                to="/adsaccountmanager"
                className="nav-link hover:text-blue-600 transition-colors"
              >
                Lịch sử giao dịch
              </Link>
            </div>

            <div className="hidden sm:flex sm:items-center space-x-4">
              {userobj ? (
                <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Xem thông báo"
                  >
                    <Bell className="h-6 w-6" />
                  </button>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      ref={profileButtonRef}
                      className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
                      onClick={toggleProfileMenu}
                      aria-label="Mở menu người dùng"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        <img
                          src="/avatar.jpg"
                          alt="Ảnh đại diện"
                          className="h-8 w-8 object-cover rounded-full"
                        />
                      </div>
                    </button>
                    <ProfileDropdown
                      user={userobj}
                      isProfileMenuOpen={isProfileMenuOpen}
                      handleLogout={handleLogout}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="-mr-2 flex sm:hidden">
          <button
            type="button"
            className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={toggleMenu}
            aria-label="Mở menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 space-y-2 bg-white border-t">
          <Link
            to="/dashboard"
            className="block mobile-nav-link hover:text-blue-600"
          >
            Trang chủ
          </Link>
          <Link
            to="/marketplace"
            className="block mobile-nav-link hover:text-blue-600"
          >
            Danh sách BM
          </Link>
          <Link
            to="/rentals"
            className="block mobile-nav-link hover:text-blue-600"
          >
            Tài khoản đang thuê
          </Link>
          <Link
            to="/payments"
            className="block mobile-nav-link hover:text-blue-600"
          >
            Nạp tiền
          </Link>
          <Link
            to="/adsaccountmanager"
            className="block mobile-nav-link hover:text-blue-600"
          >
            Lịch sử giao dịch
          </Link>
          {userobj ? (
            <>
              <div className="border-t pt-2">
                <p className="font-semibold text-base text-gray-700">
                  {userobj?.username || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {userobj?.email || "email@example.com"}
                </p>
                <p className="font-semibold text-green-600 text-sm">
                  {userobj?.points || "0"} điểm
                </p>
              </div>
              <Link
                to="/profile"
                className="block mobile-nav-link hover:text-blue-600"
              >
                <User className="inline-block mr-2 h-4 w-4" /> Tài khoản
              </Link>
              <Link
                to="/payments"
                className="block mobile-nav-link hover:text-blue-600"
              >
                <CreditCard className="inline-block mr-2 h-4 w-4" /> Nạp tiền
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left mobile-nav-link hover:text-blue-600"
              >
                <LogOut className="inline-block mr-2 h-4 w-4" /> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block mobile-nav-link hover:text-blue-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="block mobile-nav-link hover:text-blue-600"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
