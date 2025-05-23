import React, { useState, useEffect } from "react";
import {
  MessageCircleHeart,
  MonitorDotIcon,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Facebook,
  Zap,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {AdAccountProvider} from "./marketplace/AdAccountContext.tsx";

interface StatCard {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
}

interface ConnectedAccount {
  id: string;
  name: string;
  status: string;
}

interface AutomationTask {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  trend,
  color,
}: StatCard) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 text-blue-600",
    green: "from-green-50 to-green-100 text-green-600",
    purple: "from-purple-50 to-purple-100 text-purple-600",
    orange: "from-orange-50 to-orange-100 text-orange-600",
    red: "from-red-50 to-red-100 text-red-600",
    yellow: "from-yellow-50 to-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div
          className={`p-2 sm:p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      <div className="flex items-end gap-2 sm:gap-3 mb-2">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function AdPerformanceChart() {
  const data = [
    { name: "Thứ 2", cost: 32000000, reach: 180000 },
    { name: "Thứ 3", cost: 42000000, reach: 220000 },
    { name: "Thứ 4", cost: 28000000, reach: 160000 },
    { name: "Thứ 5", cost: 36000000, reach: 190000 },
    { name: "Thứ 6", cost: 40000000, reach: 230000 },
    { name: "Thứ 7", cost: 30000000, reach: 170000 },
    { name: "CN", cost: 25000000, reach: 140000 },
  ];
  return (
    <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Hiệu suất quảng cáo
        </h2>
        <select
          className="text-sm border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 w-44 h-10 appearance-none bg-white bg-no-repeat bg-right pr-8"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
            backgroundPosition: "calc(100% - 0.5rem) center",
            backgroundSize: "1rem",
          }}
        >
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>3 tháng qua</option>
        </select>
      </div>

      <div className="h-[250px] sm:h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} ₫`}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cost"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#colorCost)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reach"
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
              fill="url(#colorReach)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// function ConnectedAccountsSection() {
//   const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
//   const [pages, setPages] = useState<any[]>([]);

//   useEffect(() => {
//     fetchConnectedAccounts();
//     fetchConnectedPages();
//   }, []);

//   const fetchConnectedAccounts = async () => {
//     // const { data } = await supabase.from("system_ad_accounts").select("*");
//     // setAccounts(data || []);
//   };

//   const fetchConnectedPages = async () => {
//     // const { data } = await supabase.from("facebook_connections").select("*");
//     // setPages(data || []);
//   };

//   return (
//     <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm">
//       <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
//         Tài khoản đã kết nối
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="p-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center gap-3 mb-4">
//             <MonitorDotIcon className="w-5 h-5 text-blue-600" />
//             <h3 className="font-medium">Tài khoản quảng cáo</h3>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{accounts.length}</p>
//           <p className="text-sm text-gray-600 mt-1">Tài khoản đang hoạt động</p>
//         </div>
//         <div className="p-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center gap-3 mb-4">
//             <Facebook className="w-5 h-5 text-blue-600" />
//             <h3 className="font-medium">Facebook Pages</h3>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{pages.length}</p>
//           <p className="text-sm text-gray-600 mt-1">Trang đã kết nối</p>
//         </div>
//       </div>
//     </div>
//   );
// }

function Dashboard() {
  const stats: StatCard[] = [
    {
      icon: DollarSign,
      title: "Doanh thu",
      value: "2,89 Tỷ ₫",
      description: "Tổng doanh thu tháng này",
      trend: { value: "+12.5%", positive: true },
      color: "green",
    },
    {
      icon: Target,
      title: "Chi phí quảng cáo",
      value: "289,5M ₫",
      description: "Chi phí quảng cáo tháng này",
      trend: { value: "+8.1%", positive: false },
      color: "blue",
    },
    {
      icon: Eye,
      title: "Tiếp cận",
      value: "2,4M",
      description: "Số người tiếp cận",
      trend: { value: "+15.3%", positive: true },
      color: "purple",
    },
    {
      icon: MessageCircleHeart,
      title: "Tương tác",
      value: "89,2K",
      description: "Tổng lượt tương tác",
      trend: { value: "+5.7%", positive: true },
      color: "orange",
    },
  ];

  return (
      <AdAccountProvider>
        <Layout>
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Báo Cáo Hiệu Suất
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <AdPerformanceChart />
              {/* <ConnectedAccountsSection /> */}
              <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Chiến dịch hàng đầu
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: "Summer Sale 2025",
                      spend: 105450000,
                      reach: "458K",
                      ctr: 2.8,
                    },
                    {
                      name: "New Collection Launch",
                      spend: 89250000,
                      reach: "356K",
                      ctr: 3.2,
                    },
                    {
                      name: "Holiday Special",
                      spend: 68450000,
                      reach: "289K",
                      ctr: 2.5,
                    },
                  ].map((campaign, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <span className="text-green-600 text-sm">
                          {campaign.ctr}% CTR
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{(campaign.spend / 1000000).toFixed(1)}M ₫</span>
                        <span>{campaign.reach} tiếp cận</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Chiến dịch hàng đầu
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: "Summer Sale 2025",
                      spend: 105450000,
                      reach: "458K",
                      ctr: 2.8,
                    },
                    {
                      name: "New Collection Launch",
                      spend: 89250000,
                      reach: "356K",
                      ctr: 3.2,
                    },
                    {
                      name: "Holiday Special",
                      spend: 68450000,
                      reach: "289K",
                      ctr: 2.5,
                    },
                  ].map((campaign, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <span className="text-green-600 text-sm">
                          {campaign.ctr}% CTR
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{(campaign.spend / 1000000).toFixed(1)}M ₫</span>
                        <span>{campaign.reach} tiếp cận</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </Layout>
      </AdAccountProvider>
  );
}

export default Dashboard;
