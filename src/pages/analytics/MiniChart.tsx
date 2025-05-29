import React from "react";
import ApexCharts from 'apexcharts';


interface ChartData {
    name: string;
    data: number[];
}

interface MiniChartProps {
    chartData: ChartData[];
    categories: string[];
    colors: string[];
}


const MiniChart: React.FC<MiniChartProps> = ({ chartData, categories,colors }) => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (chartRef.current) {
            const options = {
                chart: {
                    type: 'line',
                    width: 100,
                    height: 66,
                    sparkline: {
                        enabled: true,
                    },
                    animations: {
                        enabled: false,
                    },
                },
                series: chartData,
                xaxis: {
                    categories,
                },
                stroke: {
                    curve: 'smooth',
                    width: 2.5,
                },
                colors,
                tooltip: {
                    enabled: true,
                    theme: 'false',
                    style: {
                        fontSize: '12px',
                        fontFamily: '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    },
                    x: {
                        show: true,
                        format: 'MMM',
                    },
                    y: {
                        formatter: (val: number) => val,
                    },
                },
                legend: {
                    show: false,
                },
                grid: {
                    show: false,
                },
                markers: {
                    size: 0,
                },
            };

            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            return () => {
                chart.destroy();
            };
        }
    }, [chartData, categories, colors]);

    return <div ref={chartRef} className="w-[100px] h-[66px]" />;
};

export default MiniChart
