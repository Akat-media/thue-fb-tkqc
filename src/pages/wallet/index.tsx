import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { useUserStore } from '../../stores/useUserStore';
import axios from 'axios';
import { Button, Input, Pagination, Spin } from 'antd';
import usePagination from '../../hook/usePagination';
import { SearchOutlined } from '@ant-design/icons';
import EmptyState from '../../components/EmptyState';

interface WalletType {
  id: number;
  name: string;
  adsAccounts: any;
  balance: string;
  users: any[];
}
const formatVND = (value: number | '') => {
  if (value === '' || isNaN(value)) return '';
  return value.toLocaleString('vi-VN');
};

const parseVND = (value: string) => {
  return Number(value.replace(/\./g, ''));
};

const Wallet = () => {
  /* ===== State ===== */
  const fetchUser = useUserStore((state) => state.fetchUser);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const userString = localStorage.getItem('user');
  const userInfo = userString ? JSON.parse(userString) : null;
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [users, setUsers] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [walletBalance, setWalletBalance] = useState<number | ''>('');
  const [walletBalanceDisplay, setWalletBalanceDisplay] = useState('');
  const [walletName, setWalletName] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [walletEditing, setWalletEditing] = useState<WalletType | null>(null);
  const [walletToDelete, setWalletToDelete] = useState<WalletType | null>(null);
  const [searchUser, setSearchUser] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const { currentPage, pageSize, handleChange, setCurrentPage } = usePagination(
    1,
    3
  );
  const [totalWallet, setTotalWallet] = useState<number>(0);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [inputValue, setInputValue] = useState('');

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const [response] = await Promise.all([
        BaseHeader({
          url: '/wallet',
          method: 'get',
          params: {
            page: currentPage,
            limit: pageSize,
            query: searchQuery || undefined,
          },
        }),
      ]);
      setWallets(response.data.data.data);
      setTotalWallet(response.data.data.count);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchWallets();
  }, [currentPage, searchQuery, reloadKey]);
  /* ===== Fetch data ===== */
  const handleGetUser = async () => {
    try {
      const userId = userInfo?.user_id || userInfo?.user?.user_id;
      if (!userId) return;
      const [response, responseAccount] = await Promise.all([
        BaseHeader({
          url: '/user-orther',
          method: 'get',
          params: { user_id: userId },
        }),
        BaseHeader({
          url: '/ad-accounts-all',
          method: 'get',
          params: { user_id: userId },
        }),
      ]);

      setUsers(response.data.data);
      setAccounts(responseAccount.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getAdAccounts = async (keyword = '') => {
    const userId = userInfo?.user_id || userInfo?.user?.user_id;
    if (!userId) return;

    const res = await BaseHeader({
      url: '/ad-accounts-all',
      method: 'get',
      params: {
        user_id: userId,
        query: keyword || undefined, // không gửi nếu rỗng
        type: openEdit ? 'edit' : 'create',
      },
    });

    setAccounts(res.data.data);
  };
  const getAccounts = async (keyword = '') => {
    const userId = userInfo?.user_id || userInfo?.user?.user_id;
    if (!userId) return;
    const res = await BaseHeader({
      url: '/user-orther',
      method: 'get',
      params: {
        user_id: userId,
        query: keyword || undefined, // không gửi nếu rỗng
      },
    });
    setUsers(res.data.data);
  };

  useEffect(() => {
    handleGetUser();
  }, []);
  const debouncedGetAdAccounts = useCallback(
    debounce((value: string) => {
      getAdAccounts(value);
    }, 500),
    []
  );
  const debouncedGetUser = useCallback(
    debounce((value: string) => {
      getAccounts(value);
    }, 500),
    []
  );
  useEffect(() => {
    if (search) {
      debouncedGetAdAccounts(search);
    } else {
      getAdAccounts(); // search rỗng → load all
    }
    return () => {
      debouncedGetAdAccounts.cancel();
    };
  }, [search, openEdit]);
  useEffect(() => {
    if (searchUser) {
      debouncedGetUser(searchUser);
    } else {
      getAccounts(); // searchUser rỗng → load all
    }
    return () => {
      debouncedGetUser.cancel();
    };
  }, [searchUser]);
  /* ===== Toggle account ===== */
  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /* ===== Create ===== */
  const handleCreateWallet = async () => {
    if (!walletName.trim() || selectedAccounts.length === 0) return;
    const userId = userInfo?.user_id || userInfo?.user?.user_id;
    try {
      const response = await BaseHeader({
        url: '/wallet',
        method: 'post',
        data: {
          name: walletName,
          user_ids: selectedUsers,
          admin_id: userId,
          ad_accounts: selectedAccounts,
          balance: walletBalance ? walletBalance : 0,
        },
      });
      if (response.status == 200) {
        toast.success('Tạo ví thành công!');
        handleGetUser();
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      resetForm();
      setOpenCreate(false);
      fetchUser();
    }
  };

  /* ===== Edit ===== */
  const openEditModal = (wallet: any) => {
    setWalletEditing(wallet);
    setWalletName(wallet.name);
    // setSelectedUser(wallet.user_id);
    setOpenEdit(true);
    const numberValue = parseVND(String(wallet?.balance));
    setWalletBalance(numberValue || '');
    setWalletBalanceDisplay(numberValue ? formatVND(numberValue) : '');
    const reseult = wallet?.adsAccounts?.map((item: any) => item.id);
    setSelectedAccounts(reseult);
    const listUser = wallet?.users?.map((item: any) => item.user_id);
    setSelectedUsers(listUser);
  };

  const handleUpdateWallet = async () => {
    console.log('Updating wallet...', walletEditing);
    if (!walletEditing) return;
    console.log(
      'Updating wallet...',
      !walletName.trim(),
      selectedAccounts.length === 0
    );
    if (!walletName.trim() || selectedAccounts.length === 0) return;
    const userId = userInfo?.user_id || userInfo?.user?.user_id;
    try {
      const response = await BaseHeader({
        url: `/wallet/${walletEditing.id}`,
        method: 'put',
        data: {
          name: walletName,
          user_ids: selectedUsers,
          admin_id: userId,
          ad_accounts: selectedAccounts,
          balance: walletBalance ? walletBalance : 0,
        },
      });
      if (response.status == 200) {
        toast.success('Update ví thành công!');
        handleGetUser();
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Update ví thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      resetForm();
      setOpenEdit(false);
      fetchUser();
    }
  };

  /* ===== Delete ===== */
  const openDeleteModal = (wallet: WalletType) => {
    setWalletToDelete(wallet);
    setOpenDelete(true);
  };
  const confirmDeleteWallet = async () => {
    try {
      const response = await BaseHeader({
        url: `/wallet/${walletToDelete?.id}`,
        method: 'delete',
      });
      if (response.status == 200) {
        toast.success('Xóa ví thành công!');
        handleGetUser();
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Lỗi xóa ví thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setOpenDelete(false);
    }
  };

  /* ===== Utils ===== */
  const resetForm = () => {
    setWalletName('');
    setSelectedAccounts([]);
    setWalletEditing(null);
    setSearch('');
    setWalletBalance('');
    setSelectedUsers([]);
    setWalletBalanceDisplay('');
  };
  /* ===== Render ===== */
  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center
                  bg-black/40 backdrop-blur-sm"
        >
          <Spin tip="Loading..." size="large" />
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-8">Quản lý ví marketing</h2>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          + Tạo ví
        </button>
      </div>
      <div className="flex w-full max-w-xl mb-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo tên ví, TK quảng cáo, TK marketing..."
            allowClear
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);

              if (value === '') {
                setCurrentPage(1);
                setSearchQuery('');
              }
            }}
            className="
            !text-[18px]
        h-12
        rounded-l-xl
        rounded-r-[0px]
        text-sm
        border border-r-0 border-gray-200
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-200
      "
          />
        </div>

        <Button
          icon={<SearchOutlined />}
          onClick={() => {
            setCurrentPage(1); // reset page
            setSearchQuery(inputValue.trim()); // set keyword thật
          }}
          className="
          text-[20px]
      !w-[70px]
      h-12
      rounded-r-xl
      bg-indigo-500
      border-indigo-500
      text-white
      hover:bg-indigo-600
    "
        />
      </div>

      {/* Wallet list */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {wallets?.length > 0 ? (
          wallets?.map((wallet) => (
            <div
              key={wallet?.id}
              className="break-inside-avoid relative rounded-2xl border bg-white p-5 shadow hover:shadow-md transition"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => openEditModal(wallet)}
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  ✏️
                </button>
                <button
                  onClick={() => openDeleteModal(wallet)}
                  className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-[24px] font-semibold mb-3 pr-20">
                {wallet?.name}
              </h3>
              <h5 className="text-[20px] text-gray-600 font-semibold mb-3 pr-20">
                Ngân sách: {formatVND(Number(wallet?.balance))} VND
              </h5>
              <h5 className="font-semibold mb-3 pr-20">
                Tài khoản marketing:{' '}
                {wallet?.users
                  ?.map((item: any) => item?.user?.email)
                  .join(', ')}
              </h5>

              <div className="flex flex-wrap gap-2">
                <span className="text-purple-900 font-bold">
                  Tài khoản ads :
                </span>
                {wallet?.adsAccounts?.map((acc: any) => (
                  <span
                    key={acc?.account_id}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-sm"
                  >
                    {acc?.name} - {acc?.id}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
      {totalWallet > 0 && (
        <div className="mt-6 ">
          <Pagination
            total={totalWallet}
            current={currentPage}
            pageSize={pageSize}
            onChange={handleChange}
          />
        </div>
      )}

      {/* ===== CREATE / EDIT MODAL ===== */}
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[1000px] p-8 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6">
              {openEdit ? 'Chỉnh sửa ví' : 'Tạo ví marketing'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* ===== LEFT ===== */}
              <div>
                {/* Wallet name */}
                <div className="mb-4">
                  <label className="font-medium">Tên ví</label>
                  <input
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder="VD: Ví quảng cáo Facebook"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Wallet balance */}
                <div className="mb-4">
                  <label className="font-medium">Ngân sách ví</label>
                  <input
                    inputMode="numeric"
                    value={walletBalanceDisplay}
                    onChange={(e) => {
                      const raw = e.target.value;

                      // chỉ cho nhập số + dấu chấm
                      if (!/^[0-9.]*$/.test(raw)) return;

                      const numberValue = parseVND(raw);

                      setWalletBalance(numberValue || '');
                      setWalletBalanceDisplay(
                        numberValue ? formatVND(numberValue) : ''
                      );
                    }}
                    placeholder="VD: 10.000.000"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số dư ban đầu của ví (VND)
                  </p>
                </div>

                {/* Select user / account owner */}
                <div className="mb-4">
                  <label className="font-medium">Gắn với tài khoản</label>
                  {/* Input tìm kiếm */}
                  <input
                    type="text"
                    placeholder="Tìm theo username hoặc email..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mt-1 mb-2"
                  />
                  <div className="max-h-[500px] overflow-auto border rounded-lg p-2">
                    {users.length === 0 && (
                      <p className="text-center text-gray-400 py-6">
                        Không có kết quả
                      </p>
                    )}
                    {users.map((user: any) => {
                      const checked = selectedUsers.includes(user.id);
                      return (
                        <label
                          key={user.id}
                          className={`flex gap-3 p-3 rounded-lg cursor-pointer
                    ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  `}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleUser(user.id)}
                            className="accent-blue-600 mt-1"
                          />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT ===== */}
              <div className="flex flex-col h-full">
                {/* Search */}
                <div className="mb-3 relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo ID hoặc tên tài khoản quảng cáo..."
                    className="w-full border rounded-lg pl-10 pr-3 py-2"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {/* Accounts list */}
                <div className="max-h-[556px] overflow-auto border rounded-lg p-2">
                  {accounts.length === 0 && (
                    <p className="text-center text-gray-400 py-6">
                      Không có kết quả
                    </p>
                  )}

                  {accounts.map((acc: any) => {
                    const checked = selectedAccounts.includes(acc.id);
                    return (
                      <label
                        key={acc.id}
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer
                    ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  `}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAccount(acc.id)}
                          className="accent-blue-600 mt-1"
                        />
                        <div>
                          <p className="font-medium">{acc.name}</p>
                          <p className="text-xs text-gray-500">{acc.id}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setOpenCreate(false);
                  setOpenEdit(false);
                  resetForm();
                }}
                className="px-5 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={openEdit ? handleUpdateWallet : handleCreateWallet}
                disabled={
                  !walletName ||
                  !selectedUsers.length ||
                  selectedAccounts.length === 0
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-40"
              >
                {openEdit ? 'Lưu thay đổi' : 'Tạo ví'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {openDelete && walletToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Xác nhận xoá
            </h3>
            <p className="text-sm mb-4">
              Xoá ví <strong>{walletToDelete.name}</strong> và toàn bộ tài
              khoản?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenDelete(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={confirmDeleteWallet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
