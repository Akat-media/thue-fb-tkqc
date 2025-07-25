import React from 'react';
import url from '../../assets/Badge.svg';
import { Clock, AlertTriangle, Check, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface AccountCardProps {
  data: any;
  onClick?: () => void;
  hanleCancel?: () => void;
}
type StatusKey = 'process' | 'success' | 'faild' | 'complete_remove';

function formatCurrency(value?: number | string): string {
  if (value === null || value === undefined || value === '') return '';

  const str = value.toString();
  const isNegative = str.startsWith('-');
  const numeric = str.replace(/[^\d]/g, '');
  const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return isNegative ? '-' + formatted : formatted;
}
const AccountCard: React.FC<AccountCardProps> = ({
  data,
  onClick,
  hanleCancel,
}) => {
  const navigate = useNavigate();
  const { bm_id, status, ad_account, start_date, end_date } = data;
  const { name, spend_limit, amount_spent } = ad_account;
  const isProcessing = status === 'Đang xử lý';
  const statusConfig: Record<
    StatusKey,
    { label: string; color: string; icon: React.ReactNode; bgColor?: string }
  > = {
    process: {
      label: 'Đang xử lý',
      color: 'text-[#F79009] bg-[#FEF0C7]',
      icon: <Clock />,
      bgColor: 'border-[#F79009]',
    },
    success: {
      label: 'Thành công',
      color: 'text-[#12B76A] bg-[#D1FADF]',
      icon: <Check />,
      bgColor: 'border-[#12B76A]',
    },
    faild: {
      label: 'Thất bại',
      color: 'text-[#F04438] bg-[#FEE4E2]',
      icon: <AlertTriangle />,
      bgColor: 'border-[#F04438]',
    },
    complete_remove: {
      label: 'Đã thuê',
      color: 'text-[#9E77ED] bg-[#F4EBFF]',
      icon: <Lock />,
      bgColor: 'border-[#9E77ED]',
    },
  };
  const safeStatus = status as StatusKey;

  return (
    <div
      className={`rounded-[16px] border p-5 bg-white shadow-sm w-full  ${
        isProcessing ? 'border-orange-300 bg-[#fff9f4]' : 'border-[#e8d9fb]'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-[28px] font-semibold text-[#111827]">
          {name}
          <img src={url} alt="url" />
        </div>

        <div
          className={`text-xs font-medium rounded-full px-2 py-2 flex items-center gap-1 ${
            status ? statusConfig[safeStatus]?.color : ''
          }`}
        >
          {statusConfig[safeStatus]?.icon} {statusConfig[safeStatus]?.label}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p className="flex justify-between mb-2 text-[16px]">
          <span className="font-medium text-gray-600">BM ID:</span>
          <span>{bm_id}</span>
        </p>
        <p className="flex justify-between mb-2 text-[16px]">
          <span className="font-medium text-gray-600">
            {'Thời gian bắt đầu thuê'}:
          </span>
          <span>{start_date}</span>
        </p>
        <p className="flex justify-between mb-2 text-[16px]">
          <span className="font-medium text-gray-600">
            {'Thời gian kết thúc thuê'}:
          </span>
          <span>{end_date}</span>
        </p>
        <p className="flex justify-between mb-3 text-[16px]">
          <span className="font-medium text-gray-600">Giới hạn chi tiêu:</span>
          <span>{spend_limit ? formatCurrency(spend_limit) : ''}</span>
        </p>
      </div>

      <div className="flex justify-between mt-4 text-center">
        <div
          className={`w-[48%] border-[1.5px] ${
            status ? statusConfig[safeStatus]?.bgColor : ''
          } rounded-[16px] p-2.5 text-sm 
        font-semibold text-[#4B5563] border-t-0 `}
        >
          <p className="font-medium text-gray-400 mb-1 text-[16px]">
            Số tiền chi tiêu
          </p>
          <p className={`${status ? statusConfig[safeStatus]?.bgColor : ''}`}>
            {formatCurrency(amount_spent)} VNĐ
          </p>
        </div>
        <div
          className={`w-[48%] border-[1.5px] ${
            status ? statusConfig[safeStatus]?.bgColor : ''
          } rounded-[16px] p-2.5 text-sm 
        font-semibold text-[#4B5563] border-t-0 `}
        >
          <p className=" font-medium text-gray-400 mb-1 text-[16px]">Số dư</p>
          <p>
            {formatCurrency(Number(spend_limit) - Number(amount_spent))} VNĐ
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center gap-3">
        <>
          {status === 'success' && (
            <button
              onClick={hanleCancel}
              className="flex-1 border border-[#10b981] text-[#10b981] 
          rounded-full px-3 py-3 text-sm font-medium hover:bg-[#f0fdf4] transition"
            >
              Hủy tài khoản thuê
            </button>
          )}
          <button
            onClick={() => navigate('/support')}
            className="flex-1 bg-[#111827] text-white rounded-full 
          px-3 py-3 text-sm font-medium hover:bg-[#1f2937] transition"
          >
            Liên hệ Hỗ trợ
          </button>
        </>
      </div>
    </div>
  );
};

export default AccountCard;
