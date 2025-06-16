import React, {useEffect, useMemo, useState} from 'react';
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, User, Mail, Calendar } from 'lucide-react';
import axios from "axios";
import debounce from "lodash.debounce";
import Pagination from "../admin/account/Pagination.tsx";
import usePagination from "../../hook/usePagination.tsx";
import ChatBox from './ChatBox';
import {useUserStore} from "../../stores/useUserStore.ts";

interface SupportRequest {
    id: string;
    title: string;
    description: string;
    customerName: string;
    customerEmail: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'resolved' | 'closed';
    category: string;
    createdAt: string;
    lastUpdate: string;
    assignedTo?: string;
    fullName: string;
    email: string;
    content: string;
    created_at: string;
    updated_at: string;
}

interface ChatMessage {
    id: number;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
    avatar: string;
}

const AdminSupportRequests: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<SupportRequest[]>([]);
    const { currentPage, pageSize, setCurrentPage, setPageSize } = usePagination(1, 5);
    const [totalItems, setTotalItems] = useState(0);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const { user: currentUser } = useUserStore();

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const fetchData = async(
        page = 1,
        search = "",
        status = "all",
        priority= "",
        size = pageSize
    ) => {
        try{
            const response = await axios.get(`${baseUrl}/support`,{
                params: {
                    page,
                    limit: size,
                    search,
                    status,
                    priority,
                },
            })
            const newData = response.data.data.data;
            setTotalItems(response.data.data.pagination.totalRecords || 0);
            setData(newData);
        } catch (err: any) {
            console.error("Lỗi khi fetch data:", err.message);
        }
    }
    const fetchMessages = async (requestId: string) => {
        try {
            const response = await axios.get(`${baseUrl}/support/message/${requestId}`);
            setMessages(response.data.data);
        } catch (err: any) {
            console.error("Lỗi khi fetch messages:", err.message);
        }
    };

    const debouncedFetchData = useMemo(() =>
        debounce((query: string, status: string, priority: string, page: number, size: number) => {
            fetchData(page, query, status, priority, size);
        }, 800), []);

    useEffect(() => {
        setCurrentPage(1); // Đặt lại trang về 1
    }, [statusFilter, priorityFilter, searchQuery]); // Theo dõi các bộ lọc

    useEffect(() => {
        debouncedFetchData(searchQuery, statusFilter, priorityFilter, currentPage, pageSize);
    }, [searchQuery, statusFilter, priorityFilter, currentPage, pageSize, debouncedFetchData]);

    useEffect(() => {
        if (selectedRequest && showMessageModal) {
            fetchMessages(selectedRequest.id);
        }
    }, [selectedRequest, showMessageModal]);

    useEffect(() => {
        return () => {
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData]);

    const handleSendMessage = async (supportRequestId: string, senderId: string, message: string) => {
        if (!message.trim()) return;
        try {
            const response = await axios.post(`${baseUrl}/support/message`, {
                supportRequestId,
                senderId,
                message,
            });
            const newMsg = response.data.data;
            setMessages((prev) => [...prev, newMsg]);
            setNewMessage('');
        } catch (error) {
            console.error('Lỗi gửi tin nhắn:', error);
        }
    };

    const onBackToDetail = () => {
        setShowMessageModal(false);
        setShowDetailModal(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'in-progress': return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'resolved': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'closed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
            default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateRequestStatus = async (requestId: string, newStatus: SupportRequest['status']) => {
        try {
            const response = await axios.patch(`${baseUrl}/support/status/${requestId}`, {
                status: newStatus,
            });
            setSelectedRequest(prev => prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : prev);
            fetchData(currentPage, searchQuery, statusFilter, priorityFilter, pageSize);
            console.log("Trạng thái đã được cập nhật:", response.data);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };
    const totalPages = Math.ceil(totalItems / pageSize);
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    // const sendMessage= () => {
    //     // setShowMessage(true)
    //     setShowMessageModal(true);
    // }

    return (
        <div className="min-w-0">
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm yêu cầu..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="in-progress">Đang xử lý</option>
                            <option value="resolved">Đã giải quyết</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">Tất cả mức độ</option>
                            <option value="urgent">Khẩn cấp</option>
                            <option value="high">Cao</option>
                            <option value="medium">Trung bình</option>
                            <option value="low">Thấp</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center bg-blue-50 rounded-lg p-2">
                        <span className="text-xs sm:text-sm font-medium text-blue-900">
                           {data.length} / {totalItems} yêu cầu
                        </span>
                    </div>
                </div>
            </div>

            {/* Support Requests - Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Mức độ</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {data.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4">
                                    <div>
                                        {/*<div className="text-sm font-medium text-gray-900 mb-1">#{request.id}</div>*/}
                                        <div className="text-sm text-gray-600 truncate max-w-[200px]">{request.title}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{request.fullName}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1 truncate max-w-[150px]">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {request.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                            {request.priority === 'urgent' && 'Khẩn cấp'}
                                            {request.priority === 'high' && 'Cao'}
                                            {request.priority === 'medium' && 'Trung bình'}
                                            {request.priority === 'low' && 'Thấp'}
                                        </span>
                                </td>
                                <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                            {getStatusIcon(request.status)}
                                            <span className="ml-1">
                                                {request.status === 'pending' && 'Chờ xử lý'}
                                                {request.status === 'in-progress' && 'Đang xử lý'}
                                                {request.status === 'resolved' && 'Đã giải quyết'}
                                                {request.status === 'closed' && 'Đã đóng'}
                                            </span>
                                        </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-600">{request.category}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {formatDate(request.created_at)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setShowDetailModal(true);
                                                setShowMessageModal(false);
                                            }}
                                            className="inline-flex items-center px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            Xem
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setShowMessageModal(true);      // mở chat ngay
                                                setShowDetailModal(false);      // tắt modal chi tiết nếu đang mở
                                            }}
                                            className="inline-flex items-center px-2 py-1 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            Trả lời
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support Requests - Mobile Cards */}
            <div className="block sm:hidden space-y-4 mb-6">
                {data.map((request) => (
                    <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">#{request.id}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                                {request.priority === 'urgent' && 'Khẩn cấp'}
                                {request.priority === 'high' && 'Cao'}
                                {request.priority === 'medium' && 'Trung bình'}
                                {request.priority === 'low' && 'Thấp'}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{request.title}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-600">
                            <User className="w-3 h-3 mr-1" />
                            {request.fullName}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 truncate">
                            <Mail className="w-3 h-3 mr-1" />
                            {request.email}
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(request.created_at)}
                        </div>
                        <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span className="ml-1">
                                    {request.status === 'pending' && 'Chờ xử lý'}
                                    {request.status === 'in-progress' && 'Đang xử lý'}
                                    {request.status === 'resolved' && 'Đã giải quyết'}
                                    {request.status === 'closed' && 'Đã đóng'}
                                </span>
                            </span>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <button
                                onClick={() => setSelectedRequest(request)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Eye className="w-3 h-3 mr-1" />
                                Xem
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Trả lời
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-1 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-4 pb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {(currentPage - 1) * pageSize + 1} - {(currentPage - 1) * pageSize + data.length} của {totalItems} mục
                    </div>
                    <div>
                        <select
                            value={pageSize}
                            onChange={handleItemsPerPageChange}
                            className="px-2 py-1 border rounded-md text-sm"
                        >
                            <option value={5}>5 mục/trang</option>
                            <option value={10}>10 mục/trang</option>
                        </select>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            </div>

            {data.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 text-sm sm:text-base mb-2">Không tìm thấy yêu cầu nào</div>
                    <div className="text-xs sm:text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                </div>
            )}

            {/* Request Detail Modal */}
            {selectedRequest  && showDetailModal && !showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Chi tiết yêu cầu</h2>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                                    {selectedRequest.priority === 'urgent' && 'Khẩn cấp'}
                                    {selectedRequest.priority === 'high' && 'Cao'}
                                    {selectedRequest.priority === 'medium' && 'Trung bình'}
                                    {selectedRequest.priority === 'low' && 'Thấp'}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                                    {getStatusIcon(selectedRequest.status)}
                                    <span className="ml-1">
                                        {selectedRequest.status === 'pending' && 'Chờ xử lý'}
                                        {selectedRequest.status === 'in-progress' && 'Đang xử lý'}
                                        {selectedRequest.status === 'resolved' && 'Đã giải quyết'}
                                        {selectedRequest.status === 'closed' && 'Đã đóng'}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 truncate">{selectedRequest.title}</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Khách hàng</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.fullName}</p>
                                    <p className="text-xs text-gray-500 truncate">{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Danh mục</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.category}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Ngày tạo</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Cập nhật cuối</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.updated_at)}</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Mô tả chi tiết</label>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-sm text-gray-900">{selectedRequest.content}</p>
                                </div>
                            </div>

                            {selectedRequest.assignedTo && (
                                <div className="mb-4 sm:mb-6">
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Được phân công cho</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.assignedTo}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                {selectedRequest.status === 'pending' && (
                                    <button
                                        onClick={() => updateRequestStatus(selectedRequest.id, 'in-progress')}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Bắt đầu xử lý
                                    </button>
                                )}
                                {selectedRequest.status === 'in-progress' && (
                                    <button
                                        onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}
                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        Đánh dấu đã giải quyết
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowMessageModal(true);
                                        setShowDetailModal(false); // đóng chi tiết khi mở chat
                                    }}
                                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Gửi tin nhắn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedRequest && showMessageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <ChatBox
                            messages={messages}
                            newMessage={newMessage}
                            currentUser={currentUser}
                            supportRequestId={selectedRequest.id}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                            formatDate={formatDate}
                            isAdminView={true}
                            onClose={() => setShowMessageModal(false)}
                            onBack={onBackToDetail}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminSupportRequests;
