import React from 'react';
import { Send, MessageSquare, X, ArrowLeft  } from 'lucide-react';

interface ChatMessage {
    id: number;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
    avatar: string;
}

interface ChatBoxProps {
    messages: ChatMessage[];
    newMessage: string;
    currentUser: { id: string; role?: string } | null;
    supportRequestId: string;
    setNewMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: (supportRequestId: string, senderId: string, message: string) => Promise<void>;
    formatDate: (dateString: string) => string;
    isAdminView?: boolean;
    onClose?: () => void;
    onBack?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
     messages,
     newMessage,
     currentUser,
     supportRequestId,
     setNewMessage,
     handleSendMessage,
     formatDate,
     isAdminView,
     onClose,
     onBack
}) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (currentUser?.id) {
                handleSendMessage(supportRequestId, currentUser.id, newMessage);
            }
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[800px] flex flex-col">
                <div className="rounded-[10px] bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center">
                    <MessageSquare className="w-6 h-6 text-white mr-3" />
                    <h2 className="text-xl font-semibold text-white">Hội thoại hỗ trợ</h2>



                    <div className="ml-auto">
                        <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                          {messages.length} tin nhắn
                        </span>
                    </div>

                    {isAdminView && onClose && (
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    { messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-center text-gray-500">
                            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 max-w-sm mx-auto">
                                <MessageSquare className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                                <p className="text-sm sm:text-base font-medium text-gray-700">
                                    Chưa có yêu cầu hỗ trợ nào.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Khi có tin nhắn, cuộc hội thoại sẽ hiển thị tại đây.
                                </p>
                            </div>
                        </div>
                    ) : (
                            messages.map((message: any) => {
                                const avaUrl = message.sender.role === 'user' ? '/avatar.jpg' : '/call2.png';
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender.role === 'admin' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`flex max-w-[75%] min-w-[40%] ${
                                                    message.sender.role === 'admin' ? 'flex-row' : 'flex-row-reverse'
                                                }`}
                                            >
                                                <div
                                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                                        message.sender.role === 'admin' ? 'bg-emerald-600 mr-3' : 'bg-blue-600 ml-3'
                                                    }`}
                                                >
                                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                                        <img src={avaUrl} alt="akamedia" className="w-full h-full object-cover rounded-full" />
                                                    </div>
                                                </div>
                                                <div className={`flex flex-col ${message.sender.role === 'admin' ? 'items-start' : 'items-end'}`}>
                                                    <div
                                                        className={`px-4 py-3 rounded-2xl max-w-full break-words ${
                                                            message.sender.role === 'admin'
                                                                ? 'bg-gray-100 text-gray-900 rounded-bl-md'
                                                                : 'bg-blue-600 text-white rounded-br-md'
                                                        }`}
                                                    >
                                                        <p className="text-sm leading-relaxed">{message.message}</p>
                                                    </div>
                                                    <div className="flex items-center mt-2 space-x-2">
                                                        <span className="text-xs text-gray-500 font-medium">{message.sender.role}</span>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <span className="text-xs text-gray-400">{formatDate(message.updated_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                            })
                        )
                    }
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-end space-x-3">

                        {isAdminView && onBack && (
                            <button
                                onClick={onBack}
                                className="mb-[13px] p-3 rounded-2xl transition-all duration-200 shadow-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105"
                                title="Quay lại"
                            >
                                <ArrowLeft/>
                            </button>
                        )}

                        <div className="flex-1">
                          <textarea
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Nhập tin nhắn của bạn..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm shadow-sm hover:border-gray-400"
                              rows={2}
                              style={{ minHeight: '48px' }}
                          />
                        </div>
                        <button
                            onClick={() => currentUser?.id && handleSendMessage(supportRequestId, currentUser.id, newMessage)}
                            disabled={!newMessage.trim() || !currentUser?.id}
                            className="mb-4 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-sm min-w-[48px] h-12"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Gửi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
