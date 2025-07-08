import React from "react";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PricingCardProps {
    subtitle: string;
    name: string;
    currency: string;
    colors: string;
    percentage: number;
    iconCheck: string;
    description: string[];
}

const PricingCardSecond:React.FC<PricingCardProps> = ({
    subtitle,
    name,
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
        <div className="flex flex-col rounded-xl shadow-md border transition-all duration-300 w-full max-w-sm cursor-pointer">
            <div className="p-5 rounded-xl bg-white">
                <div
                    className="w-[116px] h-[38px] text-sm px-2 mb-[12px] md:mb-[15px] text-white border border-gray-300 rounded-full flex justify-center items-center"
                    style={{ backgroundColor: colors }}
                >
                    {subtitle}
                </div>
                <div className="flex justify-center">
                    <div className="text-right">
                        <div className="font-montserrat font-semibold md:text-[48px] text-[30px]">{name}</div>
                        <div className="font-hubot text-[18px] md:text-[24px] text-[#6B7280] md:-mt-[18px] -mt-[14px]">{currency}{currencyCode}</div>
                    </div>
                </div>

                <div className="pt-[30px]">
                    <div className="flex flex-row font-hubot pb-2">
                        <img  className="pr-2" src={`${iconCheck}`} alt="cicrle1"/>
                        <div>
                            <span className="text-gray-500">{t('price.fee')}:{" "}</span>
                            <span className="font-bold">{percentageCode}</span>
                        </div>
                    </div>
                    <div className="flex flex-row font-hubot text-gray-500">
                       <div>
                           {description.map((item,index) => (
                               <div key={index} className="flex flex-row items-start pb-2">
                                   <img  className="pr-2 " src={`${iconCheck}`} alt="cicrle1"/>
                                   <span className="text-gray-500 ">{item}</span>
                               </div>
                           ))}
                       </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate("/marketplace")}
                    className="h-[64px] rounded-[60px] bg-[#193250] mt-[20px] text-white border text-center flex items-center justify-center">
                    <span className="font-hubot text-[20px] font-semibold">{t('price.rent')}</span>
                </div>
            </div>
        </div>
    );
}

export default PricingCardSecond
