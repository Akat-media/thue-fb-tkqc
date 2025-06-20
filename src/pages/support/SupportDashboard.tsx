import React, {useEffect, useState, useMemo, useCallback} from "react";
import {
    Search, Plus, Filter, MoreVertical, Clock, ArrowRight, TrendingUp, CheckCircle2,
    X, Eye, MessageSquare, Trash2,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import debounce from "lodash.debounce";
import { useUserStore } from "../../stores/useUserStore.ts";
import BaseHeader from "../../api/BaseHeader.ts";

interface SupportRequest {
    id: string;
    title: string;
    sender: string;
    service: string;
    department: string;
    status: string;
    priority: string;
    lastUpdate: string;
    description: string;
    avatar?: string;
    full_name: string;
    updated_at: string;
    content: string;
    category: string;
    email: string;
}

const SupportDashboard: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [data, setData] = useState<SupportRequest[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const {user} = useUserStore()
    const id = user?.id;

    const fetchData =  useCallback(async (
        targetPage = 1,
        isLoadMore = false,
        search = "",
        status = "all"
    ) => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/support/user/${id}`, {
                params: {
                    page: targetPage,
                    limit: 6,
                    search,
                    status,
                },
            });

            const newData = response.data.data.data;
            const totalRecords = response.data.data.pagination.totalRecords;

            if (isLoadMore) {
                setData(prev => [...prev, ...newData]);
            } else {
                setData(newData);
            }

            const loadedItems = isLoadMore
                ? data.length + newData.length
                : newData.length;

            setHasMore(loadedItems < totalRecords);
        } catch (err: any) {
            console.error("Lỗi khi fetch data:", err.message);
        } finally {
            setLoading(false);
        }
    }, [id, baseUrl]);

    const debouncedFetchData = useMemo(() =>
        debounce((query: string, status: string) => {
            fetchData(1, false, query, status);
            setPage(1);
            setHasMore(true);
        }, 800), [fetchData]);

    useEffect(() => {
        if (id) {
            debouncedFetchData(searchQuery, statusFilter);
        }
    }, [id, searchQuery, statusFilter]);

    useEffect(() => {
        return () => {
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData]);

    // xy ly khi click ben ngoai nut xoa yeu cau
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dropdownMenus = document.querySelectorAll(".dropdown-menu");
            let clickedInside = false;

            dropdownMenus.forEach(menu => {
                if (menu.contains(target)) {
                    clickedInside = true;
                }
            });

            if (!clickedInside) setOpenMenuId(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage, true, searchQuery, statusFilter);
    };

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await BaseHeader({
                method: "delete",
                url: `support/${deleteTargetId}`,
            })
            // await axios.delete(`${baseUrl}/support/${deleteTargetId}`);
            setData(prev => prev.filter(item => item.id !== deleteTargetId));
            setOpenMenuId(null);
            setShowDeleteModal(false);
            setDeleteTargetId(null);
        } catch (err: any) {
            console.error("Error deleting request:", err.message);
        }
    };

    const formatTimestampToDate = (timestamp: string | number | Date): string => {
        const date = new Date(timestamp);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const createRequest = () => navigate("/create-request");

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Chờ xử lý' },
            'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: TrendingUp, label: 'Đang xử lý' },
            resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2, label: 'Đã giải quyết' },
            closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: X, label: 'Đã đóng' }
        };
        return configs[status as keyof typeof configs];
    };

    // const getPriorityConfig = (priority: string) => {
    //     const configs = {
    //         low: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    //         medium: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-400' },
    //         high: { bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-400' },
    //         urgent: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-400' }
    //     };
    //     return configs[priority as keyof typeof configs];
    // };


    return (
        <div className="min-h-[800px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className=" backdrop-blur-sm border-b border-white/20 z-50">
                <div className="max-w-7xl mx-auto px-6 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
                                    Trung tâm hỗ trợ
                                </h2>
                                <p className="mt-1 text-base text-gray-500">
                                    <span>Quản lý yêu cầu hỗ trợ thông minh</span>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative ">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-12 py-3 border border-gray-300 bg-gray-50 rounded-xl text-gray-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-all min-w-[160px] appearance-none cursor-pointer
"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="in-progress">Đang xử lý</option>
                                    <option value="resolved">Đã giải quyết</option>
                                </select>
                            </div>

                            {/*<button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 hover:bg-blue-100 transition-colors">*/}
                            {/*    <Calendar className="w-4 h-4" />*/}
                            {/*    Thời gian*/}
                            {/*</button>*/}
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tiêu đề, nội dung,..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 border-0 bg-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                                />
                            </div>
                            <button
                                onClick={createRequest}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo yêu cầu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Requests */}
                {data.length > 0 ? (
                    <div className="max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-white-400 scrollbar-track-blue-100 space-y-4 pr-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {data.map((request:SupportRequest) => {
                                const statusConfig = getStatusConfig(request.status);
                                // const priorityConfig = getPriorityConfig(request.priority);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <div key={request.id}
                                         className="animate-fadeIn group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:border-blue-200/50 transition-all duration-300 cursor-pointer">
                                        {/* Header */}
                                        <div className="relative flex items-start justify-between mb-4" >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                                    {/*<User className="w-5 h-5 text-blue-600" />*/}
                                                    <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{request.full_name}</p>
                                                    <p className="text-xs text-gray-500">{request.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleMenu(request.id)} // Toggle menu cho card cụ thể
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                            {/* Dropdown menu */}
                                            {openMenuId === request.id && (
                                                <div className="dropdown-menu absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteModal(true)
                                                            setDeleteTargetId(request.id)
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Xoá yêu cầu
                                                    </button>
                                                </div>

                                            )}

                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center gap-2 mb-2">
                                              {/*<span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">*/}
                                              {/*  {request.phone}*/}
                                              {/*</span>*/}
                                                <h3 className="items-center font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {request.title}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    {/*<div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>*/}
                                                    <span className="text-xs text-gray-500 capitalize">{request.priority}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                {request.content}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConfig.label}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {formatTimestampToDate(request.updated_at)}
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/support/${request.id}`)}
                                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-all"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    Xem
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
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
                                                onClick={()=>handleDelete()}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Chưa có yêu cầu hỗ trợ nào
                            </h3>
                            <p className="text-gray-500 mb-8">
                                Hệ thống của bạn đang hoạt động ổn định. Tạo yêu cầu hỗ trợ khi cần thiết.
                            </p>
                            <button
                                onClick={createRequest}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl mx-auto">
                                <Plus className="w-5 h-5" />
                                Tạo yêu cầu đầu tiên
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
                {hasMore && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Đang tải...' : 'Tải thêm'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SupportDashboard;
