import React from 'react';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface PricingCardProps {
    id?: string;
    name: string;
    description: string[];
    amount: number;
    start_date: string;
    end_date: string;
    currency: string;
    percentage: number;
    highlight: boolean;
    buttonLabel: string;
    buttonColor: string;
    buttonContact: string;
    subtitle: string;
    overview: string;
    buttonLabelEN: string;
    buttonContactEN: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
    name,
    description,
    amount,
    percentage,
    buttonLabel = "Bắt đầu ngay",
    buttonContact = "Liên hệ",
    subtitle,
    overview,
    buttonLabelEN = "Start now",
    buttonContactEN = "Contact",
 }) => {
    const navigate = useNavigate();

    const { i18n } = useTranslation();

    return (
        <div
            className={`flex flex-col rounded-xl shadow-md border transition-all duration-300 w-full max-w-sm hover:border-blue-400 hover:-translate-y-2 hover:shadow-lg cursor-pointer`}
        >
            <div className="p-6 rounded-t-xl bg-gradient-to-r from-blue-100 to-purple-50">
                <div className="text-sm font-semibold mb-[25px] text-gray-700 bg-white w-max border border-gray-300 rounded-full px-2">
                    {subtitle}
                </div>
                <h2 className="text-2xl font-bold mb-[20px]">{name}</h2>
                <div className="mb-[20px]">
                    {overview}
                </div>


                <div className="text-base font-medium text-gray-700 flex gap-1 mb-10 mt-10 items-center">
                    {i18n.language === 'vi' ? (
                        <div>Phí dịch vụ thuê:</div>
                    ) : (
                        <div>Rental service fee</div>
                    )}

                    { amount < 2000000000 && (
                        <div className="font-bold text-lg text-green-500">{percentage}%</div>
                    )}
                </div>

                { amount >= 2000000000 && (
                    <button
                        onClick={()=>navigate("/support")}
                        className={`w-full py-2 text-white font-medium rounded-md mb-4 bg-gradient-to-r from-green-400 to-blue-400`}
                    >
                        {i18n.language === 'vi' ? (
                            buttonContact
                        ) : (
                            buttonContactEN
                        )}
                    </button>
                )}

                { amount < 2000000000 && (
                    <button
                        onClick={() => navigate("/payments")}
                        className={`w-full py-2 text-white font-medium rounded-md mb-4 bg-gradient-to-r from-sky-500 to-blue-300`}
                    >
                        {i18n.language === 'vi' ? (
                            buttonLabel
                        ) : (
                            buttonLabelEN
                        )}
                    </button>
                )}
            </div>

            <div className="bg-white p-5 rounded-b-xl">
                <ul className="text-sm space-y-2 text-left text-gray-700">
                    {description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PricingCard;
