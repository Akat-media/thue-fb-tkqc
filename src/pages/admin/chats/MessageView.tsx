import React, {useEffect, useRef, useState} from "react";
import {ArrowLeft} from "lucide-react";

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

type MessageViewProps = {
    user: {
        id: string;
        username: string;
        email?: string;
    };
    messages: Message[];
    currentUserId: string;
};

const MessageView: React.FC<MessageViewProps>  = ({ user, messages }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);


    const messagesEndRef = useRef<HTMLDivElement>(null);
    // const [messages, setMessages] = useState([
    //     { id: 1, sender: 'AKA Media', content: 'Xin chào! Cảm ơn bạn đã liên hệ với AKA Media 👋', time: '14:30', isOwn: false },
    //     { id: 2, sender: 'Bạn', content: 'Chào admin! Tôi muốn tìm hiểu về dịch vụ truyền thông của công ty', time: '14:32', isOwn: true },
    //     { id: 3, sender: 'AKA Media', content: 'Chúng tôi cung cấp đầy đủ các dịch vụ marketing digital, content creation, và quản lý social media. Bạn có nhu cầu cụ thể nào không? 🤔', time: '14:33', isOwn: false },
    //     { id: 4, sender: 'Bạn', content: 'Tôi đang cần hỗ trợ chạy ads Facebook cho shop online của mình', time: '14:35', isOwn: true },
    //     { id: 5, sender: 'AKA Media', content: 'Tuyệt vời! Chúng tôi có kinh nghiệm 5+ năm trong lĩnh vực Facebook Ads. Bạn có thể cho biết ngành hàng và ngân sách dự kiến không? 💼', time: '14:36', isOwn: false },
    //     { id: 6, sender: 'Bạn', content: 'Mình bán thời trang nữ, budget khoảng 20-30 triệu/tháng', time: '14:37', isOwn: true },
    //     { id: 7, sender: 'AKA Media', content: 'Thời trang nữ là một trong những lĩnh vực mạnh của chúng tôi. Với budget 20-30 triệu, chúng tôi có thể tạo ra nhiều campaign hiệu quả với ROAS từ 4-6x. Bạn có muốn tham khảo case study không? 📊', time: '14:38', isOwn: false },
    // ]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
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

    console.log("user now: ",user.username)
    console.log("messages now: ",messages)
    // return

    return (
        <div className="flex flex-col bg-white w-full min-h-screen">
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/*mobile sidebar*/}
                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-full bg-gray-200 text-blue-500"
                            onClick={() => setShowSidebar(true)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">{user.username}</h2>
                        <p className="text-sm text-green-600">Đang hoạt động</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className=" overflow-y-auto px-6 py-4">
                {messages.map((message) => {
                    console.log("message.sender.role ", message.sender.role)
                    return (
                        <div key={message.id} className={`flex items-start gap-2 mb-4 ${message.sender.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            {message.sender.role === 'user' && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    U
                                </div>
                            )}
                            {message.sender.role === 'admin' && (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    B
                                </div>
                            )}
                            <div className={`max-w-md px-4 py-2 rounded-2xl ${
                                message.sender.role === 'admin'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender.role === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    test time
                                </p>
                            </div>
                        </div>
                    )
                })}

                {isTyping && (
                    <div className="flex items-start gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            A
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t px-6 py-4 sticky bottom-0">
                <div className="flex items-end gap-3">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-blue-500 flex-shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-blue-500 flex-shrink-0">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 min-h-10 max-h-32 overflow-y-auto">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="w-full bg-transparent text-gray-800 placeholder-gray-500 resize-none outline-none text-sm"
                    rows={1}
                />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="p-2 rounded-full hover:bg-blue-50 text-blue-500 flex-shrink-0"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageView;
