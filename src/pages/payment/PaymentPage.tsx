import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Copy,
  Landmark,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Transaction } from '../../types';
import BaseHeader, { BaseUrlSocket } from '../../api/BaseHeader';
import socket from '../../socket';
import { useUserStore } from '../../stores/useUserStore';
import axios from 'axios';

const PaymentPage: React.FC = () => {
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedAmount, setSelectedAmount] = useState(500000);
  const [customAmount, setCustomAmount] = useState<string>('500000');
  const [isLoading, setIsLoading] = useState(false);
  // const { user } = useAuth();
  const userStore = useUserStore((state) => state.user);
  // const fetchUser = useUserStore((state) => state.fetchUser);
  const { addNotification } = useNotification();
  const [showQRCode, setShowQRCode] = useState(false);
  const [isShowingQR, setIsShowingQR] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'loading' | 'success' | 'failed' | null
  >(null);
  const { user, fetchUser } = useUserStore();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(true);
  const [currencyTab, setCurrencyTab] = useState<'VND' | 'USD' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    fetchUser();
    setIsCurrencyModalOpen(true);
  }, [fetchUser]);

  const hanleCalTransaction = async (number: any) => {
    try {
      const res = await BaseHeader({
        url: 'transaction',
        method: 'post',
        data: {
          amountVND: number,
          user_id: userParse.user_id || '',
        },
      });
      return res.data.data.short_code;
    } catch (error) {
      console.log(error);
    }
  };
  const storedUserData = localStorage.getItem('user');
  const shortCode = storedUserData
    ? JSON.parse(storedUserData)?.user?.short_code || 'NAP0000'
    : 'NAP0000';

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification(
      'Đã sao chép',
      'Thông tin đã được sao chép vào clipboard',
      'success'
    );
  };

  const handleDeposit = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (isNaN(amount) || amount <= 0) {
      addNotification('Lỗi', 'Vui lòng nhập số tiền hợp lệ', 'error');
      return;
    }
    const shortCode = await hanleCalTransaction(amount);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addNotification(
        'Tạo lệnh nạp tiền thành công',
        'Vui lòng chuyển khoản theo thông tin đã cung cấp',
        'success'
      );
      setIsShowingQR(true);
      const qrUrl = `https://apiqr.web2m.com/api/generate/ACB/20478471/duy%20nam?amount=${amount}&memo=${shortCode}&is_mask=1&bg=1`;
      setQrImageUrl(qrUrl);
      setTimeout(() => {
        setShowQRCode(true);
        setIsShowingQR(false);
        setCountdown(120);
      }, 1200);
      if (qrUrl) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Deposit error:', error);
      addNotification(
        'Có lỗi xảy ra',
        'Không thể tạo lệnh nạp tiền. Vui lòng thử lại sau',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransfer = () => {
    setPaymentStatus('loading');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setPaymentStatus(null);
        setShowQRCode(false);
        setCustomAmount('');
      }, 2000);
    }, 3000);
  };

  const formatTransactionDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  useEffect(() => {
    if (!showQRCode) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStatus('failed');
          setTimeout(() => {
            setPaymentStatus(null);
            setShowQRCode(false);
            setCustomAmount('');
          }, 3000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showQRCode]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('joinRoom');
    });

    socket.on('payment_success', (data) => {
      console.log('Payment success event received:', data);
      fetchUser();

      setPaymentStatus('success');

      setTimeout(() => {
        setPaymentStatus(null);
        setShowQRCode(false);
        setCustomAmount('');
      }, 5000);
    });

    return () => {
      socket.off('connect');
      socket.off('payment_success');
    };
  }, [fetchUser]);

  return (
    <>
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">
              Select Payment Method
            </h2>

            <div className="space-y-3">
              <div
                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition ${
                  currencyTab === 'VND'
                    ? 'border-blue-600 ring-2 ring-blue-400'
                    : 'border-gray-300'
                }`}
                onClick={() => {
                  setCurrencyTab('VND');
                  setIsCurrencyModalOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currencyTab === 'VND'
                        ? 'border-blue-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {currencyTab === 'VND' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    VNĐ (Internet Banking)
                  </span>
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3128/3128313.png"
                  alt="Bank icon"
                  className="h-6"
                />
              </div>
              <div
                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition ${
                  currencyTab === 'USD'
                    ? 'border-blue-600 ring-2 ring-blue-400'
                    : 'border-gray-300'
                }`}
                onClick={() => {
                  setCurrencyTab('USD');
                  setIsCurrencyModalOpen(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currencyTab === 'USD'
                        ? 'border-blue-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {currencyTab === 'USD' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">
                    USD (PayPal)
                  </span>
                </div>
                <img
                  src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                  alt="PayPal"
                  className="h-6"
                />
              </div>
              <div className="flex items-center justify-between border rounded-lg p-3 shadow-sm opacity-50 cursor-not-allowed">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">Visa</span>
                    <span className="text-xs text-gray-500">
                      Đang phát triển
                    </span>
                  </div>
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                  alt="Visa"
                  className="h-3"
                />
              </div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                Chức năng này đang được phát triển
              </div>
              <div className="flex items-center justify-between border rounded-lg p-3 shadow-sm opacity-50 cursor-not-allowed">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      MasterCard
                    </span>
                    <span className="text-xs text-gray-500">
                      Đang phát triển
                    </span>
                  </div>
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  alt="MasterCard"
                  className="h-6"
                />
              </div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                Chức năng này đang được phát triển
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
            Cổng Thanh Toán
          </h2>

          {user && (
            <div className="mt-1 text-base text-gray-500">
              <p>
                Số dư hiện tại:{' '}
                <span className="font-medium text-green-700">
                  {user.points?.toLocaleString('vi-VN') || 0} điểm
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="deposit">Nạp tiền</option>
              {/* <option value="history">Lịch sử nạp</option>
              <option value="platform">Thanh toán nền tảng</option> */}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className={`${
                    activeTab === 'deposit'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('deposit')}
                >
                  <CreditCard className="h-5 w-5 mr-2 inline-block" />
                  Nạp tiền
                </button>
                {/* <button
                  className={`${
                    activeTab === "history"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("history")}
                >
                  <FileText className="h-5 w-5 mr-2 inline-block" />
                  Lịch sử nạp
                </button>
                <button
                  className={`${
                    activeTab === "platform"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("platform")}
                >
                  Thanh toán nền tảng
                </button> */}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'deposit' && currencyTab === 'VND' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    Nạp tiền vào hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="col-span-2 sm:col-span-3">
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        Nhập số tiền bạn muốn nạp 👇
                      </label>
                      <div className="mt-2">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            className={`shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full h-12 px-4 pr-16 sm:text-sm rounded-md ${
                              customAmount &&
                              (parseInt(customAmount) <= 50000 ||
                                parseInt(customAmount) % 1000 !== 0)
                                ? 'border-red-500'
                                : 'border border-gray-300'
                            }`}
                            placeholder="Nhập số tiền"
                            value={
                              customAmount
                                ? parseInt(customAmount).toLocaleString('vi-VN')
                                : ''
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, '');
                              setCustomAmount(raw);
                              setSelectedAmount(parseInt(raw) || 0);
                              setShowQRCode(false);
                            }}
                            min="50000"
                            step="1000"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            VNĐ
                          </span>
                        </div>

                        {customAmount &&
                          (parseInt(customAmount) <= 50000 ||
                            parseInt(customAmount) % 1000 !== 0) && (
                            <p className="text-red-500 text-xs mt-1">
                              Vui lòng nhập số tiền từ 50.000 VNĐ trở lên và là
                              số tiền chẵn hàng nghìn (vd: 50.000 VNĐ, 68.000
                              VNĐ, 100.000 VNĐ).
                            </p>
                          )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        Vui lòng chọn mệnh giá
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                        {[
                          500000, 1000000, 2000000, 3000000, 5000000, 10000000,
                        ].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`${
                              selectedAmount === amount
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-700'
                            } border rounded-md py-2 px-1 md:px-3 text-sm font-medium 
                            ${
                              parseInt(customAmount) === amount
                                ? 'ring-2 ring-blue-500 ring-opacity-50'
                                : ''
                            }
                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                            transition-all duration-200 whitespace-nowrap
                            max-w-[230px] truncate overflow-hidden`}
                            style={{ minWidth: 0 }}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount(String(amount));
                              setShowQRCode(false);
                            }}
                          >
                            {amount.toLocaleString('vi-VN')}đ
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md bg-blue-50 p-3 md:p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Landmark
                            className="h-5 w-5 text-blue-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3 w-full">
                          <h3 className="text-sm font-medium text-blue-800 mb-2">
                            Thông tin chuyển khoản
                          </h3>
                          <div className="text-sm text-blue-700 space-y-2 grid grid-cols-[1fr,auto] gap-x-2">
                            <span className="self-center">Ngân hàng:</span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[100px] overflow-hidden inline-block align-middle">
                                ACB Bank
                              </span>
                              <button
                                onClick={() => handleCopyClick('ACB Bank')}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Số tài khoản:</span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[100px] overflow-hidden inline-block align-middle">
                                20478471
                              </span>
                              <button
                                onClick={() => handleCopyClick('20478471')}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Chủ tài khoản:</span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[160px] overflow-hidden inline-block align-middle">
                                CÔNG TY TNHH AKADS
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyClick('CÔNG TY TNHH AKADS')
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Nội dung CK:</span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[100px] overflow-hidden inline-block align-middle">
                                {shortCode}
                              </span>
                              <button
                                onClick={() => handleCopyClick(shortCode)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Số tiền:</span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[160px] overflow-hidden inline-block align-middle">
                                {(customAmount
                                  ? parseInt(customAmount)
                                  : selectedAmount
                                ).toLocaleString('vi-VN')}{' '}
                                VNĐ
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyClick(
                                    `${
                                      customAmount
                                        ? parseInt(customAmount)
                                        : selectedAmount
                                    }`
                                  )
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        fullWidth
                        onClick={handleDeposit}
                        isLoading={isLoading}
                        disabled={
                          isLoading ||
                          !customAmount ||
                          parseInt(customAmount) < 50000 ||
                          parseInt(customAmount) % 1000 !== 0
                        }
                        className={
                          !customAmount ||
                          parseInt(customAmount) < 50000 ||
                          parseInt(customAmount) % 1000 !== 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : ''
                        }
                        title={
                          !customAmount ||
                          parseInt(customAmount) < 50000 ||
                          parseInt(customAmount) % 1000 !== 0
                            ? 'Số tiền phải từ 50.000 VNĐ trở lên'
                            : ''
                        }
                      >
                        Tạo lệnh nạp tiền
                      </Button>
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Sau khi chuyển khoản, hệ thống sẽ tự động cộng tiền vào
                        tài khoản của bạn trong vòng 5 phút.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>
                    {showQRCode ? 'Mã QR' : 'Hướng dẫn nạp tiền'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {isShowingQR ? (
                    <div className="flex justify-center items-center w-full h-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                      <div className="flex flex-col items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-transparent mb-3"></div>
                        <p>Đang tạo mã QR, vui lòng chờ...</p>
                      </div>
                    </div>
                  ) : showQRCode ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="flex flex-col items-center text-sm text-gray-700 space-y-6 text-center">
                        {qrImageUrl && (
                          <img
                            src={qrImageUrl}
                            alt="Mã QR chuyển khoản"
                            className="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-auto rounded shadow"
                          />
                        )}
                        {/* <Button
                          onClick={handleConfirmTransfer}
                          className="mt-4"
                        >
                          Đã thanh toán
                        </Button> */}
                        <div className="space-y-1">
                          <p className="text-sm text-red-500 font-semibold">
                            Mã QR sẽ hết hạn sau: {Math.floor(countdown / 60)}:
                            {(countdown % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            1
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Chọn số tiền cần nạp
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Chọn một trong các mệnh giá có sẵn hoặc nhập số tiền
                            tùy chọn (tối thiểu 50.000đ).
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            2
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Tạo lệnh nạp tiền
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Nhấn nút "Tạo lệnh nạp tiền" để hệ thống tạo một mã
                            giao dịch duy nhất.
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            3
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Chuyển khoản ngân hàng
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Thực hiện chuyển khoản theo thông tin được cung cấp.
                            Lưu ý nhập đúng nội dung chuyển khoản.
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            4
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Nhận tiền tự động
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Hệ thống sẽ tự động cộng tiền vào tài khoản của bạn
                            sau khi nhận được thanh toán (thường trong vòng 5
                            phút).
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <Button
                          onClick={() => setIsCurrencyModalOpen(true)}
                          className="mt-6 w-full py-3 rounded-md text-lg font-semibold text-white bg-orange-400 hover:bg-orange-600 transition"
                        >
                          Thay đổi phương thức thanh toán
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'deposit' && currencyTab === 'USD' && (
            <div className="grid grid-cols-10 gap-6">
              <div className="col-span-4 p-8 rounded-lg shadow-lg text-center w-full border border-blue-100 h-full flex flex-col justify-center bg-gradient-to-br from-blue-100 to-white">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal Logo"
                    className="h-10 w-auto"
                  />
                  <h3 className="text-2xl font-bold text-yellow-400 ml-3">
                    Send Money Securely Online with{' '}
                    <span className="italic">
                      <span className="text-blue-900">Pay</span>
                      <span className="text-blue-400">Pal</span>
                    </span>
                  </h3>
                </div>

                <p className="text-gray-700 mb-6 text-sm">
                  Please enter the amount (USD) you wish to deposit (minimum
                  $10), then click the button below to proceed with PayPal
                  payment.
                </p>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount (USD)"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 text-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-500
                      [appearance:textfield] 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">
                      $
                    </span>
                  </div>
                  {customAmount && parseFloat(customAmount) < 10 && (
                    <p className="text-red-500 text-sm mt-2">
                      Minimum amount is $10.
                    </p>
                  )}
                </div>

                <Button
                  className={`w-full py-3 rounded-md text-lg font-semibold text-black transition 
                  ${
                    isRedirecting ||
                    !customAmount ||
                    parseFloat(customAmount) < 10
                      ? '!bg-yellow-200 !cursor-not-allowed'
                      : 'bg-yellow-400 hover:bg-yellow-500'
                  }`}
                  disabled={
                    isRedirecting ||
                    !customAmount ||
                    parseFloat(customAmount) < 10
                  }
                  onClick={async () => {
                    if (
                      !customAmount ||
                      parseFloat(customAmount) < 10 ||
                      isRedirecting
                    )
                      return;

                    setIsRedirecting(true);

                    try {
                      const res = await axios.post(
                        `${BaseUrlSocket}paypal/payment`,
                        {
                          amount: String(customAmount),
                          user_id: user?.id,
                        }
                      );

                      if (res?.data?.data?.approvalLink) {
                        window.open(res.data.data.approvalLink, '_blank');
                      } else {
                        addNotification(
                          'Lỗi',
                          'Có lỗi xảy ra trong quá trình thanh toán PayPal, vui lòng thử lại !',
                          'error'
                        );
                      }
                    } catch (err) {
                      console.error(err);
                      addNotification(
                        'Lỗi',
                        'Không thể tạo phiên thanh toán PayPal.',
                        'error'
                      );
                    } finally {
                      setIsRedirecting(false);
                    }
                  }}
                >
                  Pay with{' '}
                  <span className="text-blue-900 font-extrabold italic ml-1">
                    Pay
                  </span>
                  <span className="text-blue-400 font-extrabold italic">
                    Pal
                  </span>
                </Button>

                <p className="text-xs text-red-500 mt-5">
                  After completing the payment, please check your account to
                  verify the transaction.
                </p>
              </div>

              <Card className="col-span-6 h-full mb-2">
                <CardContent className="py-4 h-full flex flex-col justify-start">
                  <h2 className="text-xl text-blue-900 font-bold mb-3">
                    How to Pay?
                  </h2>
                  <ol className="list-decimal list-inside space-y-2 text-base text-gray-600">
                    <li>Enter the amount you want to deposit (minimum $10).</li>
                    <li>
                      Click the <strong>Pay with PayPal</strong> button to open
                      the payment page.
                    </li>
                    <li>
                      Log in to your PayPal account and confirm the payment.
                    </li>
                    <li>
                      Wait a few minutes for the system to verify and credit
                      your account.
                    </li>
                    <li>
                      If you have any questions or issues during the payment
                      process, please contact us for assistance.
                    </li>
                    <div className="flex">
                      <Button
                        onClick={() => setIsCurrencyModalOpen(true)}
                        className="mt-6 w-full py-3 rounded-md text-lg font-semibold text-white bg-orange-400 hover:bg-orange-600 transition"
                      >
                        Change Payment Method
                      </Button>
                    </div>
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      {paymentStatus && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            {paymentStatus === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-700 text-sm">
                  Vui lòng chờ một chút để hệ thống xác nhận thanh toán...
                </p>
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thanh toán thành công!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Vui lòng chờ trong giây lát để cộng điểm!!
                </p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thanh toán thất bại!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Không nhận được xác nhận thanh toán. Vui lòng thử lại sau.
                </p>
                <button
                  onClick={() => {
                    setPaymentStatus(null);
                    setShowQRCode(false);
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentPage;
