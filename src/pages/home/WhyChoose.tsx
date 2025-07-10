import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
const WhyChoose = () => {
    const { t } = useTranslation();
       
    return (
      <div className="pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-4 md:space-y-0">
            <div className="inline-flex h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] items-center">
              <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
              <div className="font-hubot font-normal text-[14px] md:text-[16px] whitespace-nowrap">
                {t('whyChoose.button')}
              </div>
            </div>

            <div className="flex flex-col">
            {/* <div className="flex"> */}
              <div className="font-hubot font-medium text-[24px] md:text-[40px] leading-[1.1] pb-2 mr-0">
                {t('whyChoose.headingLine1')}
              </div>
              <div className="font-hubot font-medium text-[22px] md:text-[38px] leading-[1.1]">
                <span className="text-[#1E8CFF]">{t('whyChoose.highlight')} </span>
                <span>{t('whyChoose.headingLine2')} </span>
              </div>
            </div>
          </div>

          {/* First card */}
          <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
            <div className="flex gap-5 flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
              {/* Left content */}
              <div className="flex gap-3 flex-col justify-between space-y-4 md:space-y-0">
                <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                  <div className="md:mb-3 mb-0">
                    <img
                      src="/homepage/why-choose/missile.svg"
                      alt="missile"
                      className="w-12 h-12 md:w-auto md:h-auto"
                      data-aos="zoom-in"
                    />
                  </div>
                  <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                    <span>{t('strongAccount.titleLine1')}</span>
                    <br />
                    {t('strongAccount.titleLine2')}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                  {t('strongAccount.descLine1')}, <br className="hidden md:block" />{' '}
                  {t('strongAccount.descLine2')}
                  </div>
                  <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                  {t('strongAccount.descLine3')},{' '}
                    <br className="hidden md:block" />
                    {t('strongAccount.descLine4')}
                  </div>
                </div>
              </div>

              {/* Right image */}
              <div className="flex justify-center md:justify-end">
                <img
                  src="/homepage/why-choose/test.png"
                  alt="akaads"
                  className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                  data-aos="fade-left"
                />
              </div>
            </div>
          </div>

          {/* Second card */}
          {/*<div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">*/}
          {/*  <div className="flex gap-5 flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">*/}
          {/*    /!* Left image - appears second on mobile *!/*/}
          {/*    <div className="flex justify-center md:justify-start order-2 md:order-1 mt-[24px] md:mt-[0]">*/}
          {/*      <img*/}
          {/*        src="/homepage/why-choose/test.png"*/}
          {/*        alt="akaads"*/}
          {/*        className="max-w-full h-auto max-h-48 md:max-h-none object-contain"*/}
          {/*        data-aos="fade-right"*/}
          {/*      />*/}
          {/*    </div>*/}

          {/*    /!* Right content - appears first on mobile *!/*/}
          {/*    <div className="flex flex-col gap-3 justify-between space-y-4 md:space-y-0 order-1 md:order-2">*/}
          {/*      <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">*/}
          {/*        <div className="md:mb-3 mb-0">*/}
          {/*          <img*/}
          {/*            src="/homepage/why-choose/setting.svg"*/}
          {/*            alt="setting"*/}
          {/*            className="w-12 h-12 md:w-auto md:h-auto "*/}
          {/*            data-aos="zoom-in"*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">*/}
          {/*          {t('streamlinedProcess.title')}*/}
          {/*        </div>*/}
          {/*      </div>*/}

          {/*      <div>*/}
          {/*        <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">*/}
          {/*          {t('streamlinedProcess.descLine1')}*/}
          {/*          <br />*/}
          {/*          {t('streamlinedProcess.descLine2')}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*Third card*/}
          {/*<div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">*/}
          {/*  <div className="flex gap-5 flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">*/}
          {/*    /!* Left content *!/*/}
          {/*    <div className="flex gap-3 flex-col justify-between space-y-4 md:space-y-0">*/}
          {/*      <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">*/}
          {/*        <div className="md:mb-3 mb-0">*/}
          {/*          <img*/}
          {/*            src="/homepage/why-choose/shield.svg"*/}
          {/*            alt="shield"*/}
          {/*            className="w-12 h-12 md:w-auto md:h-auto"*/}
          {/*            data-aos="zoom-in"*/}
          {/*          />*/}
          {/*        </div>*/}
          {/*        <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">*/}
          {/*        {t('systemSecurity.titleLine1')} <br className="hidden md:block" />*/}
          {/*        {t('systemSecurity.titleLine2')} */}
          {/*        </div>*/}
          {/*      </div>*/}

          {/*      <div className="space-y-2">*/}
          {/*        <div className="text-black text-left  font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">*/}
          {/*        {t('systemSecurity.descLine1')} <br className="hidden md:block" />*/}
          {/*        {t('systemSecurity.descLine2')}*/}
          {/*        </div>*/}
          {/*        <div className="text-black text-left  font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">*/}
          {/*        {t('systemSecurity.descLine3')} <br className="hidden md:block" />*/}
          {/*        {t('systemSecurity.descLine4')}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}

          {/*    /!* Right image *!/*/}
          {/*    <div className="flex justify-center md:justify-end">*/}
          {/*      <img*/}
          {/*        src="/homepage/why-choose/test.png"*/}
          {/*        alt="akaads"*/}
          {/*        className="max-w-full h-auto max-h-48 md:max-h-none object-contain"*/}
          {/*        data-aos="fade-left"*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*Fourth card*/}
          <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
            <div className="flex gap-5 flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
              {/* Left image - appears second on mobile */}
              <div className="flex justify-center md:justify-start order-2 md:order-1 mt-[24px] md:mt-[0]">
                <img
                  src="/homepage/why-choose/test.png"
                  alt="akaads"
                  className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                  data-aos="fade-right"
                />
              </div>

              {/* Right content - appears first on mobile */}
              <div className="flex flex-col gap-3 justify-between space-y-4 md:space-y-0 order-1 md:order-2">
                <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                  <div className="md:mb-3 mb-0">
                    <img
                      src="/homepage/why-choose/lightning.svg"
                      alt="lightning"
                      className="w-12 h-12 md:w-auto md:h-auto"
                      data-aos="zoom-in"
                    />
                  </div>
                  <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                    <span><Trans i18nKey="active.title" /></span>
                  </div>
                </div>

                <div>
                  <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                    <div>
                        <Trans i18nKey="active.descLine1" />
                    </div>
                    <div className="mt-[8px] md:mt-[0px]">
                        <Trans i18nKey="active.descLine2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*fifth card*/}
          <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex gap-5 flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
              {/* Left content */}
              <div className="flex gap-3 flex-col justify-between space-y-4 md:space-y-0">
                <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                  <div className="md:mb-3 mb-0">
                    <img
                      src="/homepage/why-choose/card.svg"
                      alt="card"
                      className="w-12 h-12 md:w-auto md:h-auto"
                      data-aos="zoom-in"
                    />
                  </div>
                  <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                    <span>
                        <Trans i18nKey="payment.title" />
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                    <Trans i18nKey="payment.descLine1" />
                  </div>
                  <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                    <Trans i18nKey="payment.descLine2" />
                  </div>
                </div>
              </div>

              {/* Right image */}
              <div className="flex justify-center md:justify-end">
                <img
                  src="/homepage/why-choose/test.png"
                  alt="akaads"
                  className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                  data-aos="fade-left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default WhyChoose;
