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

const pieData = [
    { name: "18-25", value: 438.000 },
    { name: "26-35", value: 313.000 },
    { name: "36-45", value: 188.000 },
    { name: "lớn hơn 45", value: 63.000 },
];

const COLORS = ["#10B981", "#FBBF24", "#3B82F6", "#EF4444"];

const barData = [
    { name: "Jan", marketing_1: 2000000, marketing_2: 3000000 },
    { name: "Feb", marketing_1: 1000000, marketing_2: 2000000 },
    { name: "Mar", marketing_1: 1500000, marketing_2: 1000000 },
    { name: "Apr", marketing_1: 2500000, marketing_2: 3000000 },
    { name: "May", marketing_1: 3000000, marketing_2: 1500000 },
    { name: "Jun", marketing_1: 1000000, marketing_2: 2500000 },
    { name: "Jul", marketing_1: 2000000, marketing_2: 2300000 },
    { name: "Aug", marketing_1: 2000000, marketing_2: 2200000 },
    { name: "Sep", marketing_1: 1500000, marketing_2: 1500000 },
];

export default function StatsCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full  mx-auto py-6">
            {/* Current Visits */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Tiếp cận</h2>
                <div className="flex justify-center">
                    <PieChart width={220} height={320}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <ReTooltip content={<CustomTooltip />}  />
                    </PieChart>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full" /> 18-25
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full" /> 26-35
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full" /> 36-45
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full" /> lớn hơn 45
                  </span>
                </div>
            </div>

            {/* Website Visits */}
            <div className="bg-white rounded-xl shadow p-6 col-span-1 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-1">Chi phí quảng cáo</h2>
                {/*<p className="text-sm text-gray-500 mb-4">(+43%) than last year</p>*/}
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}
                                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                                  // barCategoryGap="20%"
                                  // barGap={2}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ReTooltip />
                            <Legend />
                            <Bar dataKey="marketing_1" fill="#10B981" />
                            <Bar dataKey="marketing_2" fill="#FBBF24" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
