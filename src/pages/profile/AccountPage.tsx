import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSidebar from './AccountSidebar';
import AccountForm from './AccountForm';
import ChangePasswordForm from './ChangePasswordForm.tsx';
import SubAccount from './SubAccount.tsx';
import HistoryGivePoints from './HistoryGivePoints.tsx';
import HistoryRetrievePoints from './HistoryRetrievePoints.tsx';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'account' | 'password' | 'history' | 'retrieve'
  >('account');
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Tài khoản</h2>
        <nav className="text-sm text-gray-500 mt-1">
          <button
            className="hover:underline text-gray-500"
            onClick={() => navigate('/')}
            type="button"
          >
            Trang chủ
          </button>
          &nbsp;&gt;&nbsp;Tài khoản
        </nav>
      </div>

      <div className="flex items-center space-x-8 border-b pb-4">
        <button
          className={`pb-1 font-semibold ${
            activeTab === 'account'
              ? 'border-b-2 border-black'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('account')}
        >
          Thông tin chung
        </button>
        <button
          className={`pb-1 font-semibold ${
            activeTab === 'password'
              ? 'border-b-2 border-black'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('password')}
        >
          Đổi mật khẩu
        </button>
        <button
          className={`pb-1 font-semibold ${
            activeTab === 'history'
              ? 'border-b-2 border-black'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử tặng điểm
        </button>
        <button
          className={`pb-1 font-semibold ${
            activeTab === 'retrieve'
              ? 'border-b-2 border-black'
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('retrieve')}
        >
          Lịch Nhận điểm
        </button>
      </div>

      {activeTab === 'account' && (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            <AccountSidebar />
            <AccountForm />
          </div>
          <SubAccount />
        </>
      )}

      {activeTab === 'password' && (
        <div>
          <ChangePasswordForm />
        </div>
      )}
      {activeTab === 'history' && (
        <div>
          <HistoryGivePoints />
        </div>
      )}
      {activeTab === 'retrieve' && (
        <div>
          <HistoryRetrievePoints />
        </div>
      )}
    </div>
  );
};

export default AccountPage;
