import React, {useEffect, useState} from 'react';
import PricingPage from "./PricingPage.tsx";

interface FAQItem {
    question: string;
    answer: string;
}
const faqData: FAQItem[] = [
    {
        question: 'Tài khoản thuê là tài khoản gì? Có khác gì tài khoản cá nhân không?',
        answer: 'Tài khoản thuê là tài khoản quảng cáo được cung cấp sẵn với lịch sử chi tiêu và độ trust cao, giúp chạy ads hiệu quả hơn so với tài khoản mới hoặc cá nhân.'
    },
    {
        question: 'Tôi cần chuẩn bị gì để sử dụng tài khoản thuê?',
        answer: 'Bạn chỉ cần có chiến dịch quảng cáo sẵn, team kỹ thuật hoặc media buyer; chúng tôi sẽ cấp quyền truy cập và hướng dẫn vận hành.'
    },
    {
        question: 'Dịch vụ có cam kết gì không? Nếu tài khoản bị khoá thì sao?',
        answer: 'Chúng tôi cam kết hỗ trợ xử lý sự cố nhanh chóng, hoàn tiền hoặc thay thế tài khoản nếu lỗi phát sinh từ phía hệ thống (tùy chính sách từng gói).'
    },
    {
        question: 'Có thể thanh toán theo ngày/tuần/tháng không?',
        answer: 'Có, các gói thuê được thiết kế linh hoạt: theo ngày, tuần, hoặc theo ngân sách tiêu dùng (CPM). Giá sẽ khác nhau tùy hạn mức và độ trust.',
    },
    {
        question: 'Có bị giới hạn ngành hàng hoặc nội dung quảng cáo không?',
        answer: 'Có. Một số ngành bị giới hạn như tài chính, crypto, hoặc sản phẩm vi phạm chính sách nền tảng. Vui lòng liên hệ để kiểm tra nội dung trước khi chạy.',
    },
    {
        question: 'Tôi có thể dùng tài khoản này để chạy cho nhiều Fanpage/Website không?',
        answer: 'Tuỳ vào gói thuê. Một số gói hỗ trợ nhiều Fanpage/Domain, một số chỉ áp dụng cho 1-2 chiến dịch. Chúng tôi sẽ tư vấn rõ khi bạn đăng ký.',
    },
    {
        question: 'Thời gian nhận tài khoản sau khi đăng ký là bao lâu?',
        answer: 'Thường từ 30 phút đến 2 giờ làm việc, tuỳ mức độ phê duyệt và số lượng tài khoản có sẵn.',
    }
];

const faqDataEN: FAQItem[] = [
    {
        question: 'What is a rented ad account? How is it different from a personal account?',
        answer: 'A rented ad account is a pre-approved account with spending history and high trust, offering better performance than new or personal accounts.'
    },
    {
        question: 'What do I need to prepare to use a rented account?',
        answer: 'You just need a ready ad campaign and a technical team or media buyer. We will grant access and provide guidance on how to operate it.'
    },
    {
        question: 'Is there any service guarantee? What if the account gets banned?',
        answer: 'We commit to quick issue resolution, refunds, or account replacements if the issue originates from the system (depending on each package\'s policy).'
    },
    {
        question: 'Can I pay daily, weekly, or monthly?',
        answer: 'Yes, rental packages are flexible: daily, weekly, or based on ad spend (CPM). Prices vary by spending limit and trust level.'
    },
    {
        question: 'Are there any restrictions on industries or ad content?',
        answer: 'Yes. Some industries are restricted, such as finance, crypto, or content that violates platform policies. Please contact us to check your content in advance.'
    },
    {
        question: 'Can I use the account for multiple Fanpages/Websites?',
        answer: 'It depends on the package. Some support multiple Fanpages/Domains, while others are limited to 1–2 campaigns. We will advise clearly during registration.'
    },
    {
        question: 'How long does it take to receive the account after registration?',
        answer: 'Usually from 30 minutes to 2 working hours, depending on approval level and account availability.'
    }
];


const PriceList: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [faq, setFaq] =  useState<FAQItem[]>([]);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const language = localStorage.getItem("language");
    const langParse = language ? JSON.parse(language).language : 'vi'; // default la vi

    useEffect(() => {
        if (langParse === 'vi') {
            setFaq(faqData);
        } else {
            setFaq(faqDataEN);
        }
    }, [langParse]);

    return (
        <div className="font-sans">
            {/*banner*/}
            <div
                className="text-center sm:pt-14 px-8 sm:pb-14 pt-[24px] pb-[24px] bg-gradient-to-br from-cyan-400 via-transparent to-violet-200">
                {langParse === 'vi' ? (
                    <h1 className="text-[32px] sm:text-5xl font-bold">
                        Thuê <span className="text-[32px] sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">tài khoản</span> với
                        gói đăng ký phù hợp
                    </h1>
                ) : (
                    <h1 className="text-[32px] sm:text-5xl font-bold">
                        Rent <span className="text-[32px] sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">accounts</span> with
                        the right package
                    </h1>
                )}

            </div>

            {/*pick fee*/}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/*fee*/}
                <div className="flex justify-center">
                    <PricingPage/>
                </div>

                {/*aka media*/}
                <div className="rounded-[15px] py-12 px-6 md:py-[64px] md:px-[32px] bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
                    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2">
                        <div className="p-4 md:p-[30px] flex flex-col justify-center">
                            <div className="text-[24px] leading-[32px] md:text-[32px] md:leading-[42px] font-bold mb-4 bg-gradient-to-r from-cyan-500 to-purple-300 bg-clip-text text-transparent">
                                AKA MEDIA
                            </div>
                            <div className="text-[16px] leading-[22px] md:text-[16px] md:leading-[26px] mb-4">
                                {langParse === 'vi' ? (
                                    <>
                                        AKA Media là đơn vị cung cấp giải pháp truyền thông số tại Việt Nam, chuyên về quảng cáo đa nền tảng như Facebook,
                                        TikTok, YouTube, Google và Zalo. Công ty nổi bật với các dịch vụ như xác minh tích xanh, khôi phục tài khoản,
                                        gỡ vi phạm và seeding chuyên sâu. AKA Media đã đồng hành cùng hàng nghìn doanh nghiệp và cá nhân trên toàn quốc.
                                    </>
                                ) : (
                                    <>
                                        AKA Media is a leading provider of digital media solutions in Vietnam, specializing in multi-platform advertising on Facebook,
                                        TikTok, YouTube, Google, and Zalo. The company stands out with services such as blue tick verification, account recovery,
                                        policy violation resolution, and advanced seeding. AKA Media has supported thousands of businesses and individuals nationwide.
                                    </>
                                )}
                            </div>

                        </div>
                        <div className="p-4 md:p-[30px] flex items-center justify-center">
                            <img className="w-full max-w-[580px] h-auto" src="/homepage.png" alt="akamedia" />
                        </div>
                    </div>
                </div>

                {/*question frequently*/}
                <div className="py-12 md:py-[64px]">
                    <style>
                        {`
                            .faq-content {
                              max-height: 0;
                              overflow: hidden;
                              transition: max-height 0.5s ease;
                            }
                            .faq-content.open {
                              max-height: 500px;
                            }
                        `}
                    </style>
                    <div className="text-[14px] leading-[32px] md:text-[20px] md:leading-[42px] font-bold mb-4">
                        {langParse === 'vi' ? (
                            <span>Câu hỏi thường gặp</span>
                        ): (
                            <span>Frequently Asked Questions</span>
                        )}
                    </div>
                    {/*faq*/}
                    <div className=" ">
                        <ul className="space-y-4">
                            {faq.map((item, index) => (
                                <li key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400">
                                    <button
                                        className="w-full text-left p-4 flex justify-between items-center text-gray-700 font-medium hover:bg-blue-50"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        {item.question}
                                        <span className="text-gray-500">
                                            {activeIndex === index ? '−' : '+'}
                                        </span>
                                    </button>
                                    <div
                                        className={`faq-content ${activeIndex === index ? 'open' : ''} bg-gray-50 px-4 text-gray-600`}
                                    >
                                        <div className="py-4">{item.answer}</div>
                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PriceList;
