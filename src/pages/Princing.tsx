import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import BaseHeader from '../api/BaseHeader';
import { CheckCircleOutlined } from '@ant-design/icons';

interface BudgetItem {
  id?: string;
  name: string;
  description: string[];
  amount: number;
  start_date: string;
  end_date: string;
  currency: string;
  percentage: number;
}

export default function PricingPage() {
  const [data, setData] = useState<BudgetItem[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await BaseHeader({ method: 'get', url: '/budget' });
        setData(res.data.data || []);
      } catch {
        setData([]);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className=" backdrop-blur-sm border-b border-white/20 z-50">
          <div className="max-w-7xl mx-auto pb-6 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
                    Bảng giá thuê tài khoản quảng cáo
                  </h2>
                  <p className="mt-1 text-base text-gray-500">
                    <span>
                      Tối ưu chi phí – đơn giản hóa quy trình thuê tài khoản.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-4 md:grid-cols-2">
          {data.map((plan) => (
            <div
              key={plan.name}
              className="group relative overflow-hidden rounded-xl shadow bg-white hover:bg-indigo-900 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:text-white cursor-pointer"
            >
              <svg
                className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <defs>
                  <pattern
                    id={`lines-${plan.name}`}
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M 0 4 L 4 0" stroke="white" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect
                  width="100"
                  height="100"
                  fill={`url(#lines-${plan.name})`}
                />
              </svg>

              <div className="relative z-10 p-8">
                <Tooltip title={plan.name} placement="top">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 h-16 overflow-hidden line-clamp-2 leading-8">
                    {plan.name}
                  </h3>
                </Tooltip>
                <p className="text-sm mb-6 text-gray-500 group-hover:text-blue-200 transition-colors duration-300">
                  Chỉ từ
                </p>
                {/* Pricing */}
                <div className='h-[112px]'>
                <div className="flex items-center mb-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold leading-none text-gray-900 group-hover:text-white transition-colors duration-300">
                      {plan.amount}
                      <span className="ml-1 text-lg text-gray-600 group-hover:text-blue-200 transition-colors duration-300">
                        / Tháng
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-text-xl mb-6 text-gray-600 group-hover:text-blue-200 transition-colors duration-300">
                  {plan.percentage}%{' '}
                  <span className="text-sm"> / Tài khoản</span>
                </p>
                </div>
                <button className="w-full h-12 rounded-lg text-base font-medium mb-8 transition-all duration-300 bg-indigo-900 hover:bg-indigo-800 text-white group-hover:bg-green-500 group-hover:hover:bg-green-600">
                  Thuê ngay
                </button>
                {/* Features */}
                <ul className="space-y-4">
                  {plan.description.map((feature, index) => (
                    <li
                      key={`${plan.name}-${index}`}
                      className="flex items-start"
                    >
                      <CheckCircleOutlined className="mr-3 text-lg text-green-500 group-hover:text-green-400 transition-colors duration-300" />
                      <span className="text-sm text-gray-700 group-hover:text-blue-100 transition-colors duration-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}