import React, { useState, useMemo, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import { useOnOutsideClick } from "../../hook/useOutside";

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
  SquarePen,
  MoreVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface AdsAccount {
  id: string;
  accountName: string;
  facebookAdsId: string;
  note: string;
  amount: number;
  fee: number;
  business: string;
  currency: string;
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
    business: "Vip",
    currency: "VNĐ",
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
    business: "Vip",
    currency: "USD",
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
    business: "Vip",
    currency: "VNĐ",
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
    business: "Vip",
    currency: "VNĐ",
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
    business: "Vip",
    currency: "VNĐ",
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
    business: "Vip 2",
    currency: "USD",
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
    business: "Vip",
    currency: "VNĐ",
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
    business: "Vip",
    currency: "VNĐ",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T009",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "USD",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T010",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T011",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T012",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T013",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T014",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
    fee: 30000,
    total: 1230000,
    status: "Đang xử lý",
    limitBefore: 3000000,
    limitAfter: 4200000,
    createdAt: "2024-05-08",
  },
  {
    id: "T015",
    accountName: "Ads Account H",
    facebookAdsId: "202020202",
    note: "Đang xác minh giao dịch",
    amount: 1200000,
    business: "Vip 3",
    currency: "Franc",
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
  const [selectedAccount, setSelectedAccount] = useState<AdsAccount | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AdsAccount;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [openSortKey, setOpenSortKey] = useState<keyof AdsAccount | null>(null);

  const toggleCheckbox = (id: string) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      setHighlightedRows(updated);
      return updated;
    });
  };
  const { innerBorderRef } = useOnOutsideClick(() => {
    setShowModal(false);
  });

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
  const handleSearchLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);

    const result = mockData.filter((item) => {
      const matchSearch =
        item.accountName.toLowerCase().includes(term) ||
        item.facebookAdsId.toLowerCase().includes(term) ||
        item.note.toLowerCase().includes(term);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchType =
        typeFilter === "all" ||
        (typeFilter === "business" && item.accountName.includes("B"));
      typeFilter === "personal" && item.accountName.includes("C");

      return matchSearch && matchStatus && matchType;
    });

    setFiltered(result);
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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const table = document.querySelector("table");
      if (table && !table.contains(e.target as Node)) {
        setActiveCell(null);
        setActiveRow(null);
        setOpenSortKey(null);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const SortableHeader = ({
    label,
    sortKey,
    openSortKey,
    setOpenSortKey,
  }: {
    label: string;
    sortKey: keyof AdsAccount;
    openSortKey: keyof AdsAccount | null;
    setOpenSortKey: (key: keyof AdsAccount | null) => void;
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

  return (
    <Layout>
      <div className="flex items-end justify-between mb-4">
        <h1 className="text-1xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate mt-1">
          Quản lý tài khoản
        </h1>
      </div>

      <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-[350px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, Tài Khoản"
            className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            value={search}
            onChange={handleSearchLabel}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSync}
            className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Đồng Bộ Tài Khoản
            </div>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-h-[576px] overflow-y-auto"
        >
          <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
            <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-20">
              <tr>
                <th className="px-2 py-3 text-center min-w-[50px] border border-gray-200">
                  <label className="relative inline-flex items-center justify-center cursor-pointer w-4 h-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === sortedData.length &&
                        selectedIds.length > 0
                      }
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? sortedData.map((i) => i.id)
                          : [];
                        setSelectedIds(newSelected);
                        setHighlightedRows(newSelected);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border border-gray-300 bg-white peer-checked:bg-[#78bb07] peer-checked:border-[#78bb07] after:content-['✔'] after:absolute after:left-[2px] after:top-[-1px] after:text-white after:text-xs after:font-bold peer-checked:after:block after:hidden"></div>
                  </label>
                </th>
                <th className="px-4 py-3 text-center min-w-[50px] border border-gray-200">
                  <SquarePen className="w-4 h-4 text-gray-500" />
                </th>
                <th className="px-4 py-3 text-center min-w-[80px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                    <span>ID</span>
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
                    <BadgeCheck className="w-4 h-4 text-gray-500" />
                    <span>Account Name</span>
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
                    <CircleDollarSign className="w-4 h-4 text-gray-500" />
                    <span>Account Status</span>
                    <SortableHeader
                      label=""
                      sortKey="status"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Scale className="w-4 h-4 text-gray-500" />
                    <span>Amount Spent</span>
                    <SortableHeader
                      label=""
                      sortKey="amount"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>Balance</span>
                    <SortableHeader
                      label=""
                      sortKey="total"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>Business</span>
                    <SortableHeader
                      label=""
                      sortKey="business"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <AlarmClockPlus className="w-4 h-4 text-gray-500" />
                    <span>Currency</span>
                    <SortableHeader
                      label=""
                      sortKey="currency"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[140px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Pen className="w-4 h-4 text-gray-500" />
                    <span>Created Time</span>
                    <SortableHeader
                      label=""
                      sortKey="createdAt"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[240px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <ALargeSmall className="w-4 h-4 text-gray-500" />
                    <span>Reason Status</span>
                    <SortableHeader
                      label=""
                      sortKey="note"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Infinity className="w-4 h-4 text-gray-500" />
                    <span>Name</span>
                    <SortableHeader
                      label=""
                      sortKey="accountName"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[120px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <Clock9 className="w-4 h-4 text-gray-500" />
                    <span>Spend Cap</span>
                    <SortableHeader
                      label=""
                      sortKey="limitAfter"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Time</span>
                    <SortableHeader
                      label=""
                      sortKey="createdAt"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[140px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <LucideUserRoundCheck className="w-4 h-4 text-gray-500" />
                    <span>Owner</span>
                    <SortableHeader
                      label=""
                      sortKey="status"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[100px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <HandCoins className="w-4 h-4 text-gray-500" />
                    <span>Personal</span>
                    <SortableHeader
                      label=""
                      sortKey="status"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center min-w-[150px] whitespace-nowrap border border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <HandCoins className="w-4 h-4 text-gray-500" />
                    <span>Prepay Account</span>
                    <SortableHeader
                      label=""
                      sortKey="status"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-800">
              {sortedData.map((item: any) => (
                <tr
                  key={item.id}
                  className={`${
                    highlightedRows.includes(item.id)
                      ? "bg-[#dcfce7] relative"
                      : activeRow === item.id
                      ? "bg-green-100"
                      : "hover:bg-gray-50"
                  }`}
                  style={
                    highlightedRows.includes(item.id)
                      ? {
                          outline: "1px solid #47b46c",
                          outlineOffset: "0px",
                          position: "relative",
                          zIndex: 5,
                        }
                      : {}
                  }
                >
                  <td className="px-4 py-3 text-center border border-gray-100">
                    <label className="relative inline-flex items-center justify-center cursor-pointer w-4 h-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleCheckbox(item.id)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 rounded border border-gray-300 bg-white peer-checked:bg-[#78bb07] peer-checked:border-[#78bb07] after:content-['✔'] after:absolute after:left-[2px] after:top-[-1px] after:text-white after:text-xs after:font-bold peer-checked:after:block after:hidden"></div>
                    </label>
                  </td>

                  <td className="px-4 py-2 text-center border border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedAccount(item);
                        setShowModal(true);
                      }}
                      className="text-gray-600 hover:text-blue-600"
                      title="Xem chi tiết"
                    >
                      <SquarePen className="w-4 h-4 mx-auto" />
                    </button>
                  </td>

                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-id` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-id`);
                      setActiveRow(null);
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-accountName`
                        ? "bg-green-100"
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
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-status` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-status`);
                      setActiveRow(null);
                    }}
                  >
                    {item.status}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-amount` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-amount`);
                      setActiveRow(null);
                    }}
                  >
                    {item.amount.toLocaleString()}₫
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-total` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-total`);
                      setActiveRow(null);
                    }}
                  >
                    {item.total.toLocaleString()}₫
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-business` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-business`);
                      setActiveRow(null);
                    }}
                  >
                    Business name
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-currency` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-currency`);
                      setActiveRow(null);
                    }}
                  >
                    VND
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-createdAt`
                        ? "bg-green-100"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-createdAt`);
                      setActiveRow(null);
                    }}
                  >
                    {item.createdAt}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-note` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-note`);
                      setActiveRow(null);
                    }}
                  >
                    {item.note}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-name` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-name`);
                      setActiveRow(null);
                    }}
                  >
                    {item.accountName}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-limitAfter`
                        ? "bg-green-100"
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
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-time` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-time`);
                      setActiveRow(null);
                    }}
                  >
                    {item.createdAt}
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-owner` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-owner`);
                      setActiveRow(null);
                    }}
                  >
                    Owner Name
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-personal` ? "bg-green-100" : ""
                    }`}
                    onClick={() => {
                      setActiveCell(`${item.id}-personal`);
                      setActiveRow(null);
                    }}
                  >
                    Personal
                  </td>
                  <td
                    className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                      activeCell === `${item.id}-prepay` ? "bg-green-100" : ""
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
        {showModal && selectedAccount && (
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
              <h2 className="text-xl font-semibold	 mb-4">Chi tiết tài khoản</h2>
              <ul className="space-y-2 text-sm">
                {Object.entries(selectedAccount).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "number" ? value.toLocaleString() : value}
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

export default ManageAdsAccount;
