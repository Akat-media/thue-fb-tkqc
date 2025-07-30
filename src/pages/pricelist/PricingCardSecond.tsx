import React from "react";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCardBg } from "./PricingCard";
import Icon from "../../components/icons";

interface PricingCardProps {
    subtitle: string;
    name: string;
    currency: string;
    amount:number,
    colors: string;
    percentage: number;
    iconCheck: string;
    description: string[];
}

const PricingCardSecond:React.FC<PricingCardProps> = ({
    subtitle,
    name,
    amount,
    currency,
    colors,
    percentage,
    iconCheck,
    description,

}) => {
    const currencyCode = currency === "VND" ? "/tháng" : "/month";
    const percentageCode = percentage > 1 ? `${percentage}%` : "Liên hệ";

    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
      <div className="flex flex-col rounded-3xl transition-all duration-300 w-full max-w-sm cursor-pointer">
        <div className="p-5 rounded-3xl bg-white min-h-[450px] flex flex-col justify-between">
          <div
            className="w-[116px] h-[38px] text-sm px-2 mb-[12px] md:mb-[15px] text-white border border-gray-300 rounded-full flex justify-center items-center font-light"
            style={{
              color: '#193250',
              backgroundColor: getCardBg(subtitle),
              border: `1px solid ${getCardBg(subtitle)}`,
            }}
          >
            {subtitle}
          </div>
          <div className="flex justify-center">
            <div className="text-right">
              <div className="font-montserrat font-semibold md:text-[36px] text-[30px] text-nowrap">
                {name}
              </div>
              <div className="font-hubot text-[18px] md:text-[20px] text-[#6B7280] md:-mt-[10px] -mt-[10px]">
                {currency}
                {currencyCode}
              </div>
            </div>
          </div>

          <div className="pt-[30px]">
            <div className="flex flex-row font-hubot pb-2">
              <span className="mr-[6px]">
                <Icon name="checkCircle" />
              </span>
              <div>
                <span className="text-gray-500">{t('price.fee')}: </span>
                <span className="ml-1 font-bold">{percentageCode}</span>
              </div>
            </div>
            <div className="flex flex-row font-hubot text-gray-500">
              <div>
                {description.map((item, index) => (
                  <div key={index} className="flex pb-2">
                    <span className="mr-[6px]">
                      <Icon name="checkCircle" className="h-5 w-full" />
                    </span>
                    <span className="text-gray-500 ">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {(amount < 2000000000 && currency === 'VND') ||
          (amount < 100000 && currency === 'USD') ? (
            <div
              onClick={() => navigate('/marketplace')}
              className="h-[64px] rounded-[60px] bg-[#193250] mt-[20px] text-white border border-[#07FFE6]/20 text-center 
                       flex items-center justify-center cursor-pointer relative overflow-hidden
                       transition-all duration-300 ease-in-out
                       hover:scale-105 hover:shadow-[0_0_25px_rgba(7,255,230,0.5)]
                       active:scale-95 active:shadow-[0_0_10px_rgba(7,255,230,0.3)]
                       transform-gpu group"
            >
              <div className="absolute inset-0 rounded-[60px] bg-gradient-to-r from-[#07FFE6] to-transparent opacity-10 blur-xl group-hover:opacity-20 transition-all duration-300 pointer-events-none" />
              <span className="font-semibold text-[20px] text-[#07FFE6] transition-all duration-200 z-10">
                {t('price.rent')}
              </span>
            </div>
          ) : (
            <div
              onClick={() => navigate('/marketplace')}
              className="h-[64px] rounded-[60px] bg-[#193250] mt-[20px] text-white border border-[#07FFE6]/20 text-center 
                       flex items-center justify-center cursor-pointer relative overflow-hidden
                       transition-all duration-300 ease-in-out
                       hover:scale-105 hover:shadow-[0_0_25px_rgba(7,255,230,0.5)]
                       active:scale-95 active:shadow-[0_0_10px_rgba(7,255,230,0.3)]
                       transform-gpu group"
            >
              <div className="absolute inset-0 rounded-[60px] bg-gradient-to-r from-[#07FFE6] to-transparent opacity-10 blur-xl group-hover:opacity-20 transition-all duration-300 pointer-events-none" />
              <span className="font-semibold text-[20px] text-[#07FFE6] transition-all duration-200 z-10">
                {t('price.contact')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
}

export default PricingCardSecond
