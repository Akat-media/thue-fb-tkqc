import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { useOnOutsideClick } from "../../hook/useOutside";
import {
  MoreVertical,
  ArrowUp,
  ArrowDown,
  RefreshCcw,
  User,
  BadgeInfo,
  DollarSign,
  Briefcase,
  Phone,
  Eye,
  Contact,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "User" | "Moderator";
  status: "Hoạt động" | "Đã khóa";
  createdAt: string;
  lastActive: string;
  totalDeposit: number;
  adAccounts: string[];
}

const mockUsers: User[] = [
  {
    id: "U001",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0909123456",
    role: "Admin",
    status: "Hoạt động",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 5000000,
    adAccounts: ["All"],
  },
  {
    id: "U002",
    name: "Trần Thị B",
    email: "b@example.com",
    phone: "0909123456",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 80000000,
    adAccounts: ["ADS001", "ADS002"],
  },
  {
    id: "U003",
    name: "Lê Minh Cường",
    email: "cuonglm@example.com",
    phone: "0909129616",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 52000000,
    adAccounts: ["ADS003", "ADS004"],
  },
  {
    id: "U004",
    name: "Phạm Thị Duyên",
    email: "duyenpt@example.com",
    phone: "0909129616",
    role: "User",
    status: "Đã khóa",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 15000000,
    adAccounts: ["ADS006", "ADS005"],
  },
  {
    id: "U005",
    name: "Hoàng Văn Tèo",
    email: "teohoang@example.com",
    phone: "0909129616",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 1850000,
    adAccounts: ["ADS007", "ADS008"],
  },
  {
    id: "U006",
    name: "Hứa Quang Hán",
    email: "huaquang@example.com",
    phone: "0909121616",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-01",
    lastActive: "2025-05-22",
    totalDeposit: 18350000,
    adAccounts: ["ADS013", "ADS018"],
  },
  {
    id: "U007",
    name: "Ngô Kiến Huy",
    email: "ngokienhuy@example.com",
    phone: "0911223344",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-03",
    lastActive: "2025-05-28",
    totalDeposit: 12500000,
    adAccounts: ["ADS022"],
  },
  {
    id: "U008",
    name: "Trịnh Thăng Bình",
    email: "trinhbinh@example.com",
    phone: "0933445566",
    role: "User",
    status: "Đã khóa",
    createdAt: "2025-04-15",
    lastActive: "2025-05-10",
    totalDeposit: 8350000,
    adAccounts: [],
  },
  {
    id: "U009",
    name: "Minh Hằng",
    email: "minhhang@example.com",
    phone: "0909332211",
    role: "Admin",
    status: "Hoạt động",
    createdAt: "2025-03-20",
    lastActive: "2025-05-27",
    totalDeposit: 20100000,
    adAccounts: ["ADS009", "ADS010", "ADS030"],
  },
  {
    id: "U010",
    name: "Sơn Tùng M-TP",
    email: "sontung@example.com",
    phone: "0988223344",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-10",
    lastActive: "2025-05-28",
    totalDeposit: 32000000,
    adAccounts: ["ADS014", "ADS015"],
  },
  {
    id: "U011",
    name: "Hòa Minzy",
    email: "hoaminzy@example.com",
    phone: "0911445566",
    role: "User",
    status: "Đã khóa",
    createdAt: "2025-04-01",
    lastActive: "2025-05-12",
    totalDeposit: 5500000,
    adAccounts: ["ADS005"],
  },
  {
    id: "U012",
    name: "Trúc Nhân",
    email: "trucnhan@example.com",
    phone: "0909556677",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-02",
    lastActive: "2025-05-25",
    totalDeposit: 17900000,
    adAccounts: ["ADS012"],
  },
  {
    id: "U013",
    name: "Đen Vâu",
    email: "denvau@example.com",
    phone: "0977889911",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-03-18",
    lastActive: "2025-05-28",
    totalDeposit: 28700000,
    adAccounts: ["ADS017", "ADS021"],
  },
  {
    id: "U014",
    name: "Bích Phương",
    email: "bichphuong@example.com",
    phone: "0922113344",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-04-28",
    lastActive: "2025-05-27",
    totalDeposit: 14600000,
    adAccounts: [],
  },
  {
    id: "U015",
    name: "Noo Phước Thịnh",
    email: "noophuoc@example.com",
    phone: "0909334455",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-05",
    lastActive: "2025-05-26",
    totalDeposit: 19400000,
    adAccounts: ["ADS031"],
  },
  {
    id: "U016",
    name: "Tóc Tiên",
    email: "toctien@example.com",
    phone: "0909887766",
    role: "User",
    status: "Hoạt động",
    createdAt: "2025-05-06",
    lastActive: "2025-05-28",
    totalDeposit: 22250000,
    adAccounts: ["ADS011", "ADS020"],
  },
];

const handleDeactivate = (userId: string) => {
  console.log("Vô hiệu hóa user:", userId);
};

const handleActivate = (userId: string) => {
  console.log("Mở khóa user:", userId);
};

const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [openSortKey, setOpenSortKey] = useState<keyof User | null>(null);
  const { innerBorderRef } = useOnOutsideClick(() => setShowModal(false));

  const toggleCheckbox = (id: string) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      setHighlightedRows(updated);
      return updated;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setFiltered(
      mockUsers.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
      )
    );
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...filtered];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const SortableHeader = ({
    label,
    sortKey,
    openSortKey,
    setOpenSortKey,
  }: {
    label: string;
    sortKey: keyof User;
    openSortKey: keyof User | null;
    setOpenSortKey: (key: keyof User | null) => void;
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
          <div className="absolute right-0 top-6 w-32 bg-white border rounded shadow z-10">
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

  const handleSync = () => {
    setFiltered(mockUsers);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const table = document.querySelector("table");
      if (table && !table.contains(e.target as Node)) {
        setOpenSortKey(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <Layout>
      <div className="flex items-end justify-between mb-4">
        <h1 className="text-xl font-semibold leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
          Quản lý người dùng
        </h1>
      </div>

      <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[350px]">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSync}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Đồng Bộ Người Dùng
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-h-[576px] overflow-y-auto"
        >
          <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
            <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        selectedIds.length === sortedData.length &&
                        sortedData.length > 0
                      }
                      onChange={(e) => {
                        const allIds = e.target.checked
                          ? sortedData.map((i) => i.id)
                          : [];
                        setSelectedIds(allIds);
                        setHighlightedRows(allIds);
                      }}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <Contact className="w-5 h-5 text-gray-500" />
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="ID"
                      sortKey="id"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Tên"
                      sortKey="name"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                    Email
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Số điện thoại
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Vai trò"
                      sortKey="role"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Trạng thái"
                      sortKey="status"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Tổng nạp"
                      sortKey="totalDeposit"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Tài khoản QC"
                      sortKey="adAccounts"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((user) => (
                <tr
                  key={user.id}
                  className={
                    highlightedRows.includes(user.id)
                      ? "bg-[#dcfce7] ring-2 ring-[#47b46c]"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="text-center px-4 py-4 border border-gray-100 w-4 h-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleCheckbox(user.id)}
                    />
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                    </button>
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.id}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.name}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.email}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.phone}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.role}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.status}
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.totalDeposit.toLocaleString()}₫
                  </td>
                  <td className="text-center px-2 py-2 border border-gray-100">
                    {user.adAccounts.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              ref={innerBorderRef}
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[600px] relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Chi tiết người dùng
              </h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong>{" "}
                    {Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "number"
                      ? value.toLocaleString()
                      : value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagementPage;
