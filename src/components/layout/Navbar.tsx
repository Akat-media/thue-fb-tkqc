import React, { useState, useEffect } from "react";
import { Menu, X, User, CreditCard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../pages/auth/LoginModal.tsx";
import { toast,ToastContainer } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useUserStore } from "../../stores/useUserStore.ts";
import socket from "../../socket/index.ts";

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


const AuthDropdown: React.FC<{
  isAuthMenuOpen: boolean;
  onClose: () => void;
}> = ({ isAuthMenuOpen, onClose }) => {
  return (
      <div
          className={`absolute right-0 mt-2 min-w-[150px] rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform ${
              isAuthMenuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <p className="text-sm font-semibold">Tài khoản</p>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
        <Link to="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Đăng nhập
        </Link>
        <Link to="/register" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Đăng ký
        </Link>
      </div>
  );
};


const Navbar: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const { setUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // xử lý khi nhấn Back/Forward
  useEffect(() => {
    const handlePopstate = () => {
      fetchUser(); // Cập nhật lại user khi ấn nút back trên browser
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [fetchUser]);

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
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
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
    { icon: '🏠', label: 'Trang chủ', href: '/dashboard', hoverColor: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { icon: '📋', label: 'Danh sách BM', href: '/marketplace', hoverColor: 'bg-gradient-to-r from-teal-400 to-teal-600' },
    { icon: '💳', label: 'Tài khoản đang thuê', href: '/rentals', hoverColor: 'bg-gradient-to-r from-green-400 to-green-600' },
    { icon: '💰', label: 'Nạp tiền', href: '/payments', hoverColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    { icon: '📜', label: 'Lịch sử giao dịch', href: '/admintransaction', hoverColor: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { icon: '🎧', label: 'Hỗ trợ', href: '/support', hoverColor: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { icon: '⚙️', label: 'Chính sách', href: '/policy', hoverColor: 'bg-gradient-to-r from-orange-400 to-orange-600' },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
      <nav className="bg-white shadow-sm w-full flex flex-row sm:flex-col">
        <div className="w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 via-sky-200 to-cyan-100">
          <style>
            {`
                @keyframes marquee {
                  0% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                  animation: marquee 20s linear infinite;
                  animation-fill-mode: forwards;
                  animation-play-state: running;
                }
                .group:hover .animate-marquee {
                  animation-play-state: paused;
                }
            `}
          </style>
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="h-14 flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0 justify-between sm:justify-start">
                {/* Sidebar mobile only */}
                <div className="sm:hidden">
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
                      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                      }`}
                  >
                    <div className="p-4 border-b font-semibold text-blue-700">Menu</div>
                    <nav className="flex flex-col p-4 space-y-3">
                      {menuItems.map((item, index) => (
                          <Link
                              key={index}
                              to={item.href}
                              className="text-gray-800 hover:text-blue-600 transition-colors"
                              onClick={() => setIsSidebarOpen(false)}
                          >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                          </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                <img src="/akamedia.png" alt="User Avatar" className="h-12 shrink-0" />

                {/* Text run on desktop only */}
                <div className="hidden sm:relative sm:overflow-hidden sm:w-full sm:h-[38px] sm:flex sm:items-center">
                  <div className="absolute right-0 whitespace-nowrap animate-marquee text-[13px]">
                    <span className="mx-4 font-[13px]">
                      Chào mừng bạn đến với AKA MEDIA - Giải pháp nhanh chóng, an toàn và đáng tin cậy trên các nền tảng số
                    </span>
                  </div>
                </div>

                {/* Auth button with dropdown for mobile only */}
                <div className="relative sm:hidden">
                  {user ? (
                      <button
                          onClick={toggleProfileMenu}
                          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                      >
                        <img
                            src="/avatar.jpg"
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                      </button>
                  ) : (
                      <button
                          onClick={toggleAuthMenu}
                          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                      >
                        <img
                            src="/avatar.jpg"
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
                          />
                      )}
                      </div>
                  )}
                </div>

              </div>

              <div className="hidden sm:flex sm:items-center sm:space-x-3 sm:justify-end">
                {user ? (
                    <div className="relative">
                      <button
                          onClick={toggleProfileMenu}
                          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors"
                      >
                        <img
                            src="/avatar.jpg"
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
                          onClick={() => navigate("/login")}
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
                          onClick={() => navigate("/register")}
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
        <div className="hidden sm:block bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700">
          <nav className="relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 animate-[shimmer_3s_ease-in-out_infinite]" />

            <ToastContainer />
            <div className="relative z-10 hidden sm:flex flex-wrap justify-center items-center gap-4 max-w-screen-xl mx-auto px-4 py-6">
              {menuItems.map((item, i) => {
                const protectedRoutes = ["/rentals", "/payments", "/admintransaction"];
                const isProtected = protectedRoutes.includes(item.href);

                const handleClick = (e: React.MouseEvent) => {
                  if (!user && isProtected) {
                    e.preventDefault(); // ngăn chuyển trang
                    toast.error("Bạn cần đăng nhập để truy cập mục này");
                    setShowLoginModal(true);
                  }
                };

                return (
                    <Link
                        key={i}
                        to={item.href}
                        onClick={handleClick}
                        className={`
                          group relative
                          flex items-center gap-2 text-white font-medium text-sm
                          px-5 py-2.5 rounded-full border
                          transition-opacity transition-transform transition-shadow duration-300 ease-in-out
                          hover:scale-105 hover:-translate-y-1 active:scale-100
                          shadow-md bg-white/10 border-white/20 hover:shadow-xl
                          will-change-transform will-change-opacity will-change-shadow
                        `}
                    >
                      <div
                          className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.hoverColor} z-[-1]`}
                      />
                      <span className="text-base drop-shadow">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                );
              })}
              <LoginModal
                  isOpen={showLoginModal}
                  onClose={() => setShowLoginModal(false)}
                  onLoginSuccess={() => {
                    setShowLoginModal(false);
                    fetchUser(); // cập nhật lại navbar
                  }}
              />

            </div>
          </nav>
        </div>
      </nav>
  );
};

export default Navbar;
