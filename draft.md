import React, { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
Card,
CardContent,
CardFooter,
CardHeader,
CardTitle,
} from '../../components/ui/Card';
import { useNotification } from '../../context/NotificationContext';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '../../stores/useUserStore';
import FieldForm, { OptionType } from '../../components/form/FieldForm';
import { useOnOutsideClick } from '../../hook/useOutside';
import dayjs from 'dayjs';
import { VoucherData } from '../profile/Ticket';
import { format, parseISO } from 'date-fns';
import { Form, Modal, Select } from 'antd';
import styled from 'styled-components';
import { useNotificationStore } from '../../stores/notificationStore';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const visaRentSchema = z.object({
bm_id: z
.string()
.regex(/^\d+$/, 'BM ID phải là số nguyên dương')
.min(1, 'BM ID không được để trống'),

requestedLimit: z
.number({
required_error: 'Hạn mức chi tiêu là bắt buộc',
invalid_type_error: 'Hạn mức chi tiêu phải là số',
})
.min(10001, 'Hạn mức chi tiêu phải lớn hơn 10.000 VNĐ'),

currency: z.string().min(1, 'Vui lòng chọn loại tiền tệ'),
voucher_id: z.string().optional(),
bot_id: z.string().optional(),
});
const nonVisaRentSchema = z.object({
bm_id: z
.string()
.regex(/^\d+$/, 'BM ID phải là số nguyên dương')
.min(1, 'BM ID không được để trống'),

rentalRange: z
.object({
start: z.date(),
end: z.date(),
})
.refine(
({ start, end }) => {
const msPerDay = 1000 _ 60 _ 60 \* 24;
const days =
Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
return days >= 7 && days <= 31;
},
{
message: 'Thời gian thuê phải từ 7 đến 31 ngày.',
}
),

currency: z.string().min(1, 'Vui lòng chọn loại tiền tệ'),
voucher_id: z.string().optional(),
bot_id: z.string().optional(),
});
interface RentModalProps {
isOpen: boolean;
onClose: () => void;
account: any;
setSuccessRent: React.Dispatch<React.SetStateAction<any>>;
skipCardStep?: boolean;
openCardModal?: () => void;
setRentMeta?: (meta: any) => void;
rentMeta?: any;
}
const dataCurrency = [
{ id: 'vnd', name: 'VND' },
{ id: 'visa', name: 'USD' },
];
const RentModal: React.FC<RentModalProps> = (props) => {
const {
isOpen,
onClose,
account,
setSuccessRent,
skipCardStep,
openCardModal,
setRentMeta,
rentMeta,
} = props;
const objetUser = localStorage.getItem('user');
const userParse = JSON.parse(objetUser || '{}');
const [userBmId, setUserBmId] = useState('');
const [requestedLimit, setRequestedLimit] = useState<number | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [cookies, setCookies] = useState<any[]>([]);
const [selectedCookieId, setSelectedCookieId] = useState<any>('');
const [isLoadingCookies, setIsLoadingCookies] = useState(false);
const [rentalRange, setRentalRange] = useState<any>(null);
const [rentalRangeError, setRentalRangeError] = useState<string | null>(null);
const [dataVoucher, setDataVoucher] = useState<VoucherData[]>([]);
const [selectedVoucher, setSelectedVoucher] = useState('');
const [selectedCurrend, setSelectedCurrend] = useState('vnd');
const [budgetData, setBudgetData] = useState<{
amount: number;
percentage: number;
} | null>(null);

const isVisaAccount = account?.is_visa_account;
const rentSchema = z.union([visaRentSchema, nonVisaRentSchema]);

const {
register,
control,
handleSubmit,
setError,
formState: { errors },
} = useForm({
resolver: zodResolver(rentSchema),
mode: 'onChange',
defaultValues: isVisaAccount
? {
bm_id: '',
requestedLimit: 10000000,
currency: 'vnd',
voucher_id: '',
bot_id: '',
}
: {
bm_id: '',
rentalRange: {
start: new Date(),
end: new Date(),
},
currency: 'vnd',
voucher_id: '',
bot_id: '',
},
});
const { user, fetchUser } = useUserStore();

const { innerBorderRef } = useOnOutsideClick(() => {
if (isOpen) onClose();
});

const selectedVoucherData = dataVoucher.find(
(item) => item.voucher_id === selectedVoucher
);

const discountAmount = (() => {
if (!selectedVoucherData || !selectedVoucherData.voucher) return 0;
const { type, discount } = selectedVoucherData.voucher;
if (type === 'fixed') return discount;
if (type === 'percentage' && requestedLimit)
return Math.floor((requestedLimit \* discount) / 100);
return 0;
})();

// Phí dịch vụ
const serviceFee = useMemo(() => {
if (isVisaAccount) {
const limit = Number(requestedLimit || 0);
if (limit === 0) return 0;
if (limit < 500_000_000) return Math.floor(limit _ 0.04);
if (limit < 1_000_000_000) return Math.floor(limit _ 0.03);
return Math.floor(limit \* 0.02);
}

    const spendCap = Number(account?.spend_cap || 0);
    const budgetAmount = Number(budgetData?.amount || 0);
    const apiPercentage = Number(budgetData?.percentage || 0);

    if (!budgetData || !budgetAmount || typeof apiPercentage !== 'number') {
      const fallbackPercent = spendCap < 500000000 ? 0.05 : 0.04;
      return Math.floor(spendCap * fallbackPercent);
    }

    const feePercent = spendCap < 500000000 ? 0.05 : apiPercentage;

    return Math.floor(spendCap * feePercent);

}, [requestedLimit, account?.spend_cap, isVisaAccount, budgetData]);

const totalBill = useMemo(() => {
if (isVisaAccount) {
const basePrice = requestedLimit || 0;
return basePrice + serviceFee - discountAmount;
}

    return serviceFee - discountAmount;

}, [requestedLimit, serviceFee, discountAmount, isVisaAccount]);

const onSubmitValidated = async () => {
if (!isVisaAccount) {
if (!rentalRange) {
setRentalRangeError('Vui lòng chọn thời gian thuê.');
return;
}

      const { start, end } = rentalRange;
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;

      if (days < 7 || days > 31) {
        setRentalRangeError('Thời gian thuê phải từ 7 đến 31 ngày.');
        return;
      }
    }

    if (
      isVisaAccount &&
      (requestedLimit === null ||
        isNaN(requestedLimit) ||
        requestedLimit <= 10000)
    ) {
      return;
    }

    if (!isVisaAccount) {
      setRentMeta?.({
        bm_origin: account?.owner || '',
        ads_name: account?.name || '',
        bm_id: userBmId || '',
        ads_account_id: account?.account_id || '',
        amountPoint: totalBill,
        bot_id: selectedCookieId || '',
        voucher_id: selectedVoucher || '',
        start_date: [rentalRange.start],
        end_date: [rentalRange.end],
        currency: selectedCurrend,
      });
      onClose();
      openCardModal?.();
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        bm_origin: account?.owner || '',
        ads_name: account?.name || '',
        bm_id: userBmId || '',
        ads_account_id: account?.account_id || '',
        user_id: userParse.user_id || '',
        amountPoint: totalBill,
        voucher_id: selectedVoucher || '',
        bot_id: selectedCookieId || null,
        // bot_id: "b7e55204-8952-4258-9a79-6425f2bbfe33",
        currency: selectedCurrend,
      };

      const response = await BaseHeader({
        url: 'points-used',
        method: 'post',
        data: payload,
      });

      if (response.status === 200 && response.data.success) {
        setSuccessRent(response.data.message);
        // await handleAddNotification({
        //   user_id: userParse.user_id || '',
        //   title: `Bạn đã thuê thành công tài khoản ${account?.name}`,
        //   content: 'Tài khoản đã thuê thành công hãy khám phá các tính năng',
        //   type: 'success',
        // });
        // await fetchNotifications(userParse.user_id || '');
        onClose();
        // toast.success('Thuê tài khoản thành công!');
      } else {
        toast.error(response.data.message || 'Không thể thuê tài khoản.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lỗi khi thuê tài khoản.');
    } finally {
      setIsLoading(false);
    }

};

useEffect(() => {
const fetchBudget = async () => {
try {
const res = await BaseHeader({
method: 'get',
url: 'budget',
});
const data = res?.data;
if (
data &&
typeof data.amount === 'number' &&
typeof data.percentage === 'number'
) {
setBudgetData({ amount: data.amount, percentage: data.percentage });
}
} catch (error) {
console.error('Lỗi khi gọi API ngân sách:', error);
}
};

    if (isOpen) {
      fetchCookies();
      fetchData();
      fetchUser();
      if (!isVisaAccount) {
        fetchBudget();
      }

      if (
        typeof rentMeta === 'object' &&
        rentMeta?.rentalRange &&
        Array.isArray(rentMeta.rentalRange) &&
        rentMeta.rentalRange.length === 2
      ) {
        const [startRaw, endRaw] = rentMeta.rentalRange;
        const start = dayjs(startRaw);
        const end = dayjs(endRaw);

        if (start.isValid() && end.isValid()) {
          setRentalRange([start.toDate(), end.toDate()]);
          setRentalRangeError(null);
        }
      }
    } else {
      setUserBmId('');
      setSelectedVoucher('');
      setRequestedLimit(null);
    }

}, [isOpen, isVisaAccount]);

useEffect(() => {
if (isOpen) {
// Chặn scroll khi modal mở
document.body.style.overflow = 'hidden';
document.body.style.paddingRight = '15px'; // Bù trừ scrollbar width
} else {
// Khôi phục scroll khi modal đóng
document.body.style.overflow = 'unset';
document.body.style.paddingRight = '0px';
}

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };

}, [isOpen]);

const fetchCookies = async () => {
try {
setIsLoadingCookies(true);
const response = await BaseHeader({
method: 'get',
url: 'cookies',
params: {},
});
setCookies(response.data.data || []);
setSelectedCookieId(response.data.data?.[0]?.id);
} catch (error) {
console.error('Error fetching cookies:', error);
} finally {
setIsLoadingCookies(false);
}
};
const fetchData = async () => {
const userId = JSON.parse(localStorage.getItem('user') || '').user_id;
try {
const respone = await BaseHeader({
method: 'get',
url: `my-vouchers?user_id=${userId}`,
});
setDataVoucher(respone.data.data);
} catch (error: any) {
console.log('error', error);
}
};
const isValidBmId = /^[0-9]+$/.test(userBmId) && userBmId.trim() !== '';
const isValidLimit =
requestedLimit !== null &&
Number.isInteger(requestedLimit) &&
requestedLimit > 10000;
const isValid = isValidBmId && isValidLimit;
const isValidRentalRange = rentalRange !== null && rentalRangeError === null;
const isVoucherExpired = (expiresAt: string) => {
const currentTime = new Date();
const expiryTime = new Date(expiresAt);
return expiryTime < currentTime;
};

const handleOk = () => {
onClose();
};

const handleCancel = () => {
onClose();
};

if (!isOpen) return null;
return (
<Modal
closable={{ 'aria-label': 'Custom Close Button' }}
open={isOpen}
onOk={handleOk}
onCancel={handleCancel}
footer={null} // <-- Tắt cả hai nút OK và Cancel
centered
className="z-[1000000000]" >
<Main
        ref={innerBorderRef}
        className="inline-block align-bottom rounded-lg text-left overflow-hidden  transform transition-all sm:my-2 sm:align-middle sm:max-w-lg sm:w-full"
      >
<Card>
<CardHeader className="relative">
<CardTitle className="text-[26px]">Thuê tài khoản</CardTitle>
</CardHeader>
<CardContent>
{!isVisaAccount && (
<div className="p-4 text-green-600 bg-green-100 rounded-md text-sm mb-2">
Loại tài khoản này quý khách tự gắn thẻ vào tài khoản quảng cáo
</div>
)}

            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="!text-[16px] text-sm font-medium text-blue-800">
                    Tài khoản: <strong>{account.name}</strong>
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <Input
                  {...register('bm_id')}
                  placeholder="Nhập BM ID"
                  error={errors.bm_id?.message}
                  type="number"
                  className="font-semibold w-full mt-1 px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                />
              </div>
              {isVisaAccount == true && (
                <div>
                  <Input
                    {...register('requestedLimit', { valueAsNumber: true })}
                    type="number"
                    placeholder="Hạn mức chi tiêu"
                    error={(errors as any)?.requestedLimit?.message}
                    className="font-semibold w-full mt-1 px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                  />
                  <div className="text-sm text-gray-500 mt-1 pl-2">
                    Hạn mức:{' '}
                    {requestedLimit !== null && !isNaN(requestedLimit)
                      ? requestedLimit.toLocaleString('vi-VN')
                      : '—'}{' '}
                    VNĐ
                  </div>
                </div>
              )}
              {!isVisaAccount && (
                <div className="w-full">
                  <Controller
                    name="rentalRange"
                    control={control}
                    render={({ field }) => (
                      <FieldForm
                        {...field}
                        type="rangeDate"
                        label="Thời gian thuê"
                        value={field.value}
                        onChange={(value: any) => {
                          if (!value || value.length < 2) return;
                          field.onChange({
                            start: value[0].toDate(),
                            end: value[1].toDate(),
                          });
                        }}
                        error={(errors as any)?.requestedLimit?.message}
                      />
                    )}
                  />
                </div>
              )}
              <div>
                <label
                  id="voucherSelect"
                  className="!text-[16px] text-sm font-semibold text-gray-700 mb-1"
                >
                  Chọn hình thức thanh toán
                </label>
                <select {...register('currency')}>
                  {dataCurrency.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.currency?.message && (
                  <div className="text-red-500">{errors.currency.message}</div>
                )}
              </div>
              <div>
                <label
                  id="voucherSelect"
                  className="!text-[16px] text-sm font-semibold text-gray-700 mb-1"
                >
                  Chọn voucher
                </label>
                <select
                  id="voucherSelect"
                  className="w-full px-3 py-3 border border-gray-300 rounded text-sm"
                  value={selectedVoucher}
                  onChange={(e) => setSelectedVoucher(e.target.value)}
                >
                  <option className="text-gray-700 font-sans" value="">
                    -- Không sử dụng voucher --
                  </option>
                  {dataVoucher.map((item, index) => {
                    const checkExpored = isVoucherExpired(
                      item.voucher.expires_at
                    );
                    if (!checkExpored) {
                      return (
                        <option key={index} value={String(item.voucher_id)}>
                          {item.voucher.name} (x{item.quantity}) - (
                          {format(
                            parseISO(item.voucher.expires_at),
                            'dd/MM/yyyy'
                          )}
                          )
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            </div>

            <div className="py-4 rounded-md">
              <h4 className="text-sm text-gray-900 !text-[16px] font-semibold">
                Chi tiết thanh toán
              </h4>
              <p className="text-sm text-gray-500 mt-1 italic">
                * Phí dịch vụ được tính dựa trên giới hạn chi tiêu của tài
                khoản. Vui lòng tham khảo bảng giá hoặc liên hệ hỗ trợ.
              </p>

              <div className="mt-2 space-y-1">
                {requestedLimit !== null &&
                  requestedLimit > account.defaultLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí tăng limit</span>
                      <span className="text-gray-900 font-medium"></span>
                    </div>
                  )}
                <div className="text-sm">
                  {selectedVoucher && (
                    <p className="text-gray-500 text-[16px] font-semibold">
                      Giảm giá từ voucher:{' '}
                      <span className="text-[#DC2625]">
                        - {discountAmount.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </p>
                  )}
                  <p className="text-gray-500 mt-2 text-[16px] font-semibold">
                    Phí dịch vụ:{' '}
                    <span className="text-blue-600">
                      {serviceFee.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-[17px] sm:text-[20px] font-semibold">
                    <span className="text-gray-900">Tổng thanh toán:</span>
                    <span className="text-blue-600 text-end text-nowrap">
                      {totalBill.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {user && (
              <div>
                <div className="flex justify-between">
                  <span className="text-[16px] sm:text-[18px] font-semibold ">
                    Số dư:{' '}
                  </span>
                  <span
                    className={`font-medium text-[18px] ${
                      (user.points ?? 0) < totalBill
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {user.points != null
                      ? user.points.toLocaleString('vi-VN') + ' VNĐ'
                      : 'Đang tải...'}
                  </span>
                </div>
                {(user.points ?? 0) < totalBill && (
                  <div className="mt-2 text-red-600">
                    Số dư không đủ để thuê tài khoản này. Vui lòng nạp thêm
                    tiền.
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit(onSubmitValidated)}
              isLoading={isLoading}
              className={
                !isValidBmId ||
                (isVisaAccount && !isValidLimit) ||
                (!isVisaAccount && !isValidRentalRange) ||
                (user && (user.points ?? 0) < totalBill)
                  ? 'hover:bg-gray-300 bg-gray-300 cursor-not-allowed'
                  : ''
              }
            >
              Xác nhận thuê
            </Button>
          </CardFooter>
        </Card>
      </Main>
    </Modal>

);
};
const Main = styled.div`  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }`;
export default RentModal;
