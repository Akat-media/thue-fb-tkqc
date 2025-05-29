import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  BadgeInfo,
  CircleDollarSign,
  Clock9,
  Banknote,
  User,
  Eye,
  RefreshCcw,
} from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActive: string;
  totalDeposit: number;
}

const users: UserInfo[] = [
  {
    id: "U001",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0909123456",
    totalDeposit: 5000000,
    lastActive: "2025-05-23 09:00",
  },
  {
    id: "U002",
    name: "Trần Thị B",
    email: "b@example.com",
    phone: "0909876543",
    totalDeposit: 8500000,
    lastActive: "2025-05-24 16:00",
  },
];

const mockTransactions = [
  {
    id: "F164LTI4OC",
    userId: "U001",
    amount: 100000,
    createdAt: "2025-05-24T09:02:07",
    paidAt: "",
    status: "Chưa thanh toán",
    bank: "Vietcombank",
    accountName: "NGUYEN TUONG PHUOC",
    accountNumber: "9362676605",
    type: "deposit",
  },
  {
    id: "TX09384ABC",
    amount: 2000000,
    userId: "U002",
    createdAt: "2025-05-23T11:30:00",
    paidAt: "2025-05-23T11:45:00",
    status: "Đã thanh toán",
    bank: "TPBank",
    accountName: "TRAN VAN B",
    accountNumber: "8374938482",
    type: "deposit",
  },
  {
    id: "TX99812GHT",
    amount: 1500000,
    userId: "U001",
    createdAt: "2025-05-21T09:30:00",
    paidAt: "2025-05-21T09:50:00",
    status: "Đã thanh toán",
    bank: "BIDV",
    accountName: "NGUYEN VAN C",
    accountNumber: "5566778899",
    type: "deposit",
  },
  {
    id: "PLAT001",
    amount: 300000,
    userId: "U002",
    createdAt: "2025-05-25T10:00:00",
    status: "Đã thanh toán",
    description: "Thanh toán dịch vụ AI - 1 tháng",
    type: "platform",
  },
  {
    id: "PLAT002",
    amount: 500000,
    userId: "U002",
    createdAt: "2025-05-22T13:20:00",
    status: "Đã thanh toán",
    description: "Thanh toán thuê tài khoản quảng cáo",
    type: "platform",
  },
];

const AdminTransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "platform">("deposit");
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const depositTransactions = mockTransactions.filter(
    (tx) =>
      tx.type === "deposit" &&
      tx.id.toLowerCase().includes(search.toLowerCase())
  );

  const platformTransactions = mockTransactions.filter(
    (tx) =>
      tx.type === "platform" &&
      tx.id.toLowerCase().includes(search.toLowerCase())
  );
  const handleSync = async () => {
    // const response = await fetch("api note");
    // const data = await response.json();
    // setFiltered(data);
    //setFiltered(mockData);
  };
  const formatDate = (input: string) => {
    return new Date(input).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-end justify-between mb-4">
          <h1 className="text-1xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
            Quản lý giao dịch
          </h1>
          <button
            onClick={handleSync}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Đồng Bộ Giao Dịch
            </div>
          </button>
        </div>

        <div className="border-b mb-4">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "deposit"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lịch sử nạp tiền
            </button>
            <button
              onClick={() => setActiveTab("platform")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "platform"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lịch sử thanh toán nền tảng
            </button>
          </nav>
        </div>

        {/* Tìm kiếm */}
        <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm mb-6">
          <div className="relative w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã giao dịch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline">Tải về CSV</Button>
        </div>

        {/* Bảng giao dịch */}
        <div className="overflow-auto">
          {activeTab === "deposit" && (
            <table className="min-w-[1200px] table-fixed border border-gray-300 border-collapse bg-white text-sm text-gray-800">
              <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <BadgeInfo className="inline w-4 h-4 mr-2 text-gray-500" />
                    Mã giao dịch
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <CircleDollarSign className="inline w-4 h-4 mr-2 text-gray-500" />
                    Số tiền
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <Clock9 className="inline w-4 h-4 mr-2 text-gray-500" />
                    Thời gian tạo
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <Clock9 className="inline w-4 h-4 mr-2 text-gray-500" />
                    Thanh toán
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <BadgeInfo className="inline w-4 h-4 mr-2 text-gray-500" />
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <Banknote className="inline w-4 h-4 mr-2 text-gray-500" />
                    Ngân hàng
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <User className="inline w-4 h-4 mr-2 text-gray-500" />
                    Chủ tài khoản
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200">
                    <Banknote className="inline w-4 h-4 mr-2 text-gray-500" />
                    Số tài khoản
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap border border-gray-200"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {depositTransactions.length > 0 ? (
                  depositTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className={`border-t cursor-pointer ${
                        activeRowId === tx.id
                          ? "bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setActiveRowId(activeRowId === tx.id ? null : tx.id)
                      }
                    >
                      <td className="px-4 py-2 text-center border border-gray-200 font-semibold">
                        {tx.id}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {tx.amount.toLocaleString()} VND
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {tx.paidAt || (
                          <span className="text-gray-400 italic">_</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            tx.status === "Đã thanh toán"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {tx.bank}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {tx.accountName}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        {tx.accountNumber}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <button
                          onClick={() => {
                            const user = users.find((u) => u.id === tx.userId);
                            setSelectedUser(user || null);
                            setIsModalOpen(true);
                          }}
                          className="text-gray-600 hover:text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-6 text-gray-500 border border-gray-200"
                    >
                      Không có giao dịch nạp tiền nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === "platform" && (
            <table className="w-full table-auto border rounded-lg text-sm text-left shadow">
              <thead className="bg-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-4 py-2">Mã giao dịch</th>
                  <th className="px-4 py-2">Thời gian</th>
                  <th className="px-4 py-2">Mô tả</th>
                  <th className="px-4 py-2">Số tiền</th>
                  <th className="px-4 py-2">Trạng thái</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {platformTransactions.length > 0 ? (
                  platformTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{tx.id}</td>
                      <td className="px-4 py-2">{formatDate(tx.createdAt)}</td>
                      <td className="px-4 py-2">{tx.description}</td>
                      <td className="px-4 py-2 text-red-600 font-semibold">
                        -{tx.amount.toLocaleString()} VND
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            tx.status === "Đã thanh toán"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const matchedUser = users.find(
                              (u) => u.id === tx.userId
                            );
                            setSelectedUser(matchedUser || null);
                            setIsModalOpen(true);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Không có giao dịch thanh toán nền tảng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Chi tiết người dùng</h2>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>
                <strong>Tên:</strong> {selectedUser.name}
              </li>
              <li>
                <strong>Email:</strong> {selectedUser.email}
              </li>
              <li>
                <strong>Số điện thoại:</strong> {selectedUser.phone}
              </li>
              <li>
                <strong>Số tiền đã nạp:</strong>{" "}
                {selectedUser.totalDeposit.toLocaleString()} VND
              </li>
            </ul>
            <div className="text-right mt-6">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminTransactionsPage;
