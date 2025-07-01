import React from "react";

const WhyChoose = () => {
    return (
        <div className="py-8 md:py-12 md:pt-24 md:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
                    <div className="inline-flex h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] items-center">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
                        <div className="font-hubot font-normal text-[14px] md:text-[16px] whitespace-nowrap">
                            TẠI SAO CHỌN AKA ADS?
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end w-full">
                        <div className="font-hubot font-medium text-[24px] md:text-[40px] leading-[1.1] pb-2 md:mr-[139px] mr-0">
                            Tài khoản ổn định
                        </div>
                        <div className="font-hubot font-medium text-[22px] md:text-[38px] leading-[1.1]">
                            <span className="text-blue-600">bứt tốc doanh số </span>
                            <span>hiệu quả</span>
                        </div>
                    </div>

                </div>

                {/* First card */}
                <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
                        {/* Left content */}
                        <div className="flex flex-col justify-between space-y-4 md:space-y-0">
                            <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                                <div className="md:mb-3 mb-0">
                                    <img
                                        src="/homepage/why-choose/missile.svg"
                                        alt="missile"
                                        className="w-12 h-12 md:w-auto md:h-auto"
                                    />
                                </div>
                                <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                                    <span>Tài khoản mạnh</span><br/>Đẩy nhanh quảng cáo
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Tài khoản chất lượng cao, <br className="hidden md:block"/> ngưỡng thanh toán lớn.
                                </div>
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Xét duyệt nhanh, phân phối hiệu quả, <br className="hidden md:block"/>không lo giới hạn ngân sách.
                                </div>
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="/homepage/why-choose/test.png"
                                alt="akaads"
                                className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Second card */}
                <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
                        {/* Left image - appears second on mobile */}
                        <div className="flex justify-center md:justify-start order-2 md:order-1 mt-[24px] md:mt-[0]">
                            <img
                                src="/homepage/why-choose/test.png"
                                alt="akaads"
                                className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                            />
                        </div>

                        {/* Right content - appears first on mobile */}
                        <div className="flex flex-col justify-between space-y-4 md:space-y-0 order-1 md:order-2">
                            <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                                <div className="md:mb-3 mb-0">
                                    <img
                                        src="/homepage/why-choose/setting.svg"
                                        alt="setting"
                                        className="w-12 h-12 md:w-auto md:h-auto "
                                    />
                                </div>
                                <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                                    Quy trình quản lý <br className="hidden md:block"/>tinh gọn
                                </div>
                            </div>

                            <div>
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Linh hoạt lựa chọn – tài khoản mạnh,<br/>backup sẵn sàng, quảng cáo không ngắt mạch
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Third card*/}
                <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
                        {/* Left content */}
                        <div className="flex flex-col justify-between space-y-4 md:space-y-0">
                            <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                                <div className="md:mb-3 mb-0">
                                    <img
                                        src="/homepage/why-choose/shield.svg"
                                        alt="shield"
                                        className="w-12 h-12 md:w-auto md:h-auto"
                                    />
                                </div>
                                <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                                    Tích hợp hệ thống <br className="hidden md:block" />bảo mật hiện đại
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-black text-left  font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Cam kết bảo mật 100%, <br className="hidden md:block" />không lo bị hack.
                                </div>
                                <div className="text-black text-left  font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Giao dịch minh bạch, <br className="hidden md:block" />không phát sinh chi phí ẩn.
                                </div>
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="/homepage/why-choose/test.png"
                                alt="akaads"
                                className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/*Fourth card*/}
                <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
                        {/* Left image - appears second on mobile */}
                        <div className="flex justify-center md:justify-start order-2 md:order-1 mt-[24px] md:mt-[0]">
                            <img
                                src="/homepage/why-choose/test.png"
                                alt="akaads"
                                className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                            />
                        </div>

                        {/* Right content - appears first on mobile */}
                        <div className="flex flex-col justify-between space-y-4 md:space-y-0 order-1 md:order-2">
                            <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                                <div className="md:mb-3 mb-0">
                                    <img
                                        src="/homepage/why-choose/lightning.svg"
                                        alt="lightning"
                                        className="w-12 h-12 md:w-auto md:h-auto"
                                    />
                                </div>
                                <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                                    <span>Kích hoạt nhanh, vận hành <br/>liền mạch</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    <div>Nạp tiền tự động, dễ dàng chọn mệnh giá và tạo lệnh.</div><br className="hidden md:block"/>
                                    <div className="mt-[8px] md:mt-[0px]">Hệ thống tự động cập nhật chính xác <br className="hidden md:block"/>trên từng tài khoản.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*fifth card*/}
                <div className="bg-[#F5FAFF] shadow-md border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow mb-6 md:mb-12">
                    <div className="flex flex-col md:flex-row justify-between p-6 md:p-[60px] space-y-6 md:space-y-0">
                        {/* Left content */}
                        <div className="flex flex-col justify-between space-y-4 md:space-y-0">
                            <div className="flex md:flex-col flex-row gap-3 md:gap-0 items-center md:items-start">
                                <div className="md:mb-3 mb-0">
                                    <img
                                        src="/homepage/why-choose/card.svg"
                                        alt="card"
                                        className="w-12 h-12 md:w-auto md:h-auto"
                                    />
                                </div>
                                <div className="font-hubot text-[22px] md:text-[28px] font-[500] leading-[130%]">
                                    <span>Thanh toán linh hoạt, <br />dễ dàng</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Tích hợp đa phương thức thanh toán.
                                </div>
                                <div className="text-black text-left font-hubot text-[16px] md:text-[18px] font-[400] leading-[140%]">
                                    Tự động xử lý giao dịch, bảo mật tuyệt đối,<br/>không lo gián đoạn
                                </div>
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="flex justify-center md:justify-end">
                            <img
                                src="/homepage/why-choose/test.png"
                                alt="akaads"
                                className="max-w-full h-auto max-h-48 md:max-h-none object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyChoose;
