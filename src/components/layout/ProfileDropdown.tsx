import React from 'react';
import { X, User, CreditCard, LogOut, TicketPercent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dropdown, MenuProps } from 'antd';

export const ProfileDropdown: React.FC<{
  user: any;
  avatar: string;
  handleLogout: () => void;
}> = ({ user, avatar, handleLogout }) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      type: 'group',
      label: (
        <div className="no-hover border-b border-gray-200">
          <p className="font-semibold text-base">{user?.username || 'User'}</p>
          <div className="no-hover">
            <p className="text-gray-500 truncate">
              {user?.email || 'email@example.com'}
            </p>
            <p className="font-semibold text-green-600 mt-1">
              {user?.points?.toLocaleString('vi-VN')} điểm
            </p>
          </div>
        </div>
      ),
      children: [
        {
          key: '2',
          label: (
            <Link
              to="/profile"
              className="flex items-start justify-start py-2 min-w-36 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="mr-2 h-4 w-4" /> Tài khoản
            </Link>
          ),
        },
        {
          key: '3',
          label: (
            <Link
              to="/ticket"
              className="flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <TicketPercent className="mr-2 h-4 w-4" /> Voucher
            </Link>
          ),
        },
        {
          key: '4',
          label: (
            <Link
              to="/payments"
              className="flex items-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CreditCard className="mr-2 h-4 w-4" /> Nạp tiền
            </Link>
          ),
        },
        {
          key: '5',
          label: (
            <button
              onClick={handleLogout}
              className="flex w-full items-center py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
            </button>
          ),
        },
      ],
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="topRight" trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:border-gray-300 transition-colors">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </a>
    </Dropdown>
  );
};
