import React, { useState, useMemo, useEffect } from 'react';
import { useOnOutsideClick } from '../../../hook/useOutside.tsx';
import {
  MoreVertical,
  ArrowUp,
  ArrowDown,
  User,
  DollarSign,
  Briefcase,
  Phone,
  Eye,
  Contact,
  Pencil,
  Trash2,
  Mail,
  Smartphone,
  CircleUserRound,
  Edit,
  Shield,
  Activity,
  Star,
  TrendingUp,
  Calendar,
  X,
  Gift,
  TicketPercent,
  UserRoundSearch,
} from 'lucide-react';
import Pagination from './Pagination.tsx';
// import axios from "axios";
import BaseHeader, { BaseUrl } from '../../../api/BaseHeader';
import debounce from 'lodash.debounce';
import usePagination from '../../../hook/usePagination.tsx';
import { useForm, Controller } from 'react-hook-form';
import UserDetailModal from './UserDetailModal.tsx';
import AddUserModal from './AddUserModal.tsx';
import { toast, ToastContainer } from 'react-toastify';
import { useUserStore } from '../../../stores/useUserStore.ts';
import ToggleStatus from './ToggleStatus.tsx';
import { Checkbox, InputNumber, Modal, Table } from 'antd';
import { Voucher } from '../manager/voucher/VoucherManager.tsx';

// Define the User interface
interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  lastActive: string;
  totalDeposit: number;
  adAccounts: string[];
  edit: string;
  remove: string;
  points: number;
  percentage: number;
  created_at: string;
  active: boolean;
  type: string;
}
interface VoucherWithMeta extends Voucher {
  is_checked: boolean;
  is_expired: boolean;
  is_exceeded: boolean;
  quantity: number;
  initial_quantity: number;
  total_assigned: number;
  initial_total_assigned: number;
  _count: { userVouchers: number };
}

const AccountForm: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'asc' | 'desc';
  } | null>(null);
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);
  const [openSortKey, setOpenSortKey] = useState<keyof User | null>(null);
  const { innerBorderRef } = useOnOutsideClick(() => setShowModal(false));
  const [data, setData] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const { currentPage, pageSize, setCurrentPage, setPageSize } = usePagination(
    1,
    12
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [voucherList, setVoucherList] = useState<VoucherWithMeta[]>([]);
  const [rowUserId, setRowUserId] = useState<string>();
  console.log('voucherList111', voucherList);

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<User>({
    defaultValues: {
      id: '',
      username: '',
      email: '',
      phone: '',
      role: 'user',
    },
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const user = localStorage.getItem('user');
  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      fetchData(value);
    }, 800);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
    debounceSearch(e.target.value);
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        return sortConfig.direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const currentItems = sortedData;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
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
              <ArrowUp className="w-4 h-4 mr-2" />
              ASC
            </div>
            <div
              onClick={() => toggleSort('desc')}
              className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer flex items-center"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              DESC
            </div>
          </div>
        )}
      </div>
    );
  };

  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const fetchData = async (searchQuery = '') => {
    try {
      const parsedUser = JSON.parse(user || '{}');
      const userId = parsedUser?.user?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const params = {
        page: currentPage,
        pageSize: pageSize,
        ...(searchQuery && { query: searchQuery.trim() }),
      };

      const response = await BaseHeader({
        method: 'get',
        url: '/user',
        baseURL: BaseUrl,
        params,
      });
      setData(response.data?.data?.data || []);
      setTotalItems(response.data?.data?.pagination.total || 0);
    } catch (err: any) {
      console.error('Error fetching data:', err.message || err);
    }
  };

  function formatTimestampToDate(timestamp: string | number | Date): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatPercentage(item: any): string {
    const value = Number(item);
    return isNaN(value) ? '0' : (value * 100).toFixed(2);
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const table = document.querySelector('table');
      if (table && !table.contains(e.target as Node)) {
        setOpenSortKey(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const userobj = useUserStore((state) => state.user);
  const handleEdit = (user: User) => {
    setValue('id', user.id);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('role', user.role || 'user');
    setShowEditModal(true);
  };
  const handleVoucher = (user: User) => {
    fetchDataVoucher(user.id);
    setShowVoucherModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await BaseHeader({
        method: 'delete',
        url: `/user/${deleteTargetId}`,
        baseURL: BaseUrl,
      });
      setData((prev) => prev.filter((user) => user.id !== deleteTargetId));
      // setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
      setHighlightedRows((prev) => prev.filter((id) => id !== deleteTargetId));
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (err: any) {
      console.error('Error deleting user:', err.message || err);
    }
  };

  const handleEditSubmit = async (data: User) => {
    try {
      if (data.id) {
        await BaseHeader({
          method: 'put',
          url: `/user/${data.id}`,
          baseURL: BaseUrl,
          data,
        });
        toast.success('Cập nhật người dùng thành công!');
      } else {
        await BaseHeader({
          method: 'post',
          url: '/user',
          baseURL: BaseUrl,
          data,
        });
        toast.success('Thêm người dùng thành công');
      }
      await fetchData(query);
      setShowEditModal(false);
      reset();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Lỗi không xác định';
      if (errorMsg?.toLowerCase().includes('email')) {
        toast.error('Email đã tồn tại');
      } else {
        console.error('Error updating user:', errorMsg);
        toast.error('Có lỗi xảy ra. Vui lòng thử lại');
      }
    }
  };

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);
  const hanleChangeActive = async ({ id, active }: any) => {
    try {
      const response = await BaseHeader({
        method: 'put',
        url: `/user/${id}`,
        data: {
          active,
        },
      })
        .then(() => {
          toast.success('Đã thay đổi trạng thái người dùng');
          fetchData(query);
        })
        .catch((error: any) => {
          console.error('Error changing user status:', error.message || error);
          toast.error('Có lỗi xảy ra khi thay đổi trạng thái người dùng');
        });
    } catch (error: any) {
      console.error('Error changing user status:', error.message || error);
      toast.error('Có lỗi xảy ra khi thay đổi trạng thái người dùng');
    }
  };

  const fetchDataVoucher = async (id: string) => {
    try {
      const respone = await BaseHeader({
        method: 'get',
        url: `/all-vouchers/${id}`,
        baseURL: BaseUrl,
      });
      const vouchersWithInitialState = respone.data.data.map(
        (v: VoucherWithMeta) => ({
          ...v,
          initial_quantity: v.quantity,
          initial_total_assigned: v.total_assigned,
        })
      );
      setVoucherList(vouchersWithInitialState);
    } catch (err: any) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  };
  // console.log('voucherList111',voucherList)
  const handleSubmitVoucher = async () => {
    const payload = {
      user_id: rowUserId,
      voucher_states: voucherList.map((v) => ({
        voucher_id: v.id,
        is_checked: v.is_checked,
        quantity: v.quantity,
      })),
    };
    try {
      const respone = await BaseHeader({
        method: 'patch',
        url: `/assign-voucher`,
        baseURL: BaseUrl,
        data: payload,
      });
      setShowVoucherModal(false);
      toast.success(respone.data.message);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại'
      );
    }
  };
  const columns = [
    { title: 'Tên', dataIndex: 'name', width: 150 },
    { title: 'Mã', dataIndex: 'code', width: 100 },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: 120,
      render: (text: number, record: VoucherWithMeta) => (
        <InputNumber
          min={0}
          max={
            record.max_usage
              ? record.max_usage -
                (record.total_assigned -
                  (record.is_checked ? record.quantity : 0))
              : undefined
          }
          value={record.quantity}
          onChange={(value) => {
            const newVoucherList = voucherList.map((v) => {
              if (v.id === record.id) {
                const newQuantity = value || 0;
                const quantityChange = newQuantity - v.initial_quantity;
                return {
                  ...v,
                  quantity: newQuantity,
                  is_checked: newQuantity > 0,
                  total_assigned: v.initial_total_assigned + quantityChange,
                };
              }
              return v;
            });
            setVoucherList(newVoucherList);
          }}
          disabled={
            !record.is_checked || record.is_exceeded || record.is_expired
          }
        />
      ),
    },
    { title: 'Giảm giá', dataIndex: 'discount', width: 100 },
    { title: 'Loại', dataIndex: 'type', width: 100 },
    {
      title: 'HSD',
      dataIndex: 'expires_at',
      render: (text: any) =>
        text ? new Date(text).toLocaleDateString() : 'Không có',
      width: 120,
    },
    {
      title: 'Hết hạn',
      dataIndex: 'is_expired',
      render: (expired: boolean) =>
        expired ? <span className="text-red-500 font-medium">✓</span> : '',
      width: 80,
    },
    {
      title: 'Hết SL',
      dataIndex: 'is_exceeded',
      render: (exceeded: boolean) =>
        exceeded ? <span className="text-orange-500 font-medium">✓</span> : '',
      width: 80,
    },
    // {
    //   title: 'Đã gán',
    //   dataIndex: 'total_assigned',
    //   width: 80,
    // },
    // {
    //   title: 'Tổng',
    //   dataIndex: 'max_usage',
    //   width: 80,
    // },
    {
      title: 'Còn lại',
      width: 80,
      render: (record: VoucherWithMeta) =>
        record.max_usage ? record.max_usage - record.total_assigned : '∞',
    },
  ];

  const CheckType = (type: string) => {
    if (type === 'Manager') return 'Quản trị viên';
    if (type === 'Supper Admin') return 'Quản trị Marketing';
    if (type === 'User') return 'Người dùng';
    return type;
  };
  return (
    <div className="min-w-0">
      <div className="pl-1 p-4 mt-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[350px]">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email"
            className="form-control w-full pl-2 pr-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            value={query}
            onChange={handleSearch}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                handleSearch({
                  target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4 transition hover:scale-110" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          + Thêm người dùng
        </button>
      </div>

      <div className="sm:overflow-x-auto sm:rounded-lg sm:border sm:border-gray-300">
        {/* Desktop form */}
        <div
          className="hidden sm:block max-h-[576px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
            <thead className="bg-[#f5f5ff] text-sm text-center font-semibold uppercase text-[#2b3245] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <Contact className="w-4 h-4 text-gray-500" />
                    Chi tiết
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Tên"
                      sortKey="username"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4 text-gray-500" />
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
                    <Shield className="w-4 h-4 text-gray-500" />
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
                    <UserRoundSearch className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Loại tài khoản"
                      sortKey="type"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="w-4 h-4 text-gray-500" />
                    Trạng thái
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Điểm"
                      sortKey="points"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Phí dịch vụ"
                      sortKey="percentage"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <SortableHeader
                      label="Ngày tạo"
                      sortKey="created_at"
                      openSortKey={openSortKey}
                      setOpenSortKey={setOpenSortKey}
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <Edit className="w-4 h-4 text-gray-500" />
                    Chỉnh sửa
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user: User) => {
                const isDisabled =
                  user.email !== userobj?.email && user.role === 'super_admin';
                const isEnabled = user?.active ?? false;
                return (
                  <tr
                    key={user.id}
                    className={
                      highlightedRows.includes(user.id)
                        ? 'bg-[#dcfce7] relative'
                        : 'hover:bg-gray-50'
                    }
                    style={
                      highlightedRows.includes(user.id)
                        ? {
                            outline: '1px solid #47b46c',
                            outlineOffset: '0px',
                            position: 'relative',
                            zIndex: 5,
                          }
                        : {}
                    }
                  >
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
                      {user.username}
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
                      {CheckType(user.type || '')}
                    </td>
                    <td className="text-center px-2 py-2 border border-gray-100">
                      <ToggleStatus
                        isEnabled={isEnabled}
                        setIsEnabled={() =>
                          hanleChangeActive({ id: user.id, active: !isEnabled })
                        }
                      />
                    </td>
                    <td className="text-center px-2 py-2 border border-gray-100">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="text-center px-2 py-2 border border-gray-100">
                      {formatPercentage(user.percentage)} %
                    </td>
                    <td className="text-center px-2 py-2 border border-gray-100">
                      {formatTimestampToDate(user.created_at)}
                    </td>
                    <td className="text-center px-2 py-2 border border-gray-100">
                      <div className="flex justify-center items-center gap-2">
                        {/* voucher */}
                        <button
                          className={`p-1 rounded transition ${
                            isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-blue-100 text-[#13823d] hover:text-blue-700'
                          }`}
                          title="Chỉnh sửa"
                          onClick={() => {
                            handleVoucher(user);
                            setRowUserId(user.id);
                          }}
                          disabled={isDisabled}
                        >
                          <TicketPercent className="w-5 h-5" />
                        </button>
                        {/* Nút sửa */}
                        <button
                          className={`p-1 rounded transition ${
                            isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-blue-100 text-blue-500 hover:text-blue-700'
                          }`}
                          title="Chỉnh sửa"
                          onClick={() => {
                            if (!isDisabled) handleEdit(user);
                          }}
                          disabled={isDisabled}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>

                        {/* Nút xoá */}
                        <button
                          className={`p-1 rounded transition ${
                            isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-red-100 text-red-500 hover:text-red-700'
                          }`}
                          title="Xoá"
                          onClick={() => {
                            if (!isDisabled) {
                              setDeleteTargetId(user.id);
                              setShowDeleteModal(true);
                            }
                          }}
                          disabled={isDisabled}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile form */}
        <div className="block sm:hidden space-y-4 mb-6">
          {currentItems.map((request: User) => {
            const isDisabled =
              request.email !== userobj?.email && request.role === 'admin';
            return (
              <div
                key={request.id}
                className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-200/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 ring-1 ring-inset ring-gray-100/50 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CircleUserRound className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {request.username}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-5">
                  <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-blue-50/70">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium truncate">
                      {request.email}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-green-50/70">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Smartphone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {request.phone}
                    </span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50/70 rounded-xl transition-colors hover:bg-purple-50/70">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {request.role}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-xl border border-emerald-100">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-emerald-600 mr-2" />
                      <span className="text-xs text-emerald-700 font-medium">
                        Tổng nạp
                      </span>
                    </div>
                    <p className="text-lg font-bold text-emerald-800 mt-1">
                      {request.totalDeposit}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-xs text-blue-700 font-medium">
                          Tài khoản AD
                        </span>
                      </div>
                    </div>
                    {request.adAccounts && request.adAccounts.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {request.adAccounts
                          .slice(0, 3)
                          .map((account, index) => (
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
                      <p className="text-xs text-blue-600 italic">
                        Chưa có tài khoản
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-2">
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
                  <div className="grid grid-cols-2 gap-3">
                    {/* Nút sửa */}
                    <button
                      onClick={() => {
                        if (!isDisabled) handleEdit(request);
                      }}
                      disabled={isDisabled}
                      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
                        isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-amber-500 focus:ring-2'
                      }`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </button>

                    {/* Nút xoá */}
                    <button
                      onClick={() => {
                        if (!isDisabled) {
                          setDeleteTargetId(request.id);
                          setShowDeleteModal(true);
                        }
                      }}
                      disabled={isDisabled}
                      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${
                        isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 focus:ring-2'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-4 pb-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-sm text-gray-600">
              {/*Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedData.length)} của {sortedData.length} mục*/}
              Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
              {(currentPage - 1) * pageSize + data.length} của {totalItems} mục
            </div>
            <div>
              <select
                value={pageSize}
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

        {/* Detail modal */}
        {showModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
          />
        )}
        {/* modal Voucher */}
        {showVoucherModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div
              ref={innerBorderRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
                <button
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90"
                  onClick={() => {
                    setShowVoucherModal(false);
                    reset();
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-white pr-10">
                  Quản lý voucher người dùng
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6 overflow-y-scroll max-h-[500px]">
                  <Table
                    dataSource={voucherList}
                    rowKey="id"
                    pagination={false}
                    bordered
                    rowSelection={{
                      type: 'checkbox',
                      getCheckboxProps: (record) => ({
                        disabled: record.is_expired || record.is_exceeded, // Disable nếu is_expired hoặc is_exceeded = true
                      }),
                      selectedRowKeys: voucherList
                        .filter((v) => v.is_checked)
                        .map((v) => v.id),
                      onChange: (selectedRowKeys) => {
                        setVoucherList((prev) =>
                          prev.map((v) => {
                            const wasChecked = v.is_checked;
                            const isChecked = selectedRowKeys.includes(v.id);

                            let newQuantity = v.quantity;

                            if (isChecked && !wasChecked) {
                              if (newQuantity === 0) {
                                newQuantity = 1;
                              }
                            } else if (!isChecked && wasChecked) {
                              newQuantity = 0;
                            }

                            const quantityChange =
                              newQuantity - v.initial_quantity;
                            const newTotalAssigned =
                              v.initial_total_assigned + quantityChange;

                            return {
                              ...v,
                              is_checked: isChecked,
                              quantity: newQuantity,
                              total_assigned: newTotalAssigned,
                            };
                          })
                        );
                      },
                    }}
                    columns={columns}
                  />
                </div>
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVoucherModal(false);
                      reset();
                    }}
                    className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={Object.keys(errors).length > 0}
                    className={`flex-1 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                      Object.keys(errors).length > 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    onClick={handleSubmitVoucher}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div
              ref={innerBorderRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 relative">
                <button
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90"
                  onClick={() => {
                    setShowEditModal(false);
                    reset();
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-white pr-10">
                  Chỉnh sửa người dùng
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Cập nhật thông tin tài khoản
                </p>
              </div>
              <div className="p-6">
                <form
                  onSubmit={handleSubmit(handleEditSubmit)}
                  className="space-y-6"
                >
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Tên người dùng
                    </label>
                    <div className="relative">
                      <Controller
                        name="username"
                        control={control}
                        rules={{
                          required: 'Tên người dùng là bắt buộc',
                          minLength: {
                            value: 3,
                            message: 'Tên người dùng phải có ít nhất 3 ký tự',
                          },
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                              errors.username
                                ? 'border-red-400'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                            placeholder="Nhập tên người dùng"
                          />
                        )}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Email
                    </label>
                    <div className="relative">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: 'Email là bắt buộc',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email không hợp lệ',
                          },
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                              errors.email
                                ? 'border-red-400'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                            placeholder="Nhập địa chỉ email"
                          />
                        )}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: 'Số điện thoại là bắt buộc',
                          pattern: {
                            value: /^\+?\d{10,15}$/,
                            message: 'Số điện thoại không hợp lệ',
                          },
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full p-3 pl-10 border-2 rounded-xl transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white ${
                              errors.phone
                                ? 'border-red-400'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                            placeholder="Nhập số điện thoại"
                          />
                        )}
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                        Vai trò
                      </label>
                      <div className="relative">
                        <Controller
                          name="role"
                          control={control}
                          rules={{
                            required: 'Vai trò là bắt buộc',
                            validate: (value) =>
                              ['admin', 'user', 'super_admin'].includes(value)
                                ? true
                                : 'Vai trò không hợp lệ',
                          }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className={`w-full p-3 pl-10 pr-8 border-2 rounded-xl transition-all duration-200 outline-none appearance-none cursor-pointer ${
                                errors.role
                                  ? 'border-red-400'
                                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                              } bg-gray-50/50 hover:bg-white`}
                            >
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                          )}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.093"
                            />
                          </svg>
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        reset();
                      }}
                      className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                      className={`flex-1 px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                        Object.keys(errors).length > 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
              <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
              <p>Bạn có chắc muốn xóa người dùng này không?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTargetId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/*Add new user modal*/}
        {showAddUserModal && (
          <AddUserModal
            onClose={() => setShowAddUserModal(false)}
            onSuccess={() => {
              fetchData(); // Làm mới danh sách sau khi thêm
              setShowAddUserModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AccountForm;
