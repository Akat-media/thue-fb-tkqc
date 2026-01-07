import React, { useEffect, useMemo, useState } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import axios from 'axios';
type ModalType =
  | 'SYNC_CONFIRM'
  | 'ATTACH_ACCOUNT'
  | 'SET_LIMIT'
  | 'UP_LIMIT'
  | 'SYNC_ALL_CONFIRM'
  | null;

interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  adsAccounts: any[];
  userViewCampaign: any[];
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
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // modal
  const [modalType, setModalType] = useState<ModalType>(null);

  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [chooseUser, setChooseUser] = useState<string[]>([]);

  const [openDelete, setOpenDelete] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<any>(null);

  const [walletBalance, setWalletBalance] = useState<number | ''>('');
  const [walletBalanceDisplay, setWalletBalanceDisplay] = useState('');

  const fetchWallets = async () => {
    try {
      const [response] = await Promise.all([
        BaseHeader({
          url: '/wallet',
          method: 'get',
        }),
      ]);
      const result = response.data.data;
      setWallets(result);
      setSelectedWalletId((prev: any) =>
        prev === null && result.length > 0 ? result[0].id : prev
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!selectedWalletId) return;

    // reset state phụ thuộc ví
    setSelectedAccount(null);
    setSelectedUsers([]);
    setChooseUser([]);
    setModalType(null);
  }, [selectedWalletId]);

  const fetchUserNotInCamp = async () => {
    if (!selectedAccount?.id) return;
    try {
      const [response] = await Promise.all([
        BaseHeader({
          url: '/user-not-in-campaign',
          method: 'get',
          params: {
            ads_id: selectedAccount.id,
          },
        }),
      ]);
      const result = response.data.data;
      if (result.length > 0) {
        setSelectedUsers(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchWallets();
  }, []);

  useEffect(() => {
    if (modalType === 'ATTACH_ACCOUNT') {
      setLoading(true);
      fetchUserNotInCamp();
    }
  }, [modalType]);

  const selectedWallet = useMemo(() => {
    return wallets.find((w) => w.id === selectedWalletId);
  }, [selectedWalletId]);
  console.log('selectedWallet', selectedWallet, selectedWalletId);
  const handleOpenModal = (account: any) => {
    setSelectedAccount(account);
    setModalType('SET_LIMIT');
  };
  const handleOpenModalUpLimit = (account: any) => {
    setSelectedAccount(account);
    setModalType('UP_LIMIT');
  };
  const handleOpenModalDelete = (account: any) => {
    setWalletToDelete(account);
    setOpenDelete(true);
  };
  const handleOpenSyncModal = (account: any) => {
    setSelectedAccount(account);
    setModalType('SYNC_CONFIRM');
  };
  const handleOpenSyncAllModal = () => {
    setModalType('SYNC_ALL_CONFIRM');
  };
  const handleOpenAttachModal = (account: any) => {
    setSelectedAccount(account);
    setModalType('ATTACH_ACCOUNT');
  };

  const handleConfirmLimit = async () => {
    if (!selectedWallet || !selectedAccount || !walletBalance) return;

    try {
      const response = await BaseHeader({
        url: `/wallet/ads-spend-cap/${selectedWallet?.id}`,
        method: 'post',
        data: {
          ads_id: selectedAccount.id,
          spend_cap: String(walletBalance),
        },
      });
      if (response.status == 200) {
        toast.success('Set ngưỡng tài khoản ví thành công!');
        fetchWallets();
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
    if (!selectedWallet || !selectedAccount || !walletBalance) return;

    try {
      const response = await BaseHeader({
        url: `/wallet/ads-spend-cap-increase/${selectedWallet?.id}`,
        method: 'post',
        data: {
          ads_id: selectedAccount.id,
          spend_cap: String(walletBalance),
        },
      });
      if (response.status == 200) {
        toast.success('Set ngưỡng tài khoản ví thành công!');
        fetchWallets();
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
        fetchWallets();
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
    try {
      const listAds = selectedWallet?.adsAccounts.map((item: any) => item.id);
      const response = await BaseHeader({
        url: `/async-many-campaign`,
        method: 'post',
        data: {
          list_ads_id: listAds,
          wallet_id: selectedWallet?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Đồng bộ tất cả camp thành công!');
        fetchWallets();
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
  const confirmAsyncCamp = async () => {
    try {
      const response = await BaseHeader({
        url: `/async-one-campaign`,
        method: 'post',
        data: {
          list_ads_id: [selectedAccount.id],
          wallet_id: selectedWallet?.id,
        },
      });
      if (response.status == 200) {
        toast.success('Đồng bộ camp thành công!');
        fetchWallets();
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
          list_user_id: chooseUser,
          ads_id: selectedAccount.id,
          wallet_id: selectedWalletId,
        },
      });
      if (response.status == 200) {
        toast.success('Gắn tài khoản thành công!');
        fetchWallets();
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

      {/* Wallet selector */}
      <div className="mb-8">
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
      </div>

      {loading && <div className="text-lg">Đang tải dữ liệu...</div>}

      {/* Wallet card */}
      {!loading && selectedWallet && (
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold">{selectedWallet.name}</div>
              <div className="text-gray-500 mt-1">Số dư hiện tại</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              <div>
                {selectedWallet.balance.toLocaleString()}{' '}
                {selectedWallet.currency}
              </div>
              <button
                onClick={handleOpenSyncAllModal}
                className="bg-orange-600 text-white text-base px-5 py-2.5 rounded-lg hover:bg-orange-700 transition mt-2"
              >
                Đồng bộ tất cả campaign
              </button>
            </div>
          </div>

          {/* Accounts */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tài khoản quảng cáo</h3>
            <ul className="space-y-4">
              {selectedWallet?.adsAccounts?.map((acc) => (
                <li
                  key={acc.id}
                  className="border border-gray-200 rounded-xl p-5 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <div className="text-lg font-medium">{acc?.name}</div>
                    <div className="text-[14px] font-medium">
                      {acc?.account_id}
                    </div>
                    <div className="text-gray-500 mt-1">
                      BM_ID:{' '}
                      <span className="font-semibold text-gray-700">
                        {acc.owner}
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      Ngưỡng chi tiêu:{' '}
                      <span className="font-semibold text-gray-700">
                        {formatVNDV2(acc.spend_cap)} VND
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      Đã tiêu:{' '}
                      <span className="font-semibold text-gray-700">
                        {formatVNDV2(acc.amount_spent)} VND
                      </span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      User gắn campaign:{' '}
                      <span className="font-semibold text-red-500 break-words max-w-[500px] block">
                        {(selectedWallet?.userViewCampaign || [])
                          .filter((item) => item.ads_id === acc.id)
                          .map((item) => item.user?.email)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenSyncModal(acc)}
                      className="bg-indigo-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-indigo-700 transition"
                    >
                      Đồng bộ camp
                    </button>

                    <button
                      onClick={() => handleOpenAttachModal(acc)}
                      className="bg-emerald-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-emerald-700 transition"
                    >
                      Gắn tài khoản
                    </button>

                    <button
                      onClick={() => handleOpenModalUpLimit(acc)}
                      className="bg-purple-500 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-purple-600 transition"
                    >
                      Nâng ngưỡng
                    </button>
                    <button
                      onClick={() => handleOpenModal(acc)}
                      className="bg-amber-500 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-amber-600 transition"
                    >
                      Set ngưỡng
                    </button>

                    <button
                      onClick={() => handleOpenModalDelete(acc)}
                      className="bg-rose-600 text-white text-base px-5 py-2.5 
    rounded-lg hover:bg-rose-700 transition"
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
      {/* ================= MODAL ================= */}
      {modalType === 'SET_LIMIT' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] space-y-6">
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
                  numberValue ? formatVND(numberValue) : ''
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
          <div className="bg-white rounded-2xl p-8 w-[420px] space-y-6">
            <h3 className="text-xl font-bold">Nâng ngưỡng chi tiêu thêm</h3>
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
                  numberValue ? formatVND(numberValue) : ''
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
                onClick={handleConfirmUpLimit}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'SYNC_CONFIRM' && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
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
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
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
          <div className="bg-white rounded-xl p-6 w-[450px] space-y-4">
            <h3 className="text-xl font-bold text-emerald-600">
              Gắn tài khoản
            </h3>

            <select
              multiple
              value={chooseUser}
              onChange={(e) =>
                setChooseUser(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="w-full border rounded-lg px-4 py-2 h-[120px]"
            >
              <option value="">Chọn tài khoản</option>
              {selectedUsers.length > 0 &&
                selectedUsers.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.email}
                  </option>
                ))}
            </select>

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
