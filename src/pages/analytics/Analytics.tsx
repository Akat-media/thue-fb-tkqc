import React from "react";
import Layout from "../../components/layout/Layout";
import { Bell, Settings, User } from "lucide-react";
import StatCard from "./StatCard";
import StatsCharts from "./StatsCharts";
// import {
//     FaShoppingBag,
//     FaUser,
//     FaCartPlus,
//     FaEnvelope
// } from "react-icons/fa";
import ChartDashboard from "./ChartDashboard";
// import RevenueChart from "../dashboard/RevenueChart";
// import TopCampaignsCard from "./TopCampaignsCard";

const Analytics: React.FC = () => {
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
              value="2.890.000.000 VND"
              icon="/ic-glass-bag.svg"
              trend={2.6}
              color="bg-green-300 text-green-800"
            />
            <StatCard
              title="Số lượng tài khoản quảng cáo "
              value="5000"
              icon="/ic-glass-users.svg"
              trend={-0.1}
              color="bg-purple-300 text-purple-800"
            />
            <StatCard
              title="Số lượng người dùng đăng ký"
              value="3268"
              icon="/ic-glass-buy.svg"
              trend={2.8}
              color="bg-yellow-300 text-yellow-800"
            />
            <StatCard
              title="Số lượng chiến dịch"
              value="59.236"
              icon="/ic-glass-message.svg"
              trend={3.6}
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
