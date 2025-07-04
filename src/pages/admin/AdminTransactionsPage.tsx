import React, { useState, useMemo, useEffect } from 'react';
import { useOnOutsideClick } from '../../hook/useOutside';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  BadgeInfo,
  BadgeCheck,
  CircleDollarSign,
  Scale,
  Briefcase,
  AlarmClockPlus,
  Pen,
  ALargeSmall,
  HandCoins,
  RefreshCcw,
  SquarePen,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  User,
} from 'lucide-react';
import Subheader from '../../components/ui/Subheader';
import Button from '../../components/ui/Button';
import BaseHeader from '../../api/BaseHeader';
import { Pagination } from 'antd';
import usePagination from '../../hook/usePagination';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

interface Transaction {
  id: string;
  short_code: string;
  user_id: string;
  amountVND: number;
  points: number;
  createdAt: string;
  bank: string;
  description: string;
  transactionID: number;
  type: string;
  date: string;
  status: string;
  error_message: string | null;
}

const AdminTransactionsPage: React.FC = () => {
  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user || '{}');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Transaction | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [openSortKey, setOpenSortKey] = useState<keyof Transaction | null>(
    null
  );
  const [active, setActive] = useState('money');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionPoints, setTransactionPoints] = useState<Transaction[]>([]);
  const [query, setQuery] = useState('');

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

  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      if (active === 'money') {
        hanleTransactionMoney(value);
      } else {
        hanleTransactionPoint(value);
      }
    }, 100);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...filtered];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        if (aValue == null && bValue != null)
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue != null && bValue == null)
          return sortConfig.direction === 'asc' ? 1 : -1;
        if (aValue == null && bValue == null) return 0;

        return sortConfig.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('all');
    setFiltered(transactions);
  };
  const handleSync = async () => {
    if (active === 'money') {
      await hanleTransactionMoney();
    } else if (active === 'points') {
      await hanleTransactionPoint();
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const table = document.querySelector('table');
      if (table && !table.contains(e.target as Node)) {
        setActiveCell(null);
        setActiveRow(null);
        setOpenSortKey(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const SortableHeader = ({
    label,
    sortKey,
    openSortKey,
    setOpenSortKey,
  }: {
    label: string;
    sortKey: keyof Transaction;
    openSortKey: keyof Transaction | null;
    setOpenSortKey: (key: keyof Transaction | null) => void;
  }) => {
    const isOpen = openSortKey === sortKey;

    const toggleSort = (direction: 'asc' | 'desc') => {
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
              onClick={() => toggleSort('asc')}
              className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer flex items-center"
            >
              <ArrowUp className="w-4 h-4 mr-2" /> ASC
            </div>
            <div
              onClick={() => toggleSort('desc')}
              className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer flex items-center"
            >
              <ArrowDown className="w-4 h-4 mr-2" /> DESC
            </div>
          </div>
        )}
      </div>
    );
  };
  const headers = [
    {
      key: 'checkbox',
      render: () => (
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
      ),
    },
    // {
    //   key: 'edit',
    //   render: () => (
    //     <th className="px-4 py-3 text-center min-w-[50px] border border-gray-200">
    //       <SquarePen className="w-4 h-4 text-gray-500" />
    //     </th>
    //   ),
    // },
    {
      key: 'id',
      label: 'ID',
      icon: <BadgeInfo className="w-4 h-4 text-gray-500" />,
      sortKey: 'id',
      minWidth: '80px',
    },
    {
      key: 'username',
      label: 'Tên người dùng',
      icon: <User className="w-4 h-4 text-gray-500" />,
      sortKey: 'id',
      minWidth: '80px',
    },
    {
      key: 'amountVND',
      label: 'Số tiền đã nạp',
      icon: <CircleDollarSign className="w-4 h-4 text-gray-500" />,
      sortKey: 'amountVND',
      minWidth: '160px',
    },
    {
      key: 'points',
      label: 'Điểm',
      icon: <BadgeCheck className="w-4 h-4 text-gray-500" />,
      sortKey: 'points',
      minWidth: '160px',
    },
    {
      key: 'bank',
      label: 'Ngân hàng',
      icon: <Scale className="w-4 h-4 text-gray-500" />,
      sortKey: 'bank',
      minWidth: '120px',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      icon: <Briefcase className="w-4 h-4 text-gray-500" />,
      sortKey: 'status',
      minWidth: '120px',
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      icon: <AlarmClockPlus className="w-4 h-4 text-gray-500" />,
      sortKey: 'createdAt',
      minWidth: '150px',
    },
    {
      key: 'type',
      label: 'Loại',
      icon: <AlarmClockPlus className="w-4 h-4 text-gray-500" />,
      sortKey: 'type',
      minWidth: '100px',
    },
    {
      key: 'short_code',
      label: 'Short Code',
      icon: <HandCoins className="w-4 h-4 text-gray-500" />,
      sortKey: 'short_code',
      minWidth: '140px',
    },
    {
      key: 'transactionID',
      label: 'TransactionID',
      icon: <Pen className="w-4 h-4 text-gray-500" />,
      sortKey: 'transactionID',
      minWidth: '140px',
    },
    {
      key: 'description',
      label: 'Mô tả',
      icon: <ALargeSmall className="w-4 h-4 text-gray-500" />,
      sortKey: 'description',
      minWidth: '240px',
    },
  ];
  const headersPoints = [
    {
      key: 'checkbox',
      render: () => (
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
      ),
    },
    // {
    //   key: 'edit',
    //   render: () => (
    //     <th className="px-4 py-3 text-center min-w-[50px] border border-gray-200">
    //       <SquarePen className="w-4 h-4 text-gray-500" />
    //     </th>
    //   ),
    // },
    {
      key: 'id',
      label: 'ID',
      icon: <BadgeInfo className="w-4 h-4 text-gray-500" />,
      sortKey: 'id',
      minWidth: '80px',
    },
    {
      key: 'points_used',
      label: 'Số điểm đã đổi',
      icon: <CircleDollarSign className="w-4 h-4 text-gray-500" />,
      sortKey: 'points_used',
      minWidth: '160px',
    },
    {
      key: 'service_type',
      label: 'Loại dịch vụ',
      icon: <BadgeCheck className="w-4 h-4 text-gray-500" />,
      sortKey: 'service_type',
      minWidth: '160px',
    },
    {
      key: 'target_account',
      label: 'Tài khoản facebook',
      icon: <Scale className="w-4 h-4 text-gray-500" />,
      sortKey: 'target_account',
      minWidth: '120px',
    },
    {
      key: 'status',
      label: 'Trạng thái',
      icon: <Briefcase className="w-4 h-4 text-gray-500" />,
      sortKey: 'status',
      minWidth: '120px',
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      icon: <AlarmClockPlus className="w-4 h-4 text-gray-500" />,
      sortKey: 'created_at',
      minWidth: '150px',
    },
    {
      key: 'description',
      label: 'Mô tả',
      icon: <ALargeSmall className="w-4 h-4 text-gray-500" />,
      sortKey: 'description',
      minWidth: '240px',
    },
  ];
  const [total, setTotal] = useState<any>(0);
  const [totalPoints, setTotalPoints] = useState<any>(0);
  const { currentPage, pageSize, handleChange, setCurrentPage, setPageSize } =
    usePagination(1, 10);
  const {
    currentPage: currentPagePoint,
    pageSize: pageSizePoint,
    handleChange: handleChangePoint,
    setCurrentPage: setCurrentPagePoint,
    setPageSize: setPageSizePoint,
  } = usePagination(1, 10);
  const hanleTransactionMoney = async (searchQuery = '') => {
    try {
      let response;
      if (userParse?.user?.role === 'admin') {
        response = await BaseHeader({
          url: '/transaction-all',
          method: 'get',
          params: {
            page: currentPage,
            pageSize: pageSize,
            ...(searchQuery && { query: searchQuery.trim() }),
          },
        });
      } else {
        response = await BaseHeader({
          url: '/transaction',
          method: 'get',
          params: {
            user_id: userParse?.user_id,
            page: currentPage,
            pageSize: pageSize,
            ...(searchQuery && { query: searchQuery.trim() }),
          },
        });
      }
      const transactionData = response.data.data.data;
      // console.log("transactionData", transactionData);
      setTransactions(transactionData);
      setFiltered(transactionData); // Cập nhật filtered khi nhận dữ liệu mới
      setTotal(response.data.data.count);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê'
      );
    }
  };
  const hanleTransactionPoint = async (searchQuery = '') => {
    try {
      const response = await BaseHeader({
        url: '/points-used',
        method: 'get',
        params: {
          user_id: userParse?.user_id,
          page: currentPage,
          pageSize: pageSize,
          ...(searchQuery && { query: searchQuery.trim() }),
        },
      });
      const pointsData = response.data.data.data;
      setTransactionPoints(pointsData);
      setFiltered(pointsData); // Cập nhật filtered khi nhận dữ liệu mới
      setTotalPoints(response.data.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (active === 'money') {
      hanleTransactionMoney();
    }
    if (active === 'points') {
      hanleTransactionPoint();
    }
  }, [active, currentPage, pageSize]);

  useEffect(() => {
    if (active === 'money') {
      setFiltered(transactions);
    } else if (active === 'points') {
      setFiltered(transactionPoints);
    }
  }, [transactions, transactionPoints, active]);

  return (
    <div className="container mx-auto">
      {active === 'money' && (
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4">
          <Subheader active={active} setActive={setActive} />
          <div className="flex items-end justify-between mb-4">
            <h1 className="text-1xl font-semibold	 leading-7 text-blue-900 sm:text-3xl sm:truncate mt-1">
              Quản lý giao dịch nạp tiền
            </h1>
          </div>

          <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:min-w-[430px] max-w-fit flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, Tài Khoản"
                className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                value={query}
                onChange={handleSearch}
              />
              <Button
                className="min-w-[100px] bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white"
                variant="outline"
                size="sm"
                onClick={() => {
                  debounceSearch(query);
                }}
              >
                Tìm kiếm
              </Button>
            </div>
            {userParse?.user?.role === 'admin' && (
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
            )}
          </div>

          {/*main table*/}
          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[576px] overflow-y-auto"
            >
              <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
                <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-20">
                  <tr>
                    {headers.map((col) =>
                      col.render ? (
                        <React.Fragment key={col.key}>
                          {col.render()}
                        </React.Fragment>
                      ) : (
                        <th
                          key={col.key}
                          className={`px-4 py-3 text-center min-w-[${col.minWidth}] whitespace-nowrap border border-gray-200`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {col.icon}
                            <span>{col.label}</span>
                            <SortableHeader
                              label=""
                              sortKey={col.sortKey as keyof Transaction}
                              openSortKey={openSortKey}
                              setOpenSortKey={setOpenSortKey}
                            />
                          </div>
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-800">
                  {sortedData.map((item: any) => (
                    <tr
                      key={item.id}
                      className={`${
                        highlightedRows.includes(item.id)
                          ? 'bg-[#dcfce7] relative'
                          : activeRow === item.id
                          ? 'bg-green-100'
                          : 'hover:bg-gray-50'
                      }`}
                      style={
                        highlightedRows.includes(item.id)
                          ? {
                              outline: '1px solid #47b46c',
                              outlineOffset: '0px',
                              position: 'relative',
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

                      {/* <td className="px-4 py-2 text-center border border-gray-100">
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
                      </td> */}

                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-id` ? 'bg-green-100' : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-id`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.id}
                      </td>

                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-username`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-username`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.user?.username}
                      </td>

                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item?.id}-accountName`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-accountName`);
                          setActiveRow(null);
                        }}
                      >
                        {typeof item?.amountVND === 'number'
                          ? item.amountVND.toLocaleString()
                          : item?.amountVND}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-status`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-status`);
                          setActiveRow(null);
                        }}
                      >
                        {typeof item?.points === 'number'
                          ? item.points.toLocaleString()
                          : item?.points}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-amount`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-amount`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.bank}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-total`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-total`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.status}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-business`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-business`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.createdAt
                          ? format(
                              new Date(item?.createdAt),
                              'dd/MM/yyyy HH:mm:ss',
                              {
                                locale: vi,
                              }
                            )
                          : ''}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-currency`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-currency`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.type}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-createdAt`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-createdAt`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.short_code}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-note` ? 'bg-green-100' : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-note`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.transactionID}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-name` ? 'bg-green-100' : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-name`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.description}
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
                  <h2 className="text-xl font-semibold	 mb-4">
                    Chi tiết tài khoản
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(selectedAccount).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{' '}
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {Boolean(total) && (
            <div className="mt-4 mb-4">
              <Pagination
                total={total}
                onChange={handleChange}
                current={currentPage}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      )}
      {active === 'points' && (
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4">
          <Subheader active={active} setActive={setActive} />
          <div className="flex items-end justify-between mb-4">
            <h1 className="text-1xl font-semibold	 leading-7 text-blue-900 sm:text-3xl sm:truncate mt-1">
              Quản lý giao dịch đổi điểm
            </h1>
          </div>

          <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:min-w-[430px] max-w-fit flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, Tài Khoản"
                className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                value={query}
                onChange={handleSearch}
              />
              <Button
                className="min-w-[100px] bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-800 hover:text-white"
                variant="outline"
                size="sm"
                onClick={() => {
                  debounceSearch(query);
                }}
              >
                Tìm kiếm
              </Button>
            </div>
            {userParse?.user?.role === 'admin' && (
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
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-300">
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[576px] overflow-y-auto"
            >
              <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
                <thead className="bg-[#f5f5ff] text-sm font-semibold uppercase text-[#2b3245] sticky top-0 z-20">
                  <tr>
                    {headersPoints.map((col) =>
                      col.render ? (
                        <React.Fragment key={col.key}>
                          {col.render()}
                        </React.Fragment>
                      ) : (
                        <th
                          key={col.key}
                          className={`px-4 py-3 text-center min-w-[${col.minWidth}] whitespace-nowrap border border-gray-200`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {col.icon}
                            <span>{col.label}</span>
                            <SortableHeader
                              label=""
                              sortKey={col.sortKey as keyof Transaction}
                              openSortKey={openSortKey}
                              setOpenSortKey={setOpenSortKey}
                            />
                          </div>
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-800">
                  {sortedData.map((item: any) => (
                    <tr
                      key={item.id}
                      className={`${
                        highlightedRows.includes(item.id)
                          ? 'bg-[#dcfce7] ring-2 ring-[#47b46c]'
                          : activeRow === item.id
                          ? 'bg-green-100'
                          : 'hover:bg-gray-50'
                      }`}
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

                      {/* <td className="px-4 py-2 text-center border border-gray-100">
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
                      </td> */}

                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-id` ? 'bg-green-100' : ''
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
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-accountName`);
                          setActiveRow(null);
                        }}
                      >
                        {typeof item?.points_used === 'number'
                          ? item.points_used.toLocaleString()
                          : item?.points_used}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-status`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-status`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.service_type}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-amount`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-amount`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.target_account}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-total`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-total`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.status}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-business`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-business`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.created_at
                          ? format(
                              new Date(item?.created_at),
                              'dd/MM/yyyy HH:mm:ss',
                              {
                                locale: vi,
                              }
                            )
                          : ''}
                      </td>
                      <td
                        className={`px-4 py-2 text-center border border-[#f5f5ff]cursor-pointer ${
                          activeCell === `${item.id}-currency`
                            ? 'bg-green-100'
                            : ''
                        }`}
                        onClick={() => {
                          setActiveCell(`${item.id}-currency`);
                          setActiveRow(null);
                        }}
                      >
                        {item?.description}
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
                  <h2 className="text-xl font-semibold	 mb-4">
                    Chi tiết tài khoản
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {Object.entries(selectedAccount).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{' '}
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          {Boolean(totalPoints) && (
            <div className="mt-4 mb-4">
              <Pagination
                total={totalPoints}
                onChange={handleChangePoint}
                // current={currentPagePoint}
                // pageSize={pageSizePoint}
                current={currentPage}
                pageSize={pageSize}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
