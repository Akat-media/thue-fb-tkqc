import React, {useEffect,useState} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BaseHeader from "../../api/BaseHeader.ts";
import PricingCardSecond from "../pricelist/PricingCardSecond.tsx";
import { useTranslation } from "react-i18next";

interface BudgetItem {
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

const Price = () => {
    const [data, setData] = useState<BudgetItem[]>([]);

    const { t, i18n } = useTranslation();

    // const settings = {
    //     dots: false,
    //     arrows: true,
    //     // nextArrow: <CustomNextArrow />,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     autoplay: false,
    //     autoplaySpeed: 3000,
    //     responsive: [
    //         { breakpoint: 1024, settings: { slidesToShow: 3 } },
    //         { breakpoint: 768, settings: { slidesToShow: 1 } },
    //     ]
    // };
    // const items = [1, 2, 3, 4];
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await BaseHeader({
                    method: 'get',
                    url: '/budget',
                    params: {
                        lang: i18n.language,
                    },
                });
                setData(res.data.data || []);
            } catch {
                setData([]);
            }
        };
        fetch();
    }, [i18n.language]);

    const colors = ["#4B5F77","#619CFF","#4088FF", "#0061FF"];
    const iconCheck = [
      "/homepage/why-choose/check-circle-1.svg",
      "/homepage/why-choose/check-circle-2.svg",
      "/homepage/why-choose/check-circle-3.svg",
      "/homepage/why-choose/check-circle-4.svg",
    ];

    return (
        <div className="py-8 bg-[#F5FAFF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:justify-between  mb-8 space-y-4 md:space-y-0">
                    <div className="inline-flex h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] items-center">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
                        <div className="font-hubot font-normal text-[14px] md:text-[16px] whitespace-nowrap">
                            {t('price.title')}
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end w-full">
                        <div className="font-hubot font-medium text-[24px] md:text-[40px] leading-[1.1] pb-2">
                            {t('price.title2')}
                        </div>
                        <div className="font-hubot font-medium text-[22px] md:text-[38px] leading-[1.1]">
                            {t('price.title3')} <span className="text-blue-500">Facebook</span>

                        </div>
                    </div>
                </div>

                {/*slide*/}
                <div className="slider-container md:pt-8 py-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {data.map((plan, index) => (
                            <PricingCardSecond
                                key = {index}
                                {...plan}
                                colors={colors[index]}
                                iconCheck={iconCheck[index]}
                            />
                            ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Price;
