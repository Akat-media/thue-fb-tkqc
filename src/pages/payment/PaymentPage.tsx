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
import { useOnOutsideClick } from '../../hook/useOutside';
import { useTranslation } from 'react-i18next';
import PaymentDropdown from './PaymentDropdown';
import Deposit from "./Deposit.tsx";
import DepositCard from './DepositCard.tsx';
import {toast} from "react-toastify";

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedAmount, setSelectedAmount] = useState(1000000);
  const [customAmount, setCustomAmount] = useState<string>('1000000');
  const [isLoading, setIsLoading] = useState(false);
  const userStore = useUserStore((state) => state.user);
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
  const [currencyTab, setCurrencyTab] = useState<'VND' | 'USD' | null>('VND');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedOption, setSelectedOption] = useState('VND');
  const [showInfo, setShowInfo] = useState(false);
  const handleChange = (event:any) => {
    setSelectedOption(event.target.value);
    setCurrencyTab(event.target.value)
  };

  const { innerBorderRef } = useOnOutsideClick(() => {
    setIsCurrencyModalOpen(false);
  });

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
      t('paymentPage.copied'),
      t('paymentPage.copiedToClipboard'),
      'success'
    );
  };

  const handleDeposit = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (isNaN(amount) || amount <= 0 || amount % 1000000 !== 0) {
      // toast.error(t('paymentPage.enterValidAmount'))
      return;
    }
    const shortCode = await hanleCalTransaction(amount);
    setIsLoading(true);
    setShowInfo(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addNotification(
        t('paymentPage.depositSuccess'),
        t('paymentPage.pleaseTransfer'),
        'success'
      );
      setIsShowingQR(true);
      const qrUrl = `https://apiqr.web2m.com/api/generate/ACB/21280151/bich%20ngoc?amount=${amount}&memo=${shortCode}&is_mask=1&bg=1`;
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
        t('paymentPage.errorOccurred'),
        t('paymentPage.cannotCreateDeposit'),
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
    <div className="container mx-auto">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

          .font-mona {
            font-family: 'Mona Sans', sans-serif;
          }
        `}
      </style>
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center ">
          <div
            ref={innerBorderRef}
            className="flex flex-col bg-[#F5FAFF] rounded-xl p-6 shadow-2xl w-full max-w-max sm:max-w-[452px] relative"
          >
            <button
              onClick={() => setIsCurrencyModalOpen(false)}
              className="flex justify-end text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="font-mona text-[24px] leading-[33.6px] font-semibold text-[#6B7280] text-center">
              {t('payment_method.title')}
            </h2>

            <div className="my-[32px] max-w-[289px] w-full mx-auto">
              <div className="flex flex-row justify-between mb-[36px]">
                <label className="flex items-center">
                  <input
                      type="radio"
                      name="money"
                      value="VND"
                      checked={selectedOption === 'VND'}
                      onChange={handleChange}
                      className="mr-2"
                  />
                  <span className="font-mona text-[18px] font-medium leading-[25.2px] text-[#6E7382]">VNĐ</span>
                </label>

                <label className="flex items-center">
                  <input
                      type="radio"
                      name="money"
                      value="USD"
                      checked={selectedOption === 'USD'}
                      onChange={handleChange}
                      className="mr-2"
                      disabled
                  />
                  <span className="font-mona text-[18px] font-medium leading-[25.2px] text-[#6E7382]">USD</span>
                </label>
              </div>

              <PaymentDropdown />
            </div>

            <div className="mx-auto">
              <button
                  className="bg-[#193250] border rounded-full w-[200px] h-[64px]"
                  onClick={() => {
                    setIsCurrencyModalOpen(false);
                    setActiveTab('deposit');
                  }}
              >
                <span className="text-cyan-300 font-mona font-semibold text-[20px]">{t('paymentPage.confirm')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
            {t('paymentPage.paymentGateway')}
          </h2>

          {user && (
            <div className="mt-1 text-base text-gray-500">
              <p>
                {t('paymentPage.currentBalance')}:{' '}
                <span className="font-medium text-green-700">
                  {user.points?.toLocaleString('vi-VN') || 0}{' '}
                  {t('paymentPage.points')}
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
              <option value="deposit">{t('paymentPage.deposit')}</option>
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
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-[16px]`}
                  onClick={() => setActiveTab('deposit')}
                >
                  <CreditCard className="h-5 w-5 mr-2 inline-block" />
                  {t('paymentPage.deposit')}
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'deposit' && currencyTab === 'VND' && (
              <DepositCard
                  handleDeposit={handleDeposit}
                  showInfo={showInfo}
                  backInfo={()=>setShowInfo(false)}
                  customAmount={customAmount}
                  setCustomAmount={setCustomAmount}
                  qrImageUrl = {qrImageUrl}
                  countdown = {countdown}
              />
          )}

          {activeTab === 'deposit' && currencyTab === 'USD' && (
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6">
              <div className="md:col-span-4 p-4 md:p-8 rounded-lg shadow-lg text-center w-full border border-blue-100 h-full flex flex-col justify-center bg-gradient-to-br from-blue-100 to-white">
                <div className="flex flex-col md:flex-row items-center justify-center mb-4 gap-2 md:gap-4">
                  <img
                    src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal Logo"
                    className="h-8 md:h-10 w-auto"
                  />
                  <h3 className="text-xl md:text-2xl font-bold text-yellow-400 break-words max-w-[260px] md:max-w-[340px] lg:max-w-[400px] xl:max-w-[500px] mx-auto">
                    Send Money Securely Online with{' '}
                    <span className="italic">
                      <span className="text-blue-900">Pay</span>
                      <span className="text-blue-400">Pal</span>
                    </span>
                  </h3>
                </div>

                <p className="text-gray-700 mb-4 md:mb-6 text-xs md:text-sm">
                  Please enter the amount (USD) you wish to deposit (minimum
                  $10), then click the button below to proceed with PayPal
                  payment.
                </p>

                <div className="mb-4 md:mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount (USD)"
                      className="w-full border border-gray-300 rounded-md px-3 md:px-4 py-2 md:py-3 pr-10 text-base md:text-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-500
                      [appearance:textfield] 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base md:text-lg font-medium">
                      $
                    </span>
                  </div>
                  {customAmount && parseFloat(customAmount) < 10 && (
                    <p className="text-red-500 text-xs md:text-sm mt-2">
                      Minimum amount is $10.
                    </p>
                  )}
                </div>

                <Button
                  className={`w-full py-2 md:py-3 rounded-md text-base md:text-lg font-semibold text-black transition 
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
                          'Error',
                          'An error occurred during PayPal payment, please try again!',
                          'error'
                        );
                      }
                    } catch (err) {
                      console.error(err);
                      addNotification(
                        'Error',
                        'Unable to create PayPal payment session. Please try again!',
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

                <p className="text-xs text-red-500 mt-3 md:mt-5">
                  After completing the payment, please check your account to
                  verify the transaction.
                </p>
              </div>

              {/* How to Pay Card */}
              <Card className="md:col-span-6 h-full mb-2 mt-4 md:mt-0">
                <CardContent className="py-3 md:py-4 h-full flex flex-col justify-start">
                  <h2 className="text-lg md:text-xl text-blue-900 font-bold mb-2 md:mb-3">
                    How to Pay?
                  </h2>
                  <ol className="list-decimal list-inside space-y-1 md:space-y-2 text-sm md:text-base text-gray-600">
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
                  </ol>
                  <div className="flex">
                    <Button
                      onClick={() => setIsCurrencyModalOpen(true)}
                      className="mt-4 md:mt-6 w-full py-2 md:py-3 rounded-md text-base md:text-lg font-semibold text-white bg-orange-400 hover:bg-orange-600 transition"
                    >
                      Change Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'deposit' && !currencyTab && (
              <div className="text-center text-gray-500">
                Vui lòng chọn đơn vị tiền tệ (VND hoặc USD) để tiếp tục.
              </div>
          )}
        </div>
      </div>

      {paymentStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            {paymentStatus === 'loading' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('paymentPage.status.processing')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('paymentPage.status.pleaseWait')}
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('paymentPage.status.success')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('paymentPage.status.successMessage')}
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {t('paymentPage.status.failed')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t('paymentPage.status.failedMessage')}
                </p>
                <div className="mt-5">
                  <Button
                    onClick={() => {
                      setPaymentStatus(null);
                      setShowQRCode(false);
                    }}
                  >
                    {t('paymentPage.status.tryAgain')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
