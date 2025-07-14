import React, {useEffect, useRef, useState} from "react";
import {ArrowLeft} from "lucide-react";
import BaseHeader from "../../../api/BaseHeader.ts";
import {useUserStore} from "../../../stores/useUserStore.ts";
import {usePageStore} from "../../../stores/usePageStore.ts";

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
    chatId?: string;
};

const MessageView: React.FC<MessageViewProps>  = ({ user, messages, chatId }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [messaged, setMessaged] = useState<Message[]>([]);

    console.log("chatId", chatId);
    console.log("messages", messages);

    const {user: userAdmin} = useUserStore();
    const { formatDateToVN } = usePageStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        try {
            const response = await BaseHeader({
                method: 'post',
                url: '/chat',
                data: {
                    user_id: userAdmin?.id,
                    content: newMessage,
                    chat_id: chatId
                },
            });
            console.log("response", response);
            // return

            const newMsg = response.data.data;

            setMessaged(prev => [...prev, {
                ...newMsg,
                sender: newMsg.sender_id
            }]);

            setNewMessage('');
        } catch (err: any) {
            console.error('Lỗi khi gửi tin nhắn:', err?.response?.data || err.message);
        }
    };


    useEffect(() => {
        setMessaged(messages);
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messaged]);

    return (
        <div className="flex flex-col bg-white w-full min-h-screen">
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0">
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
                        {/*<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">*/}
                        {/*    A*/}
                        {/*</div>*/}
                        {/*<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>*/}
                        <img src="/avatar.jpg" alt="akamedia" className="h-12 w-12 rounded-full object-cover border shrink-0" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900">{user.username}</h2>
                        <p className="text-sm text-green-600">Đang hoạt động</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col ">
                <div className="flex-1 overflow-hidden m-4">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {messaged.map((message) => {
                            // console.log("message.sender.role ", message.sender.role)
                            return (
                                <div key={message.id} className={`flex items-start gap-2 mb-4 ${message.sender.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.sender.role === 'admin' && (
                                        // <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        //     U
                                        // </div>
                                        <img src="/call2.png" alt="akamedia" className="h-12 w-12 rounded-full object-cover border shrink-0" />
                                    )}
                                    {message.sender.role === 'user' && (
                                        // <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        //     B
                                        // </div>
                                        <img src="/avatar.jpg" alt="akamedia" className="h-12 w-12 rounded-full object-cover border shrink-0" />
                                    )}
                                    <div className={`max-w-md px-4 py-2 rounded-2xl ${
                                        message.sender.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.sender.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                            {formatDateToVN(message.created_at)}
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
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4  ">
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
