import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Check,
  Briefcase,
  RefreshCcw,
  X,
  Plus,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import AdAccountCard from './AdAccountCard';
import RentModal from './RentModal';
import CreateBMModal from './CreateBMModal';
import { AdAccount } from '../../types';
import { useAdAccountStore } from './adAccountStore';
import BaseHeader from '../../api/BaseHeader';
import url from '../../assets/bg.svg';
import { useOnOutsideClick } from '../../hook/useOutside';
import { toast } from 'react-toastify';
import BMCard from './BMCard';
import { NotiError, NotiSuccess } from '../../components/noti';
import LoginModal from '../auth/LoginModal';
import PaymentCardModal from '../payment/PaymentCardModal';

interface BM {
  id: string;
  bm_id: string;
  bm_name: string;
  system_user_token?: string;
  created_at?: string;
  updated_at?: string;
}

const MarketplacePage: React.FC = () => {
  const userString = localStorage.getItem('user');
  const userInfo = userString ? JSON.parse(userString) : null;
  const isAdmin = userInfo?.user?.role === 'admin';
  const [savedRentalRange, setSavedRentalRange] = useState<[Date, Date] | null>(
    null
  );

  const {
    searchTerm,
    selectedType,
    selectedAccountType,
    setSearchTerm,
    setSelectedType,
    setSelectedAccountType,
  } = useAdAccountStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(
    null
  );
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [bmList, setBmList] = useState<BM[]>([]);
  const [allBmList, setAllBmList] = useState<BM[]>([]);
  const [filteredBmList, setFilteredBmList] = useState<BM[]>([]);
  const [isCreateBMModalOpen, setIsCreateBMModalOpen] = useState(false);
  const [selectedBM, setSelectedBM] = useState<any>(null);
  const [isBMDetailModalOpen, setIsBMDetailModalOpen] = useState(false);
  const [selectedBMId, setSelectedBMId] = useState<string>('all');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [successRent, setSuccessRent] = useState<any>(null);
  const [selectedSyncBMId, setSelectedSyncBMId] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bmToDelete, setBmToDelete] = useState<BM | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [accountsWithCard, setAccountsWithCard] = useState<any[]>([]);
  const [accountsWithoutCard, setAccountsWithoutCard] = useState<any[]>([]);
  const [rentMeta, setRentMeta] = useState<any>(null);

  const handleCallAPi = async () => {
    try {
      const [visaRes, simpleRes] = await Promise.all([
        BaseHeader({
          method: 'get',
          url: 'ad-accounts-visa',
        }),
        BaseHeader({
          method: 'get',
          url: 'ad-accounts-simple',
        }),
      ]);

      const visaAccounts = visaRes.data.data || [];
      const simpleAccounts = simpleRes.data.data || [];

      setAccountsWithCard(
        visaAccounts.filter((acc: any) => acc.status_rented === 'available')
      );
      setAccountsWithoutCard(
        simpleAccounts.filter((acc: any) => acc.status_rented === 'available')
      );
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      toast.error('Lỗi khi lấy danh sách tài khoản quảng cáo');
    }
  };

  const fetchBMList = async () => {
    try {
      const response = await BaseHeader({
        method: 'get',
        url: 'facebook-bm',
        params: {},
      });
      setAllBmList(response.data.data);
      setBmList(response.data.data);
      setFilteredBmList(response.data.data);
    } catch (error) {
      console.log('Error fetching BM list:', error);
    }
  };

  useEffect(() => {
    handleCallAPi();
    fetchBMList();
  }, []);

  const handleRentClick = (account: any) => {
    const userString = localStorage.getItem('user');
    const userInfo = userString ? JSON.parse(userString) : null;

    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    setSelectedAccount(account);
    // if (!account.is_visa_account) {
    setIsRentModalOpen(true);
    // } else {
    //   setIsCardModalOpen(true);
    // }
  };

  //luu thong tin the
  const handleCardSave = async (cardData: any) => {
    if (!selectedAccount || !rentMeta) {
      toast.error(
        'Thiếu thông tin tài khoản hoặc dữ liệu thuê. Vui lòng kiểm tra lại !'
      );
      return;
    }

    const userString = localStorage.getItem('user');
    const userInfo = userString ? JSON.parse(userString) : null;

    const payload = {
      ...rentMeta,
      user_id: userInfo?.user_id || userInfo?.user?.user_id || '',
      visa_name: cardData.cardName || '',
      visa_number: cardData.cardNumber.replace(/\s/g, '') || '',
      visa_expiration: cardData.expiry || '',
      visa_cvv: cardData.cvv || '',
      verify_code: '1',
    };
    console.log(payload);

    try {
      const response = await BaseHeader({
        method: 'post',
        url: 'visa-add-card',
        data: payload,
      });

      if (response.status === 200 && response.data.success) {
        toast.success('Thêm thẻ thành công!');
        setIsCardModalOpen(false);
        setIsRentModalOpen(true);
      } else {
        toast.error(response.data.message || 'Không thể thêm thẻ.');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      const errMsg =
        error?.response?.data?.message || 'Lỗi khi gọi API thêm thẻ.';
      toast.error(errMsg);
    }
  };

  const handleBMClick = (bm: any) => {
    if (isAdmin) {
      console.log('BM clicked:', bm);
      setSelectedBM(bm);
      setIsBMDetailModalOpen(true);
    } else {
      toast.info('Bạn cần có quyền admin để xem chi tiết tài khoản BM');
    }
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const { innerBorderRef } = useOnOutsideClick(() => {
    setIsBMDetailModalOpen(false);
  });

  const filterData = (
    data: any[],
    bmId: string,
    accountType: string,
    term: string,
    isBM = false
  ) => {
    let filtered = data;
    if (!isBM && bmId !== 'all') {
      filtered = filtered.filter((acc) => acc.facebook_bm_id === bmId);
    }
    if (!isBM && accountType !== 'all') {
      filtered = filtered.filter((acc) => acc.account_type === accountType);
    }
    if (term) {
      filtered = filtered.filter((item) => {
        if (isBM) {
          return (
            (item.bm_name &&
              item.bm_name.toLowerCase().includes(term.toLowerCase())) ||
            (item.bm_id &&
              item.bm_id.toLowerCase().includes(term.toLowerCase()))
          );
        } else {
          return (
            (item.name &&
              item.name.toLowerCase().includes(term.toLowerCase())) ||
            (item.id && item.id.toLowerCase().includes(term.toLowerCase()))
          );
        }
      });
    }
    return filtered;
  };

  useEffect(() => {
    setFilteredAccounts(
      filterData(
        allAccounts,
        selectedBMId,
        selectedAccountType,
        searchTerm,
        false
      )
    );
    setFilteredBmList(
      filterData(allBmList, selectedBMId, selectedAccountType, searchTerm, true)
    );
  }, [allAccounts, allBmList, selectedBMId, selectedAccountType, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBMFilterChange = (bmId: string) => {
    setSelectedBMId(bmId);
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountType(e.target.value);
  };

  const handleSync = () => {
    setIsSyncModalOpen(true);
  };

  const handleSyncConfirm = async () => {
    try {
      setIsSyncing(true);
      const response = await BaseHeader({
        url: '/async-ad-accounts',
        method: 'post',
        data: {
          bm_id: selectedSyncBMId,
        },
      });
      if (response.status === 200) {
        toast.success('Đồng bộ tài khoản thành công');
        await handleCallAPi();
        setIsSyncModalOpen(false);
      } else {
        toast.error('Đồng bộ thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.log(error);
      toast.error('Có lỗi trong quá trình đồng bộ. Vui lòng thử lại sau.');
    } finally {
      setIsSyncing(false);
    }
  };

  const { innerBorderRef: syncModalRef } = useOnOutsideClick(() => {
    setIsSyncModalOpen(false);
  });

  const handleDeleteBM = (bm: BM) => {
    if (isAdmin) {
      setBmToDelete(bm);
      setIsDeleteModalOpen(true);
    } else {
      toast.info('Bạn cần có quyền admin để xoá tài khoản BM');
    }
  };

  const confirmDeleteBM = async () => {
    if (!bmToDelete) return;

    try {
      await BaseHeader({
        method: 'delete',
        url: `facebook-bm`,
        params: {
          id: bmToDelete.id,
        },
      });
      toast.success('Xóa tài khoản BM thành công');
      fetchBMList();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting BM:', error);
      toast.error('Không thể xóa tài khoản BM. Vui lòng thử lại sau.');
    }
  };

  const { innerBorderRef: deleteModalRef } = useOnOutsideClick(() => {
    setIsDeleteModalOpen(false);
  });

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              {/* Danh sách BM / Tài khoản quảng cáo */}
              Tài khoản quảng cáo BM
            </h2>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="w-full lg:w-1/2 flex items-center gap-2">
            <div className="relative flex gap-3 flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tài khoản..."
                className="w-full max-w-[400px] h-[42px] block pl-10 pr-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white sm:text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                type="button"
                className="h-[42px] px-3 sm:px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                onClick={toggleFilters}
              >
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="ml-2 hidden whitespace-nowrap lg:inline">
                  Bộ lọc
                </span>
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isFiltersOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleSync}
                className="group inline-flex items-center px-3 py-[10px] border border-yellow-400 rounded-xl shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 overflow-hidden"
              >
                <RefreshCcw className="h-5 w-5 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300">
                  Đồng Bộ Tài Khoản
                </span>
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                className="group inline-flex items-center px-3 py-[10px] border border-green-600 rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  setSelectedBM(null);
                  setIsCreateBMModalOpen(true);
                }}
              >
                <Plus className="h-5 w-5 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300">
                  Tạo tài khoản BM
                </span>
              </button>
            )}
          </div>
        </div>

        {isFiltersOpen && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bmFilter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tài khoản BM
                  </label>
                  <select
                    id="bmFilter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedBMId}
                    onChange={(e) => handleBMFilterChange(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    {bmList.map((bm: any) => (
                      <option key={bm.id} value={bm.bm_id}>
                        {bm.bm_name || `BM ${bm.bm_id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Dạng tài khoản
                  </label>
                  <select
                    id="accountType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedAccountType}
                    onChange={handleAccountTypeChange}
                  >
                    <option value="all">Tất cả</option>
                    <option value="visa">Visa</option>
                    <option value="high_limit">Limit cao</option>
                    <option value="low_limit">Limit thấp</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BM List Section */}
        {isAdmin && filteredBmList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Danh sách BM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBmList.map((bm: any) => (
                <BMCard
                  key={bm.id}
                  bm={bm}
                  onClick={() => handleBMClick(bm)}
                  onDelete={handleDeleteBM}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ad Accounts Section */}
        <h3 className="text-2xl font-bold text-gray-600 mb-4 mt-6">
          TKQC Đã gắn thẻ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountsWithCard.map((account: any) => (
            <AdAccountCard
              key={account.id}
              account={account}
              onRentClick={() => handleRentClick(account)}
            />
          ))}
        </div>

        <h3 className="text-2xl font-bold text-red-500 my-4 mt-6">
          TKQC Chưa gắn thẻ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountsWithoutCard.map((account: any) => (
            <AdAccountCard
              key={account.id}
              account={account}
              onRentClick={() => handleRentClick(account)}
            />
          ))}
        </div>

        {selectedAccount && (
          <RentModal
            isOpen={isRentModalOpen}
            onClose={() => setIsRentModalOpen(false)}
            account={selectedAccount}
            setSuccessRent={setSuccessRent}
            openCardModal={() => setIsCardModalOpen(true)}
            skipCardStep={selectedAccount?.is_visa_account === true}
            setRentMeta={setRentMeta}
            rentMeta={rentMeta}
          />
        )}

        {successRent && (
          <NotiSuccess
            onClose={() => setSuccessRent('')}
            message={'Vui lòng đợi giây lát để hệ thống setup'}
          />
        )}

        {/* {errorRent && (
          <NotiError onClose={() => setErrorRent('')} message={errorRent} />
        )} */}
        <CreateBMModal
          isOpen={isCreateBMModalOpen}
          onClose={() => setIsCreateBMModalOpen(false)}
          onSuccess={fetchBMList}
        />

        {selectedBM && isBMDetailModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
            <div
              ref={innerBorderRef}
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[600px] relative max-h-[80vh] overflow-y-auto"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-4xl"
                onClick={() => setIsBMDetailModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-xl text-blue-900 font-semibold mb-4">
                Chi Tiết Tài Khoản BM:
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-1/3">Tên BM:</span>
                  <span>{selectedBM.bm_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-1/3">BM ID:</span>
                  <span>{selectedBM.bm_id}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-1/3">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Hoạt động
                  </span>
                </div>
                {selectedBM.system_user_token && (
                  <div className="flex flex-col">
                    <span className="font-medium mb-1">System User Token:</span>
                    <div className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                      <code className="break-all whitespace-pre-wrap">
                        {selectedBM.system_user_token}
                      </code>
                    </div>
                  </div>
                )}
                {Object.entries(selectedBM).map(
                  ([key, value]: [string, any]) => {
                    if (
                      ['bm_name', 'bm_id', 'system_user_token'].includes(key)
                    ) {
                      return null;
                    }
                    let displayValue = value;
                    if (
                      (key === 'created_at' || key === 'updated_at') &&
                      typeof value === 'string'
                    ) {
                      try {
                        const date = new Date(value);
                        displayValue = date.toLocaleString('vi-VN', {
                          timeZone: 'Asia/Ho_Chi_Minh',
                          hour12: false,
                        });
                      } catch {
                        displayValue = value;
                      }
                    } else if (typeof value === 'number') {
                      displayValue = value.toLocaleString();
                    } else {
                      displayValue = String(value);
                    }

                    return (
                      <div key={key} className="flex items-start">
                        <span className="font-medium w-1/3">{key}:</span>
                        <span className="break-all">{displayValue}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sync Modal */}
        {isSyncModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
            <div
              ref={syncModalRef}
              className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden relative"
            >
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                <X size={20} />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Đồng bộ tài khoản quảng cáo
                </h2>

                <div className="mb-6">
                  <label
                    htmlFor="syncBmFilter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Chọn tài khoản BM để đồng bộ
                  </label>
                  <select
                    id="syncBmFilter"
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedSyncBMId}
                    onChange={(e) => setSelectedSyncBMId(e.target.value)}
                  >
                    <option value="" disabled>
                      Chọn BM
                    </option>
                    {bmList.map((bm: any) => (
                      <option key={bm.id} value={bm.bm_id}>
                        {bm.bm_name || `BM ${bm.bm_id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={isSyncing}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSyncConfirm}
                    disabled={!selectedSyncBMId || isSyncing}
                    className={`px-4 py-2 rounded-lg text-white ${
                      !selectedSyncBMId
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isSyncing
                        ? 'bg-blue-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSyncing ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Đang đồng bộ...
                        </>
                      ) : (
                        <>
                          <RefreshCcw className="w-4 h-4" />
                          Đồng Bộ
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {isDeleteModalOpen && bmToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
            <div
              ref={deleteModalRef}
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[500px] relative"
            >
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-3xl"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-xl text-blue-900 font-semibold mb-4">
                Xác nhận xóa
              </h2>
              <p className="mb-6">
                Bạn có chắc chắn muốn xóa BM{' '}
                <span className="text-blue-600">{bmToDelete.bm_name}</span> này
                không?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteBM}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setShowLoginModal(false);
              window.location.reload();
            }}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
            }}
          />
        )}
        <PaymentCardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          onSave={handleCardSave}
          onBackToRentModal={() => {
            setIsCardModalOpen(false);
            setIsRentModalOpen(true);
          }}
        />
      </div>
    </>
  );
};

export default MarketplacePage;
