import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  BadgeInfo,
  CircleDollarSign,
  Clock9,
  Banknote,
  User,
  Landmark,
  PiggyBank,
  RefreshCcw,
  MoreVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActive: string;
  totalDeposit: number;
}

type Transaction = {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  paidAt?: string;
  status: string;
  bank?: string;
  accountName?: string;
  accountNumber?: string;
  type: "deposit" | "platform";
  description?: string;
};

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
  {
    id: "PLAT017",
    amount: 350000,
    userId: "U001",
    createdAt: "2025-05-22T13:20:00",
    status: "Đã thanh toán",
    description: "Thanh toán thuê tài khoản quảng cáo",
    type: "platform",
  },
];

const AdminTransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "platform">("deposit");
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>(null);
  const [openSortKey, setOpenSortKey] = useState<keyof Transaction | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const platformTransactions = mockTransactions.filter(
    (tx) =>
      tx.type === "platform" &&
      tx.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSync = async () => {};

  const formatDate = (input: string) => {
    return new Date(input).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredData = useMemo(() => {
    return mockTransactions.filter(
      (tx) =>
        tx.type === "deposit" &&
        tx.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const sortedData = useMemo(() => {
    const sortable = [...filteredData];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);
  const filteredPlatformData = useMemo(() => {
    return mockTransactions.filter(
      (tx) =>
        tx.type === "platform" &&
        tx.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const sortedPlatformData = useMemo(() => {
    const sortable = [...filteredPlatformData];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (sortConfig.key === "accountName") {
          const aUser = users.find((u) => u.id === a.userId)?.name || "";
          const bUser = users.find((u) => u.id === b.userId)?.name || "";
          return sortConfig.direction === "asc"
            ? aUser.localeCompare(bUser)
            : bUser.localeCompare(aUser);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sortable;
  }, [filteredPlatformData, sortConfig]);

  const SortableHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: keyof Transaction;
    openSortKey: keyof Transaction | null;
    setOpenSortKey: (key: keyof Transaction | null) => void;
  }) => {
    const isOpen = openSortKey === sortKey;
    const toggleSort = (direction: "asc" | "desc") => {
      setSortConfig({ key: sortKey, direction });
      setOpenSortKey(null);
    };
    return (
      <div className="relative flex justify-center items-center">
        <span>{label}</span>
        <button
          className="ml-1 p-1 hover:bg-gray-200 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setOpenSortKey(isOpen ? null : sortKey);
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        {isOpen && (
          <div className="sortable-menu absolute right-0 top-6 w-32 bg-white border rounded shadow z-10">
            <div
              onClick={() => toggleSort("asc")}
              className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer flex items-center"
            >
              <ArrowUp className="w-4 h-4 mr-2" /> ASC
            </div>
            <div
              onClick={() => toggleSort("desc")}
              className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer flex items-center"
            >
              <ArrowDown className="w-4 h-4 mr-2" /> DESC
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const table = document.querySelector("table");
      const isClickOutsideTable = table && !table.contains(e.target as Node);

      if (isClickOutsideTable) {
        setOpenSortKey(null);
        setSelectedTxId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Layout>
      <div className="flex items-end justify-between mb-4">
        <h1 className="text-1xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
          Quản lý giao dịch
        </h1>
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

      {/* Bảng giao dịch */}
      <div className="overflow-auto">
        {activeTab === "deposit" && (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[576px] overflow-y-auto"
            >
              <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
                <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Mã Giao Dịch</span>
                        <SortableHeader
                          label=""
                          sortKey="id"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <CircleDollarSign className="w-4 h-4 text-gray-500" />
                        <span>Số Tiền</span>
                        <SortableHeader
                          label=""
                          sortKey="amount"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <Clock9 className="w-4 h-4 text-gray-500" />
                        <span>Thời Gian Tạo</span>
                        <SortableHeader
                          label=""
                          sortKey="createdAt"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <Banknote className="w-4 h-4 text-gray-500" />
                        Thanh Toán
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Trạng Thái</span>
                        <SortableHeader
                          label=""
                          sortKey="status"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <Landmark className="w-4 h-4 text-gray-500" />
                        Ngân Hàng
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <User className="w-4 h-4 text-gray-500" />
                        Chủ Tài Khoản
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <PiggyBank className="w-4 h-4 text-gray-500" />
                        Số Tài Khoản
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Chi Tiết</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((tx) => (
                    <tr
                      key={tx.id}
                      className={`cursor-pointer ${
                        selectedTxId === tx.id
                          ? "bg-[#dcfce7]"
                          : "hover:bg-gray-50"
                      }`}
                      style={
                        selectedTxId === tx.id
                          ? {
                              outline: "1px solid #47b46c",
                              position: "relative",
                              zIndex: 5,
                            }
                          : undefined
                      }
                      onClick={() => setSelectedTxId(tx.id)}
                    >
                      <td className="px-4 py-2 text-center font-semibold border border-gray-200">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "platform" && (
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[576px] overflow-y-auto"
            >
              <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
                <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Mã Giao Dịch</span>
                        <SortableHeader
                          label=""
                          sortKey="id"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Người Tạo</span>
                        <SortableHeader
                          label=""
                          sortKey="accountName"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <Clock9 className="w-4 h-4 text-gray-500" />
                        <span>Thời Gian</span>
                        <SortableHeader
                          label=""
                          sortKey="createdAt"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <CircleDollarSign className="w-4 h-4 text-gray-500" />
                        <span>Số Tiền</span>
                        <SortableHeader
                          label=""
                          sortKey="amount"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Mô Tả</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Trạng Thái</span>
                        <SortableHeader
                          label=""
                          sortKey="status"
                          openSortKey={openSortKey}
                          setOpenSortKey={setOpenSortKey}
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center min-w-[160px] whitespace-nowrap border border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <BadgeInfo className="w-4 h-4 text-gray-500" />
                        <span>Chi Tiết</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {platformTransactions.length > 0 ? (
                    sortedPlatformData.map((tx) => (
                      <tr
                        key={tx.id}
                        className={`cursor-pointer ${
                          selectedTxId === tx.id
                            ? "bg-[#dcfce7]"
                            : "hover:bg-gray-50"
                        }`}
                        style={
                          selectedTxId === tx.id
                            ? {
                                outline: "1px solid #47b46c",
                                position: "relative",
                                zIndex: 5,
                              }
                            : undefined
                        }
                        onClick={() => setSelectedTxId(tx.id)}
                      >
                        <td
                          className={`px-4 py-2 text-center font-semibold border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          {tx.id}
                        </td>
                        <td
                          className={`px-4 py-2 text-center font-medium border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          {users.find((u) => u.id === tx.userId)?.name || (
                            <span className="text-gray-400 italic">
                              Không rõ
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-2 text-center border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          {formatDate(tx.createdAt)}
                        </td>
                        <td
                          className={`px-4 py-2 text-center text-red-600 font-semibold border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          -{tx.amount.toLocaleString()} VND
                        </td>
                        <td
                          className={`px-4 py-2 text-center border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          {tx.description || (
                            <span className="text-gray-400">_</span>
                          )}
                        </td>
                        <td
                          className={`px-4 py-2 text-center border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
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
                        <td
                          className={`px-4 py-2 text-center border ${
                            selectedTxId === tx.id
                              ? "border-[#47b46c]"
                              : "border-gray-200"
                          }`}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation(); // tránh mất nền khi bấm nút
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
                      <td
                        colSpan={6}
                        className="text-center py-6 text-gray-500 border border-gray-200"
                      >
                        Không có giao dịch thanh toán nền tảng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
