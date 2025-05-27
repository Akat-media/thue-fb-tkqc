import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

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

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-1xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Quản lý tài khoản
        </h1>
        <div className="bg-white shadow-sm rounded-lg p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, Tài Khoản"
              className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
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
              <option value="all">Tất cả trạng thái</option>
              <option value="Thành công">Thành công</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Thất bại">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Tài khoản</th>
                <th className="px-4 py-2">FB Ads Id</th>
                <th className="px-4 py-2">Ghi chú</th>
                <th className="px-4 py-2">Số tiền</th>
                <th className="px-4 py-2">Phí</th>
                <th className="px-4 py-2">Tổng</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngưỡng Thanh Toán</th>
                <th className="px-4 py-2">Giới Hạn Chi Tiêu</th>
                <th className="px-4 py-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.accountName}</td>
                    <td className="px-4 py-2">{item.facebookAdsId}</td>
                    <td className="px-4 py-2">{item.note}</td>
                    <td className="px-4 py-2">
                      {item.amount.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-2">{item.fee.toLocaleString()}₫</td>
                    <td className="px-4 py-2">
                      {item.total.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">
                      {item.limitBefore.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-2">
                      {item.limitAfter.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-2">{item.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-500">
                    Không có giao dịch nào khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAdsAccount;
