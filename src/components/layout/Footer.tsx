import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="text-white text-2xl font-semibold	">
              AKAds
            </Link>
            <p className="mt-2 text-sm text-gray-300">
              Nền tảng cho thuê tài khoản quảng cáo Facebook uy tín, nhanh chóng
              và an toàn.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://www.facebook.com/akamedia.giaiphapso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/akamedia.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Dịch vụ
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-white"
                >
                  Cho thuê BM
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-white"
                >
                  Cho thuê tài khoản quảng cáo
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-gray-300 hover:text-white">
                  Nạp tiền
                </Link>
              </li>
              <li>
                <Link to="/rentals" className="text-gray-300 hover:text-white">
                  Quản lý tài khoản
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Hỗ trợ
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/policy" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-gray-300 hover:text-white">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/policy" className="text-gray-300 hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-md font-semibold text-white uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-300">+84 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-300">support@akads.vn</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="mt-8 md:mt-0">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} AKAds. Bản quyền thuộc về AKAds.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
