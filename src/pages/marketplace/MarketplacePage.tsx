import React, { useEffect, useState } from 'react';
import {
  Check,
  RefreshCcw,
  X,
  Plus,
  Search,
  Key,
  Edit,
  Save,
} from 'lucide-react';
import AdAccountCard from './AdAccountCard';
import RentModal from './RentModal';
import CreateBMModal from './CreateBMModal';
import { AdAccount } from '../../types';
import BaseHeader from '../../api/BaseHeader';
import { useOnOutsideClick } from '../../hook/useOutside';
import { toast } from 'react-toastify';
import BMCard from './BMCard';
import { NotiError, NotiSuccess } from '../../components/noti';
import LoginModal from '../auth/LoginModal';
import PaymentCardModal from '../payment/PaymentCardModal';
import ButtonCmp from '../../components/button';
import usePagination from '../../hook/usePagination';
import { Pagination } from 'antd';
import qs from 'qs';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import CardDetailModal from './CardDetailModal';
import { useTranslation } from 'react-i18next';
import { usePreventScroll } from '../../hook/usePreventScroll';
import BreadCumbsCmp from '../../components/breadCumbs';
import Button from '../../components/ui/Button';
import CardExchangeToken from './CardExchangeToken';

interface BM {
  id: string;
  bm_id: string;
  bm_name: string;
  system_user_token?: string;
  created_at?: string;
  updated_at?: string;
}

const MarketplacePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const userString = localStorage.getItem('user');
  const userInfo = userString ? JSON.parse(userString) : null;
  const isAdmin = userInfo?.user?.role === 'admin';
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(
    null
  );
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [bmList, setBmList] = useState<BM[]>([]);
  const [allBmList, setAllBmList] = useState<BM[]>([]);
  const [filteredBmList, setFilteredBmList] = useState<BM[]>([]);
  const [isCreateBMModalOpen, setIsCreateBMModalOpen] = useState(false);
  const [selectedBM, setSelectedBM] = useState<any>(null);
  const [isBMDetailModalOpen, setIsBMDetailModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [successRent, setSuccessRent] = useState<any>(null);
  const [selectedSyncBMId, setSelectedSyncBMId] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bmToDelete, setBmToDelete] = useState<BM | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [rentMeta, setRentMeta] = useState<any>(null);
  const [rentedAccounts, setRentedAccounts] = useState<any[]>([]);
  const [visaAccount, setVisaAccount] = useState<any[]>([]);
  const [allAccount, setAllAccount] = useState<any[]>([]);
  const [simpleAccount, setSimpleAccount] = useState<any[]>([]);
  const [selectedAdAccountDetail, setSelectedAdAccountDetail] =
    useState<any>(null);
  const [isAdDetailOpen, setIsAdDetailOpen] = useState(false);
  const [isExchangeToken, setIsExchangeToken] = useState(false);
  const [search, setSearch] = useState<any>('');
  const [total, setTotal] = useState<any>(0);
  const [totalVisa, setTotalVisa] = useState<any>(0);
  const [totalAll, setTotalAll] = useState<any>(0);
  const [totalRent, setTotalRent] = useState<any>(0);
  const [isAccessTokenModalOpen, setIsAccessTokenModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [isEditingBM, setIsEditingBM] = useState(false);
  const [editedBMToken, setEditedBMToken] = useState<string>('');
  const [dataQuery, setDataQuery] = useState<any>({
    pageSize: 6,
    page: 1,
    pageSizeSimple: 1,
    is_ads_visa: 1,
    is_ads_simple: 1,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlPageSimple = parseInt(searchParams.get('pageSizeSimple') || '1', 10);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { currentPage, pageSize, handleChange } = usePagination(urlPage, 6);
  const {
    currentPage: currentPageRent,
    pageSize: pageSizeRent,
    handleChange: handleChangeRent,
  } = usePagination(urlPage, 6);
  const {
    currentPage: currentPageAll,
    pageSize: pageSizeAll,
    handleChange: handleChangeAll,
  } = usePagination(urlPage, 6);
  const {
    currentPage: currentPageSimple,
    pageSize: pageSizeSimple,
    handleChange: handleChangeSimple,
  } = usePagination(urlPageSimple, 6);
  usePreventScroll(successRent);

  const handleCallAPiRent = async () => {
    try {
      const [rentedRes] = await Promise.all([
        BaseHeader({
          method: 'get',
          url: 'ad-accounts-rent',
          params: {
            page: currentPageRent,
            pageSize,
          },
        }),
      ]);
      const rentedList = rentedRes.data.data.data || [];
      setRentedAccounts(rentedList);
      setTotalRent(rentedRes.data.data?.count);
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      toast.error(t('marketplacePage.errors.fetchAdAccounts'));
    }
  };
  const hanleSearch = (data: any) => {
    console.log(data);
    const cleaned = _.pickBy({
      ...dataQuery,
      page: currentPage,
      pageSizeSimple: currentPageSimple,
      // is_ads_visa: data?.selectedItems.includes('1') ? '1' : null,
      // is_ads_simple: data?.selectedItems.includes('2') ? '1' : null,
      from: data?.range?.[0],
      to: data?.range?.[1],
    });
    const queryString = qs.stringify(cleaned);
    setDataQuery(cleaned);
    setSearchParams(queryString);
  };
  const handleCallAPiVisa = async () => {
    try {
      const [visaRes] = await Promise.all([
        BaseHeader({
          method: 'get',
          url: 'ad-accounts-visa',
          params: {
            page: currentPage,
            pageSize,
            from: searchParams.get('from') || 0,
            to: searchParams.get('to') || 10000000000,
            search,
          },
        }),
      ]);

      const visaAccounts = visaRes.data.data.data || [];
      setVisaAccount(visaAccounts);
      setTotalVisa(visaRes.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      toast.error(t('marketplacePage.errors.fetchAdAccounts'));
    }
  };
  const handleCallAPiSimple = async () => {
    try {
      const [simpleRes] = await Promise.all([
        BaseHeader({
          method: 'get',
          url: 'ad-accounts-simple',
          params: {
            page: currentPageSimple,
            pageSize: pageSizeSimple,
            from: searchParams.get('from') || 0,
            to: searchParams.get('to') || 10000000000,
            search,
          },
        }),
      ]);
      const simpleAccounts = simpleRes.data.data.data || [];
      setSimpleAccount(simpleAccounts);
      setTotal(simpleRes.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      toast.error(t('marketplacePage.errors.fetchAdAccounts'));
    }
  };
  const hanleChangeSearch = async () => {
    switch (activeTab) {
      case 'all': {
        await handleCallAPiAll();
        return;
      }
      case 'visa': {
        await handleCallAPiVisa();
        return;
      }
      case 'simple': {
        await handleCallAPiSimple();
        return;
      }

      default:
        return;
    }
  };
  const handleCallAPiAll = async () => {
    try {
      const [Res] = await Promise.all([
        BaseHeader({
          method: 'get',
          url: 'ad-accounts',
          params: {
            page: currentPageAll,
            pageSize: pageSizeAll,
            from: searchParams.get('from') || 0,
            to: searchParams.get('to') || 10000000000,
            search,
          },
        }),
      ]);
      const Accounts = Res.data.data.data || [];
      setAllAccount(Accounts);
      setTotalAll(Res.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      toast.error(t('marketplacePage.errors.fetchAdAccounts'));
    }
  };
  useEffect(() => {
    if (!isAdmin) {
      const queryString = qs.stringify({
        ...dataQuery,
        page: currentPage,
        pageSizeSimple: currentPageSimple,
      });
      setSearchParams(queryString);
    }
  }, [currentPage, currentPageSimple]);
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
    handleCallAPiRent();
    fetchBMList();
  }, [currentPageRent]);
  useEffect(() => {
    if (activeTab === 'all') {
      handleCallAPiAll();
    }
  }, [
    isAdmin,
    currentPageAll,
    searchParams.get('from'),
    searchParams.get('to'),
    activeTab,
    successRent,
  ]);
  useEffect(() => {
    if (!isAdmin && activeTab === 'visa') {
      handleCallAPiVisa();
    }
  }, [
    isAdmin,
    currentPage,
    searchParams.get('from'),
    searchParams.get('to'),
    activeTab,
    successRent,
  ]);
  useEffect(() => {
    if (!isAdmin && activeTab === 'simple') {
      handleCallAPiSimple();
    }
  }, [
    isAdmin,
    currentPageSimple,
    searchParams.get('from'),
    searchParams.get('to'),
    activeTab,
    successRent,
  ]);
  useEffect(() => {
    setSearch('');
  }, [activeTab]);

  const handleRentClick = (account: any) => {
    const userString = localStorage.getItem('user');
    const userInfo = userString ? JSON.parse(userString) : null;
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }
    setSelectedAccount(account);
    setIsAdDetailOpen(false);
    setTimeout(() => {
      setIsRentModalOpen(true);
    }, 100);
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
        toast.success(response.data.message);
        setIsCardModalOpen(false);
        setIsRentModalOpen(false);
        setRentMeta(null);
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

  const { innerBorderRef } = useOnOutsideClick(() => {
    setIsBMDetailModalOpen(false);
  });

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
        toast.success(t('marketplacePage.success.syncComplete'));
        await handleCallAPiVisa();
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

  const { innerBorderRef: accessTokenModalRef } = useOnOutsideClick(() => {
    setIsAccessTokenModalOpen(false);
  });

  const handleEditBM = () => {
    setIsEditingBM(true);
    setEditedBMToken(selectedBM?.system_user_token || '');
  };

  const handleSaveBMToken = async () => {
    if (!selectedBM || !editedBMToken.trim()) {
      toast.error('Vui lòng nhập token hợp lệ!');
      return;
    }

    try {
      console.log('Updating BM with data:', {
        id: selectedBM.id,
        bm_name: selectedBM.bm_name,
        bm_id: selectedBM.bm_id,
        system_user_token: editedBMToken.trim(),
      });

      const response = await BaseHeader({
        method: 'post',
        url: 'facebook-bm-update',
        data: {
          id: selectedBM.id,
          bm_name: selectedBM.bm_name,
          bm_id: selectedBM.bm_id,
          system_user_token: editedBMToken.trim(),
        },
      });

      console.log('Update response:', response);

      if (response.status === 200 || response.status === 201) {
        toast.success('Cập nhật token thành công!');
        setIsEditingBM(false);
        // Cập nhật selectedBM với token mới
        setSelectedBM({
          ...selectedBM,
          system_user_token: editedBMToken.trim(),
        });
        // Refresh danh sách BM
        fetchBMList();
      } else {
        toast.error('Cập nhật token thất bại!');
      }
    } catch (error: any) {
      console.error('Error updating BM token:', error);
      console.error('Error details:', error.response?.data);
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật token!'
      );
    }
  };

  const handleCancelEditBM = () => {
    setIsEditingBM(false);
    setEditedBMToken('');
  };

  const fieldNameMap: Record<string, string> = {
    account_id: t('cardDetailModal.account_id'),
    type: t('cardDetailModal.type'),
    id: t('marketplacePage.fields.id'),
    account_status: t('marketplacePage.fields.accountStatus'),
    amount_spent: t('marketplacePage.fields.amountSpent'),
    balance: t('marketplacePage.fields.balance'),
    currency: t('marketplacePage.fields.currency'),
    name: t('marketplacePage.fields.name'),
    spend_cap: t('marketplacePage.fields.spendCap'),
    end_advertiser_name: t('marketplacePage.fields.end_advertiser_name'),
    status_rented: t('marketplacePage.fields.statusRented'),
    spend_limit: t('marketplacePage.fields.spendLimit'),
    note_aka: t('marketplacePage.fields.noteAka'),
    active: t('marketplacePage.fields.active'),
  };
  const tabs = [
    { key: 'all', label: t('marketplacePage.adAccounts') },
    // {
    //   key: 'visa',
    //   label: t('marketplacePage.adAccountsWithCard'),
    // },
    // {
    //   key: 'simple',
    //   label: t('marketplacePage.adAccountsWithoutCard'),
    // },
  ];
  const onSubmitExchangeToken = async (data: any) => {
    try {
      const response = await BaseHeader({
        method: 'post',
        url: 'ad-accounts-exchange-token',
        data: {
          bm_id: selectedBM.bm_id,
          client_id: data.client_id,
          client_secret: data.client_secret,
        },
      });
      if (response.status == 200) {
        toast.success('Cập nhật token thành công!');
      } else {
        toast.error('Cập nhật token thất bại!');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSelectedBM(null);
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 container mx-auto">
        <div className="flex flex-row items-center justify-between ">
          <div>
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              {t('marketplacePage.title')}
            </h2>
          </div>

          <div className="sm:hidden flex">
            <ButtonCmp
              onClick={hanleSearch}
              overrideClass="h-[40px] min-w-[90px]"
            />
          </div>
        </div>
        <div className="block sm:flex gap-8 mt-4">
          <BreadCumbsCmp
            tabs={tabs}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <ButtonCmp onClick={hanleSearch} className="hidden sm:flex" />
        </div>
        <div
          className={
            'mt-3 w-full flex flex-col md:flex-row gap-2 justify-between'
          }
        >
          <div className="flex gap-2 md:max-w-[50%] w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Nhập ID ads hoặc tên tài khoản quảng cáo"
              className="w-full px-3 py-3 text-[16px] rounded-[8px] border-[1.5px] border-[#CBCDD2]"
            />
            <Button
              size="lg"
              onClick={hanleChangeSearch}
              className="text-white bg-gradient-to-r
    from-purple-500 to-indigo-500 hover:bg-gradient-to-bl
    focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800
    font-medium rounded-lg text-sm min-w-[150px]"
              icon={<Search className="h-4 w-4" />}
            >
              Tìm kiếm
            </Button>
          </div>

          {isAdmin && (
            <Button
              size="lg"
              onClick={() => setIsAccessTokenModalOpen(true)}
              className="mt-2 md:mt-0 text-white bg-gradient-to-r
    from-green-500 to-emerald-500 hover:bg-gradient-to-bl
    focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800
    font-medium rounded-lg text-sm min-w-[150px]"
              icon={<Key className="h-4 w-4" />}
            >
              Access Token
            </Button>
          )}
        </div>
        <div className="sm:mt-6 mt-0 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mt-3 md:mt-0 flex items-center gap-3">
            {
              <button
                onClick={handleSync}
                className="group inline-flex items-center px-3 py-[10px] border border-yellow-400 rounded-xl shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 overflow-hidden"
              >
                <RefreshCcw className="h-5 w-5 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300">
                  {t('marketplacePage.syncAccounts')}
                </span>
              </button>
            }
            {
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
                  {t('marketplacePage.createBM')}
                </span>
              </button>
            }
          </div>
        </div>

        {/* BM List Section */}
        {filteredBmList.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              {t('marketplacePage.bmList')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBmList.map((bm: any) => (
                <BMCard
                  key={bm.id}
                  bm={bm}
                  onClick={() => handleBMClick(bm)}
                  onDelete={handleDeleteBM}
                  onExchangeToken={(data) => {
                    setIsExchangeToken(true);
                    setSelectedBM(data);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ad Accounts Section */}
        {activeTab === 'all' && (
          <>
            <h3 className="text-2xl font-bold text-gray-600 mb-4 mt-6">
              {t('marketplacePage.adAccounts')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAccount.map((account: any, index) => (
                <AdAccountCard
                  key={`${account.id}-${index}`}
                  account={account}
                  onRentClick={() => handleRentClick(account)}
                  isAdmin={isAdmin}
                  onViewDetail={(acc) => {
                    setSelectedAdAccountDetail(acc);
                    setIsAdDetailOpen(true);
                  }}
                />
              ))}
            </div>
            <div>
              {Boolean(totalAll) && (
                <div className="mt-8 mb-4">
                  <Pagination
                    total={totalAll}
                    onChange={handleChangeAll}
                    current={currentPageAll}
                    pageSize={pageSizeAll}
                  />
                </div>
              )}
            </div>
          </>
        )}
        {/* {activeTab === 'visa' && searchParams.get('is_ads_visa') == '1' && (
          <>
            <h3 className="text-2xl font-bold text-gray-600 mb-4 mt-6">
              {t('marketplacePage.adAccountsWithCard')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visaAccount.map((account: any, index) => (
                <AdAccountCard
                  key={`${account.id}-${index}`}
                  account={account}
                  onRentClick={() => handleRentClick(account)}
                  isAdmin={isAdmin}
                  onViewDetail={(acc) => {
                    setSelectedAdAccountDetail(acc);
                    setIsAdDetailOpen(true);
                  }}
                />
              ))}
            </div>
            {Boolean(totalVisa) && (
              <div className="mt-8 mb-4">
                <Pagination
                  total={totalVisa}
                  onChange={handleChange}
                  current={currentPage}
                  pageSize={pageSize}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'simple' && searchParams.get('is_ads_simple') == '1' && (
          <>
            <h3 className="text-2xl font-bold text-red-500 my-4 mt-6">
              {t('marketplacePage.adAccountsWithoutCard')}
            </h3>
            {simpleAccount.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {simpleAccount.map((account: any, index) => (
                    <AdAccountCard
                      key={`${account.id}-${index}`}
                      account={account}
                      onRentClick={() => handleRentClick(account)}
                      isAdmin={isAdmin}
                      onViewDetail={(acc) => {
                        setSelectedAdAccountDetail(acc);
                        setIsAdDetailOpen(true);
                      }}
                    />
                  ))}
                </div>
                {Boolean(total) && (
                  <div className="mt-8 mb-4">
                    <Pagination
                      total={total}
                      onChange={handleChangeSimple}
                      current={currentPageSimple}
                      pageSize={pageSizeSimple}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 italic py-4">
                {t('marketplacePage.noAccountsWithoutCard')}
              </div>
            )}
          </>
        )} */}
        {/* 
        {isAdmin && (
          <>
            <h3 className="text-2xl font-bold text-green-600 my-4 mt-6">
              {t('marketplacePage.rentedAccounts')}
            </h3>
            {rentedAccounts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentedAccounts.map((account: any, index) => (
                    <AdAccountCard
                      key={`${account.id}-${index}`}
                      account={account}
                      onRentClick={() => handleRentClick(account)}
                      isAdmin={isAdmin}
                      onViewDetail={(acc) => {
                        setSelectedAdAccountDetail(acc);
                        setIsAdDetailOpen(true);
                      }}
                    />
                  ))}
                </div>
                {Boolean(totalRent) && (
                  <div className="mt-8 mb-4">
                    <Pagination
                      total={totalRent}
                      onChange={handleChangeRent}
                      current={currentPageRent}
                      pageSize={pageSizeRent}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 italic py-4">
                {t('marketplacePage.noRentedAccounts')}
              </div>
            )}
          </>
        )} */}

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
            handleCallAPiVisa={handleCallAPiVisa}
          />
        )}

        {successRent && (
          <NotiSuccess
            onClose={() => setSuccessRent('')}
            message={t('rentalsPage.notifications.setupInProgress')}
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
                onClick={() => {
                  setIsBMDetailModalOpen(false);
                  setIsEditingBM(false);
                  setEditedBMToken('');
                }}
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
                <div className="flex flex-col">
                  <span className="font-medium mb-1">System User Token:</span>
                  {isEditingBM ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedBMToken}
                        onChange={(e) => setEditedBMToken(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Nhập System User Token..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEditBM}
                          className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleSaveBMToken}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Save className="h-3 w-3" />
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                      <code className="break-all whitespace-pre-wrap">
                        {selectedBM.system_user_token || 'Chưa có token'}
                      </code>
                    </div>
                  )}
                </div>
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

              {/* Nút Edit ở góc dưới bên phải */}
              {!isEditingBM && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleEditBM}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Token
                  </button>
                </div>
              )}
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
        {isAdDetailOpen && selectedAdAccountDetail && (
          <CardDetailModal
            isOpen={isAdDetailOpen}
            setIsAdDetailOpen={setIsAdDetailOpen}
            selectedAdAccountDetail={selectedAdAccountDetail}
            fieldNameMap={fieldNameMap}
            onRentClick={handleRentClick}
          />
        )}
        {isExchangeToken && (
          <CardExchangeToken
            isOpen={isExchangeToken}
            onClose={setIsExchangeToken}
            onSubmit={onSubmitExchangeToken}
          />
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

        {/* Access Token Modal */}
        {isAccessTokenModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
            <div
              ref={accessTokenModalRef}
              className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden relative"
            >
              <button
                onClick={() => setIsAccessTokenModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                <X size={20} />
              </button>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Access Token
                </h2>

                <div className="mb-6">
                  <label
                    htmlFor="accessToken"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nhập Access Token
                  </label>
                  <textarea
                    id="accessToken"
                    rows={4}
                    className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm resize-none"
                    placeholder="Paste your access token here..."
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccessTokenModalOpen(false);
                      setAccessToken('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      if (accessToken.trim()) {
                        // Lưu access token vào localStorage hoặc xử lý theo yêu cầu
                        localStorage.setItem(
                          'facebook_access_token',
                          accessToken.trim()
                        );
                        toast.success('Access Token đã được lưu thành công!');
                        setIsAccessTokenModalOpen(false);
                        setAccessToken('');
                      } else {
                        toast.error('Vui lòng nhập Access Token!');
                      }
                    }}
                    disabled={!accessToken.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${
                      !accessToken.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Lưu Token
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MarketplacePage;
