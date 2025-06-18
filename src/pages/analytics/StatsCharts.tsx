// src/components/StatsCharts.tsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip.tsx";
import { MonthlyStats } from "../HomePage.tsx";
import { format } from "date-fns";

const COLORS = ["#9A5CEC", "#EDB24C","#E26954"];
type DataChart = {
  data: MonthlyStats
}
export default function StatsCharts({data}: DataChart) {
  const pieData = [
    { name: "SL tài khoản QC", value: data?.totals.totalAdsAccounts || 0},
    { name: "SL người dùng đăng ký", value:  data?.totals.totalUsers || 0 },
    { name: "SL giao dịch", value: data?.totals.totalTransaction || 0},
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full  mx-auto py-6">
      {/* Current Visits */}
      {!pieData.every((item) => item.value === 0) ? (
         <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-2">
         <h2 className="text-lg text-blue-800 font-semibold mb-4">Tiếp cận</h2>
         <div className="flex justify-center">
           <PieChart width={220} height={320}>
             <Pie
               data={pieData}
               cx="50%"
               cy="50%"
               label={({
                 cx,
                 cy,
                 midAngle,
                 innerRadius,
                 outerRadius,
                 percent,
               }) => {
                 const RADIAN = Math.PI / 180;
                 const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                 const x = cx + radius * Math.cos(-midAngle * RADIAN);
                 const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
                 return (
                   <text
                     x={x}
                     y={y}
                     fill="#fff"
                     textAnchor="middle"
                     dominantBaseline="central"
                     fontSize={14}
                     fontWeight={600}
                   >
                     {`${(percent * 100).toFixed(1)}%`}
                   </text>
                 );
               }}
               labelLine={false}
               outerRadius={110}
               fill="#8884d8"
               dataKey="value"
             >
               {pieData.map((_, index) => (
                 <Cell
                   key={`cell-${index}`}
                   fill={COLORS[index % COLORS.length]}
                 />
               ))}
             </Pie>
             <ReTooltip content={<CustomTooltip />} />
           </PieChart>
         </div>
 
         <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
           <span className="flex items-center gap-1">
             <span className="w-3 h-3 bg-[#9A5CEC]  rounded-full" /> SL tài khoản QC
           </span>
           <span className="flex items-center gap-1">
             <span className="w-3 h-3 bg-[#EDB24C] rounded-full" /> SL người đăng ký
           </span>
           <span className="flex items-center gap-1">
             <span className="w-3 h-3 bg-[#E26954] rounded-full" /> SL giao dịch
           </span>
         </div>
       </div>
      ) : (<></>)}
      {/* Website Visits */}
      <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-3">
        <h2 className="text-lg text-blue-800 font-semibold mb-1">
          Thống kê hoạt động
        </h2>
        {/*<p className="text-sm text-gray-500 mb-4">(+43%) than last year</p>*/}
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.monthlyStats}
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
              // barCategoryGap="20%"
              // barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(value) => `Tháng ${format(new Date(value), "M")}`} />
              <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />
              <ReTooltip
                formatter={(value) => value.toLocaleString("vi-VN")}
              />
              <Legend />
              <Bar dataKey="newAdsAccounts" fill="#9A5CEC" name={"SL tài khoản QC"} />
              <Bar dataKey="newUsers" fill="#EDB24C" name={"SL người dùng đăng ký"}/>
              <Bar dataKey="countTransactions" fill="#E26954" name={"SL giao dịch"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
