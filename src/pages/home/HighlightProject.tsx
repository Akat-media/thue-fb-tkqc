import React from "react";
import {useTranslation} from "react-i18next";

const HighlightProject = () => {
    const { t } = useTranslation();

    return (
        <div className="py-8 md:py-12 md:pt-24 md:pb-16 bg-[#F5FAFF]">
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
                          <span className="text-blue-500">{t('highlightProject.title3')} </span>
                        </div>
                    </div>
                </div>

                <div className="font-hubot text-[18px] max-w-[657px] my-6 md:text-right ml-auto">
                    {t('highlightProject.content')}
                </div>

                <div className="md:pt-8 py-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img src="/homepage/highlight/highlight2.png" alt="akamedia"/>
                        <img src="/homepage/highlight/highlight1.png" alt="akamedia"/>
                        <img src="/homepage/highlight/highlight3.png" alt="akamedia"/>
                        <img src="/homepage/highlight/highlight4.png" alt="akamedia"/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HighlightProject;
