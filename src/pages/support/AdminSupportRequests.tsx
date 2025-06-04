import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, AlertCircle, User, Mail, Calendar } from 'lucide-react';

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
}

const AdminSupportRequests: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

    const [supportRequests] = useState<SupportRequest[]>([
        {
            id: 'SR-001',
            title: 'Không thể đăng nhập vào tài khoản',
            description: 'Tôi đã thử nhiều lần nhưng không thể đăng nhập. Có thể bạn giúp tôi kiểm tra tài khoản?',
            customerName: 'Nguyễn Văn An',
            customerEmail: 'nguyen.van.an@email.com',
            priority: 'high',
            status: 'pending',
            category: 'Tài khoản',
            createdAt: '2024-06-01T10:30:00Z',
            lastUpdate: '2024-06-01T10:30:00Z',
        },
        {
            id: 'SR-002',
            title: 'Lỗi thanh toán khi mua hàng',
            description: 'Khi tôi thanh toán bằng thẻ tín dụng, hệ thống báo lỗi và không thể hoàn tất giao dịch.',
            customerName: 'Trần Thị Bình',
            customerEmail: 'tran.thi.binh@email.com',
            priority: 'urgent',
            status: 'in-progress',
            category: 'Thanh toán',
            createdAt: '2024-06-01T09:15:00Z',
            lastUpdate: '2024-06-01T14:20:00Z',
            assignedTo: 'Admin User'
        },
        {
            id: 'SR-003',
            title: 'Yêu cầu hoàn tiền',
            description: 'Tôi muốn hoàn tiền cho đơn hàng #12345 vì sản phẩm không đúng mô tả.',
            customerName: 'Lê Minh Châu',
            customerEmail: 'le.minh.chau@email.com',
            priority: 'medium',
            status: 'resolved',
            category: 'Hoàn tiền',
            createdAt: '2024-05-30T16:45:00Z',
            lastUpdate: '2024-06-01T11:30:00Z',
            assignedTo: 'Support Team'
        },
        {
            id: 'SR-004',
            title: 'Cập nhật thông tin tài khoản',
            description: 'Tôi cần thay đổi số điện thoại và địa chỉ email trong tài khoản.',
            customerName: 'Phạm Quốc Dũng',
            customerEmail: 'pham.quoc.dung@email.com',
            priority: 'low',
            status: 'closed',
            category: 'Tài khoản',
            createdAt: '2024-05-29T13:20:00Z',
            lastUpdate: '2024-05-30T09:15:00Z',
            assignedTo: 'Admin User'
        }
    ]);

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

    const filteredRequests = supportRequests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const updateRequestStatus = (requestId: string, newStatus: SupportRequest['status']) => {
        console.log(`Updating request ${requestId} to status: ${newStatus}`);
    };

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            <option value="closed">Đã đóng</option>
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
                            {filteredRequests.length} / {supportRequests.length} yêu cầu
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
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">ID & Tiêu đề</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Mức độ</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 mb-1">#{request.id}</div>
                                        <div className="text-sm text-gray-600 truncate max-w-[200px]">{request.title}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1 truncate max-w-[150px]">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {request.customerEmail}
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
                                        {formatDate(request.createdAt)}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedRequest(request)}
                                            className="inline-flex items-center px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            Xem
                                        </button>
                                        <button className="inline-flex items-center px-2 py-1 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                {filteredRequests.map((request) => (
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
                            {request.customerName}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 truncate">
                            <Mail className="w-3 h-3 mr-1" />
                            {request.customerEmail}
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(request.createdAt)}
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

            {filteredRequests.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 text-sm sm:text-base mb-2">Không tìm thấy yêu cầu nào</div>
                    <div className="text-xs sm:text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                </div>
            )}

            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Chi tiết yêu cầu #{selectedRequest.id}</h2>
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
                                    <p className="text-sm text-gray-900">{selectedRequest.customerName}</p>
                                    <p className="text-xs text-gray-500 truncate">{selectedRequest.customerEmail}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Danh mục</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.category}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Ngày tạo</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="text-xs sm:text-sm font-medium text-gray-700">Cập nhật cuối</label>
                                    <p className="text-sm text-gray-900">{formatDate(selectedRequest.lastUpdate)}</p>
                                </div>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Mô tả chi tiết</label>
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <p className="text-sm text-gray-900">{selectedRequest.description}</p>
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
                                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500">
                                    Gửi tin nhắn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupportRequests;
