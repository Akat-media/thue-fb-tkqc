'use client';

import type React from 'react';
import {
  User,
  CreditCard,
  Wallet,
  FileText,
  X,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  setIsAdDetailOpen: (open: boolean) => void;
  selectedAdAccountDetail: any;
  fieldNameMap: any;
}

const CardDetailModal: React.FC<ModalProps> = ({
  isOpen,
  setIsAdDetailOpen,
  selectedAdAccountDetail,
  fieldNameMap,
}) => {
  const { t } = useTranslation();

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      onClick={() => setIsAdDetailOpen(false)}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[800px] relative max-h-[80vh] lg:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#fff] px-6 py-4 text-slate-700 relative">
          <button
            className="absolute top-4 right-4 text-slate-700 hover:text-slate-500 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 hover:bg-opacity-50 transition-all"
            onClick={() => setIsAdDetailOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl lg:text-2xl  font-bold flex items-center gap-3">
            <User className="w-6 h-6" />
            {t('cardDetailModal.title')}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] lg:max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div
              style={{ boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px' }}
              className="bg-[#F1F2F5] border-l-4 border-slate-200 rounded-lg p-5"
            >
              <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-500" />
                {t('cardDetailModal.basicInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['account_id', 'name', 'account_status', 'active'].map(
                  (field) => {
                    const value = selectedAdAccountDetail[field];
                    let displayValue = String(value ?? '—');

                    if (field === 'account_status') {
                      displayValue =
                        value === 1
                          ? t('cardDetailModal.accountStatus.active')
                          : t('cardDetailModal.accountStatus.inactive');
                    } else if (field === 'active') {
                      displayValue = value
                        ? t('cardDetailModal.yes')
                        : t('cardDetailModal.no');
                    }

                    return (
                      <div
                        key={field}
                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-100"
                      >
                        <p className="text-sm font-medium text-slate-500 mb-1">
                          {fieldNameMap[field] || field}
                        </p>
                        <p className="text-lg font-semibold text-slate-600">
                          {field === 'account_id' ? (
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                              {displayValue}
                            </span>
                          ) : field === 'account_status' ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${
                                value === 1
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {value === 1 ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {displayValue}
                            </span>
                          ) : field === 'active' ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${
                                value
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-rose-50 text-rose-600'
                              }`}
                            >
                              {value ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {displayValue}
                            </span>
                          ) : (
                            displayValue
                          )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Financial Information Card */}
            <div
              style={{ boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px' }}
              className="bg-gradient-to-r from-white to-emerald-25 border-l-4 border-emerald-200 rounded-lg p-5 "
            >
              <h3 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" />
                {t('cardDetailModal.financialInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['amount_spent', 'balance', 'spend_cap', 'spend_limit'].map(
                  (field) => {
                    const value = selectedAdAccountDetail[field];
                    const formattedValue =
                      !isNaN(Number(value)) && value !== null
                        ? `${Number(value).toLocaleString('vi-VN')} VNĐ`
                        : '—';

                    const getCardConfig = (field: any) => {
                      switch (field) {
                        case 'amount_spent':
                          return {
                            gradient: 'from-sky-200 to-sky-300',
                            icon: <TrendingUp className="w-4 h-4" />,
                          };
                        case 'balance':
                          return {
                            gradient: 'from-emerald-200 to-emerald-300',
                            icon: <DollarSign className="w-4 h-4" />,
                          };
                        case 'spend_cap':
                          return {
                            gradient: 'from-violet-200 to-violet-300',
                            icon: <Shield className="w-4 h-4" />,
                          };
                        case 'spend_limit':
                          return {
                            gradient: 'from-amber-200 to-amber-300',
                            icon: <AlertTriangle className="w-4 h-4" />,
                          };
                        default:
                          return {
                            gradient: 'from-slate-400 to-slate-500',
                            icon: <DollarSign className="w-4 h-4" />,
                          };
                      }
                    };

                    const config = getCardConfig(field);

                    return (
                      <div
                        key={field}
                        className={`bg-gradient-to-r ${config.gradient} p-4 rounded-lg text-slate-700 shadow-sm`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {config.icon}
                          <p className="text-sm font-medium opacity-90">
                            {fieldNameMap[field] || field}
                          </p>
                        </div>
                        <p className="text-xl font-bold">
                          {field === 'spend_cap' && value === 0
                            ? t('cardDetailModal.noLimit')
                            : formattedValue}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Additional Information Card */}
            <div
              style={{ boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px' }}
              className="bg-gradient-to-r from-white to-slate-25 border-l-4 border-slate-200 rounded-lg p-5"
            >
              <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                {t('cardDetailModal.additionalInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['currency', 'end_advertiser_name', 'status_rented', 'note_aka'].map(
                  (field) => {
                    const value = selectedAdAccountDetail[field];
                    const displayValue = String(value ?? '—');

                    return (
                      <div
                        key={field}
                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-100"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">
                            {fieldNameMap[field] || field}
                          </span>
                          <span className="text-sm font-semibold text-slate-600">
                            {field === 'currency' ? (
                              <span className="bg-sky-50 text-sky-600 px-2 py-1 rounded-full text-xs font-mono">
                                {displayValue}
                              </span>
                            ) : field === 'status_rented' ? (
                              <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs">
                                {displayValue}
                              </span>
                            ) : (
                              displayValue
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
