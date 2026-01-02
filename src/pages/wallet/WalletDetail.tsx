import React, { useEffect, useState } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';

/* ================= MOCK API ================= */

/* ================= TYPES ================= */

interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  adsAccounts: any[];
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
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

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
      if (result.length > 0) {
        setSelectedWalletId(result[0].id);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchWallets();
  }, []);

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  const handleOpenModal = (account: any) => {
    setSelectedAccount(account);
    setOpenModal(true);
  };
  const handleOpenModalDelete = (account: any) => {
    setWalletToDelete(account);
    setOpenDelete(true);
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
      toast.error('Lỗi set ngưỡng khoản ví thất bại!');
    } finally {
      setOpenModal(false);
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
      toast.error('Lỗi xóa tài khoản ví thất bại!');
    } finally {
      setOpenDelete(false);
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
          onChange={(e) => setSelectedWalletId(Number(e.target.value))}
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
              {selectedWallet.balance.toLocaleString()}{' '}
              {selectedWallet.currency}
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
                    <div className="text-lg font-medium">{acc.name}</div>
                    <div className="text-gray-500 mt-1">
                      Ngưỡng chi tiêu:{' '}
                      <span className="font-semibold text-gray-700">
                        {formatVNDV2(acc.spend_cap)} VND
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(acc)}
                      className="bg-blue-600 text-white text-base px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                    >
                      Set ngưỡng
                    </button>
                    <button
                      onClick={() => handleOpenModalDelete(acc)}
                      className="bg-red-600 text-white text-base px-5 py-2.5 
                      rounded-lg hover:bg-red-700 transition"
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
      {openModal && selectedAccount && (
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
                onClick={() => setOpenModal(false)}
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
    </div>
  );
};

export default WalletDetail;
