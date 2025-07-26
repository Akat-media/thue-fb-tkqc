import React, { useState, useEffect } from 'react';
import {
  Bell,
} from 'lucide-react';
import StatCard from './analytics/StatCard.tsx';
import StatsCharts from './analytics/StatsCharts.tsx';
import ChartDashboard from './analytics/ChartDashboard.tsx';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { createGlobalStyle } from 'styled-components';
import { toast } from 'react-toastify';
import BaseHeader from '../api/BaseHeader.ts';
import { useTranslation } from 'react-i18next';
import LandingPageLayout from './landing/LandingPageLayout.tsx';
import { useNotificationStore } from '../stores/notificationStore.ts';

type MonthlyTotal = {
  totalRevenue: number;
  totalUsers: number;
  totalTransaction: number;
  totalAdsAccounts: number;
  growUser: number;
  growTransaction: number;
  growAdsAccount: number;
  growRevenue: number;
};
type MonthlyStatsItem = {
  month: string;
  revenue: number;
  newUsers: number;
  newAdsAccounts: number;
  countTransactions: number;
};
export type UserInfo = {
  username: string;
  totalAmount: number;
};
export type MonthlyStats = {
  monthlyStats: MonthlyStatsItem[];
  totals: MonthlyTotal;
  userList: UserInfo[];
};
const GlobalStyle = createGlobalStyle`
   @media (max-width: 768px) {
    .ant-picker-panels {
      flex-direction: column !important;
    }
  }
`;

const HomePage: React.FC = () => {
  const { fetchNotifications } = useNotificationStore();
  const user = localStorage.getItem('user');
  const role = typeof user === 'string' ? JSON.parse(user)?.user?.role : '';
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';
  const [stats, setStats] = useState<any>(null);
  const [statsMonthly, setStatsMonthly] = useState<MonthlyStats>({
    monthlyStats: [],
    userList: [],
    totals: {
      totalRevenue: 0,
      totalUsers: 0,
      totalTransaction: 0,
      totalAdsAccounts: 0,
      growUser: 0,
      growTransaction: 0,
      growAdsAccount: 0,
      growRevenue: 0,
    },
  });
  const [dateRange, setDateRange] = useState({
    targetFrom: dayjs()
      .subtract(5, 'month')
      .startOf('month')
      .format('YYYY/MM/DD'),
    targetTo: dayjs().startOf('month').format('YYYY/MM/DD'),
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await BaseHeader({
          method: 'get',
          url: '/statistics',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    if (role === 'admin') fetchStats();
  }, [role]);

  const handleRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dateStrings.length === 2) {
      const targetDayFrom = dateStrings[0];
      const targetDayTo = dateStrings[1];
      setDateRange({
        targetFrom: targetDayFrom,
        targetTo: targetDayTo,
      });
      if (role === 'admin') fetchDataChart(targetDayFrom, targetDayTo);
    }
  };
  const fetchDataChart = async (targetDayFrom: string, targetDayTo: string) => {
    try {
      const response = await BaseHeader(
        `/monthlyStatistics?targetDayFrom=${targetDayFrom}&targetDayTo=${targetDayTo}`
      );
      setStatsMonthly(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê'
      );
    }
  };
  useEffect(() => {
    if (role === 'admin') {
      fetchDataChart(dateRange.targetFrom, dateRange.targetTo);
    }
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.user_id) {
          fetchNotifications(userData.user_id);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
    {
      role !== 'admin' && <LandingPageLayout/>
    }

      {role === 'admin' && (
        <>
          <div className="flex flex-col mb-7 md:flex-row flex-1 max-w-screen-3xl mx-auto box-border px-4 sm:px-10 items-start md:items-center justify-between gap-2 mt-4">
            <GlobalStyle />
            <RangePicker
              defaultValue={[
                dayjs(dateRange.targetFrom, dateFormat),
                dayjs(dateRange.targetTo, dateFormat),
              ]}
              format="YYYY/MM/DD"
              onChange={handleRangeChange}
            />
            <div className="flex h-14 items-center justify-between gap-8 sm:px-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-red-600 font-sans">
                  {new Date().toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {/*<div className="flex items-center gap-6 max-md:hidden">*/}
              {/*  <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />*/}
              {/*  <User className="w-5 h-5 text-gray-600 cursor-pointer" />*/}
              {/*</div>*/}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="w-full max-w-screen-3xl mx-auto box-border px-0 sm:px-10 pt-[var(--layout-dashboard-content-pt)] pb-[var(--layout-dashboard-content-pb)] flex flex-col flex-[1_1_auto] px-4 sm:px-4">
              <div className="mb-10 text-xl text-blue-600 font-bold leading-6 font-sans">
                Hi, Welcome back 👋
              </div>

              <div
                className="
                  grid grid-cols-1 
                  max-[630px]:grid-cols-1
                  min-[1000px]:grid-cols-2 
                  max-[1179px]:grid-cols-2 
                  min-[1179px]:grid-cols-4 
                  gap-6 w-full mx-auto"
              >
                <StatCard
                  title="Doanh thu"
                  value={
                    statsMonthly
                      ? `${statsMonthly.totals.totalRevenue?.toLocaleString(
                          'vi-VN'
                        )} VND`
                      : 'Loading...'
                  }
                  icon="/ic-glass-bag.svg"
                  trend={statsMonthly ? statsMonthly.totals.growRevenue : 0}
                  color="bg-green-300 text-green-800"
                />
                <StatCard
                  title="Số lượng tài khoản quảng cáo"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalAdsAccounts?.toLocaleString(
                          'vi-VN'
                        )
                      : 'Loading...'
                  }
                  icon="/ic-glass-users.svg"
                  trend={statsMonthly ? statsMonthly.totals.growAdsAccount : 0}
                  color="bg-purple-300 text-purple-800"
                />
                <StatCard
                  title="Số lượng người dùng đăng ký"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalUsers?.toLocaleString('vi-VN')
                      : 'Loading...'
                  }
                  icon="/ic-glass-buy.svg"
                  trend={statsMonthly ? statsMonthly.totals.growUser : 0}
                  color="bg-yellow-300 text-yellow-800"
                />
                <StatCard
                  title="Số lượng giao dịch"
                  value={
                    statsMonthly
                      ? statsMonthly.totals.totalTransaction?.toLocaleString(
                          'vi-VN'
                        )
                      : 'Loading...'
                  }
                  icon="/ic-glass-message.svg"
                  trend={statsMonthly ? statsMonthly.totals.growTransaction : 0}
                  color="bg-red-300 text-red-800"
                />
              </div>

              <div>
                <StatsCharts data={statsMonthly} />
              </div>

              <div>
                <ChartDashboard data={statsMonthly} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
