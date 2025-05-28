import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  BadgeInfo,
  BadgeCheck,
  CircleDollarSign,
  Scale,
  Briefcase,
  DollarSign,
  AlarmClockPlus,
  Pen,
  ALargeSmall,
  Infinity,
  Clock9,
  User,
  LucideUserRoundCheck,
  HandCoins,
  RefreshCcw,
} from "lucide-react";

interface AdsAccount {
  id: string;
  accountName: string;
  facebookAdsId: string;
  note: string;
  amount: number;
  fee: number;
  total: number;
  status: string;
  limitBefore: number;
  limitAfter: number;
  createdAt: string;
}

const mockData: AdsAccount[] = [
  {
    id: "T001",
    accountName: "Ads Account A",
    facebookAdsId: "123123123",
    note: "Giao dịch thành công",
    amount: 2000000,
    fee: 50000,
    total: 2050000,
    status: "Thành công",
    limitBefore: 5000000,
    limitAfter: 7000000,
    createdAt: "2024-05-01",
  },
  {
    id: "T002",
    accountName: "Ads Account B",
    facebookAdsId: "986968968",
    note: "Chờ xác nhận",
    amount: 1000000,
    fee: 30000,
    total: 1030000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4000000,
    createdAt: "2024-05-02",
  },
  {
    id: "T003",
    accountName: "Ads Account C",
    facebookAdsId: "555666777",
    note: "Thất bại do lỗi hệ thống",
    amount: 1500000,
    fee: 40000,
    total: 1540000,
    status: "Thất bại",
    limitBefore: 2000000,
    limitAfter: 2000000,
    createdAt: "2024-05-03",
  },
  {
    id: "T004",
    accountName: "Ads Account D",
    facebookAdsId: "111222333",
    note: "Giao dịch thành công",
    amount: 3000000,
    fee: 60000,
    total: 3060000,
    status: "Thành công",
    limitBefore: 6000000,
    limitAfter: 9000000,
    createdAt: "2024-05-04",
  },
  {
    id: "T005",
    accountName: "Ads Account E",
    facebookAdsId: "444555666",
    note: "Đang chờ xử lý",
    amount: 500000,
    fee: 20000,
    total: 520000,
    status: "Đang xử lý",
    limitBefore: 1000000,
    limitAfter: 1500000,
    createdAt: "2024-05-05",
  },
  {
    id: "T006",
    accountName: "Ads Account F",
    facebookAdsId: "777888999",
    note: "Thất bại do sai thông tin thẻ",
    amount: 800000,
    fee: 30000,
    total: 830000,
    status: "Thất bại",
    limitBefore: 1200000,
    limitAfter: 1200000,
    createdAt: "2024-05-06",
  },
  {
    id: "T007",
    accountName: "Ads Account G",
    facebookAdsId: "101010101",
    note: "Giao dịch thành công",
    amount: 2500000,
    fee: 50000,
    total: 2550000,
    status: "Thành công",
    limitBefore: 4000000,
    limitAfter: 6500000,
    createdAt: "2024-05-07",
  },
  {
    id: "T008",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
];

const ManageAdsAccount: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filtered, setFiltered] = useState(mockData);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const handleFilter = () => {
    const result = mockData.filter((item) => {
      const matchSearch =
        item.facebookAdsId.includes(search) ||
        item.note.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });

    setFiltered(result);
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
    setFiltered(mockData);
  };
  const handleSync = async () => {
    // const response = await fetch("api note");
    // const data = await response.json();
    // setFiltered(data);
    setFiltered(mockData);
  };
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-1xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Quản lý tài khoản
          </h1>
          <button
            onClick={handleSync}
            className="mt-0 flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <RefreshCcw className="w-4 h-4" />
            Đồng Bộ Tài Khoản
          </button>
        </div>

        <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, Tài Khoản"
              className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
          </div>
          <div className="flex items-center gap-1">
            <select
              className="form-select focus:outline-none focus:ring-0"
              value={statusFilter}
              onChange={(e) => {
                const value = e.target.value;
                setStatusFilter(value);
                const result = mockData.filter((item) => {
                  const matchSearch =
                    item.facebookAdsId.includes(search) ||
                    item.note.toLowerCase().includes(search.toLowerCase());

                  const matchStatus = value === "all" || item.status === value;

                  return matchSearch && matchStatus;
                });
                setFiltered(result);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="Thành công">Thành công</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Thất bại">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-[1200px] table-fixed border border-gray-300 border-collapse bg-white text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3 text-center min-w-[80px] whitespace-nowrap border border-gray-200">
                  <BadgeInfo className="inline w-4 h-4 mr-2 text-gray-500" />
                  ID
                </th>
                <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                  <BadgeCheck className="inline w-4 h-4 mr-2 text-gray-500" />
                  Account ID
                </th>
                <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                  <CircleDollarSign className="inline w-4 h-4 mr-2 text-gray-500" />
                  Account Status
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <Scale className="inline w-4 h-4 mr-2 text-gray-500" />
                  Amount Spent
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <Briefcase className="inline w-4 h-4 mr-2 text-gray-500" />
                  Balance
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <DollarSign className="inline w-4 h-4 mr-2 text-gray-500" />
                  Business
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <AlarmClockPlus className="inline w-4 h-4 mr-2 text-gray-500" />
                  Currency
                </th>
                <th className="px-4 py-3 text-center min-w-[140px] whitespace-nowrap border border-gray-200">
                  <Pen className="inline w-4 h-4 mr-2 text-gray-500" />
                  Created Time
                </th>
                <th className="px-4 py-3 text-center min-w-[240px] whitespace-nowrap border border-gray-200">
                  <ALargeSmall className="inline w-4 h-4 mr-2 text-gray-500" />
                  Reason Status
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <Infinity className="inline w-4 h-4 mr-2 text-gray-500" />
                  Name
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <Clock9 className="inline w-4 h-4 mr-2 text-gray-500" />
                  Spend Cap
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <User className="inline w-4 h-4 mr-2 text-gray-500" />
                  Time
                </th>
                <th className="px-4 py-3 text-center min-w-[140px] whitespace-nowrap border border-gray-200">
                  <LucideUserRoundCheck className="inline w-4 h-4 mr-2 text-gray-500" />
                  Owner
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <HandCoins className="inline w-4 h-4 mr-2 text-gray-500" />
                  Personal
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <HandCoins className="inline w-4 h-4 mr-2 text-gray-500" />
                  Prepay Account
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-800">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t ${
                    activeRow === item.id ? "bg-blue-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-id` || activeRow === item.id
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveRow(item.id);
                      setActiveCell(`${item.id}-id`);
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-accountName`
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-accountName`);
                      setActiveRow(null);
                    }}
                  >
                    {item.accountName}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-status` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-status`);
                      setActiveRow(null);
                    }}
                  >
                    {item.status}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-amount` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-amount`);
                      setActiveRow(null);
                    }}
                  >
                    {item.amount.toLocaleString()}₫
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-total` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-total`);
                      setActiveRow(null);
                    }}
                  >
                    {item.total.toLocaleString()}₫
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-business` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-business`);
                      setActiveRow(null);
                    }}
                  >
                    Business name
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-currency` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-currency`);
                      setActiveRow(null);
                    }}
                  >
                    VND
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-createdAt` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-createdAt`);
                      setActiveRow(null);
                    }}
                  >
                    {item.createdAt}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-note` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-note`);
                      setActiveRow(null);
                    }}
                  >
                    {item.note}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-name` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-name`);
                      setActiveRow(null);
                    }}
                  >
                    {item.accountName}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-limitAfter`
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-limitAfter`);
                      setActiveRow(null);
                    }}
                  >
                    {item.limitAfter.toLocaleString()}₫
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-time` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-time`);
                      setActiveRow(null);
                    }}
                  >
                    {item.createdAt}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-owner` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-owner`);
                      setActiveRow(null);
                    }}
                  >
                    Owner Name
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-personal` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-personal`);
                      setActiveRow(null);
                    }}
                  >
                    Personal
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-gray-200 cursor-pointer ${
                      activeCell === `${item.id}-prepay` ? "bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-prepay`);
                      setActiveRow(null);
                    }}
                  >
                    Có
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAdsAccount;
