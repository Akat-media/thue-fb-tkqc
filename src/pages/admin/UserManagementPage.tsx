import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";

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
];

const handleDeactivate = (userId: string) => {
  console.log("Vô hiệu hóa user:", userId);
};

const handleActivate = (userId: string) => {
  console.log("Mở khóa user:", userId);
};

const UserManagementPage = () => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);
    setFilteredUsers(
      mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      )
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            value={search}
            onChange={handleSearch}
            className="form-control w-full md:w-1/3"
          />
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto border rounded-lg text-sm text-center align-middle">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2">Tên</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Vai trò</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Hoạt động"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.createdAt}</td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-0"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                <strong>Trạng thái:</strong> {selectedUser.status}
              </li>
              <li>
                <strong>Ngày tạo:</strong> {selectedUser.createdAt}
              </li>
              <li>
                <strong>Hoạt động gần nhất:</strong> {selectedUser.lastActive}
              </li>
              <li>
                <strong>Số tiền đã nạp:</strong>{" "}
                {selectedUser.totalDeposit.toLocaleString()} VND
              </li>
              <li>
                <strong>Tài khoản quảng cáo:</strong>{" "}
                {selectedUser.adAccounts.join(", ") || "Không có"}
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

export default UserManagementPage;
