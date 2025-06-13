import React, { useState, useRef, useEffect } from 'react';
import { Send, X, User, Shield } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    timestamp: Date;
    isAdmin: boolean;
    sender: string;
}

interface ChatModalProps {
    selectedRequest?: {
        fullName: string;
        email: string;
    };
    showMessageModal: boolean;
    setShowMessageModal: (show: boolean) => void;
    currentUserRole?: 'user' | 'admin';
    onBackToDetail?: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
     selectedRequest = { fullName: 'Nguyễn Văn A', email: 'user@example.com' },
     showMessageModal = true,
     setShowMessageModal,
     currentUserRole = 'admin',
     onBackToDetail,
 }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Xin chào! Tôi cần hỗ trợ về yêu cầu đã gửi.',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            isAdmin: false,
            sender: 'Nguyễn Văn A'
        },
        {
            id: '2',
            content: 'Chào bạn! Tôi đã xem yêu cầu của bạn. Bạn có thể cung cấp thêm thông tin chi tiết không?',
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            isAdmin: true,
            sender: 'Admin'
        },
        {
            id: '3',
            content: 'Vâng, tôi muốn biết thêm về quy trình xử lý và thời gian dự kiến.',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            isAdmin: false,
            sender: 'Nguyễn Văn A'
        }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message: Message = {
            id: Date.now().toString(),
            content: newMessage.trim(),
            timestamp: new Date(),
            isAdmin: currentUserRole === 'admin',
            sender: currentUserRole === 'admin' ? 'Admin' : selectedRequest.fullName
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Mô phỏng phản hồi tự động từ phía còn lại
        if (currentUserRole === 'admin') {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const autoReply: Message = {
                    id: (Date.now() + 1).toString(),
                    content: 'Cảm ơn bạn đã phản hồi! Tôi sẽ xem xét và liên hệ lại sớm.',
                    timestamp: new Date(),
                    isAdmin: false,
                    sender: selectedRequest.fullName
                };
                setMessages(prev => [...prev, autoReply]);
            }, 2000);
        } else {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                const autoReply: Message = {
                    id: (Date.now() + 1).toString(),
                    content: 'Tôi đã ghi nhận yêu cầu của bạn. Chúng tôi sẽ xử lý trong vòng 24h làm việc.',
                    timestamp: new Date(),
                    isAdmin: true,
                    sender: 'Admin'
                };
                setMessages(prev => [...prev, autoReply]);
            }, 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const messageDate = new Date(date);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (messageDate.toDateString() === new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
            return 'Hôm qua';
        } else {
            return messageDate.toLocaleDateString('vi-VN');
        }
    };

    if (!showMessageModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md sm:max-w-2xl h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="rounded-t-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-6 py-4 flex items-center border-b border-emerald-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{selectedRequest.fullName}</h2>
                            <p className="text-emerald-100 text-sm">{selectedRequest.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowMessageModal(false)}
                        className="ml-auto text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message, index) => {
                        const showDate = index === 0 ||
                            formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

                        return (
                            <div key={message.id}>
                                {showDate && (
                                    <div className="text-center mb-4">
                                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                          {formatDate(message.timestamp)}
                                        </span>
                                    </div>
                                )}

                                <div className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[80%] ${message.isAdmin ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.isAdmin ? 'bg-emerald-500 ml-2' : 'bg-blue-500 mr-2'
                                        }`}>
                                            {message.isAdmin ?
                                                <Shield className="w-4 h-4 text-white" /> :
                                                <User className="w-4 h-4 text-white" />
                                            }
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`rounded-2xl px-4 py-2 ${
                                            message.isAdmin
                                                ? 'bg-emerald-500 text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.isAdmin ? 'text-emerald-100' : 'text-gray-500'
                                            }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end space-x-2 max-w-[80%]">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-white rounded-b-xl p-4">
                    <div className="flex items-end space-x-3">
                        <button
                            onClick={onBackToDetail}
                            className="mb-[8px] p-3 rounded-2xl transition-all duration-200 shadow-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105"
                            title="Quay lại"
                        >
                            ←
                        </button>

                        <div className="flex-1">
                          <textarea
                              ref={textareaRef}
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm max-h-32 shadow-sm hover:border-gray-400"
                              placeholder="Nhập tin nhắn..."
                              rows={1}
                              style={{ minHeight: '48px' }}
                          />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={newMessage.trim() === ''}
                            className={`mb-[10px] p-3 rounded-2xl transition-all duration-200 shadow-sm ${
                                newMessage.trim() === ''
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Status */}
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
                        <span className="text-emerald-600">● Đang hoạt động</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
