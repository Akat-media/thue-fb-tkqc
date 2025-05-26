import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

interface Transaction {
  id: string;
  amount: number;
  createdAt: string;
  paidAt?: string;
  status: string;
  bank: string;
  accountName: string;
  accountNumber: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "F164LTI4OC",
    amount: 100000,
    createdAt: "2025-05-24T09:02:07",
    paidAt: "",
    status: "Chưa thanh toán",
    bank: "Vietcombank",
    accountName: "NGUYEN TUONG PHUOC",
    accountNumber: "9362676605",
  },
  {
    id: "TX09384ABC",
    amount: 2000000,
    createdAt: "2025-05-23T11:30:00",
    paidAt: "2025-05-23T11:45:00",
    status: "Đã thanh toán",
    bank: "TPBank",
    accountName: "TRAN VAN B",
    accountNumber: "8374938482",
  },
  {
    id: "TX48392XYZ",
    amount: 500000,
    createdAt: "2025-05-22T10:00:00",
    paidAt: "",
    status: "Chưa thanh toán",
    bank: "MB Bank",
    accountName: "LE THI MAI",
    accountNumber: "1122334455",
  },
  {
    id: "TX99812GHT",
    amount: 1500000,
    createdAt: "2025-05-21T09:30:00",
    paidAt: "2025-05-21T09:50:00",
    status: "Đã thanh toán",
    bank: "BIDV",
    accountName: "NGUYEN VAN C",
    accountNumber: "5566778899",
  },
  {
    id: "TX77123ZXC",
    amount: 750000,
    createdAt: "2025-05-20T14:20:00",
    paidAt: "",
    status: "Chưa thanh toán",
    bank: "ACB",
    accountName: "PHAM THI DUNG",
    accountNumber: "1010101010",
  },
  {
    id: "TX66221MNB",
    amount: 3200000,
    createdAt: "2025-05-19T08:00:00",
    paidAt: "2025-05-19T08:30:00",
    status: "Đã thanh toán",
    bank: "Techcombank",
    accountName: "TRAN DUC HUY",
    accountNumber: "9292929292",
  },
  {
    id: "TX51245QWE",
    amount: 1000000,
    createdAt: "2025-05-18T15:10:00",
    paidAt: "",
    status: "Chưa thanh toán",
    bank: "VietinBank",
    accountName: "HOANG MINH TRI",
    accountNumber: "4848484848",
  },
  {
    id: "TX33445RTY",
    amount: 2200000,
    createdAt: "2025-05-17T17:45:00",
    paidAt: "2025-05-17T18:00:00",
    status: "Đã thanh toán",
    bank: "Agribank",
    accountName: "DO THI HANH",
    accountNumber: "7474747474",
  },
];

const AdminTransactionsPage = () => {
  const [search, setSearch] = useState("");

  const filteredData = mockTransactions.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý giao dịch nạp tiền</h1>

        {/* Toolbar */}
        <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm">
          <div className="relative w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hóa đơn"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
            />
            <i className="absolute left-3 top-2.5 text-gray-400">🔍</i>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">Tải về CSV</Button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-auto">
          <table className="w-full table-auto border rounded-lg text-sm text-left shadow">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-2">Mã hóa đơn</th>
                <th className="px-4 py-2">Số tiền</th>
                <th className="px-4 py-2">Tạo lúc</th>
                <th className="px-4 py-2">Thanh toán</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngân hàng</th>
                <th className="px-4 py-2">Chủ tài khoản</th>
                <th className="px-4 py-2">Số tài khoản</th>
                <th className="px-4 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{tx.id}</td>
                  <td className="px-4 py-2">
                    {tx.amount.toLocaleString()} VND
                  </td>
                  <td className="px-4 py-2">{tx.createdAt}</td>
                  <td className="px-4 py-2">
                    {tx.paidAt || (
                      <span className="text-gray-400 italic">_</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        tx.status === "Đã thanh toán"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "Chưa thanh toán"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{tx.bank}</td>
                  <td className="px-4 py-2">{tx.accountName}</td>
                  <td className="px-4 py-2">{tx.accountNumber}</td>
                  <td className="px-4 py-2 text-center">
                    <a
                      href={`/depositDetail?idDeposit=${tx.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Chi tiết
                    </a>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị {filteredData.length} kết quả</span>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTransactionsPage;
