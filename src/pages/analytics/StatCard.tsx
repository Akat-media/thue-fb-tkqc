import React from 'react';
import MiniChart from "./MiniChart.tsx";
// import CustomLineChartIcon from "./CustomLineChartIcon.tsx";

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    trend: number;
    color: string;
}

interface ChartData {
    name: string;
    data: number[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
    const up = (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21 7a.8.8...z" />
        </svg>
    );

    const down = (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21 12a1...Z" />
        </svg>
    );

    const isPositive = trend >= 0;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
    const trendPrefix = isPositive ? '+' : '-';
    const trendSymbol = isPositive ? up : down;

    const baseData2025 = [30, 40, 35, 50, 82];
    const baseData2024 = [20, 30, 25, 40, 72];
    const chartData: ChartData[] = [
        {
            name: '2025',
            data: isPositive
                ? baseData2025
                : baseData2025.map((val, idx) => Math.max(10, val - (5 - idx) * 5)), // Giảm dần nếu trend âm
        },
        {
            name: '2024',
            data: isPositive
                ? baseData2024.map((val, idx) => Math.min(100, val + (5 - idx) * 5)) // Tăng dần nếu trend dương
                : baseData2024,
        },
    ];
    const categories: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

    // Xác định màu sắc biểu đồ dựa trên color của StatCard
    const colorMap: { [key: string]: string[] } = {
        'bg-green-300 text-green-800': ['#34d399', '#059669'], // Green shades
        'bg-purple-300 text-purple-800': ['#a78bfa', '#7c3aed'], // Purple shades
        'bg-yellow-300 text-yellow-800': ['#facc15', '#ca8a04'], // Yellow shades
        'bg-red-300 text-red-800': ['#f87171', '#dc2626'], // Red shades
    };
    const chartColors = colorMap[color] || ['#5be49b', '#00a76f']; // Fallback colors


    return (
        <div
            className={`relative rounded-xl shadow p-5 w-full ${color} h-[180px] bg-[url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/shape-square.svg)] bg-no-repeat overflow-hidden`}
        >
            <div className="absolute inset-0 bg-white bg-opacity-80 z-0"></div>
            <div className="relative flex justify-between items-center h-full z-10">
                <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex justify-between items-center">
                        <img src={icon} alt="Stat icon" className="w-10 h-10 object-contain opacity-80" />
                        <span className={`${trendColor} text-lg font-semibold flex items-center gap-2`}>
                                    {trendSymbol} {trendPrefix}{Math.abs(trend).toFixed(1)}%
                                </span>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                        <div>
                            <p
                                className="text-sm font-medium"
                                style={{
                                    fontFamily:
                                        '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.57',
                                }}
                            >
                                {title}
                            </p>
                            <h3
                                className="text-2xl font-bold mt-1"
                                style={{
                                    fontFamily:
                                        '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                                    lineHeight: '1.5',
                                }}
                            >
                                {value}
                            </h3>
                        </div>
                        <div>
                            <MiniChart chartData={chartData} categories={categories} colors={chartColors} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
