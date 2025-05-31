import React from "react";
import Layout from "../../components/layout/Layout.tsx";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PolicySection {
    title: string;
    content: string[];
}

const Policy: React.FC = () => {
    const [openSections, setOpenSections] = React.useState<Record<number, boolean>>({});

    const toggleSection = (index: number) => {
        setOpenSections((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const policies: PolicySection[] = [
        {
            title: 'Điều Khoản Sử Dụng',
            content: [
                'Người dùng phải từ 18 tuổi trở lên để sử dụng dịch vụ của AKA MEDIA.',
                'Mọi hành vi vi phạm pháp luật hoặc gây hại đến hệ thống sẽ bị cấm và có thể dẫn đến khóa tài khoản.',
                'AKA MEDIA có quyền thay đổi điều khoản mà không cần thông báo trước.',
                'Người dùng chịu trách nhiệm bảo mật thông tin tài khoản của mình.',
            ],
        },
        {
            title: 'Chính Sách Bảo Mật',
            content: [
                'Chúng tôi thu thập thông tin cá nhân (tên, email, số điện thoại) để cung cấp dịch vụ và cải thiện trải nghiệm người dùng.',
                'Thông tin của bạn sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý, trừ khi có yêu cầu từ cơ quan pháp luật.',
                'Chúng tôi sử dụng công nghệ mã hóa để bảo vệ dữ liệu người dùng.',
                'Người dùng có quyền yêu cầu xóa dữ liệu cá nhân của mình bằng cách liên hệ qua support@akamedia.com.',
            ],
        },
        {
            title: 'Chính Sách Thanh Toán',
            content: [
                'Mọi giao dịch thanh toán phải được thực hiện qua các phương thức được AKA MEDIA hỗ trợ.',
                'Không hoàn tiền cho các giao dịch đã hoàn tất, trừ khi có lỗi từ phía hệ thống.',
                'Thời gian xử lý giao dịch có thể mất từ 1-3 ngày làm việc.',
                'Người dùng cần cung cấp thông tin chính xác để tránh sai sót trong quá trình thanh toán.',
            ],
        },
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-cyan-100">
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Chính Sách và Điều Khoản
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Vui lòng đọc kỹ các chính sách dưới đây để hiểu rõ quyền lợi và trách nhiệm khi sử dụng dịch vụ của AKA MEDIA.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {policies.map((policy, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleSection(index)}
                                    className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 text-left text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    <span>{policy.title}</span>
                                    {openSections[index] ? (
                                        <ChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                                {openSections[index] && (
                                    <div className="px-6 py-4 bg-white">
                                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                            {policy.content.map((item, idx) => (
                                                <li key={idx} className="text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </Layout>
    )
}

export default Policy;
