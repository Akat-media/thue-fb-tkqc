import React from 'react';
import PricingTable from './PricingTable';

const plans = [
    {
        name: 'Marketing',
        priceMonthly: 300,
        features: ['Quyền tạo chiến dịch', 'Báo cáo cơ bản', 'Hỗ trợ qua email'],
    },
    {
        name: 'Performance',
        priceMonthly: 600,
        features: ['Tất cả Marketing', 'Theo dõi chuyển đổi nâng cao', 'Hỗ trợ ưu tiên'],
        popular: true,
    },
    {
        name: 'Enterprise',
        priceMonthly: 1200,
        features: [
            'Tất cả Performance',
            'Tích hợp API',
            'Quản lý nhiều tài khoản',
            'Dedicated account manager',
        ],
    },
];

const PriceList: React.FC = () => (
    <>
        <div className="text-center pt-12 px-8 pb-12 bg-gradient-to-br from-cyan-400 via-transparent to-violet-500">
            <h1 className="text-4xl font-bold font-sans">Thuê <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">tài khoản</span> với gói đăng ký phù hợp</h1>
        </div>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
            <h1 className="text-3xl font-bold text-center mb-8">Bảng giá tài khoản quảng cáo</h1>
                <PricingTable plans={plans} />
            </div>
        </div>
    </>
);

export default PriceList;
