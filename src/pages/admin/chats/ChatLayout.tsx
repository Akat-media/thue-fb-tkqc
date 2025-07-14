import React, { useState, useRef, useEffect } from 'react';
import {ArrowLeft} from "lucide-react";
import BaseHeader from "../../../api/BaseHeader.ts";
import {useUserStore} from "../../../stores/useUserStore.ts";
import {usePageStore} from "../../../stores/usePageStore.ts";
import MessageView from './MessageView.tsx';

type Message = {
    id: string;
    content: string;
    chat_id: string;
    created_at: string;
    sender_id: string;
    sender: {
        id: string;
        username: string;
        role: string;
    };
};

type User = {
    id: string;
    name: string;
    email: string;
    username: string;
};

type Chat = {
    id?: string;
    messages: Message[];
};

type ChatMember = {
    id: string;
    chat_id: string;
    user_id: string;
    user: User;
    chat: Chat;
};

const ChatLayout: React.FC = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'AKA Media', content: 'Xin chào! Cảm ơn bạn đã liên hệ với AKA Media 👋', time: '14:30', isOwn: false },
        { id: 2, sender: 'Bạn', content: 'Chào admin! Tôi muốn tìm hiểu về dịch vụ truyền thông của công ty', time: '14:32', isOwn: true },
        { id: 3, sender: 'AKA Media', content: 'Chúng tôi cung cấp đầy đủ các dịch vụ marketing digital, content creation, và quản lý social media. Bạn có nhu cầu cụ thể nào không? 🤔', time: '14:33', isOwn: false },
        { id: 4, sender: 'Bạn', content: 'Tôi đang cần hỗ trợ chạy ads Facebook cho shop online của mình', time: '14:35', isOwn: true },
        { id: 5, sender: 'AKA Media', content: 'Tuyệt vời! Chúng tôi có kinh nghiệm 5+ năm trong lĩnh vực Facebook Ads. Bạn có thể cho biết ngành hàng và ngân sách dự kiến không? 💼', time: '14:36', isOwn: false },
        { id: 6, sender: 'Bạn', content: 'Mình bán thời trang nữ, budget khoảng 20-30 triệu/tháng', time: '14:37', isOwn: true },
        { id: 7, sender: 'AKA Media', content: 'Thời trang nữ là một trong những lĩnh vực mạnh của chúng tôi. Với budget 20-30 triệu, chúng tôi có thể tạo ra nhiều campaign hiệu quả với ROAS từ 4-6x. Bạn có muốn tham khảo case study không? 📊', time: '14:38', isOwn: false },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [data, setData] = useState<ChatMember[]>([]);
    const [selectedUser, setSelectedUser] = useState<User>();

    const {user} = useUserStore();
    const { formatDateToVN } = usePageStore();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const currentTime = new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            setMessages([...messages, {
                id: messages.length + 1,
                sender: 'Bạn',
                content: newMessage,
                time: currentTime,
                isOwn: true
            }]);
            setNewMessage('');

            setIsTyping(true);

            setTimeout(() => {
                setIsTyping(false);
                const responses = [
                    'Chúng tôi có nhiều case study thành công trong ngành thời trang. Tỷ lệ chuyển đổi trung bình 3-5% 📈',
                    'Bạn có thể chia sẻ thêm về target audience và sản phẩm best seller không? 🎯',
                    'Chúng tôi sẽ setup tracking chi tiết và báo cáo hàng tuần. Bạn có muốn book lịch tư vấn không? 📅',
                    'Cảm ơn bạn đã quan tâm! Chúng tôi sẽ hỗ trợ tối đa để đạt được mục tiêu bán hàng! 🚀'
                ];

                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    sender: 'AKA Media',
                    content: responses[Math.floor(Math.random() * responses.length)],
                    time: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    isOwn: false
                }]);
            }, 2500);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const fetchData = async () => {
        try {
            if (!user?.id) return;
            const response = await BaseHeader({
                method: 'get',
                url: `users-chatted/${user.id}`,
            });
            console.log("res: ",response.data.data);
            // return
            setData(response.data.data)
        } catch (err: any) {
            console.error('Lỗi khi fetch data:', err.message);
        }
    }
    useEffect(() => {
        fetchData()
    }, [user?.id]);

    useEffect(() => {
        console.log("data: ",data)
    }, [data]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const chatLists = [
        {
            name: "AKA Media",
            time: "15h30",
            messages: "Chúng tôi có nhiều case study thành công 123",
            colorText: "text-white",
            bg: "bg-gradient-to-br from-blue-500 to-purple-600"
        },
        {
            name: "Marketing team",
            time: "16h30",
            messages: "Báo cáo kết quả campaign tuần này 456",
            colorText: "text-black",
            bg: "bg-gray-300"

        },
        {
            name: "Design team",
            time: "14h30",
            messages: "Đã upload mockup mới",
            colorText: "text-white",
            bg: "bg-green-400"
        }
    ]


    const handleSelectUser = (chatMember: ChatMember) => {
        setSelectedUser(chatMember.user);
    };

    useEffect(() => {
        console.log("selectedUser",selectedUser)
    }, [selectedUser]);

    useEffect(() => {
        if (data.length > 0 && !selectedUser) {
            setSelectedUser(data[0].user); // user gần nhất đã chat
        }
    }, [data, selectedUser]);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">

            {/* left sidebar desktop */}
            <div className="hidden md:flex w-full md:w-80 bg-white border-r flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Đoạn chat</h1>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                                </svg>
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm trong Messenger"
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {
                        data.map((item,index) => (
                            <div
                                key={index}
                                className="hover:bg-gray-50 px-4 py-3 cursor-pointer bg-blue-50 border-r-2 border-blue-500"
                                onClick={() => handleSelectUser(item)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            A
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.user.username}</h3>
                                            <span className="text-xs text-gray-500">{formatDateToVN(item.chat.messages[0]?.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{item.chat.messages[0]?.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* left sidebar mobile */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 z-50 bg-white w-4/5 max-w-xs border-r flex flex-col transition-transform duration-300 transform md:hidden ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header sidebar mobile */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Đoạn chat</h2>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="p-2 text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {
                        data.map((item,index) => (
                            <div key={index} className="hover:bg-gray-50 px-4 py-3 cursor-pointer bg-blue-50 border-r-2 border-blue-500">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            A
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.user.username}</h3>
                                            <span className="text-xs text-gray-500">{formatDateToVN(item.chat.messages[0]?.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{item.chat.messages[0]?.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>


            {/* CENTER - Main Chat Area */}
            {selectedUser && (
                <div className="flex-1 overflow-y-auto p-4">
                    {selectedUser && user?.id && (
                        <div className="flex-1 overflow-y-auto p-4">
                            <MessageView
                                user={selectedUser}
                                messages={
                                    data.find(d => d.user.id === selectedUser.id)?.chat.messages || []
                                }
                                currentUserId={user?.id}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* RIGHT SIDEBAR - Chat Info Panel */}
            <div className="hidden md:flex w-full md:w-80 bg-white border-l flex-col">
            {/* Profile Section */}
                <div className="p-6 text-center border-b">
                    <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            A
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">AKA Media</h3>
                    <p className="text-sm text-gray-600 mb-2">Agency truyền thông</p>
                    <p className="text-sm text-green-600">Đang hoạt động</p>
                </div>

                {/* Info Details */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b">
                        <h4 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">cskh@akamedia.vn</p>
                                    <p className="text-xs text-gray-500">Email</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Hà Nội, Việt Nam</p>
                                    <p className="text-xs text-gray-500">Địa chỉ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-b">
                        <h4 className="font-semibold text-gray-900 mb-3">Dịch vụ</h4>
                        <div className="space-y-2">
                            <div className="bg-blue-50 px-3 py-2 rounded-lg">
                                <p className="text-sm text-blue-800">Facebook Ads</p>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded-lg">
                                <p className="text-sm text-green-800">Tiktok Ads</p>
                            </div>
                            <div className="bg-purple-50 px-3 py-2 rounded-lg">
                                <p className="text-sm text-purple-800">Content Marketing</p>
                            </div>
                            <div className="bg-orange-50 px-3 py-2 rounded-lg">
                                <p className="text-sm text-orange-800">Social Media</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default ChatLayout;
