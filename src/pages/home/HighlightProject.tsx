import React from "react";
import {useTranslation} from "react-i18next";

const HighlightProject = () => {
    const { t } = useTranslation();

    return (
        <div className="py-6 md:pb-16 bg-[#F5FAFF]">
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
        
                  .font-mona {
                    font-family: 'Mona Sans', sans-serif;
                  }
                `}
            </style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-4 md:space-y-0">
                    <div className="inline-flex h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] items-center">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
                        <div className="font-hubot font-normal text-[14px] md:text-[16px] whitespace-nowrap">
                            {t('highlightProject.title')}
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end w-full">
                        <div className="font-hubot font-medium text-[24px] md:text-[40px] leading-[1.1] pb-2">
                            {t('highlightProject.title2')}
                        </div>
                        <div className="font-hubot font-medium text-[22px] md:text-[38px] leading-[1.1]">
                          <span className="text-[#1E8CFF] italic">{t('highlightProject.title3')} </span>
                        </div>
                    </div>
                </div>

                <div className="font-mona text-[#6B7280] text-lg font-medium max-w-[657px] my-6 md:text-start ml-auto text-start">
                    {t('highlightProject.content')}
                </div>

                <div className="md:pt-8 py-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src="/homepage/highlight/ttnew1.png" alt="akamedia"/>
                        <img src="/homepage/highlight/ttnew2.png" alt="akamedia"/>
                        <img src="/homepage/highlight/ttnew3.png" alt="akamedia"/>
                        <img src="/homepage/highlight/highlight4.png" alt="akamedia"/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HighlightProject;
