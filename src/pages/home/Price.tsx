import React, {useEffect,useState} from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import CustomNextArrow from '../pricelist/CustomNextArrow.tsx';
import BaseHeader from "../../api/BaseHeader.ts";
import PricingCard from "../pricelist/PricingCard.tsx";
import PricingCardSecond from "../pricelist/PricingCardSecond.tsx";

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
        const language = localStorage.getItem("i18nextLng");
        const langParse = language ? language : 'vi';

        const fetch = async () => {
            try {
                const res = await BaseHeader({
                    method: 'get',
                    url: '/budget',
                    params: {
                        lang: langParse,
                    },
                });
                setData(res.data.data || []);
            } catch {
                setData([]);
            }
        };
        fetch();
    }, []);

    const colors = ["#4B5F77","#619CFF","#4088FF", "#0061FF"];
    const iconCheck = [
      "/homepage/why-choose/check-circle-1.svg",
      "/homepage/why-choose/check-circle-2.svg",
      "/homepage/why-choose/check-circle-3.svg",
      "/homepage/why-choose/check-circle-4.svg",
    ];

    return (
        <div className="py-8 md:py-12 md:pt-24 md:pb-16 bg-[#F5FAFF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
                    <div className="inline-flex h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] items-center">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
                        <div className="font-hubot font-normal text-[14px] md:text-[16px] whitespace-nowrap">
                            BÁO GIÁ DỊCH VỤ
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end w-full">
                        <div className="font-[Helvetica] font-bold text-[24px] md:text-[40px] leading-[1.1] pb-2">
                            Gói Thuê Tài Khoản
                        </div>
                        <div className="font-[Helvetica] font-bold text-[22px] md:text-[38px] leading-[1.1]">
                            <span>Quảng Cáo </span>
                            <span className="text-blue-500">Facebook</span>

                        </div>
                    </div>
                </div>

                {/*slide*/}
                <div className="slider-container px-8 md:px-4 md:py-8 py-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 max-w-7xl mx-auto">
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
