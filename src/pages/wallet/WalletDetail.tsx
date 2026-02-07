import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUserStore } from '../../stores/useUserStore';
import { debounce } from 'lodash';
import { Button, Input, Pagination, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import usePagination from '../../hook/usePagination';
import EmptyState from '../../components/EmptyState';

type ModalType =
  | 'SYNC_CONFIRM'
  | 'ATTACH_ACCOUNT'
  | 'SET_LIMIT'
  | 'UP_LIMIT'
  | 'SYNC_ALL_CONFIRM'
  | 'STOP_ADS_ACCOUNT'
  | null;

interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  adsAccounts: any[];
  userViewCampaign: any[];
  users: any[];
}
const formatVND = (value: number | '') => {
  if (value === '' || isNaN(value)) return '';
  return value.toLocaleString('vi-VN');
};
const formatVNDV2 = (value?: number | string) => {
  if (value === null || value === undefined || value === '') return '0';
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('vi-VN');
};

const parseVND = (value: string) => {
  return Number(value.replace(/\./g, ''));
};

/* ================= COMPONENT ================= */
const WalletDetail = () => {
  const { user } = useUserStore();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [chooseWallet, setChooseWallet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // modal
  const [modalType, setModalType] = useState<ModalType>(null);

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<any>(null);

  const [walletBalance, setWalletBalance] = useState<number | ''>('');
  const [walletBalanceDisplay, setWalletBalanceDisplay] = useState('');

  const [searchUser, setSearchUser] = useState<any>('');

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState<any>('');
  const [totalWallet, setTotalWallet] = useState<number>(0);
  const { currentPage, pageSize, handleChange, setCurrentPage } = usePagination(
    1,
    3,
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [highlightedAccountId, setHighlightedAccountId] = useState<
    string | null
  >(null);

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
      const result = response.data.data.data;
      setWallets(result);
      setTotalWallet(response.data.data.count);

      // Kiểm tra xem searchQuery có phải là ID tài khoản quảng cáo không
      if (searchQuery && result.length > 0) {
        // Tìm kiếm
        for (const wallet of result) {
          const foundAccount = wallet.adsAccounts?.find(
            (acc: any) =>
              acc.account_id === searchQuery || acc.id === searchQuery,
          );
          if (foundAccount) {
            setHighlightedAccountId(foundAccount.account_id);
            // Scroll đến tài khoản sau khi render
            setTimeout(() => {
              const element = document.getElementById(
                `account-${foundAccount.account_id}`,
              );
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 600);
            break;
          }
        }
      } else {
        setHighlightedAccountId(null);
      }
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

  const fetchUserNotInCamp = async (searchUser = '') => {
    if (!selectedAccount?.id) return;
    try {
      const [response] = await Promise.all([
        BaseHeader({
          url: '/user-not-in-campaign',
          method: 'get',
          params: {
            ads_id: selectedAccount.id,
            query: searchUser || undefined,
          },
        }),
      ]);
      const result = response.data.data;
      if (result.length > 0) {
        setUsersData(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const debouncedGetUser = useCallback(
    debounce((value: string) => {
      fetchUserNotInCamp(value);
    }, 500),
    [],
  );
  useEffect(() => {
    if (modalType === 'ATTACH_ACCOUNT') {
      if (searchUser) {
        debouncedGetUser(searchUser);
      } else {
        fetchUserNotInCamp('');
      }
    }
    return () => {
      debouncedGetUser.cancel();
    };
  }, [modalType, searchUser]);

  const handleOpenModal = (account: any, selectedWallet: any) => {
    setSelectedAccount(account);
    setModalType('SET_LIMIT');
    setChooseWallet(selectedWallet);
  };
  const handleOpenModalUpLimit = (account: any, selectedWallet: any) => {
    setSelectedAccount(account);
    setModalType('UP_LIMIT');
    setChooseWallet(selectedWallet);
  };
  const handleOpenModalDelete = (account: any, selectedWallet: any) => {
    setWalletToDelete(account);
    setOpenDelete(true);
    setChooseWallet(selectedWallet);
  };
  const handleOpenSyncModal = (account: any, selectedWallet: any) => {
    setSelectedAccount(account);
    setModalType('SYNC_CONFIRM');
    setChooseWallet(selectedWallet);
  };
  const handleStopAdsModal = (account: any, selectedWallet: any) => {
    setSelectedAccount(account);
    setModalType('STOP_ADS_ACCOUNT');
    setChooseWallet(selectedWallet);
  };
  // const handleOpenSyncAllModal = () => {
  //   setModalType('SYNC_ALL_CONFIRM');
  // };
  const handleOpenAttachModal = (account: any, selectedWallet: any) => {
    setSelectedAccount(account);
    setModalType('ATTACH_ACCOUNT');
    const listUser = selectedWallet?.userViewCampaign
      ?.filter((item: any) => item.ads_id === account.id)
      ?.map((item: any) => item.user_id);
    setSelectedUsers(listUser || []);
    setChooseWallet(selectedWallet);
  };

  const handleConfirmLimit = async () => {
    if (!chooseWallet || !selectedAccount || !walletBalance) return;

    try {
      const response = await BaseHeader({
        url: `/wallet/ads-spend-cap/${chooseWallet?.id}`,
        method: 'post',
        data: {
          ads_id: selectedAccount.id,
          spend_cap: String(walletBalance),
          user_id: user?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Set ngưỡng tài khoản ví thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Lỗi set ngưỡng tài khoản ví thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setModalType(null);
      setSelectedAccount(null);
      setWalletBalance('');
      setWalletBalanceDisplay('');
    }
  };
  const handleConfirmUpLimit = async () => {
    if (!chooseWallet || !selectedAccount || !walletBalance) return;

    // Kiểm tra số tiền tối thiểu 500,000
    if (typeof walletBalance === 'number' && walletBalance < 500000) {
      toast.error('Số tiền phải từ 500,000 VND trở lên');
      return;
    }

    try {
      const response = await BaseHeader({
        url: `/wallet/ads-spend-cap-increase/${chooseWallet?.id}`,
        method: 'post',
        data: {
          ads_id: selectedAccount.id,
          spend_cap: String(walletBalance),
          user_id: user?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Set ngưỡng tài khoản ví thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Lỗi set ngưỡng tài khoản ví thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setModalType(null);
      setSelectedAccount(null);
      setWalletBalance('');
      setWalletBalanceDisplay('');
    }
  };
  const confirmStopAds = async () => {
    if (!chooseWallet || !selectedAccount) return;
    try {
      const response = await BaseHeader({
        url: `/wallet/ads-spend-cap-increase-to-one/${chooseWallet?.id}`,
        method: 'post',
        data: {
          ads_id: selectedAccount.id,
          spend_cap: 1,
          user_id: user?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Set ngưỡng tài khoản ví về 1 thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Lỗi set ngưỡng tài khoản ví về 1 thất bại!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setModalType(null);
      setSelectedAccount(null);
      setWalletBalance('');
      setWalletBalanceDisplay('');
    }
  };
  const confirmDeleteWallet = async () => {
    try {
      const response = await BaseHeader({
        url: `/wallet/delete-ads/${walletToDelete?.wallet_id}`,
        method: 'post',
        data: {
          ads_id: walletToDelete.id,
        },
      });
      if (response.status == 200) {
        toast.success('Xóa tài khoản ví thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error('Lỗi xóa tài khoản ví thất bại!');
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
  const confirmAsyncAllCamp = async () => {
    // try {
    //   const listAds = wall?.adsAccounts.map((item: any) => item.id);
    //   const response = await BaseHeader({
    //     url: `/async-many-campaign`,
    //     method: 'post',
    //     data: {
    //       list_ads_id: listAds,
    //       wallet_id: selectedWallet?.id,
    //     },
    //   });
    //   if (response.status == 200) {
    //     toast.success('Đồng bộ tất cả camp thành công!');
    //     setCurrentPage(1);
    //   } else {
    //     toast.error(response.data.message);
    //   }
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     const message = error.response?.data?.message || 'Có lỗi xảy ra';
    //     toast.error(message);
    //   } else {
    //     toast.error('Lỗi không xác định');
    //   }
    // } finally {
    //   setModalType(null);
    // }
  };
  const confirmAsyncCamp = async () => {
    try {
      const response = await BaseHeader({
        url: `/async-one-campaign`,
        method: 'post',
        data: {
          list_ads_id: [selectedAccount.id],
          wallet_id: chooseWallet?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Đồng bộ camp thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setModalType(null);
    }
  };

  const confirmAttachUser = async () => {
    try {
      const response = await BaseHeader({
        url: `/attach-user-in-campaign`,
        method: 'post',
        data: {
          list_user_id: selectedUsers,
          ads_id: selectedAccount.id,
          wallet_id: chooseWallet?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Gắn tài khoản thành công!');
        setCurrentPage(1);
        setReloadKey((prev) => prev + 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    } finally {
      setModalType(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 ">
      <h2 className="text-3xl font-bold mb-8">Quản lý chi tiết ví</h2>
      <div className="flex w-full max-w-xl">
        <div className="flex-1 mb-8">
          <Input
            placeholder="Tìm kiếm theo tên ví hoặc ID tài khoản quảng cáo..."
            allowClear
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);

              if (value === '') {
                setCurrentPage(1);
                setSearchQuery('');
                setHighlightedAccountId(null);
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

      {/* Wallet selector */}
      {/* <div className="mb-8">
        <label className="block text-lg font-semibold mb-2">Chọn ví</label>
        <select
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedWalletId ?? ''}
          onChange={(e) => setSelectedWalletId(e.target.value)}
        >
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              {wallet.name}
            </option>
          ))}
        </select>
      </div> */}

      {loading && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center
                  bg-black/40 backdrop-blur-sm"
        >
          <Spin tip="Loading..." size="large" />
        </div>
      )}

      {/* Wallet card */}
      {!loading && wallets.length > 0 ? (
        wallets.map((selectedWallet) => {
          return (
            <div
              key={selectedWallet.id}
              className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-2xl shadow-lg p-8 space-y-8 mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xl font-semibold">
                    {selectedWallet.name}
                  </div>
                  <div className="text-gray-500 mt-1">Số dư hiện tại</div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  <div>
                    {selectedWallet.balance.toLocaleString()}{' '}
                    {selectedWallet.currency}
                  </div>
                  {/* <button
                    onClick={handleOpenSyncAllModal}
                    className="bg-orange-600 text-white text-base px-5 py-2.5 rounded-lg hover:bg-orange-700 transition mt-2"
                  >
                    Đồng bộ tất cả campaign
                  </button> */}
                </div>
              </div>

              {/* Accounts */}
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Tài khoản quảng cáo
                </h3>
                <ul className="space-y-4">
                  {selectedWallet?.adsAccounts?.map((acc) => {
                    const isHighlighted =
                      highlightedAccountId === acc.account_id;
                    return (
                      <li
                        key={acc.id}
                        id={`account-${acc.account_id}`}
                        className={`bg-white border rounded-xl p-5 flex justify-between items-center hover:shadow-md transition ${
                          isHighlighted
                            ? 'border-yellow-400 border-2 shadow-lg bg-yellow-50 ring-4 ring-yellow-200'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-medium">
                              {acc?.name}
                            </div>
                            {isHighlighted && (
                              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-pulse">
                                ⭐
                              </span>
                            )}
                          </div>
                          {/* <div className="text-[14px] font-medium">
                          {acc?.account_id}
                        </div> */}
                          <div className="text-gray-500 mt-1">
                            ID:{' '}
                            <span
                              className={`font-semibold ${isHighlighted ? 'text-yellow-700' : 'text-gray-700'}`}
                            >
                              {acc?.account_id}
                            </span>
                          </div>
                          <div className="text-gray-500 mt-1">
                            Ngưỡng chi tiêu:{' '}
                            <span className="font-semibold text-gray-700">
                              {formatVNDV2(acc.spend_cap)} VND
                            </span>
                          </div>
                          {/* <div className="text-gray-500 mt-1">
                          Đã tiêu:{' '}
                          <span className="font-semibold text-gray-700">
                            {formatVNDV2(acc.amount_spent)} VND
                          </span>
                        </div> */}
                          <div className="text-gray-500 mt-1">
                            Tài khoản marketing:{' '}
                            <span className="font-semibold text-red-500 break-words max-w-[500px] block">
                              {selectedWallet?.users
                                ?.map((item: any) => item?.user?.email)
                                .join(', ')}
                            </span>
                          </div>
                          {/* <div className="text-gray-500 mt-1">
                            User gắn campaign:{' '}
                            <span className="font-semibold text-red-500 break-words max-w-[500px] block">
                              {(selectedWallet?.userViewCampaign || [])
                                .filter((item) => item.ads_id === acc.id)
                                .map((item) => item.user?.email)
                                .join(', ')}
                            </span>
                          </div> */}
                        </div>

                        <div className="flex gap-2">
                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() =>
                                handleStopAdsModal(acc, selectedWallet)
                              }
                              className="bg-pink-500 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-pink-600 transition"
                            >
                              Dừng tài khoản quảng cáo
                            </button>
                          )}
                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() =>
                                handleOpenSyncModal(acc, selectedWallet)
                              }
                              className="bg-indigo-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-indigo-700 transition"
                            >
                              Đồng bộ camp
                            </button>
                          )}
                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() =>
                                handleOpenAttachModal(acc, selectedWallet)
                              }
                              className="bg-emerald-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-emerald-700 transition"
                            >
                              Gắn tài khoản
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleOpenModalUpLimit(acc, selectedWallet)
                            }
                            className="bg-purple-500 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-purple-600 transition"
                          >
                            Nâng ngưỡng
                          </button>
                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() =>
                                handleOpenModal(acc, selectedWallet)
                              }
                              className="bg-amber-500 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-amber-600 transition"
                            >
                              Set ngưỡng
                            </button>
                          )}
                          {user?.role === 'super_admin' && (
                            <button
                              onClick={() =>
                                handleOpenModalDelete(acc, selectedWallet)
                              }
                              className="bg-rose-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-rose-700 transition"
                            >
                              Xóa tài khoản
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState />
      )}
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
      {/* ================= MODAL ================= */}
      {modalType === 'SET_LIMIT' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[auto] space-y-6">
            <h3 className="text-xl font-bold">Thiết lập ngưỡng chi tiêu</h3>
            <div className="text-gray-600 text-lg">{selectedAccount.name}</div>
            <input
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg w-full focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
              value={walletBalanceDisplay}
              onChange={(e) => {
                const raw = e.target.value;
                // chỉ cho nhập số + dấu chấm
                if (!/^[0-9.]*$/.test(raw)) return;
                const numberValue = parseVND(raw);
                setWalletBalance(numberValue || '');
                setWalletBalanceDisplay(
                  numberValue ? formatVND(numberValue) : '',
                );
              }}
              placeholder="VD: 10.000.000"
            />
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-5 py-2.5 text-lg border rounded-lg"
                onClick={() => setModalType(null)}
              >
                Huỷ
              </button>
              <button
                className="px-5 py-2.5 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleConfirmLimit}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'UP_LIMIT' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[auto] space-y-6">
            <h3 className="text-xl font-bold">Nâng ngưỡng chi tiêu thêm</h3>
            <div className="text-gray-600 text-lg">{selectedAccount.name}</div>
            <p className="!mt-2">
              Ngưỡng hiện tại: {formatVNDV2(selectedAccount?.spend_cap)} VND
            </p>
            <p className="!mt-2">
              Đã chi tiêu: {formatVNDV2(selectedAccount?.amount_spent)} VND
            </p>
            <p className="!mt-2">
              Dư nợ (balance): {formatVNDV2(selectedAccount?.balance)} VND
            </p>
            <div>
              <input
                className={`border rounded-lg px-4 py-3 text-lg w-full focus:ring-2 ${
                  walletBalance &&
                  typeof walletBalance === 'number' &&
                  walletBalance < 500000
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                inputMode="numeric"
                value={walletBalanceDisplay}
                onChange={(e) => {
                  const raw = e.target.value;
                  // chỉ cho nhập số + dấu chấm
                  if (!/^[0-9.]*$/.test(raw)) return;
                  const numberValue = parseVND(raw);
                  setWalletBalance(numberValue || '');
                  setWalletBalanceDisplay(
                    numberValue ? formatVND(numberValue) : '',
                  );
                }}
                placeholder="Nhập số tiền (tối thiểu 500,000 VND)"
              />
              {walletBalance &&
                typeof walletBalance === 'number' &&
                walletBalance < 500000 && (
                  <p className="text-red-500 text-sm mt-2">
                    Số tiền phải từ 500,000 VND trở lên
                  </p>
                )}
              {walletBalance > chooseWallet?.balance && (
                <p className="text-red-500 text-sm mt-2">
                  Số tiền trong ví không đủ
                </p>
              )}
            </div>
            <p className="!mt-2 text-[12px] text-red-500">
              Lưu ý: ngưỡng sau khi nâng{' '}
              {formatVNDV2(
                Number(selectedAccount?.spend_cap) + Number(walletBalance),
              )}{' '}
              VND
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-5 py-2.5 text-lg border rounded-lg"
                onClick={() => {
                  setModalType(null);
                  setWalletBalance('');
                  setWalletBalanceDisplay('');
                }}
              >
                Huỷ
              </button>
              <button
                className={`px-5 py-2.5 text-lg rounded-lg ${
                  !walletBalance ||
                  (typeof walletBalance === 'number' && walletBalance < 500000)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
                onClick={handleConfirmUpLimit}
                disabled={
                  !walletBalance ||
                  (typeof walletBalance === 'number' &&
                    walletBalance < 500000) ||
                  walletBalance > chooseWallet?.balance
                }
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'STOP_ADS_ACCOUNT' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[auto] space-y-4">
            <h3 className="text-xl font-bold text-indigo-600">
              Xác nhận dừng tài khoản quảng cáo
            </h3>

            <p>
              Bạn có chắc muốn dừng tài khoản quảng cáo và set ngưỡng về 1 cho
              tài khoản
              <strong> {selectedAccount.name}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={confirmStopAds}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'SYNC_CONFIRM' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[auto] space-y-4">
            <h3 className="text-xl font-bold text-indigo-600">
              Xác nhận đồng bộ
            </h3>

            <p>
              Bạn có chắc muốn đồng bộ campaign cho tài khoản
              <strong> {selectedAccount.name}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={confirmAsyncCamp}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'SYNC_ALL_CONFIRM' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[auto] space-y-4">
            <h3 className="text-xl font-bold text-indigo-600">
              Xác nhận đồng bộ
            </h3>

            <p>
              Bạn có chắc muốn đồng bộ tất cả campaign cho các tài khoản
              <strong> {selectedAccount.name}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={confirmAsyncAllCamp}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'ATTACH_ACCOUNT' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[auto] space-y-4">
            <h3 className="text-xl font-bold text-emerald-600">
              Gắn tài khoản
            </h3>
            <input
              type="text"
              placeholder="Tìm theo username hoặc email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-2"
            />
            <div className="max-h-72 overflow-auto border rounded-lg p-2">
              {usersData.length === 0 && (
                <p className="text-center text-gray-400 py-6">
                  Không có kết quả
                </p>
              )}
              {usersData.map((user: any) => {
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
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Huỷ
              </button>
              <button
                onClick={confirmAttachUser}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              >
                Gắn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDetail;
