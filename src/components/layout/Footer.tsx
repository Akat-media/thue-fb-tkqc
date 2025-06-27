import React from 'react';
import ChevronRightGradient from "../../pages/home/ChevronRightGradient.tsx";
import { Copyright } from 'lucide-react';

// import { Link } from 'react-router-dom';
// import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
      <div>
        {/*<div className="bg-gray-200 h-28"></div>*/}
        <footer className="bg-gradient-to-r from-[#0061FF] to-[#60EFFF]  text-white">
            <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8">
                <div>
                    <img src="/homepage/footer/aka-white.png" alt="aka-footer"/>
                </div>

                <div className="flex flex-col md:flex-row md:gap-28">
                    {/*left*/}
                    <div className="flex flex-col p-6">
                        <div className="font-hubot text-[20px] md:text-[32px] font-[700]">Agency Truyền Thông AKA Media</div>
                        <div>
                            <div className="flex flex-row items-center py-3">
                                <img src="/homepage/footer/location.png" alt="location"/>
                                <div className="font-hubot font-[500] pl-5 max-w-[450px]">Tầng 4, Tòa nhà Việt
                                    Hương, 1 Làng nghề, Triều Khúc, Thanh Trì, Hà Nội, Việt Nam
                                </div>
                            </div>
                            <div className="flex flex-row items-center py-3">
                                <img src="/homepage/footer/message.png" alt="message"/>
                                <div className="font-hubot font-[500] pl-5">cskh@akamedia.vn</div>
                            </div>
                            <div className="flex flex-row items-center py-3">
                                <img src="/homepage/footer/phone.png" alt="phone"/>
                                <div className="font-hubot font-[500] pl-5">038 595 8416</div>
                            </div>

                            <div className="flex flex-row items-center py-3 gap-2 pl-14">
                                <img src="/homepage/footer/fb.png" alt="facebook"/>
                                <img src="/homepage/footer/zalo.png" alt="zalo"/>
                                <img src="/homepage/footer/youtube.png" alt="youtube"/>
                                <img src="/homepage/footer/insta.png" alt="instagram"/>
                            </div>
                        </div>
                    </div>

                    {/*right */}
                    <div className="flex md:flex-row flex-col">
                        <div className="mb-5 md:mb-0">
                            <div className="font-hubot text-[20px] font-[700]">DỊCH VỤ</div>
                            <div className="font-hubot font-[500] flex flex-row text-black px-2 pt-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Cho thuê BM
                            </div>
                            <div className="font-hubot font-[500] flex flex-row text-black pl-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Cho thuê tài khoản quảng cáo
                            </div>
                            <div className="font-hubot font-[500] flex flex-row text-black pl-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Nạp tiền
                            </div>
                            <div className="font-hubot font-[500] flex flex-row text-black pl-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Quản lý tài khoản
                            </div>
                        </div>
                        <div className="md:pl-8 mb-5 md:mb-0">
                            <div className="font-hubot text-[20px] font-[700]">HỖ TRỢ</div>
                            <div className="font-hubot font-[500] flex flex-row text-black px-2 pt-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                FAQ
                            </div>
                            <div className="font-hubot font-[500] flex flex-row text-black pl-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Điều khoản sử dụng
                            </div>
                            <div className="font-hubot font-[500] flex flex-row text-black pl-2">
                                <ChevronRightGradient isBlack width={24} height={24}/>
                                Chính sách bảo mật
                            </div>
                        </div>
                    </div>
                </div>

                {/*copyright*/}
                <div className="font-hubot flex flex-row justify-center font-normal p-4 text-[16px] leading-[24px] tracking-[0.1px] text-right border-t border-white ">
                    <Copyright />
                    <span className="pl-2 ">AKA Media, 2025. Bảo lưu mọi quyền.</span>
                </div>

            </div>

            {/*copyright*/}
            {/*<div className="border-t border-white w-full">*/}
            {/*    <div className="font-hubot flex flex-row justify-center font-normal p-4 text-[16px] leading-[24px] tracking-[0.1px] text-right border-t border-white ">*/}
            {/*        <Copyright />*/}
            {/*        <span className="pl-2 ">AKA Media, 2025. Bảo lưu mọi quyền.</span>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </footer>
      </div>

  );
};

export default Footer;
