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

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedAmount, setSelectedAmount] = useState(500000);
  const [customAmount, setCustomAmount] = useState<string>('500000');
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
  const [currencyTab, setCurrencyTab] = useState<'VND' | 'USD' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
    if (isNaN(amount) || amount <= 0) {
      addNotification(
        t('paymentPage.error'),
        t('paymentPage.enterValidAmount'),
        'error'
      );
      return;
    }
    const shortCode = await hanleCalTransaction(amount);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addNotification(
        t('paymentPage.depositSuccess'),
        t('paymentPage.pleaseTransfer'),
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
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
          <div
            ref={innerBorderRef}
            className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm relative"
          >
            <button
              onClick={() => setIsCurrencyModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
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
                      Coming soon...
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
                      Coming soon...
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
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    {t('paymentPage.depositToSystem')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="col-span-2 sm:col-span-3">
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t('paymentPage.enterAmount')} 👇
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
                            placeholder={t('paymentPage.enterAmount')}
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
                              {t('paymentPage.amountValidation')}
                            </p>
                          )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t('paymentPage.selectDenomination')}
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
                            hover:bg-blue-50 hover:border-blue-300 transition-colors`}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount(amount.toString());
                              setShowQRCode(false);
                            }}
                          >
                            {amount.toLocaleString('vi-VN')} VNĐ
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
                            {t('paymentPage.transferInfo')}
                          </h3>
                          <div className="text-sm text-blue-700 space-y-2 grid grid-cols-[1fr,auto] gap-x-2">
                            <span className="self-center">
                              {t('paymentPage.bank')}:
                            </span>
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

                            <span className="self-center">
                              {t('paymentPage.accountNumber')}:
                            </span>
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

                            <span className="self-center">
                              {t('paymentPage.accountName')}:
                            </span>
                            <div className="flex justify-end items-center min-w-0">
                              <span className="font-medium truncate max-w-[100px] overflow-hidden inline-block align-middle">
                                Duy Nam
                              </span>
                              <button
                                onClick={() => handleCopyClick('Duy Nam')}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">
                              {t('paymentPage.transferContent')}:
                            </span>
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

                            <span className="self-center">
                              {t('paymentPage.amount')}:
                            </span>
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
                            ? t('paymentPage.amountMustBeAtLeast')
                            : ''
                        }
                      >
                        {t('paymentPage.createDepositOrder')}
                      </Button>
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        {t('paymentPage.automaticDepositNote')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    {showQRCode
                      ? t('paymentPage.qrCode')
                      : t('paymentPage.depositInstructions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  {isShowingQR ? (
                    <div className="flex justify-center items-center w-full h-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                      <div className="flex flex-col items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-transparent mb-3"></div>
                        <p>{t('paymentPage.generatingQR')}</p>
                      </div>
                    </div>
                  ) : showQRCode ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="flex flex-col items-center text-sm text-gray-700 space-y-6 text-center">
                        {qrImageUrl && (
                          <img
                            src={qrImageUrl}
                            alt="QR Code"
                            className="w-64 h-64 object-contain border p-2 rounded-lg shadow-sm"
                          />
                        )}
                        <p className="text-sm text-gray-600 max-w-xs">
                          {t('paymentPage.scanQRInstructions')}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-red-500 font-semibold">
                            {t('paymentPage.qrExpires')}:{' '}
                            {Math.floor(countdown / 60)}:
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
                            {t('paymentPage.step1Title')}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {t('paymentPage.step1Description')}
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
                            {t('paymentPage.step2Title')}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {t('paymentPage.step2Description')}
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
                            {t('paymentPage.step3Title')}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {t('paymentPage.step3Description')}
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
                            {t('paymentPage.step4Title')}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {t('paymentPage.step4Description')}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <Button
                          onClick={() => setIsCurrencyModalOpen(true)}
                          className="mt-6 w-full py-3 rounded-md text-lg font-semibold text-white bg-orange-400 hover:bg-orange-600 transition"
                        >
                          {t('paymentPage.changePaymentMethod')}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
