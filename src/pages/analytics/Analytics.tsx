import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Bell, Settings, User } from "lucide-react";
import StatCard from "./StatCard";
import StatsCharts from "./StatsCharts";
import ChartDashboard from "./ChartDashboard";
import axios from "axios";

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "https://api-rent.duynam.store/api/v1/statistics"
        );
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-10">Đang tải dữ liệu...</div>;

  return (
    <Layout>
      <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-red-600 font-sans">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-6 max-md:hidden">
          <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
          <User className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="w-full max-w-screen-3xl mx-auto box-border px-0 sm:px-10 pt-[var(--layout-dashboard-content-pt)] pb-[var(--layout-dashboard-content-pb)] flex flex-col flex-[1_1_auto]">
          <div className="mb-10 text-xl text-blue-600 font-bold leading-6 font-sans">
            Hi, Welcome back 👋
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto">
            <StatCard
              title="Doanh thu"
              value={`${stats.revenue.amountVND.toLocaleString("vi-VN")} VND`}
              icon="/ic-glass-bag.svg"
              trend={stats.revenueGrowth}
              color="bg-green-300 text-green-800"
            />
            <StatCard
              title="Số lượng tài khoản quảng cáo"
              value={stats.countAds.toLocaleString("vi-VN")}
              icon="/ic-glass-users.svg"
              trend={stats.adsGrowth}
              color="bg-purple-300 text-purple-800"
            />
            <StatCard
              title="Số lượng người dùng đăng ký"
              value={stats.countUser.toLocaleString("vi-VN")}
              icon="/ic-glass-buy.svg"
              trend={stats.userGrowth}
              color="bg-yellow-300 text-yellow-800"
            />
            <StatCard
              title="Số lượng giao dịch"
              value={stats.countTransaction.toLocaleString("vi-VN")}
              icon="/ic-glass-message.svg"
              trend={stats.transactionGrowth}
              color="bg-red-300 text-red-800"
            />
          </div>

          <div className="bg-gray-50">
            <StatsCharts />
          </div>

          <div className=" bg-gray-50">
            <ChartDashboard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
