import React, { useState, useEffect, useRef } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserStore } from '../../stores/useUserStore';
import { useOnOutsideClick } from '../../hook/useOutside';
import { VoucherData } from '../profile/Ticket';
import { addDays, format } from 'date-fns';
import { Modal } from 'antd';
import styled from 'styled-components';
import { useNotificationStore } from '../../stores/notificationStore';
import { useTranslation } from 'react-i18next';
import { usePreventScroll } from '../../hook/usePreventScroll';
import './index.css';
import url3 from '../../assets/Badge (1).svg';
import url4 from '../../assets/calendar.svg';
import url5 from '../../assets/Icon.svg';
import url6 from '../../assets/Icon (1).svg';
import bg from '../../assets/bg (1).svg';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any;
  setSuccessRent: React.Dispatch<React.SetStateAction<any>>;
  skipCardStep?: boolean;
  openCardModal?: () => void;
  setRentMeta?: (meta: any) => void;
  rentMeta?: any;
  handleCallAPiVisa: () => void;
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
    handleCallAPiVisa,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const objetUser = localStorage.getItem('user');
  const userParse = JSON.parse(objetUser || '{}');
  const [selectedCookieId, setSelectedCookieId] = useState<any>('');
  const [dataVoucher, setDataVoucher] = useState<VoucherData[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [selectedCurrend, setSelectedCurrend] = useState('vnd');
  const [budgetData, setBudgetData] = useState<{
    amount: number;
    percentage: number;
  } | null>(null);
  const { user, fetchUser } = useUserStore();
  const [maxToDate, setMaxToDate] = useState<Date | undefined>(undefined);

  const schema = z.object({
    bmId: z
      .string()
      .min(1, t('rentModal.verifyInput.verifyInput1'))
      .regex(/^\d+$/, t('rentModal.verifyInput.verifyInput2')),
    spendLimit: z
      .number({ invalid_type_error: t('rentModal.verifyInput.verifyInput3') })
      .gt(10000, t('rentModal.verifyInput.verifyInput4'))
      .max(user?.points || 0, {
        message: `${t(
          'rentModal.verifyInput.verifyInput5'
        )} (${user?.points?.toLocaleString('vi-VN')} ${t(
          'rentModal.verifyInput.verifyInput6'
        )})`,
      }),
    voucher: z.string().optional(),
    dateRange: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine(
        ({ from, to }) => {
          const diff = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
          return diff >= 7 && diff <= 60;
        },
        {
          message: 'Khoảng thời gian phải từ 7 đến 60 ngày',
          path: ['to'],
        }
      ),
  });

  type FormData = z.infer<typeof schema>;
  const { fetchNotifications } = useNotificationStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bmId: '',
      spendLimit: 10000000,
      voucher: '',
      dateRange: { from: undefined, to: undefined },
    },
    mode: 'onChange',
  });
  const isVisaAccount = account?.is_visa_account;
  usePreventScroll(isOpen);
  const { innerBorderRef } = useOnOutsideClick(() => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    if (isOpen) {
      fetchCookies();
      fetchData();
      fetchUser();
      reset({
        bmId: '',
        spendLimit: 0,
        voucher: '',
        dateRange: { from: undefined, to: undefined },
      });
    }
  }, [isOpen, isVisaAccount]);

  const fetchCookies = async () => {
    try {
      const response = await BaseHeader({
        method: 'get',
        url: 'cookies',
        params: {},
      });
      setSelectedCookieId(response.data.data?.[0]?.id);
    } catch (error) {
      console.error('Error fetching cookies:', error);
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
  const handleOk = () => {
    onClose();
  };
  const handleCancel = async () => {
    onClose();
    await reset();
  };

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit = async (data: FormData) => {
    console.log('Submitted data:', data);
    const startDate = format(data.dateRange.from, 'dd/MM/yyyy HH:mm:ss');
    const endDate = format(data.dateRange.to, 'dd/MM/yyyy HH:mm:ss');
    const payload = {
      bm_origin: account?.owner || '',
      ads_name: account?.name || '',
      bm_id: data.bmId || '',
      ads_account_id: account?.account_id || '',
      user_id: userParse.user_id || '',
      amountPoint:
        data.spendLimit +
        Number(watch('spendLimit') || 0) * (user?.percentage || 0),
      fee: Number(watch('spendLimit') || 0) * (user?.percentage || 0),
      voucher_id: data.voucher || '',
      bot_id: selectedCookieId || null,
      currency: selectedCurrend,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      const response = await BaseHeader({
        url: 'points-used',
        method: 'post',
        data: payload,
      });
      if (response.data.success) {
        setSuccessRent(response.data.data);
        onClose();
        await reset();
      }
    } catch (error) {
      console.log('Error submitting form:', error);
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
    }
  };
  const datePickerRef = useRef<any>(null);

  if (!isOpen) return null;
  return (
    <Modal
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null} // <-- Tắt cả hai nút OK và Cancel
      centered
      width={896}
      className="z-[1000000000] p-0 max-h-[80vh] sm:max-h-screen  overflow-scroll sm:overflow-hidden"
    >
      <Main
        ref={innerBorderRef}
        className="relative inline-block align-bottom rounded-lg 
        text-left overflow-hidden  transform transition-all 
         p-[30px] w-full"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full z-10 relative"
        >
          <div className="flex flex-col">
            <h3 className="text-[20px] sm:text-[24px] font-medium text-[#6B7280]">
              {t('rentModal.title')}
            </h3>
            <h1 className="flex gap-2">
              <div className="text-[25px] sm:text-[42px] font-semibold">
                {account?.name}
              </div>
              <img src={url3} alt="Xem chi tiết" />
            </h1>
          </div>
          <main className="flex sm:flex-row flex-col items-stretch w-full justify-between">
            {/* phần left */}
            <div className="w-full sm:w-[48%] my-5 sm:my-0 bg-white p-[24px] rounded-[16px]">
              <div className={`${!errors.bmId ? 'mb-3' : ''}`}>
                <label className="block mb-[8px] font-medium text-[14px] uppercase text-gray-600">
                  ID BM
                </label>
                <input
                  type="text"
                  {...register('bmId')}
                  placeholder={t('rentModal.requireBmId')}
                  className="w-full  px-3 py-3 text-[16px] rounded-[8px] border-[1.5px] border-[#CBCDD2]"
                />
                {errors.bmId && (
                  <p className="text-red-600 text-sm mt-1 italic  py-[8px]">
                    {errors.bmId.message}
                  </p>
                )}
              </div>
              <div className={`${!errors.spendLimit ? 'mb-3' : ''}`}>
                <label className="block mb-[8px] font-medium text-[14px] uppercase text-gray-600">
                  {t('rentModal.limitLabel')}
                </label>
                <Controller
                  name="spendLimit"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        field.value
                          ? Number(
                              field.value.toString().replace(/\D/g, '')
                            ).toLocaleString('vi-VN')
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        field.onChange(raw ? Number(raw) : undefined);
                      }}
                      placeholder="Nhập hạn mức chi tiêu"
                      className="w-full px-3 py-3 text-[16px] rounded-[8px] border-[1.5px] border-[#CBCDD2]"
                    />
                  )}
                />
                {errors.spendLimit && (
                  <p className="text-red-600 text-sm mt-1 italic  py-[8px]">
                    {errors.spendLimit.message}
                  </p>
                )}
              </div>
              <div className={`${!errors.dateRange ? 'mb-3' : ''}  relative`}>
                <label className="block mb-2 font-medium text-sm text-gray-600 uppercase">
                  {t('rentModal.runningTime')}
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={({ field }) => (
                    <DatePicker
                      ref={datePickerRef}
                      selectsRange
                      startDate={field.value?.from}
                      endDate={field.value?.to}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        field.onChange({
                          from: start ?? undefined,
                          to: end ?? undefined,
                        });
                        if (start) {
                          setMaxToDate(addDays(start, 60));
                        } else {
                          setMaxToDate(undefined);
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      maxDate={
                        field.value?.from ? maxToDate : addDays(new Date(), 7)
                      }
                      className="w-full px-3 py-3 text-[16px] rounded-[8px] border-[1.5px] border-[#CBCDD2]"
                      placeholderText="Chọn khoảng thời gian"
                    />
                  )}
                />
                <img
                  onClick={() => {
                    if (datePickerRef.current) {
                      datePickerRef?.current?.setOpen(true);
                    }
                  }}
                  className="absolute right-[10px] top-[40px] cursor-pointer"
                  src={url4}
                  alt="url4"
                />
                {errors.dateRange?.to && (
                  <p className="text-red-600 text-sm mt-1 italic  py-[8px]">
                    {errors.dateRange.to.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-[8px] font-medium text-[14px] uppercase text-gray-600">
                  {t('rentModal.applyVoucher')}
                </label>
                <select
                  {...register('voucher')}
                  className="w-full  px-3 py-3 text-[16px] rounded-[8px] border-[1.5px] border-[#CBCDD2]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {t('rentModal.selectVoucher')}
                  </option>
                </select>
              </div>
            </div>
            {/* phần right */}
            <div className="w-full sm:w-[48%] bg-white p-[24px] rounded-[16px]">
              <h4 className="block mb-[18px] font-medium text-[14px] uppercase text-[#6B7280]">
                {t('rentModal.paymentDetails')}
              </h4>
              <div className="p-[12px] customer-point flex items-center gap-2 mb-8">
                <img src={url5} alt="url5" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#6B7280]">
                    {t('rentModal.remainWallet')}
                  </span>
                  <span className="text-[16px] font-semibold  text-[#193250]">
                    {user?.points?.toLocaleString('vi-VN') || '0'}{' '}
                    {t('rentModal.verifyInput.verifyInput6')}
                  </span>
                </div>
              </div>
              <div className="flex justify-between flex-wrap mb-2 text-[16px] text-[#6B7280]">
                <span>{t('rentModal.spendingLimit')}</span>
                <span>
                  {Number(watch('spendLimit') || 0).toLocaleString('vi-VN')}{' '}
                  {t('rentModal.verifyInput.verifyInput6')}
                </span>
              </div>
              <div className="flex justify-between flex-wrap mb-2 text-[16px] text-[#6B7280]">
                <span>{t('rentModal.serviceFee')}</span>
                <span>
                  {(
                    Number(watch('spendLimit') || 0) * (user?.percentage || 0)
                  ).toLocaleString('vi-VN')}{' '}
                  {t('rentModal.verifyInput.verifyInput6')}
                </span>
              </div>
              <div className="flex justify-between flex-wrap mb-2 text-[16px] text-[#6B7280]">
                <span>{t('rentModal.discountVoucher')}</span>
                <span className="text-green-600">0</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 mb-[25px] text-[18px] text-[#193250]">
                <span>{t('rentModal.totalPayment')}</span>
                <span>
                  {(
                    Number(watch('spendLimit') || 0) +
                    Number(watch('spendLimit') || 0) * (user?.percentage || 0)
                  ).toLocaleString('vi-VN')}{' '}
                  {t('rentModal.verifyInput.verifyInput6')}
                </span>
              </div>
              <div className="flex gap-1 rounded-[12px] bg-[#F4F6F8] p-2">
                <div className="w-[12px] mt-1">
                  <img src={url6} alt="url6" />
                </div>
                <p className="w-[calc(100%-12px)] text-[16px] text-[#6B7280]">
                  {t('rentModal.note.note1')}{' '}
                  <span
                    onClick={() => navigate('/price')}
                    className="underline text-[#2AA6FF]"
                  >
                    {t('rentModal.note.note2')}
                  </span>{' '}
                  {t('rentModal.note.note3')}{' '}
                  <span
                    onClick={() => navigate('/support')}
                    className="underline text-[#2AA6FF]"
                  >
                    {t('rentModal.note.note4')}
                  </span>
                  .
                </p>
              </div>
            </div>
          </main>

          <div className="flex justify-between mt-[28px]">
            <button type="button" onClick={handleCancel} className="btn-close">
              {t('common.button.cancel')}
            </button>
            <button
              data-text={t('rentModal.confirm')}
              type="submit"
              className={`btn-submit ${
                !isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isValid}
            >
              {t('rentModal.confirm')}
            </button>
          </div>
        </form>
        <img className="absolute left-0 bottom-0" src={bg} alt="bg" />
      </Main>
    </Modal>
  );
};
const Main = styled.div`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  background: #f5faff;
  .react-datepicker-wrapper {
    width: 100%;
  }
  .btn-submit {
    padding: 12px 30px;
    z-index: 0;
    font-weight: 600;
    background-color: #000; /* nền đen */
    position: relative;
    color: transparent;
    border-radius: 50px;
    display: inline-block;
    overflow: hidden;
    font-size: 16px;
  }
  .btn-submit:hover {
    background-color: #2f2e2e;
  }

  .btn-submit::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      84.75deg,
      #07ffe6 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 30px;
  }
  .customer-point {
    background: linear-gradient(90deg, #e1fffe 0%, #f4fffd 100%);
    border: 1px solid #9afffa;
    border-radius: 12px;
  }
  .btn-close {
    position: relative;
    background: white;
    border-radius: 9999px; /* full rounded */
    padding: 12px 30px;
    z-index: 0;
    font-weight: 600;
    color: #6e7382;
    font-size: 16px;
  }

  .btn-close::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    padding: 1px; /* thickness của border */
    border-radius: 9999px;
    background: linear-gradient(
      84.75deg,
      #07ffc9 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;
export default RentModal;
