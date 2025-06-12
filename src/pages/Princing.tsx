import React, { useEffect, useState } from "react";
import background from "../public/sand.jpg";
import Footer from "../components/layout/Footer";
import BaseHeader from "../api/BaseHeader";

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
        const res = await BaseHeader({ method: "get", url: "/budget" });
        setData(res.data.data || []);
      } catch {
        setData([]);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] relative overflow-hidden">
      <img
        src={background}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#2a1b1123] opacity-80" />
      <div className="relative z-10 max-w-6xl mx-auto mt-20 mb-12 px-6">
        <h1 className="text-white text-center text-4xl font-semibold mb-6">
          Bảng Giá Thuê Tài Khoản Quảng Cáo
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.map((item) => {
            // Lấy ra percentage và name
            const percentage = item.percentage;
            const name = item.name;

            return (
              <div
                key={item.id}
                className="bg-[#232323]/50 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 text-center shadow-lg flex flex-col items-center min-h-[340px] mt-5"
              >
                <h2 className="text-white text-xl font-semibold mb-1">
                  {name} <span className="font-normal">/ Tháng</span>
                </h2>
                <div className="flex items-end justify-center mb-2">
                  <span className="text-4xl text-white font-bold">
                    {percentage}%
                  </span>
                  <span className="text-base text-white/80 font-normal ml-2">
                    / Tài khoản
                  </span>
                </div>
                <ul className="text-white/90 text-sm mb-8 mt-4 space-y-1">
                  {item.description.map((line, idx) => (
                    <li
                      key={idx}
                      className="flex flex-row items-center gap-2 min-h-[28px] leading-6"
                    >
                      <span className="block w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="flex-1">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-auto relative z-10">
        <Footer />
      </div>
    </div>
  );
}
