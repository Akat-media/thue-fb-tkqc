import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  Calendar,
  DollarSign,
  Wallet,
  XOctagonIcon,
  X,
  CreditCard,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Rental } from '../../types';
import url from '../../assets/bg.svg';
import BaseHeader from '../../api/BaseHeader';
import { useOnOutsideClick } from '../../hook/useOutside';
import usePagination from '../../hook/usePagination';
import { Pagination } from 'antd';
import { NotiError, NotiSuccess } from '../../components/noti';
import { toast } from 'react-toastify';

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

interface AdsRental {
  id: string;
  bm_id: string;
  bm_origin: string;
  ads_account_id: string;
  user_id: string;
  status: string;
  status_partner: number;
  status_limit_spend: number;
  status_dischard_limit_spend: number | null;
  status_dischard_partner: number | null;
  created_at: string;
  updated_at: string;
  accounts: any;
  bot_id: any;
}

const RentalsPage: React.FC = () => {
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [rentals, setRentals] = useState<(Rental & { adAccount: any })[]>([]);
  const [activeTab, setActiveTab] = useState<
    'process' | 'success' | 'faild' | 'all'
  >('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRental, setSelectedRental] = useState<
    (Rental & { adAccount: any }) | null
  >(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [adAccountDetail, setAdAccountDetail] =
    useState<AdAccountDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [showCreateAdAccountModal, setShowCreateAdAccountModal] =
    useState(false);
  const [successRent, setSuccessRent] = useState<any>(null);
  const [errorRent, setErrorRent] = useState<any>(null);

  const { innerBorderRef } = useOnOutsideClick(() => {
    setShowModal(false);
  });

  const { currentPage, pageSize, handleChange, setCurrentPage, setPageSize } =
    usePagination(1, 10);

  useEffect(() => {
    fetchRentals();
  }, [currentPage, pageSize, activeTab]);

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

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
      setLoading(true);
      setRentals([]); // reset dữ liệu cũ

      const userString = localStorage.getItem('user');
      const userInfo = userString ? JSON.parse(userString) : null;
      const userId = userInfo?.user_id || userInfo?.user?.id || '';
      const isAdmin = userInfo?.user?.role === 'admin';

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

      const total = response.data.total || response.data.meta?.total || 0;
      setTotalAccounts(total);

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      if (rawData.length === 0) {
        setRentals([]);
        return;
      }

      const formatted = rawData.map((item: any) => {
        const acc = item.accounts || {};
        return {
          id: item.id || `act-${item.ads_account_id}`,
          userId: item.user_id || 'Unknown',
          adAccountId: item.ads_account_id,
          userBmId: item.bm_id || 'Không tìm thấy BM ID',
          startDate: new Date(
            acc.created_time || item.created_at || Date.now()
          ),
          endDate: new Date(item.updated_at || Date.now()),
          requestedLimit: parseInt(acc.spend_cap) || acc.spend_limit || 0,
          totalPrice: 1500000,
          spentBudget: parseInt(acc.amount_spent) || 0,
          status: mapApiStatus(item.status_rented || item.status),
          createdAt: new Date(
            acc.created_time || item.created_at || Date.now()
          ),
          status_dischard_limit_spend: item.status_dischard_limit_spend,
          status_dischard_partner: item.status_dischard_partner,
          status_limit_spend: item.status_limit_spend || 0,
          status_partner: item.status_partner || 0,
          bm_origin: item.bm_origin,
          bot_id: item.bot_id,
          adAccount: {
            id: acc.account_id,
            name: acc.name || `Account ${acc.account_id}`,
            bmId: acc.business?.id || '',
            bmName: acc.business?.name || `Business Manager`,
            bmType: acc.is_personal === 1 ? 'personal' : 'business',
            accountType: acc.funding_source_details?.display_string?.includes(
              'VISA'
            )
              ? 'visa'
              : 'other',
            defaultLimit:
              parseInt(acc.spend_limit) || parseInt(acc.spend_cap) || 5000000,
            pricePerDay: 200000,
            remainingBudget: parseInt(acc.balance) || 0,
            includesAdAccount: true,
            status: acc.account_status === 1 ? 'active' : 'available',
            currency: acc.currency || 'VND',
            is_sefl_used_visa: item?.is_sefl_used_visa,
          },
        };
      });

      // Lọc lại theo tab hiện tại
      const filteredByTab = formatted.filter((item: any) => {
        if (activeTab === 'all') return true;
        return item.status === activeTab;
      });

      setRentals(filteredByTab);

      setRentals(filteredByTab);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      setRentals([]);
      setTotalAccounts(0);
    } finally {
      setLoading(false);
    }
  };

  const mapApiStatus = (
    status: string
  ): 'process' | 'success' | 'faild' | 'all' => {
    switch (status) {
      case 'process':
        return 'process';
      case 'success':
        return 'success';
      case 'faild':
        return 'faild';
      default:
        return 'process';
    }
  };

  // const filteredRentals = rentals.filter((rental) => {
  //   if (activeTab === 'all') return true;
  //   if (userParse?.user?.role === 'admin' && activeTab === 'active') {
  //     return rental.status === 'available'; // Đoạn ni hiển thị tài khoản "available" cho tab "active" với admin
  //   }
  //   return rental.status === activeTab;
  // });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'process':
        return (
          <span className="min-w-[110px] justify-center inline-flex items-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 bg-yellow-100 text-yellow-800 border border-yellow-200">
            <RefreshCw className="h-3 w-3 mr-1" /> Đang xử lý
          </span>
        );
      case 'success':
        return (
          <span className="min-w-[110px] justify-center inline-flex items-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 bg-green-100 text-green-800 border border-green-200">
            <Clock className="h-3 w-3 mr-1" /> Thành công
          </span>
        );
      case 'faild':
        return (
          <span className="min-w-[110px] justify-center inline-flex items-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 bg-red-100 text-red-700 border border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Thất bại
          </span>
        );
      default:
        return (
          <span className="min-w-[80px] inline-flex items-center justify-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

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
          ads_name: account?.adAccount?.name || '',
          bm_id: account?.userBmId || '',
          ads_account_id: account?.adAccountId || '',
          user_id: userParse.user_id || '',
          amountPoint: account?.adAccount?.defaultLimit || '',
          bot_id: account?.bot_id || '',
        },
      });

      const { success, message } = response.data;

      if (success) {
        toast.success(message || 'Vô hiệu hóa thành công!');
      } else {
        toast.error(message || 'Vô hiệu hóa thất bại!');
      }

      console.log(response.data);
    } catch (error: any) {
      console.error('Rental error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Lỗi kết nối hệ thống. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              Tài khoản đang thuê
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) =>
                setActiveTab(
                  e.target.value as 'process' | 'success' | 'faild' | 'all'
                )
              }
            >
              <option value="process">Đang xử lý</option>
              <option value="success">Thành công</option>
              <option value="faild">Thất bại</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {['process', 'success', 'faild', 'all'].map((tab) => (
                  <button
                    key={tab}
                    className={`${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {
                      {
                        process: 'Đang xử lý',
                        success: 'Thành công',
                        faild: 'Thất bại',
                        all: 'Tất cả',
                      }[tab]
                    }
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : rentals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rentals.map((rental) => {
                return (
                  <Card
                    key={rental.userBmId}
                    className="h-full flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div
                        onClick={() => handleCardClick(rental)}
                        className="flex justify-between items-start"
                      >
                        <CardTitle className="text-[22px]">
                          {rental.adAccount.name}
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
                              BM ID:
                            </span>
                            <span className="font-semibold">
                              {rental.userBmId}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              Thời gian thuê:
                            </span>
                            <span className="font-semibold">
                              {formatDate(rental.startDate)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              Giới hạn chi:
                            </span>
                            <span className="font-semibold">
                              {rental?.adAccount?.is_sefl_used_visa
                                ? 'No limit'
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
                                  Đã chi tiêu:
                                </span>
                                <span className="font-semibold">
                                  {rental.spentBudget.toLocaleString('vi-VN')}{' '}
                                  {rental.adAccount.currency || 'VND'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <Wallet className="w-4 h-4 text-purple-400" />
                                  Còn lại:
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
                                  Hoàn tiền khả dụng
                                </h3>
                                <p className="text-sm text-red-700 mt-1">
                                  Bạn có thể yêu cầu hoàn{' '}
                                  {(
                                    rental.requestedLimit - rental.spentBudget
                                  ).toLocaleString('vi-VN')}{' '}
                                  VNĐ chưa sử dụng
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                    <div className="px-6 py-4 relative z-10">
                      <div className="flex space-x-3">
                        {rental.status === 'success' && (
                          <Button size="sm" fullWidth>
                            Yêu cầu hoàn tiền
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
                            Đang xử lý
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full">
                      <img className="w-full" src={url} alt="img" />
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === 'process'
                  ? 'Bạn không có tài khoản nào đang thuê.'
                  : activeTab === 'success'
                  ? 'Bạn không có tài khoản nào đang hoạt động. '
                  : 'Bạn chưa thuê tài khoản nào.'}
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = '/marketplace')}
              >
                Thuê tài khoản ngay
              </Button>
            </div>
          )}
        </div>

        {/* Modal hiển thị chi tiết tài khoản */}
        {showModal && selectedRental && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              ref={innerBorderRef}
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[600px] relative max-h-[80vh] overflow-y-auto"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Chi tiết tài khoản quảng cáo
              </h2>

              {loadingDetail ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Đang tải thông tin chi tiết...
                  </p>
                </div>
              ) : adAccountDetail ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">
                      Thông tin tài khoản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">ID tài khoản:</p>
                        <p className="font-medium">
                          {adAccountDetail.account_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tên tài khoản:</p>
                        <p className="font-medium">{adAccountDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Business Manager:
                        </p>
                        <p className="font-medium">
                          {adAccountDetail.business?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái:</p>
                        <p className="font-medium">
                          {getStatusBadge(selectedRental.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">
                      Thông tin tài chính
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Số dư:</p>
                        <p className="font-medium">
                          {parseInt(adAccountDetail.balance).toLocaleString()}{' '}
                          {adAccountDetail.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Đã chi tiêu:</p>
                        <p className="font-medium">
                          {parseInt(
                            adAccountDetail.amount_spent
                          ).toLocaleString()}{' '}
                          {adAccountDetail.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Hạn mức chi tiêu:
                        </p>
                        <p className="font-medium">
                          {adAccountDetail.spend_limit
                            ? adAccountDetail.spend_limit.toLocaleString()
                            : 'Không giới hạn'}{' '}
                          {adAccountDetail.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Phương thức thanh toán:
                        </p>
                        <p className="font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-1 text-blue-500" />
                          {adAccountDetail.funding_source_details
                            ?.display_string || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Thông tin thuê</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu:</p>
                        <p className="font-medium">
                          {formatDate(selectedRental.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Ngày tạo tài khoản:
                        </p>
                        <p className="font-medium">
                          {new Date(
                            adAccountDetail.created_time
                          ).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Múi giờ:</p>
                        <p className="font-medium">
                          {adAccountDetail.timezone_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loại tài khoản:</p>
                        <p className="font-medium">
                          {adAccountDetail.is_personal === 1
                            ? 'Cá nhân'
                            : 'Doanh nghiệp'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tổng tiền:</p>
                        <p className="font-medium">
                          {selectedRental.totalPrice.toLocaleString()} VND
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giá thuê/ngày:</p>
                        <p className="font-medium">
                          {selectedRental.adAccount.pricePerDay.toLocaleString()}{' '}
                          VND
                        </p>
                      </div>
                    </div>
                  </div>

                  {adAccountDetail.note_aka && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">Ghi chú</h3>
                      <p className="text-sm">{adAccountDetail.note_aka}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setShowModal(false)}>Đóng</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Không thể tải thông tin chi tiết tài khoản. Vui lòng thử lại
                    sau.
                  </p>
                  <Button
                    className="mt-3"
                    onClick={() =>
                      fetchAdAccountDetail(selectedRental.adAccountId)
                    }
                  >
                    Thử lại
                  </Button>
                </div>
              )}
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
          message={'Vui lòng đợi giây lát để hệ thống setup'}
        />
      )}

      {errorRent && (
        <NotiError onClose={() => setErrorRent('')} message={errorRent} />
      )}
    </>
  );
};

export default RentalsPage;
