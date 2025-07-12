import React, {useEffect, useRef, useState} from "react";
import {ArrowLeft, SendHorizontal} from "lucide-react";
import BaseHeader from "../../../api/BaseHeader.ts";
import {useUserStore} from "../../../stores/useUserStore.ts";
import {usePageStore} from "../../../stores/usePageStore.ts";
import socket from "../../../socket/index.ts";

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
    onNewMessage?: (msg: Message) => void;
    onBack?: () => void;
};

const MessageView: React.FC<MessageViewProps>  = ({ user, messages, chatId, onNewMessage, onBack }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [messaged, setMessaged] = useState<Message[]>([]);
    const [latestMessage, setLatestMessage] = useState<Message | null>(null);

    const {user: userAdmin} = useUserStore();
    const { formatDateToVN } = usePageStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // can nhac
    useEffect(() => {
        if (!latestMessage) return;
        console.log("latestMessage ",latestMessage)
        if(typeof onNewMessage === "function") {    // onNewMessage?.(latestMessage);
            onNewMessage(latestMessage);
        }
    }, [latestMessage]);

    const handleSendMessage = async () => {
        try {
            const response = await BaseHeader({
                method: 'post',
                url: '/chat', // api da phat ra socket new_message den socket (server), de ChatModal nhan duoc (goi new_message)
                data: {
                    user_id: userAdmin?.id,
                    content: newMessage,
                    chat_id: chatId
                },
            });

            // console.log("response", response);

            const newMsg = {
                ...response.data.data,
                sender: response.data.data.sender ?? {
                    id: userAdmin?.id,
                    username: userAdmin?.username,
                    role: 'admin',
                }
            };

            setMessaged(prev => [...prev, newMsg]);

            // Gọi callback để ChatLayout update left bar: cho message moi nhat len dau tien
            if(typeof onNewMessage === "function") {
                onNewMessage(newMsg); // tuong duong => onNewMessage?.(newMsg);
            }

            setNewMessage(''); // set lai input = ''
        } catch (err: any) {
            console.error('Lỗi khi gửi tin nhắn:', err?.response?.data || err.message);
        }
    };

    // init load message for page
    useEffect(() => {
        setMessaged(messages);
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messaged]);

    useEffect(() => {
        const handleNewMessage = (data: { message: Message }) => {
            const { message } = data;
            // console.log('message: ',message)
            // console.log('data: ',data)

            if (!message || !user?.id) {
                console.warn('Invalid message or user');
                return;
            }

            const isCurrentChat = message.chat_id === chatId;
            // console.log('isCurrentChat: ',isCurrentChat)

            const messageWithRole = {
                ...message,
                sender: {
                    ...message.sender,
                    id: message.sender?.id || message.sender_id,
                    username: message.sender?.username || (message.sender_id === user?.id ? user?.username : 'Admin'),
                    role: message.sender?.role || (message.sender_id === user?.id ? 'user' : 'admin'),
                }
            };
            console.log('📥 Message with role:', messageWithRole);

            const isUserMessage = messageWithRole.sender?.role === 'user';
            const isAdminMessage = messageWithRole.sender?.role === 'admin';
            // console.log("isUserMessage ",isUserMessage)
            // console.log("isAdminMessage ",isAdminMessage)
            if (!isUserMessage && !isAdminMessage) {
                console.log('Message filtered out - not user or admin');
                return;
            }

            // chat đang mở
            if (isCurrentChat) {
                const exists = messaged.some((msg) => msg.id === messageWithRole.id);
                if (!exists) {
                    setLatestMessage(messageWithRole);
                    setMessaged(prev => [...prev, messageWithRole]);
                    return;
                }
            }
            // Dù không thuộc chat đang mở vẫn phải gọi callback để ChatLayout cập nhật leftbar
            // update left bar
            if(typeof onNewMessage === 'function'){ // tuong duong => onNewMessage?.(messageWithRole);
                onNewMessage(messageWithRole); // truyen data messageWithRole ve component MessageView o ChatLayout
            }

        };

        // lang nghe su kien new_message tu server socket.ts (line 52)
        socket.on('send_message_again', handleNewMessage);

        socket.on('connect', () => {
            console.log('Socket connected in MessageView');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected in MessageView');
        });

        return () => {
            socket.off('send_message_again', handleNewMessage);
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [user?.id]);


    return (
        <div className="flex flex-col bg-white w-full min-h-screen">
            {/* header desktop */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-full bg-gray-200 text-blue-500"
                            onClick={onBack}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                    </div>

                    <img src="/avatar.jpg" alt="avatar" className="h-10 w-10 rounded-full object-cover" />

                    <div className="overflow-hidden">
                        <h2 className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">{user.username}</h2>
                        <p className="text-xs text-green-600">Đang hoạt động</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col ">
                <div className="flex-1 overflow-hidden m-4">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="flex-1 overflow-hidden px-4 py-2 sm:px-6 sm:py-4">
                            {messaged.map((message,index) => {
                                // console.log("message:",message.id);
                                 return (
                                     <div
                                         key={`${index}-${message.id}`}
                                         className={`flex items-start gap-2 mb-3 ${message.sender?.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                     >
                                         <img
                                             src={message.sender?.role === 'admin' ? "/call2.png" : "/avatar.jpg"}
                                             alt="avatar"
                                             className="h-9 w-9 rounded-full object-cover"
                                         />
                                         <div
                                             className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                                                 message.sender?.role === 'user'
                                                     ? 'bg-blue-500 text-white'
                                                     : 'bg-gray-100 text-gray-800'
                                             }`}
                                         >
                                             <p>{message.content}</p>
                                             <p className={`text-xs mt-1 ${message.sender?.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                 {formatDateToVN(message.created_at)}
                                             </p>
                                         </div>
                                     </div>
                                 )
                                }
                            )}
                        </div>

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
                    {/*<button className="p-2 rounded-full hover:bg-gray-100 text-blue-500 flex-shrink-0">*/}
                    {/*    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">*/}
                    {/*        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}
                    {/*<button className="p-2 rounded-full hover:bg-gray-100 text-blue-500 flex-shrink-0">*/}
                    {/*    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">*/}
                    {/*        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>*/}
                    {/*    </svg>*/}
                    {/*</button>*/}

                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 min-h-[38px] max-h-28 overflow-y-auto text-sm">
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
                        <SendHorizontal size={20} />

                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageView;
