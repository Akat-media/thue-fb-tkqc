import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  Calendar,
  DollarSign,
  Wallet,
  XCircle,
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
import BaseHeader from '../../api/BaseHeader';
import usePagination from '../../hook/usePagination';
import { Pagination } from 'antd';
import { NotiError, NotiSuccess } from '../../components/noti';
import url from '../../assets/bg.svg';

const RentalsManagement: React.FC = () => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    'process' | 'success' | 'faild' | 'all'
  >('all');
  const [loading, setLoading] = useState(true);
  const [successRent, setSuccessRent] = useState<string | null>(null);
  const [errorRent, setErrorRent] = useState<string | null>(null);
  const { currentPage, pageSize, handleChange } = usePagination(1, 10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchRentals();
  }, [currentPage, pageSize, activeTab]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await BaseHeader({
        method: 'get',
        url: 'ads-rent-accounts-all',
        params: {
          page: currentPage,
          limit: pageSize,
          ...(activeTab !== 'all' && { status: activeTab }),
        },
      });
      let data = response.data.data || [];
      if (activeTab !== 'all') {
        data = data.filter((item: any) => item.status === activeTab);
      }
      setRentals(data);

      setTotalRecords(response.data.total || 0);
    } catch (error) {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (account: any) => {
    try {
      const response = await BaseHeader({
        url: 'points-used',
        method: 'delete',
        params: {
          id: account?.id,
          bm_origin: account?.bm_origin,
          ads_name: account?.accounts?.name,
          bm_id: account?.bm_id,
          ads_account_id: account?.ads_account_id,
          user_id: account?.user_id,
          amountPoint: account?.accounts?.spend_limit,
          bot_id: account?.bot_id,
        },
      });
      const { success, message } = response.data;
      if (success) setSuccessRent(message);
      else setErrorRent(message);
    } catch (error: any) {
      setErrorRent(
        error?.response?.data?.message ||
          'Lỗi kết nối hệ thống. Vui lòng thử lại!'
      );
    }
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
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

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
              Quản lý tài khoản
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'process'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-yellow-600 hover:border-yellow-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('process')}
              >
                Đang xử lý
              </button>
              <button
                className={`${
                  activeTab === 'success'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('success')}
              >
                Thành công
              </button>
              <button
                className={`${
                  activeTab === 'faild'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('faild')}
              >
                Thất bại
              </button>
              <button
                className={`${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('all')}
              >
                Tất cả
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rentals.map((rental) => (
                <Card
                  key={rental.id}
                  className="h-full flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-[22px]">
                        {rental.accounts?.name || 'Không tìm thấy'}
                      </CardTitle>
                      {getStatusBadge(rental.status || 'unavailable')}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow relative z-10">
                    <div className="space-y-4 font-sans text-gray-700">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Lightbulb className="w-4 h-4 text-yellow-400" /> BM
                          ID:
                        </span>
                        <span className="font-semibold">{rental.bm_id}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-4 h-4 text-blue-400" /> Thời
                          gian thuê:
                        </span>
                        <span className="font-semibold">
                          {formatDate(rental.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <DollarSign className="w-4 h-4 text-green-400" /> Giới
                          hạn chi:
                        </span>
                        <span className="font-semibold">
                          {parseInt(
                            rental.accounts?.spend_cap || 0
                          ).toLocaleString('vi-VN')}{' '}
                          VND
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Wallet className="w-4 h-4 text-blue-400" /> Đã chi
                          tiêu:
                        </span>
                        <span className="font-semibold">
                          {parseInt(
                            rental.accounts?.spend_limit || 0
                          ).toLocaleString('vi-VN')}{' '}
                          VND
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <CreditCard className="w-4 h-4 text-rose-400" /> Còn
                          lại:
                        </span>
                        <span className="font-semibold">
                          {(
                            parseInt(rental.accounts?.spend_cap || 0) -
                            parseInt(rental.accounts?.spend_limit || 0)
                          ).toLocaleString('vi-VN')}{' '}
                          VND
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="px-6 py-4 relative z-10">
                    <div className="flex space-x-3">
                      <Button
                        className="bg-red-500 hover:bg-red-400 py-2"
                        size="sm"
                        icon={<XCircle className="h-4 w-4" />}
                        fullWidth
                        onClick={() => handleCancel(rental)}
                      >
                        Vô hiệu hóa
                      </Button>
                      <Button className="py-2" size="sm" fullWidth>
                        Nâng cấp
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full">
                    <img className="w-full" src={url} alt="img" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {totalRecords > 0 && (
          <div className="mt-6">
            <Pagination
              total={totalRecords}
              current={currentPage}
              pageSize={pageSize}
              onChange={handleChange}
              showSizeChanger={false}
            />
          </div>
        )}

        {successRent && (
          <NotiSuccess
            onClose={() => setSuccessRent(null)}
            message={'Vui lòng đợi giây lát để hệ thống setup'}
          />
        )}

        {errorRent && (
          <NotiError onClose={() => setErrorRent(null)} message={errorRent} />
        )}
      </div>
    </>
  );
};

export default RentalsManagement;
