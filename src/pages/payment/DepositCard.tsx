import { Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../stores/useUserStore.ts';

const amounts = [1000000, 2000000, 3000000, 5000000, 10000000, 20000000];

interface DepositCardProps {
  handleDeposit: () => void;
  showInfo: boolean;
  backInfo: () => void;
  customAmount: string;
  setCustomAmount: (value: string) => void;
  qrImageUrl: string | null;
  countdown: number;
}

const DepositCard: React.FC<DepositCardProps> = ({
  handleDeposit,
  showInfo,
  backInfo,
  customAmount,
  setCustomAmount,
  qrImageUrl,
  countdown,
}) => {
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const { user } = useUserStore();

  const handleChangeAmount = (value: any) => {
    setCustomAmount(String(value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.value.replace(/\D/g, '');
    setCustomAmount(item);
    const value = Number(item);

    if (isNaN(value) || value <= 0 || value % 1000000 !== 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      backInfo();
    }
  }, [countdown, backInfo]);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-8 ">
      <style>
        {`
                  @import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
                  
                  .font-mona {
                    font-family: 'Mona Sans', sans-serif;
                  }
                `}
      </style>

      {/* Left box nhap so tien*/}

      <div className="font-mona bg-[#F8FCFF] rounded-2xl pt-[20px] pb-[40px] px-[24px] sm:px-[78px] shadow-md max-w-[732px] w-full">
        <h2 className=" text-[28px] font-semibold leading-[36.4px] mb-[16px]">
          {t('paymentPage.enterAmount')}
        </h2>

        <div className="relative ">
          <input
            type="text" // de hien thi dang 1.000.000: string, neu de nunmber se ko them dau '.' duoc
            inputMode="numeric" // tren mobile van hien thi ban phim so
            value={Number(customAmount).toLocaleString('vi-VN')}
            onChange={handleInputChange}
            className="w-full h-[76px] border border-gray-300 rounded-lg px-[20px] pr-16 focus:ring-2 focus:ring-blue-500 outline-none text-2xl sm:text-4xl font-semibold"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[28px] font-medium leading-[36.4px] text-[#9497A0]">
            VNĐ
          </span>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-1 italic  py-[8px]">
            {t('paymentPage.enterValidAmount')}
          </p>
        )}

        <div className="mt-[36px] grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                handleChangeAmount(amt);
              }}
              className={`py-2 rounded-lg text-base font-[500] leading-[25.2px] border transition ${
                parseInt(customAmount) === amt
                  ? 'bg-blue-50 text-blue-600 border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {amt.toLocaleString('vi-VN')} VNĐ
            </button>
          ))}
        </div>

        <div className="flex sm:flex-row flex-col justify-around items-center ">
          <button className="mb-5 sm:mb-0 bg-white border border-cyan-500 text-gray-500 rounded-full py-3 px-3 font-semibold hover:bg-cyan-50 transition">
            {t('paymentPage.changePaymentMethod')}
          </button>
          <button
            className="w-[224px] bg-[#06203F] text-cyan-300 rounded-full py-3 font-semibold hover:bg-[#0a2c57] transition"
            onClick={handleDeposit}
          >
            {t('paymentPage.createDepositOrder')}
          </button>
        </div>
      </div>

      {/* Right box */}
      <div className="font-mona bg-[#F8FCFF] rounded-2xl p-6 shadow-md flex flex-col">
        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 border border-[#9AFFFA] rounded-xl px-4 py-3 mb-6 flex items-center">
          <div className="rounded-fill mr-[16px]">
            <img src="/payments/so-du-vi.svg" alt="" />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] text-[#6B7280] font-semibold leading-[25.2px]">
              {t('paymentPage.remainPoint')}
            </span>
            <span className="text-[28px] font-bold text-gray-900">
              {user?.points?.toLocaleString('vi-VN')} {t('paymentPage.point')}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            {t('paymentPage.instructions')}
          </h3>
          <div className="flex flex-col space-y-2 text-sm text-gray-600">
            <div className="flex flex-row items-center ">
              <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">
                1
              </span>
              <span className="text-base font-medium">
                {t('paymentPage.instruction1')}
              </span>
            </div>
            <div className="flex flex-row items-center ">
              <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">
                2
              </span>
              <span className="text-base font-medium">
                {t('paymentPage.instruction2')}
              </span>
            </div>
            <div className="flex flex-row items-center ">
              <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">
                3
              </span>
              <span className="text-base font-medium">
                {t('paymentPage.instruction3')}
              </span>
            </div>
            <div className="flex flex-row items-center ">
              <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">
                4
              </span>
              <span className="text-base font-medium">
                {t('paymentPage.instruction4')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositCard;
