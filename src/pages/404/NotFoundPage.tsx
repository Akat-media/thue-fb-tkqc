import React, { useEffect } from 'react';
import { usePageStore } from "../../stores/usePageStore.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const NotFoundPage: React.FC = () => {
    const setIs404 = usePageStore((state) => state.setIs404);

    useEffect(() => {
        setIs404(true);
        return () => setIs404(false); // Reset khi thoát khỏi trang
    }, []);

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/404/bg.png')]">
            {/*<img*/}
            {/*    src="/logo.png"*/}
            {/*    alt="Logo"*/}
            {/*    className="absolute top-0 left-6 w-52 h-59 object-contain z-20 mt-6"*/}
            {/*/>*/}
            <div className=" rounded-2xl flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6 lg:p-8  sm:max-w-7xl w-full">
                {/* Text content */}
                <div className="">
                    <h2 className="text-[33px] md:text-[48px] font-bold text-gray-800">Ooops...</h2>
                    <p className="text-[25px] md:text-[48px] text-gray-700 mb-8">{t('404.text')}</p>
                    <p className="text-[18px] md:text-[23px] text-gray-500 mb-28 leading-9">
                        {t('404.text2')}
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="justify-center w-[250px] h-[60px] bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                        <span className="text-[20px] md:text-[24px] font-semibold">{t('404.text3')} →</span>
                    </button>
                </div>

                {/* Image */}
                <div className="">
                    <img
                        src="/404/404.png"
                        alt="404 illustration"
                        className="w-full max-w-md sm:max-w-lg md:max-w-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
