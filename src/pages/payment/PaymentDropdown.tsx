import React, { useState } from 'react';
import {useTranslation} from "react-i18next";
// import { ChevronUp } from 'lucide-react';

type PaymentOption = {
    label: string;
    icon: string;
    available: boolean;
};

const paymentOptions: PaymentOption[] = [
    {
        label: 'Paypal',
        icon: '/payments/paypal.svg',
        available: false,
    },
    {
        label: 'VISA',
        icon: '/payments/visa.svg',
        available: false,
    },
    {
        label: 'MasterCard',
        icon: '/payments/master-card.svg',
        available: false,
    },
];

const PaymentDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const {t} = useTranslation();

    return (
        <div className="w-[289px]">
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
                  
                  .font-mona {
                    font-family: 'Mona Sans', sans-serif;
                  }
                `}
            </style>
            <div className="border-2 border-cyan-400 rounded-lg overflow-hidden shadow-md">
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50"
                >
                    <div className="font-mona flex items-center space-x-2 font-semibold leading-[25.2px] text-[18px]  ">
                        <span>Internet Banking</span>

                    </div>
                    <div className="flex flex-row items-center">
                        <img src="/payments/internet-banking.svg" alt="card"/>
                        {/*<span><ChevronUp className=" w-[18px] h-[18px] text-[#B5B8BF] "/></span>*/}
                    </div>

                </button>

                {/* Dropdown Content */}
                {isOpen && (
                    <div
                        className="bg-white border-t-2 border-cyan-400 px-4 py-3 space-y-3"
                    >
                        {paymentOptions.map((option) => (
                            <div
                                key={option.label}
                                className={`flex items-center justify-between ${
                                    option.available ? 'text-gray-800 cursor-pointer hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
                                } px-2 py-1 rounded-md transition`}
                            >
                                <div className="flex flex-col">
                                    <span className="font-mona text-[18px] font-medium leading-[25.2px] text-gray-400">{option.label}</span>
                                    {!option.available && (
                                        <span className="font-mona text-[14px] font-normal leading-[19.6px] text-gray-400">({t('paymentPage.coming')})</span>
                                    )}
                                </div>
                                <img src={option.icon} alt={option.label} className="h-6" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDropdown;
