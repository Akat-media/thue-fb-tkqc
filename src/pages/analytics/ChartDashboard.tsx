import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Radar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import React from "react";
import TopCampaignsCard from "./TopCampaignsCard.tsx";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

const revenueData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Doanh thu (VND)",
      data: [5600000, 152000000, 135000000, 389000000, 355000000, 385218000],
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.4)",
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
};

const revenueOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    datalabels: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => `${(value / 1000000).toFixed(0)} M`,
      },
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 0,
      },
    },
  },
};

const engagementData = {
  labels: ["Lượt Thích", "Bình Luận", "Chia Sẻ", "CPC", "Clicks", "Tương Tác"],
  datasets: [
    {
      label: "Jasper 7",
      data: [70, 60, 50, 30, 80, 90],
      backgroundColor: "rgba(91, 245, 194, 0.4)",
      borderColor: "rgba(16, 185, 129, 1)",
      pointBackgroundColor: "rgba(16, 185, 129, 1)",
      fill: true,
    },
    {
      label: "Global Campaign",
      data: [50, 40, 90, 60, 30, 70],
      backgroundColor: "rgba(251, 191, 36, 0.4)",
      borderColor: "rgba(251, 191, 36, 1)",
      pointBackgroundColor: "rgba(251, 191, 36, 1)",
      fill: true,
    },
    {
      label: "Viper 006",
      data: [60, 80, 70, 90, 40, 50],
      backgroundColor: "rgba(14, 165, 233, 0.4)",
      borderColor: "rgba(14, 165, 233, 1)",
      pointBackgroundColor: "rgba(14, 165, 233, 1)",
      fill: true,
    },
  ],
};

const engagementOptions: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
        },
      },
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 100,
      angleLines: { color: "#e5e7eb" },
      grid: { color: "#e5e7eb" },
      pointLabels: {
        color: "#334155",
        font: {
          size: 12,
        },
      },
      ticks: {
        backdropColor: "transparent",
        color: "#94a3b8",
        stepSize: 20,
      },
    },
  },
};

const ChartDashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-6 px-4 sm:px-6 lg:px-0">
      {/* Doanh thu biểu đồ */}
      <div className="w-full max-w-full bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2
          className="text-sm font-semibold text-gray-800 mb-4"
          style={{
            fontFamily:
              '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            lineHeight: "1.57",
          }}
        >
          Doanh thu
        </h2>
        <div className="w-full h-[250px] sm:h-[300px] md:h-[400px]">
          <Line data={revenueData} options={revenueOptions} />
        </div>
      </div>

      {/* Container cho Tương tác và Chiến dịch hàng đầu */}
      <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6">
        {/* Tương tác */}
        <div className="w-full lg:flex-[2] min-w-0 bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Tương tác
          </h2>
          <div className="w-full h-[250px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
            <Radar data={engagementData} options={engagementOptions} />
          </div>
        </div>

        {/* Chiến dịch hàng đầu */}
        <div className="w-full lg:flex-[3] min-w-0 bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Chiến dịch hàng đầu
          </h2>
          <div className="w-full max-w-full">
            <TopCampaignsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDashboard;
