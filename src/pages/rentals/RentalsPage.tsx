import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Rental } from '../../types';
import url from '../../assets/bg.svg';
import BaseHeader from '../../api/BaseHeader';
import { useOnOutsideClick } from '../../hook/useOutside';
import usePagination from '../../hook/usePagination';
import { Pagination } from 'antd';
import { NotiError, NotiSuccess } from '../../components/noti';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import BreadCumbsCmp from '../../components/breadCumbs';
import { useNavigate } from 'react-router-dom';
import AccountCard from './AccountCard';

interface AdAccountDetail {
  id: string;
  account_id: string;
  account_status: number;
  amount_spent: string;
  balance: string;
  business: {
    id: string;
    name: string;
  };
  currency: string;
  created_time: string;
  disable_reason: number;
  name: string;
  spend_cap: string;
  timezone_name: string;
  timezone_offset_hours_utc: number;
  owner: string;
  is_personal: number;
  funding_source_details: {
    id: string;
    type: number;
    display_string: string;
  };
  status_rented: string;
  spend_limit: number;
  note_aka: string;
}
const mapApiStatus = (
  status: string
): 'process' | 'success' | 'faild' | 'complete_remove' | 'all' => {
  switch (status) {
    case 'process':
      return 'process';
    case 'success':
      return 'success';
    case 'faild':
      return 'faild';
    case 'complete_remove':
      return 'complete_remove';
    default:
      return 'process';
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
};

const RentalsPage: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [rentals, setRentals] = useState<
    (Rental & { adAccount: any; bm_id: any })[]
  >([]);
  const [activeTab, setActiveTab] = useState<any>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRental, setSelectedRental] = useState<
    (Rental & { adAccount: any }) | null
  >(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [adAccountDetail, setAdAccountDetail] =
    useState<AdAccountDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [successRent, setSuccessRent] = useState<any>(null);
  const userString = localStorage.getItem('user');
  const userInfo = userString ? JSON.parse(userString) : null;
  const userId = userInfo?.user_id || userInfo?.user?.id || '';

  const { innerBorderRef } = useOnOutsideClick(() => {
    setShowModal(false);
  });

  const { currentPage, pageSize, handleChange, setCurrentPage, setPageSize } =
    usePagination(1, 10);

  const fetchAdAccountDetail = async (accountId: string) => {
    try {
      setLoadingDetail(true);
      const response = await BaseHeader({
        method: 'get',
        url: 'ad-accounts',
        params: {
          account_id: accountId,
        },
      });

      console.log('Ad account detail:', response.data);
      const adAccountData = Array.isArray(response.data)
        ? response.data[0]
        : response.data.data
        ? response.data.data[0]
        : response.data;
      setAdAccountDetail(adAccountData);
      if (selectedRental && adAccountData) {
        const updatedRental = {
          ...selectedRental,
          requestedLimit:
            adAccountData.spend_limit || selectedRental.requestedLimit,
          spentBudget: parseInt(adAccountData.amount_spent) || 0,
          adAccount: {
            ...selectedRental.adAccount,
            name: adAccountData.name || selectedRental.adAccount.name,
            bmName:
              adAccountData.business?.name || selectedRental.adAccount.bmName,
            bmType: adAccountData.is_personal === 1 ? 'personal' : 'business',
            accountType:
              adAccountData.funding_source_details?.display_string?.includes(
                'VISA'
              )
                ? 'visa'
                : 'other',
            remainingBudget: parseInt(adAccountData.balance) || 0,
            currency: adAccountData.currency,
          },
        };
        setSelectedRental(updatedRental);
      }
    } catch (error) {
      console.error('Error fetching ad account detail:', error);
      setAdAccountDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await BaseHeader({
        method: 'get',
        url: 'ads-rent-accounts',
        params: {
          user_id: userId,
          page: currentPage,
          limit: pageSize,
          ...(activeTab !== 'all' && { status: activeTab }),
        },
      });

      setRentals(response?.data?.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setRentals([]);
      setTotalAccounts(0);
    }
  };
  useEffect(() => {
    fetchRentals();
  }, [currentPage, pageSize, activeTab]);

  const handleCardClick = async (rental: Rental & { adAccount: any }) => {
    setSelectedRental(rental);
    setShowModal(true);
    await fetchAdAccountDetail(rental.adAccountId);
  };

  const hanleCancel = async (account: any) => {
    console.log('account', account);
    try {
      const response = await BaseHeader({
        url: 'points-used',
        method: 'delete',
        params: {
          id: account?.id || '',
          bm_origin: account?.bm_origin || '',
          ads_name: account?.ad_account?.name || '',
          bm_id: account?.bm_id || '',
          ads_account_id: account?.ads_account_id || '',
          user_id: userParse.user_id || '',
          bot_id: account?.bot_id || '',
        },
      });

      const { success, message } = response.data;
      if (success) {
        fetchRentals();
        fetchRentals();
      } else toast.error('Vô hiệu hóa thất bại!');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        t('rentalsPage.notifications.connectionError');
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const tabs = [
    { key: 'process', label: t('rentalsPage.tabs.processing') },
    {
      key: 'success',
      label: t('rentalsPage.tabs.success'),
    },
    {
      key: 'faild',
      label: t('rentalsPage.tabs.failed'),
    },
    {
      key: 'complete_remove',
      label: t('rentalsPage.tabs.completed'),
    },
    {
      key: 'all',
      label: t('rentalsPage.tabs.all'),
    },
  ];
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              {t('rentalsPage.title')}
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="sm:block">
            <div className="border-b border-gray-200">
              <BreadCumbsCmp
                tabs={tabs}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('rentalsPage.loading')}</p>
            </div>
          ) : rentals?.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* {rentals?.map((rental) => {
                return (
                  <Card
                    key={rental.userBmId}
                    onClick={() => handleCardClick(rental)}
                    className="h-full flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-[22px]">
                          {rental?.adAccount?.name}
                        </CardTitle>
                        {getStatusBadge(rental.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <div className="space-y-4">
                        <div className="font-sans text-gray-700 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Lightbulb className="w-4 h-4 text-yellow-400" />
                              {t('rentalsPage.bmId')}:
                            </span>
                            <span className="font-semibold">
                              {rental.userBmId}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              {t('rentalsPage.rentalPeriod')}:
                            </span>
                            <span className="font-semibold">
                              {formatDate(new Date(rental.createdAt))}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              {t('rentalsPage.spendLimit')}:
                            </span>
                            <span className="font-semibold">
                              {rental?.adAccount?.is_sefl_used_visa
                                ? t('rentalsPage.noLimit')
                                : rental.requestedLimit.toLocaleString(
                                    'vi-VN'
                                  )}{' '}
                              {!rental?.adAccount?.is_sefl_used_visa &&
                                (rental.adAccount.currency || 'VND')}
                            </span>
                          </div>

                          {!rental?.adAccount?.is_sefl_used_visa && (
                            <>
                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <CreditCard className="w-4 h-4 text-red-400" />
                                  {t('rentalsPage.spent')}:
                                </span>
                                <span className="font-semibold">
                                  {rental.spentBudget.toLocaleString('vi-VN')}{' '}
                                  {rental.adAccount.currency || 'VND'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Wallet className="w-4 h-4 text-purple-400" />
                                  {t('rentalsPage.remaining')}:
                                </span>
                                <span className="font-semibold">
                                  {(
                                    rental.requestedLimit - rental.spentBudget
                                  ).toLocaleString('vi-VN')}{' '}
                                  {rental.adAccount.currency || 'VND'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {rental.status === 'available' && (
                          <div className="pt-2">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="h-4 rounded-full"
                                style={{
                                  width: `${
                                    rental.requestedLimit > 0
                                      ? Math.min(
                                          100,
                                          (rental.spentBudget /
                                            rental.requestedLimit) *
                                            100
                                        )
                                      : 0
                                  }%`,
                                  background:
                                    'linear-gradient(90deg, #4ade80, #22d3ee)',
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>0%</span>
                              <span>
                                {rental.requestedLimit > 0
                                  ? Math.round(
                                      (rental.spentBudget /
                                        rental.requestedLimit) *
                                        100
                                    )
                                  : 0}
                                %
                              </span>
                              <span>100%</span>
                            </div>
                          </div>
                        )}
                        {rental.status === 'faild' &&
                          rental.spentBudget < rental.requestedLimit && (
                            <div className="bg-red-50 p-3 rounded-md flex items-start">
                              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-700">
                                  {t('rentalsPage.refundAvailable')}
                                </h3>
                                <p className="text-sm text-red-700 mt-1">
                                  {t('rentalsPage.refundUnusedPoints')}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <div className="px-6 py-4 relative z-10">
                      <div className="flex space-x-3">
                        {rental.status === 'success' && (
                          <Button
                            className="bg-red-500 hover:bg-red-400 text-white rounded-lg px-3 py-2 text-sm font-medium"
                            size="sm"
                            icon={<XCircle className="h-4 w-4 mr-1" />}
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              hanleCancel(rental);
                            }}
                          >
                            {t('rentalsPage.buttons.disable')}
                          </Button>
                        )}

                        {rental.status === 'process' && (
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-400 py-2"
                            size="sm"
                            icon={<RefreshCw className="h-4 w-4" />}
                            fullWidth
                            disabled
                          >
                            {t('rentalsPage.buttons.processing')}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full">
                      <img className="w-full" src={url} alt="img" />
                    </div>
                  </Card>
                );
              })} */}
              {rentals.map((rental) => (
                <AccountCard
                  key={rental?.bm_id}
                  data={rental}
                  onClick={() => handleCardClick(rental)}
                  hanleCancel={() => hanleCancel(rental)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'process'
                  ? t('rentalsPage.emptyState.processing')
                  : activeTab === 'success'
                  ? t('rentalsPage.emptyState.success')
                  : t('rentalsPage.emptyState.all')}
              </p>
              <Button className="mt-4" onClick={() => navigate('/marketplace')}>
                {t('rentalsPage.buttons.rentNow')}
              </Button>
            </div>
          )}
        </div>

        {/* Modal hiển thị chi tiết tài khoản */}
        {showModal && selectedRental && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              ref={innerBorderRef}
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t('rentalsPage.modal.title')}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {loadingDetail ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {t('rentalsPage.modal.loading')}
                    </p>
                  </div>
                ) : adAccountDetail ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">
                        {t('rentalsPage.modal.basicInfo')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.accountId')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.account_id}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.accountName')}:
                          </p>
                          <p className="font-medium">{adAccountDetail.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.accountStatus')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.account_status === 1
                              ? t('rentalsPage.modal.statusActive')
                              : t('rentalsPage.modal.statusInactive')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.currency')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.currency}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">
                        {t('rentalsPage.modal.financialInfo')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.amountSpent')}:
                          </p>
                          <p className="font-medium">
                            {parseInt(
                              adAccountDetail.amount_spent
                            ).toLocaleString('vi-VN')}{' '}
                            {adAccountDetail.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.balance')}:
                          </p>
                          <p className="font-medium">
                            {parseInt(adAccountDetail.balance).toLocaleString(
                              'vi-VN'
                            )}{' '}
                            {adAccountDetail.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.spendCap')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.spend_cap === '0'
                              ? t('rentalsPage.modal.noLimit')
                              : `${parseInt(
                                  adAccountDetail.spend_cap
                                ).toLocaleString('vi-VN')} ${
                                  adAccountDetail.currency
                                }`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">
                        {t('rentalsPage.modal.additionalInfo')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.createdDate')}:
                          </p>
                          <p className="font-medium">
                            {new Date(
                              adAccountDetail.created_time
                            ).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.timezone')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.timezone_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.accountType')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.is_personal === 1
                              ? t('rentalsPage.modal.personal')
                              : t('rentalsPage.modal.business')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {t('rentalsPage.modal.bmName')}:
                          </p>
                          <p className="font-medium">
                            {adAccountDetail.business?.name ||
                              t('rentalsPage.modal.notAvailable')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setShowModal(false)}>
                        {t('rentalsPage.modal.close')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      {t('rentalsPage.modal.loadError')}
                    </p>
                    <Button
                      className="mt-3"
                      onClick={() =>
                        fetchAdAccountDetail(selectedRental.adAccountId)
                      }
                    >
                      {t('rentalsPage.modal.retry')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {totalAccounts > 0 && (
          <div className="mt-6">
            <Pagination
              total={totalAccounts}
              current={currentPage}
              pageSize={pageSize}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
      {successRent && (
        <NotiSuccess
          onClose={() => setSuccessRent('')}
          message={t('rentalsPage.notifications.setupInProgress')}
        />
      )}
    </>
  );
};

export default RentalsPage;
