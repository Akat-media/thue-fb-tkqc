import type React from 'react';
import {
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
import { usePreventScroll } from '../../hook/usePreventScroll';
import url3 from '../../assets/Badge.svg';
import urlChi from '../../assets/Tienchi.svg';
import urlGioi from '../../assets/Gioihan.svg';
import urlMuc from '../../assets/Hanmuc.svg';
import urlTra from '../../assets/Tiencantra.svg';
import urlVND from '../../assets/VND.svg';
interface ModalProps {
  isOpen: boolean;
  setIsAdDetailOpen: (open: boolean) => void;
  selectedAdAccountDetail: any;
  fieldNameMap: any;
  onRentClick?: (account: any) => void;
}

const CardDetailModal: React.FC<ModalProps> = ({
  isOpen,
  setIsAdDetailOpen,
  selectedAdAccountDetail,
  fieldNameMap,
  onRentClick,
}) => {
  const { t } = useTranslation();
  usePreventScroll(isOpen);

  return (
    <div
      onClick={() => setIsAdDetailOpen(false)}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cyan-50 rounded-xl shadow-2xl w-[90%] max-w-[1100px] relative max-h-[80vh] lg:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-cyan-50 px-6 py-4 text-slate-700 relative">
          <button
            className="absolute top-4 right-4 text-slate-700 hover:text-slate-500 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 hover:bg-opacity-50 transition-all"
            onClick={() => setIsAdDetailOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg lg:text-2xl font-medium text-gray-500 flex items-center gap-3">
            {t('cardDetailModal.title')}
          </h2>
          <p className="mt-1 text-3xl font-semibold text-[#030e0e] flex items-center gap-2">
            <span>{selectedAdAccountDetail?.name || '—'}</span>
            <img src={url3} alt="url3" className="w-8 h-8 object-contain" />
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] lg:max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between h-full">
              {/* Thông tin cơ bản */}
              <div className="bg-white rounded-lg p-5 shadow-sm flex-[0.45]">
                <h3 className="text-2xl font-semibold text-slate-600 mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-slate-500" />
                  {t('cardDetailModal.basicInfo')}
                </h3>
                <div className="space-y-3">
                  {[
                    'account_id',
                    'type',
                    'account_status',
                    'active',
                    'owner',
                  ].map((field) => {
                    const value = selectedAdAccountDetail[field];
                    let displayValue = '—';

                    if (value !== undefined && value !== null) {
                      if (field === 'account_status') {
                        displayValue =
                          value === 1
                            ? t('cardDetailModal.accountStatus.active')
                            : t('cardDetailModal.accountStatus.inactive');
                      } else if (field === 'active') {
                        displayValue = value
                          ? t('cardDetailModal.yes')
                          : t('cardDetailModal.no');
                      } else if (field === 'status_rented') {
                        displayValue = t(`adAccountCard.${value}`, {
                          defaultValue: value,
                        });
                      } else {
                        displayValue = String(value);
                      }
                    }

                    return (
                      <div
                        key={field}
                        className="flex justify-between items-center"
                      >
                        <span className="text-base text-slate-500">
                          {fieldNameMap[field] || field}
                        </span>
                        <span className="text-base font-semibold text-slate-700">
                          {field === 'account_id' ? (
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded text-base">
                              {displayValue}
                            </span>
                          ) : field === 'type' ? (
                            <span className="text-blue-900 font-bold">
                              {t('cardDetailModal.accountTypeBusiness')}
                            </span>
                          ) : field === 'account_status' ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium gap-1 ${
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
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium gap-1 ${
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
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin bổ sung */}
              <div className="bg-white rounded-lg p-5 shadow-sm mt-auto flex-[0.45]">
                <h3 className="text-2xl font-semibold text-slate-600 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-slate-500" />
                  {t('cardDetailModal.additionalInfo')}
                </h3>
                <div className="space-y-3">
                  {[
                    'end_advertiser_name',
                    'status_rented',
                    'currency',
                    'note_aka',
                  ].map((field) => {
                    const value = selectedAdAccountDetail[field];
                    let displayValue = '—';
                    if (value !== undefined && value !== null) {
                      if (field === 'status_rented') {
                        displayValue = t(`adAccountCard.${value}`, {
                          defaultValue: value,
                        });
                      } else {
                        displayValue = String(value);
                      }
                    }
                    return (
                      <div
                        key={field}
                        className="flex justify-between items-center"
                      >
                        <span className="text-base text-slate-500">
                          {fieldNameMap[field] || field}
                        </span>
                        <span className="text-lg font-semibold text-slate-700">
                          {field === 'currency' ? (
                            <span className="bg-sky-50 text-sky-600 px-5 py-1 rounded-full text-base font-mono">
                              {displayValue}
                            </span>
                          ) : field === 'status_rented' ? (
                            <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-base">
                              {displayValue}
                            </span>
                          ) : (
                            displayValue
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Thông tin tài chính */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-gray-500" />
                {t('cardDetailModal.financialInfo')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['amount_spent', 'balance', 'spend_cap', 'spend_limit'].map(
                  (field) => {
                    const value = selectedAdAccountDetail[field];
                    const formattedValue =
                      !isNaN(Number(value)) && value !== null
                        ? `${Number(value).toLocaleString('vi-VN')} VNĐ`
                        : '—';

                    const getCardConfig = (field: string) => {
                      switch (field) {
                        case 'amount_spent':
                          return {
                            icon: (
                              <img
                                src={urlChi}
                                alt="icon"
                                className="w-10 h-10 object-contain"
                              />
                            ),
                          };
                        case 'balance':
                          return {
                            icon: (
                              <img
                                src={urlTra}
                                alt="icon"
                                className="w-10 h-10 object-contain"
                              />
                            ),
                          };
                        case 'spend_cap':
                          return {
                            icon: (
                              <img
                                src={urlGioi}
                                alt="icon"
                                className="w-10 h-10 object-contain"
                              />
                            ),
                          };
                        case 'spend_limit':
                          return {
                            icon: (
                              <img
                                src={urlMuc}
                                alt="icon"
                                className="w-10 h-10 object-contain"
                              />
                            ),
                          };
                        default:
                          return {
                            icon: (
                              <img
                                src={urlChi}
                                alt="icon"
                                className="w-10 h-10 object-contain"
                              />
                            ),
                          };
                      }
                    };

                    const config = getCardConfig(field);

                    return (
                      <div
                        key={field}
                        className="bg-white rounded-xl border border-gray-300 p-4 sm:p-6 min-h-[120px] flex flex-col justify-between shadow-sm"
                      >
                        <div className="flex flex-col items-start gap-2 mb-4">
                          <div className="p-2 bg-cyan-50 rounded-full">
                            {config.icon}
                          </div>
                          <p className="text-base text-slate-500">
                            {fieldNameMap[field] || field}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-slate-700">
                          {field === 'spend_cap' && value === 0
                            ? t('cardDetailModal.noLimit')
                            : formattedValue}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
              {/* <div className="mt-8 text-center">
                <button
                  onClick={() => onRentClick?.(selectedAdAccountDetail)}
                  className="bg-[#193250] text-cyan-300 px-6 py-2 rounded-full font-semibold hover:bg-[#1f259ca9] transition-all w-full sm:w-auto"
                >
                  {t('cardDetailModal.rentNow') || 'Thuê ngay'}
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
