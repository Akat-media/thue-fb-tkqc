import React, { useState,useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Clock,
    AlertCircle,
    Tag,
    Paperclip,
    ArrowLeft,
    CheckCircle2,
    Timer,
    Building2,
    FileText
} from 'lucide-react';
import {useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import {useUserStore} from "../../stores/useUserStore.ts";
import ChatBox from "./ChatBox.tsx";

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
    status: 'pending' | 'resolved' | 'in-progress';
    priority: 'high' | 'medium' | 'low';
    category: string;
    created_at: string;
    updated_at: string;
    avatar?: string;
    senderId: string;
    message: string;
    supportRequestId: string;
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
    const [data, setData] = useState<TicketData | null>(null);
    const [dataMessage, setDataMessage] = useState<ChatMessage[]>([]);
    const navigate = useNavigate();

    const { user: currentUser } = useUserStore();
    const { id } = useParams();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/support/${id}`);
            setData(response.data.data);
        } catch (err:any) {
            console.error("Lỗi khi fetch data:", err.message);
        }
    }
    const fetchMess = async () => {
        try {
            const response = await axios.get(`${baseUrl}/support/message/${id}`)
            setDataMessage(response.data.data);
        } catch (err:any) {
            console.error("Lỗi khi fetch message:", err.message);
        }
    }

    useEffect(() => {
        fetchData();
    },[id])

    useEffect(() => {
        fetchMess()
    }, [id]);

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
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
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
            case 'in-progress': return <Clock className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string): string => {
        switch(status) {
            case 'pending': return 'Đang chờ';
            case 'resolved': return 'Đã giải quyết';
            case 'in-progress': return 'Đang xử lý';
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

    const handleSendMessage = async (
        supportRequestId: string,
        senderId: string,
        message: string
    ): Promise<void>  => {
        if (!message.trim()) return;
        try {
            const response = await axios.post(`${baseUrl}/support/message`, {
                supportRequestId,
                senderId,
                message
            });

            const newMsg = response.data.data;
            setDataMessage((prev) => [...prev, newMsg]);
            setNewMessage('');
        } catch (error) {
            console.error('Lỗi gửi tin nhắn:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{data.title}</h1>
                            <p className="text-gray-600 mt-1">ID: {data.id}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
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
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
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
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-900">{data.email}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
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
                    <ChatBox
                        messages={dataMessage}
                        newMessage={newMessage}
                        currentUser={currentUser}
                        supportRequestId={data.id}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        formatDate={formatDate}
                    />

                </div>
            </div>
        </div>
    );
};

export default SupportTicketDetail;
