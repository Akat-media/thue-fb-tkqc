import React, { useState, useMemo, useEffect } from "react";
// import Button from "../../../components/ui/Button.tsx";
import { useOnOutsideClick } from "../../../hook/useOutside.tsx";
import {
    MoreVertical,
    ArrowUp,
    ArrowDown,
    User,
    BadgeInfo,
    DollarSign,
    Briefcase,
    Phone,
    Eye,
    Contact,
    Pencil,
    Trash2, Mail, Smartphone, CircleUserRound,
    RefreshCcw,
} from "lucide-react";
import Pagination from "./Pagination.tsx";

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
    edit: string;
    remove: string;
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
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
        edit: "edit",
        remove: "remove",
    },

];

const AccountForm: React.FC = () => {
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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

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

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset về trang 1 khi thay đổi số mục trên trang
    };

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
        <div className="min-w-0">
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

            <div className="sm:overflow-x-auto sm:rounded-lg sm:border sm:border-gray-300">
                {/*form desktop*/}
                <div
                    className="hidden sm:block  max-h-[576px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
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
                            <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                                    Chỉnh sửa
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((user) => (
                            <tr
                                key={user.id}
                                className={
                                    highlightedRows.includes(user.id)
                                        ? "bg-[#dcfce7] relative"
                                        : "hover:bg-gray-50"
                                }
                                style={
                                    highlightedRows.includes(user.id)
                                        ? {
                                            outline: "1px solid #47b46c",
                                            outlineOffset: "0px",
                                            position: "relative",
                                            zIndex: 5,
                                        }
                                        : {}
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
                                <td className="text-center px-2 py-2 border border-gray-100">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            className="p-1 rounded hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700 transition"
                                            title="Xoá"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/*form mobile*/}
                <div className="block sm:hidden space-y-4 mb-6">
                    {currentItems.map((request) => (
                        <div
                            key={request.id}
                            className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 ring-1 ring-inset ring-gray-100/50 backdrop-blur-sm"
                        >
                            {/* Status indicator */}
                            <div className="absolute top-4 right-4">
                                <div className={`w-3 h-3 rounded-full ${request.status === 'Hoạt động' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'}`}>
                                    <div className={`w-3 h-3 rounded-full ${request.status === 'Hoạt động' ? 'bg-emerald-400' : 'bg-red-400'} animate-ping absolute`}></div>
                                </div>
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <CircleUserRound className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ID #{request.id}</span>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {request.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info Grid */}
                            <div className="grid grid-cols-1 gap-3 mb-5">
                                <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-blue-50/70">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium truncate">{request.email}</span>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-green-50/70">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                        <Smartphone className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{request.phone}</span>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-purple-50/70">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <Briefcase className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{request.role}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-100">
                                    <div className="flex items-center">
                                        <DollarSign className="w-4 h-4 text-emerald-600 mr-2" />
                                        <span className="text-xs text-emerald-700 font-medium">Tổng nạp</span>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-800 mt-1">{request.totalDeposit}</p>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                                            <span className="text-xs text-blue-700 font-medium">Tài khoản AD</span>
                                        </div>
                                        {/*<span className="text-lg font-bold text-blue-800">{request.adAccounts?.length || 0}</span>*/}
                                    </div>
                                    {request.adAccounts && request.adAccounts.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {request.adAccounts.slice(0, 3).map((account, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                                >
                                                {account}
                                            </span>
                                            ))}
                                            {request.adAccounts.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-200 text-blue-900 border border-blue-300">
                                                    +{request.adAccounts.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-blue-600 italic">Chưa có tài khoản</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-4">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${
                                    request.status === 'Hoạt động'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                        request.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}></div>
                                    {request.status}
                                </span>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setSelectedUser(request);
                                        setShowModal(true);
                                    }}
                                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/*phan trang*/}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-4 pb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-600">
                            Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedData.length)} của {sortedData.length} mục
                        </div>
                        <div>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="px-2 py-1 border rounded-md text-sm"
                            >
                                <option value={6}>6 mục/trang</option>
                                <option value={9}>9 mục/trang</option>
                            </select>
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>


                {/*show modal khi click eye desktop*/}
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
        </div>
    );
};

export default AccountForm;
