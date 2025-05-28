import React from "react";
import Layout from "../../components/layout/Layout";
import {Bell, Settings, User} from "lucide-react";
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
    return (<Layout>
            <div className="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-300"/>
                    <span className="font-medium font-sans">AKA Media</span>
                </div>
                <div className="flex items-center gap-6 max-md:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 dark:bg-white/5 dark:inset-ring-white/2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            className="-ml-0.5 size-4 fill-gray-600 dark:fill-gray-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <kbd className="font-sans text-xs/4 text-gray-500 not-[.os-macos_&]:block dark:text-gray-400">
                            Ctrl K
                        </kbd>
                    </button>
                    <Settings className="w-5 h-5 text-gray-600 cursor-pointer"/>
                    <User className="w-5 h-5 text-gray-600 cursor-pointer"/>
                </div>
            </div>

        <div className="flex flex-1 flex-col">
            <div
                className="w-full max-w-screen-3xl mx-auto box-border px-0 sm:px-10 pt-[var(--layout-dashboard-content-pt)] pb-[var(--layout-dashboard-content-pb)] flex flex-col flex-[1_1_auto]"
            >
                <div className="mb-10 text-xl font-bold leading-6 font-sans">
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
                        value="289.500"
                        icon="/ic-glass-users.svg"
                        trend={-0.1}
                        color="bg-purple-300 text-purple-800"
                    />
                    <StatCard
                        title="Số lượng người dùng đăng ký"
                        value="2.400.000"
                        icon="/ic-glass-buy.svg"
                        trend={2.8}
                        color="bg-yellow-300 text-yellow-800"
                    />
                    <StatCard
                        title="Số lượng chiến dịch"
                        value="89.200"
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

    </Layout>);
};

export default Analytics;
