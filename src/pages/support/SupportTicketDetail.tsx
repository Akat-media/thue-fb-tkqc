import React, { useState,useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Clock,
    AlertCircle,
    Tag,
    MessageSquare,
    Send,
    Paperclip,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Timer,
    Building2,
    FileText
} from 'lucide-react';
import {useNavigate,useParams } from "react-router-dom";
import axios from "axios";

interface TicketData {
    id: string;
    user_id: string;
    fullName: string;
    email: string;
    phone: string;
    title: string;
    department: string;
    content: string;
    attachments: string[];
    status: 'pending' | 'resolved' | 'closed' | 'in_progress';
    priority: 'high' | 'medium' | 'low';
    category: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
}

interface ChatMessage {
    id: number;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
    avatar: string;
}

const SupportTicketDetail: React.FC = () => {
    const [newMessage, setNewMessage] = useState<string>('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            sender: 'user',
            senderName: 'Lê Văn Bảo',
            message: 'Xin chào, tôi đang gặp vấn đề với tài khoản của mình.',
            timestamp: '2025-06-11T08:21:00.000Z',
            avatar: 'LB'
        },
        {
            id: 2,
            sender: 'admin',
            senderName: 'Admin Support',
            message: 'Chào bạn! Tôi đã nhận được yêu cầu hỗ trợ của bạn. Bạn có thể mô tả chi tiết vấn đề đang gặp phải không?',
            timestamp: '2025-06-11T08:25:00.000Z',
            avatar: 'AS'
        },
        {
            id: 3,
            sender: 'user',
            senderName: 'Lê Văn Bảo',
            message: 'Tôi không thể đăng nhập vào tài khoản và không nhận được email reset password.',
            timestamp: '2025-06-11T08:27:00.000Z',
            avatar: 'LB'
        },
        {
            id: 4,
            sender: 'admin',
            senderName: 'Admin Support',
            message: 'Tôi hiểu vấn đề của bạn. Để hỗ trợ tốt nhất, bạn có thể cung cấp thêm thông tin về thời điểm cuối cùng bạn đăng nhập thành công không?',
            timestamp: '2025-06-11T08:30:00.000Z',
            avatar: 'AS'
        }
    ]);
    const [data, setData] = useState<TicketData | null>(null);
    const navigate = useNavigate();

    const { id } = useParams();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const fetchData = async () => {
        const response = await axios.get(`${baseUrl}/support/${id}`);
        console.log("response", response.data.data);
        setData(response.data.data);
    }

    useEffect(() => {
        fetchData();
    },[id])
    // console.log("data",data.attachments.length)

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
                Đang tải chi tiết yêu cầu...
            </div>
        );
    }

    const getStatusColor = (status: string): string => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const getPriorityColor = (priority: string): string => {
        switch(priority) {
            case 'urgent': return 'bg-red-300 text-red-800 border-red-300';
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string): React.ReactNode => {
        switch(status) {
            case 'pending': return <Timer className="w-4 h-4" />;
            case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
            case 'closed': return <XCircle className="w-4 h-4" />;
            case 'in_progress': return <Clock className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string): string => {
        switch(status) {
            case 'pending': return 'Đang chờ';
            case 'resolved': return 'Đã giải quyết';
            case 'closed': return 'Đã đóng';
            case 'in_progress': return 'Đang xử lý';
            default: return status;
        }
    };

    const getPriorityText = (priority: string): string => {
        switch(priority) {
            case 'urgent': return 'Khẩn cấp';
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return priority;
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSendMessage = (): void => {
        if (newMessage.trim()) {
            const newMsg: ChatMessage = {
                id: chatMessages.length + 1,
                sender: 'admin',
                senderName: 'Admin Support',
                message: newMessage,
                timestamp: new Date().toISOString(),
                avatar: 'AS'
            };
            setChatMessages([...chatMessages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };



    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 py-8">
                    <button
                        onClick={()=>navigate("/support")}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại danh sách
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                            <p className="text-gray-600 mt-1">ID: {data.id}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(data.status)}`}>
                                {getStatusIcon(data.status)}
                                <span className="ml-2">{getStatusText(data.status)}</span>
                            </span>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(data.priority)}`}>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <span>{getPriorityText(data.priority)}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-[24px]">
                    {/* Left Sidebar - Ticket Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Thông tin người dùng */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-300 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Thông tin khách hàng
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-lg">
                                        <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                    </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{data.fullName}</h3>
                                        {/*<p className="text-sm text-gray-600">ID: {data.user_id.slice(0, 8)}...</p>*/}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-900">{data.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-900">{data.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chi tiết yêu cầu */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-yellow-200 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Chi tiết yêu cầu
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Danh mục</p>
                                        <div className="flex items-center space-x-2">
                                            <Tag className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-gray-900 capitalize">{data.category}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Bộ phận</p>
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-gray-900 capitalize">{data.department}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Mô tả vấn đề</p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-900 leading-relaxed">{data.content}</p>
                                    </div>
                                </div>
                                {data.attachments.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                                            <Paperclip className="w-4 h-4 mr-1" />
                                            File đính kèm ({data.attachments.length})
                                        </p>
                                        <div className="space-y-2">
                                            {data.attachments.map((file, index) => (
                                                <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                    <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span className="text-sm text-gray-700">{file}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thời gian */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-400 to-teal-400 px-6 py-4">
                                <h2 className="text-lg font-semibold text-white flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Thông tin thời gian
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Tạo lúc</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(data.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Cập nhật</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{formatDate(data.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Chat */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[800px] flex flex-col">
                            <div className="rounded-[10px] bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center">
                                <MessageSquare className="w-6 h-6 text-white mr-3" />
                                <h2 className="text-xl font-semibold text-white">Hội thoại hỗ trợ</h2>
                                <div className="ml-auto">
                                  <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                                    {chatMessages.length} tin nhắn
                                  </span>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {chatMessages.map((message) => (
                                    <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`flex max-w-[75%] ${message.sender === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                message.sender === 'admin' ? 'bg-emerald-600 mr-3' : 'bg-blue-600 ml-3'
                                            }`}>
                                                {message.avatar}
                                            </div>
                                            <div className={`flex flex-col ${message.sender === 'admin' ? 'items-start' : 'items-end'}`}>
                                                <div className={`px-4 py-3 rounded-2xl max-w-full break-words ${
                                                    message.sender === 'admin'
                                                        ? 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                        : 'bg-blue-600 text-white rounded-br-md'
                                                }`}>
                                                    <p className="text-sm leading-relaxed">{message.message}</p>
                                                </div>
                                                <div className="flex items-center mt-2 space-x-2">
                                                    <span className="text-xs text-gray-500 font-medium">{message.senderName}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="border-t border-gray-200 p-4">
                                <div className="flex items-end space-x-3">
                                    <div className="flex-1">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn của bạn..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        rows={2}
                                    />
                                    </div>
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Gửi</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTicketDetail;
