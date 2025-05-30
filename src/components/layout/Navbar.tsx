import React, { useState } from "react";
import { Menu, X, Bell, User, CreditCard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();
  const toggleProfileMenu = () => {
    // setIsProfileMenuOpen(!isProfileMenuOpen);
    navigate("/profile");

  };

  return (
    <nav className="bg-white shadow-sm w-full">
      <div className="flex justify-center items-center h-20 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-10 text-gray-700 text-lg font-sans-serif font-medium ">
            <div className="">
              <Link to="/" className="text-blue-600 text-3xl font-semibold ">
                AKAds
              </Link>
            </div>

            <div className="hidden sm:flex sm:space-x-8">
              <Link to="/dashboard" className="nav-link">
                Trang chủ
              </Link>
              <Link to="/marketplace" className="nav-link">
                Danh sách BM
              </Link>
              <Link to="/rentals" className="nav-link">
                Tài khoản đang thuê
              </Link>
              <Link to="/payments" className="nav-link">
                Nạp tiền
              </Link>
              <Link to="/usermanage" className="nav-link">
                Quản lý người dùng
              </Link>
            </div>

            <div className="hidden sm:flex sm:items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Xem thông báo</span>
                    <Bell className="h-6 w-6" />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu"
                      aria-haspopup="true"
                      onClick={toggleProfileMenu}
                    >
                      <span className="sr-only">Mở menu người dùng</span>
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="px-4 py-3 text-sm text-gray-700 border-b space-y-1">
                          <p className="font-semibold text-base">
                            {user?.name}
                          </p>
                          <p className="text-gray-500">{user?.email}</p>
                          <p className="font-semibold text-green-600 mt-1">
                            {user?.balance.toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="mr-2 h-4 w-4" /> Tài khoản
                        </Link>
                        <Link
                          to="/payments"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <CreditCard className="mr-2 h-4 w-4" /> Nạp tiền
                        </Link>
                        <button
                          onClick={logout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                        </button>
                      </div>
                    )}
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
          >
            <span className="sr-only">Mở menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-3 space-y-1">
          <Link to="/dashboard" className="mobile-nav-link">
            Trang chủ
          </Link>
          <Link to="/marketplace" className="mobile-nav-link">
            Danh sách BM
          </Link>
          <Link to="/rentals" className="mobile-nav-link">
            Tài khoản đang thuê
          </Link>
          <Link to="/payments" className="mobile-nav-link">
            Nạp tiền
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
