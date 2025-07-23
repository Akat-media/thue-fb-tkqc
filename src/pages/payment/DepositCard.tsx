import { Copy } from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useUserStore} from "../../stores/useUserStore.ts";

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

const DepositCard: React.FC<DepositCardProps> = (
{
    handleDeposit,
    showInfo,
    backInfo,
    customAmount,
    setCustomAmount,
    qrImageUrl,
    countdown
}) => {
    const { t } = useTranslation();
    const {user} = useUserStore();

    const handleChangeAmount = (value:any) => {
        setCustomAmount(String(value));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const item = e.target.value.replace(/\D/g, '');
        setCustomAmount(item);
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
            {!showInfo && (
                <div className="font-mona bg-[#F8FCFF] rounded-2xl pt-[20px] pb-[40px] px-[24px] sm:px-[78px] shadow-md max-w-[732px] w-full">
                    <h2 className=" text-[28px] font-semibold leading-[36.4px] mb-[16px]">{t('paymentPage.enterAmount')}</h2>

                    <div className="relative mb-[36px]">
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

                <div className=" grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {amounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => {
                                handleChangeAmount(amt)
                            }}
                            className={`py-2 rounded-lg text-sm font-[500] text-[18px] leading-[25.2px] border transition ${
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
                            {t('paymentPage.depositSuccess')}
                        </button>
                    </div>
                </div>
            )}

            {/*left box thong tin tai khoan*/}
            {showInfo && (
                <div className="font-mona bg-[#F8FCFF] rounded-2xl pb-[40px] shadow-md w-full">
                  <div className="flex flex-col sm:flex-row justify-around px-8 pb-8 pt-4">
                      <div className="flex flex-col left bg-white  w-full py-[20px] px-[24px]">
                          <div className="text-2xl font-semibold pb-[18px] text-[#193250]">{t('paymentPage.transferInfo')}</div>
                          <hr className="border-t-2 border-[#8CF5FF]" />
                          <div className="mt-5">
                              <div className="mb-3 flex flex-row justify-between">
                                  <div className="text-lg text-[#6E7382]">{t('paymentPage.bank')}</div>
                                  <div className="flex flex-row items-center">
                                      <div className="flex flex-col mr-2">
                                          <div className="flex justify-end text-lg font-semibold text-[#193250]">ACB Bank</div>
                                          <div className="text-[14px] text-[#193250]">{t('paymentPage.acbAsia')}</div>

                                      </div>
                                      <div className="text-[#6E7382]"><Copy className="h-4 w-4" /></div>
                                  </div>
                              </div>
                              <div className="mb-3 flex flex-row justify-between">
                                  <div className="text-lg text-[#6E7382]">{t('paymentPage.accountNumber')}</div>
                                  <div className="flex flex-row items-center">
                                      <div className="flex flex-col mr-2">
                                          <div className="flex justify-end text-lg font-semibold text-[#193250]">20478471</div>
                                      </div>
                                      <div className="text-[#6E7382]"><Copy className="h-4 w-4" /></div>
                                  </div>
                              </div>
                              <div className="mb-3 flex flex-row justify-between">
                                  <div className="text-lg text-[#6E7382]">{t('paymentPage.accountName')}</div>
                                  <div className="flex flex-row items-center">
                                      <div className="flex flex-col mr-2">
                                          <div className="flex justify-end text-lg font-semibold text-[#193250]">Duy Nam</div>
                                      </div>
                                      <div className="text-[#6E7382]"><Copy className="h-4 w-4" /></div>
                                  </div>
                              </div>
                              <div className="mb-3 flex flex-row justify-between">
                                  <div className="text-lg text-[#6E7382]">{t('paymentPage.transferContent')}</div>
                                  <div className="flex flex-row items-center">
                                      <div className="flex flex-col mr-2">
                                          <div className="flex justify-end text-lg font-semibold text-[#193250]">NAP0000</div>
                                      </div>
                                      <div className="text-[#6E7382]"><Copy className="h-4 w-4" /></div>
                                  </div>
                              </div>
                              <div className=" flex flex-row justify-between">
                                  <div className="text-lg text-[#6E7382]">{t('paymentPage.amount')}</div>
                                  <div className="flex flex-row items-center">
                                      <div className="flex flex-col mr-2">
                                          <div className="flex justify-end text-lg font-semibold text-[#193250]">
                                              {Number(customAmount).toLocaleString('vi-VN')} VNĐ
                                          </div>
                                      </div>
                                      <div className="text-[#6E7382]"><Copy className="h-4 w-4" /></div>
                                  </div>
                              </div>

                          </div>
                      </div>
                      <div className="w-full">
                          <div className="flex flex-col items-center text-sm text-gray-700 text-center mt-5 sm:mt-0">
                              {qrImageUrl && (
                                  <img
                                      src={qrImageUrl}
                                      alt="QR Code"
                                      className="w-48 object-contain border rounded-lg shadow-sm"
                                  />
                              )}
                              <p className="text-[15px] text-[#193250] font-semibold w-[250px] mt-3">
                                  {t('paymentPage.scanQRInstructions')}
                              </p>
                              <div className="mt-4">
                                  <p className="">
                                      <span className="text-base font-medium text-[#6E7382]">{t('paymentPage.qrExpires')}{' '}</span>
                                      <span className="text-base text-red-500 font-semibold">
                                          {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} {t('paymentPage.minutes')}
                                      </span>
                                  </p>
                              </div>
                          </div>
                      </div>

                  </div>

                  <div className="flex sm:flex-row flex-col justify-around items-center ">
                      <button
                          onClick={()=>backInfo()}
                          className="w-[132px] mb-5 sm:mb-0 border border-gray-300 bg-[#F8FCFF] text-gray-500 rounded-full py-3 font-semibold hover:bg-cyan-50 transition"
                      >
                          {t('paymentPage.back')}
                      </button>
                        <button className="mb-5 sm:mb-0 bg-white border border-cyan-500 text-gray-500 rounded-full py-3 px-3 font-semibold hover:bg-cyan-50 transition">
                            {t('paymentPage.changePaymentMethod')}
                        </button>

                    </div>
                </div>
            )}


            {/* Right box */}
            <div className="font-mona bg-[#F8FCFF] rounded-2xl p-6 shadow-md flex flex-col">
                <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 border border-[#9AFFFA] rounded-xl px-4 py-3 mb-6 flex items-center">
                    <div className="rounded-fill mr-[16px]">
                        <img src="/payments/so-du-vi.svg" alt=""/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[18px] text-[#6B7280] font-semibold leading-[25.2px]">{t('paymentPage.remainPoint')}</span>
                        <span className="text-[28px] font-bold text-gray-900">
                           {user?.points?.toLocaleString('vi-VN')} {t('paymentPage.point')}
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{t('paymentPage.instructions')}</h3>
                    <div className="flex flex-col space-y-2 text-sm text-gray-600">
                        <div className="flex flex-row items-center ">
                            <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">1</span>
                            <span className="text-lg font-medium">{t('paymentPage.instruction1')}</span>
                        </div>
                        <div className="flex flex-row items-center ">
                            <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">2</span>
                            <span className="text-lg font-medium">{t('paymentPage.instruction2')}</span>
                        </div>
                        <div className="flex flex-row items-center ">
                            <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">3</span>
                            <span className="text-lg font-medium">{t('paymentPage.instruction3')}</span>
                        </div>
                        <div className="flex flex-row items-center ">
                            <span className="flex border border-cyan-200 rounded-full w-8 h-8 px-[10px] justify-center items-center mr-2 text-blue-500 font-bold ">4</span>
                            <span className="text-lg font-medium">{t('paymentPage.instruction4')}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositCard;
