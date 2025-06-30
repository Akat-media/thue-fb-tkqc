import React, { useState, useEffect  } from "react";
import { Card, CardContent } from "../../components/ui/Card.tsx";
import ChevronRightGradient from "./ChevronRightGradient.tsx";
import { ChevronRight } from "lucide-react";
import { useSwipeable } from 'react-swipeable';

const Blog = () => {
    const [startIndex, setStartIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [articlesCount, setArticlesCount] = useState(window.innerWidth >= 768 ? 3 : 1);


    const newsArticles = [
        {
            id: 1,
            title: "Thuê tài khoản quảng cáo Facebook 1",
            date: "25/04/2025",
            excerpt: "Giải pháp thuê tài khoản quảng cáo Facebook an toàn, hiệu quả cho doanh nghiệp.",
            url: "https://akamedia.vn/thue-tai-khoan-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/thue-tai-khoan-quang-cao-facebook.png",
        },
        {
            id: 2,
            title: "Tài Khoản Quảng Cáo Facebook: Hướng Dẫn Chi Tiết Cho Người Mới 2",
            date: "06/05/2025",
            excerpt:
                "Trong thời đại số hóa ngày nay, việc quảng bá sản phẩm và dịch vụ trên các nền tảng mạng xã hội trở nên quan trọng hơn bao giờ hết. Facebook có hơn 2,9 tỷ người dùng hoạt động hàng tháng.",
            url: "https://akamedia.vn/tai-khoan-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/T%C3%A0i%20kho%E1%BA%A3n%20qu%E1%BA%A3ng%20c%C3%A1o%20Facebook.png",
        },
        {
            id: 3,
            title: "Chạy quảng cáo Facebook giá rẻ 3",
            date: "15/05/2025",
            excerpt: "Chiến lược tối ưu ngân sách khi chạy quảng cáo Facebook với chi phí thấp nhất.",
            url: "https://akamedia.vn/chay-quang-cao-facebook-gia-re",
            image: "https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png",
        },
        {
            id: 4,
            title: "Tối ưu hóa quảng cáo Facebook cho doanh nghiệp nhỏ 4",
            date: "20/05/2025",
            excerpt: "Hướng dẫn chi tiết cách tối ưu hóa quảng cáo Facebook cho các doanh nghiệp nhỏ với ngân sách hạn chế.",
            url: "https://akamedia.vn/toi-uu-hoa-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png",
        },
        {
            id: 5,
            title: "Tối ưu hóa quảng cáo Facebook cho doanh nghiệp nhỏ 5",
            date: "20/05/2025",
            excerpt: "Hướng dẫn chi tiết cách tối ưu hóa quảng cáo Facebook cho các doanh nghiệp nhỏ với ngân sách hạn chế.",
            url: "https://akamedia.vn/toi-uu-hoa-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png",
        },
        {
            id: 6,
            title: "Tối ưu hóa quảng cáo Facebook cho doanh nghiệp nhỏ 6",
            date: "20/05/2025",
            excerpt: "Hướng dẫn chi tiết cách tối ưu hóa quảng cáo Facebook cho các doanh nghiệp nhỏ với ngân sách hạn chế.",
            url: "https://akamedia.vn/toi-uu-hoa-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png",
        },
        {
            id: 7,
            title: "Tối ưu hóa quảng cáo Facebook cho doanh nghiệp nhỏ 7",
            date: "20/05/2025",
            excerpt: "Hướng dẫn chi tiết cách tối ưu hóa quảng cáo Facebook cho các doanh nghiệp nhỏ với ngân sách hạn chế.",
            url: "https://akamedia.vn/toi-uu-hoa-quang-cao-facebook",
            image: "https://akamedia.vn/assets/images/news-and-events/content/chay-quang-cao-facebook-gia-re.png",
        },
    ];

    const handleNext = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTimeout(() => {
            const increment = window.innerWidth >= 768 ? 3 : 1;
            if (startIndex + increment < newsArticles.length) {
                setStartIndex((prev) => prev + increment);
            } else {
                setStartIndex(0);
            }
            setIsTransitioning(false);
        }, 150);
    };

    const handleBack = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setTimeout(() => {
            const decrement = window.innerWidth >= 768 ? 3 : 1;
            if (startIndex >= decrement) {
                setStartIndex((prev) => prev - decrement);
            }
            setIsTransitioning(false);
        }, 150);
    };

    const displayedArticles = newsArticles.slice(startIndex, startIndex + articlesCount);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handleBack(),
        preventDefaultTouchmoveEvent: true,
        trackTouch: true,
    } as any );

    useEffect(() => {
        const updateArticlesCount = () => {
            setArticlesCount(window.innerWidth >= 768 ? 3 : 1);
        };
        window.addEventListener("resize", updateArticlesCount);
        updateArticlesCount();

        return () => window.removeEventListener("resize", updateArticlesCount);
    }, []);

    useEffect(() => {
        if (startIndex + articlesCount > newsArticles.length) {
            setStartIndex(0);
        }
    }, [articlesCount, newsArticles.length]);

    return (
        <div className="py-12 md:pt-24 md:pb-16 bg-blue-50">
            <style>{`
                .fade-transition {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .fade-out {
                    opacity: 0;
                    transform: translateY(20px);
                }
                .button-hover:hover {
                    transform: scale(1.1);
                    transition: all 0.2s ease;
                }
                .button-hover:active {
                    transform: scale(0.95);
                }
                .button-hover {
                    transition: all 0.2s ease;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-[107px] h-[52px] gap-[10px] rounded-[60px] border border-solid border-black p-[20px] flex flex-row items-center justify-between">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400"></div>
                        <div className="font-hubot font-normal md:text-[16px] text-[14px]">BLOG</div>
                    </div>
                    <div className="flex flex-col items-end w-full">
                        <div className="font-hubot font-medium text-[20px] md:text-[40px] leading-[1] pb-2">
                            Cập Nhật Tin Tức Mới Nhất
                        </div>
                        <div className="font-hubot font-medium text-[20px] md:text-[38px] leading-[1]">
                            <span>Từ </span>
                            <span className="text-blue-600">Thị Trường & Nền Tảng</span>
                        </div>
                    </div>
                    <div className="hidden md:flex w-[107px] h-[52px] gap-[10px] rounded-[60px] border border-solid border-black flex-row items-center justify-between invisible">
                        <div className="w-[12px] h-[12px] rounded-full bg-cyan-400 border-4 border-cyan-400" />
                        <div className="font-[400] text-[16px]">BLOG</div>
                    </div>
                </div>

                <div className="flex md:flex-row flex-col gap-8 items-start">
                    {/* Grid cards với animation */}
                    {/*swipe left, right tren mobile*/}
                    <div {...swipeHandlers}>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow fade-transition ${isTransitioning ? 'fade-out' : ''}`}>
                        {displayedArticles.map((article) => (
                            <Card
                                key={article.id}
                                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                            >
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-68 object-cover"
                                />
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <div className="flex flex-col flex-grow">
                                        <div className="font-hubot text-sm text-gray-500 mb-2">
                                            {article.date}
                                        </div>
                                        <h3 className="max-w-full text-[#676767] font-hubot text-[20px] font-bold leading-[24px] tracking-[0.25px] mt-[15px] mb-[15px]">
                                            {article.title}
                                        </h3>
                                        <p className="text-[#676767] font-hubot text-[16px] leading-[24px] tracking-[0.25px] line-clamp-2 mb-4">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm font-medium mt-auto"
                                    >
                                        <span className="font-hubot inline-flex items-center bg-gradient-to-r from-[#00EFBF] via-[#00EAEA] to-[#00F2F6] bg-clip-text text-transparent">
                                            Đọc thêm
                                            <ChevronRightGradient className="ml-1 h-4 w-4" />
                                        </span>
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    </div>

                    {/* Navigation buttons cho desktop */}
                    <div className="hidden md:flex flex-col items-center gap-4 mt-4 ml-4 self-center">
                        {startIndex > 0 && (
                            <button
                                onClick={handleBack}
                                disabled={isTransitioning}
                                className="p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition button-hover disabled:opacity-50"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600 rotate-180" />
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            disabled={isTransitioning}
                            className="p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition button-hover disabled:opacity-50"
                        >
                            <ChevronRight className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Navigation buttons cho mobile */}
                <div className="flex md:hidden justify-end mt-6">
                    <div className="flex gap-2">
                        <button
                            onClick={handleBack}
                            disabled={isTransitioning || startIndex === 0}
                            className="p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition button-hover disabled:opacity-50"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600 rotate-180" />
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isTransitioning}
                            className="p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition button-hover disabled:opacity-50"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
