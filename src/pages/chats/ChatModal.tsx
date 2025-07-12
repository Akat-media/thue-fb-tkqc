import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, X } from 'lucide-react';
import socket from '../../socket';
import BaseHeader from '../../api/BaseHeader';
import { useUserStore } from '../../stores/useUserStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const botResponses = [
    'Em cảm ơn anh/chị đã quan tâm! Em có thể hỗ trợ anh/chị thông tin gì cụ thể không ạ?',
    'Dạ em hiểu rồi ạ. Cho em xin số điện thoại để bộ phận tư vấn liên hệ với anh/chị nhé',
    'Em đã ghi nhận thông tin rồi ạ. Anh/chị còn cần tư vấn thêm gì không ạ?',
    'Cảm ơn anh/chị! Em sẽ chuyển thông tin cho bộ phận chuyên môn xử lý ngay ạ',
    'Em rất vui được hỗ trợ anh/chị! Anh/chị có thể để lại thông tin liên hệ không ạ?',
    'Dạ em hiểu rồi. Bộ phận kỹ thuật sẽ liên hệ với anh/chị trong thời gian sớm nhất ạ',
    'Em cảm ơn anh/chị đã tin tưởng! Còn gì khác em có thể giúp được không ạ?',
  ];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Em Minh Thư AKA Media chào anh/chị ạ. Anh/chị cần em tư vấn gì không ạ',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    // addMessage(inputValue, 'user');
    setInputValue('');
    try {
      const res = await BaseHeader({
        method: 'POST',
        url: '/chat',
        data: {
          content: inputValue,
          user_id: user?.id,
        },
      });
      const newMsg = res.data.data;
      console.log('Server response:', newMsg);

      const messageForMessageView = {
        ...newMsg,
        chat_id: newMsg.chat_id,
        sender: {
          id: user?.id,
          username: user?.username,
          role: user?.role,
        }
      };

      console.log('📤 EMITTING - messageForMessageView:', messageForMessageView);

      if (socket.connected) {
        // truyen su kien send_message den server socket.ts (line 46)
        socket.emit('send_message', { message: messageForMessageView });
      } else {
        console.warn('Socket chưa kết nối!');
      }

    } catch (error) {
      console.log(error);
    }
    // // Show typing indicator
    // setIsTyping(true);

    // // Simulate bot response after delay
    // setTimeout(() => {
    //   setIsTyping(false);
    //   const randomResponse =
    //     botResponses[Math.floor(Math.random() * botResponses.length)];
    //   addMessage(randomResponse, 'bot');
    // }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const hanleCallList = async () => {
    try {
      const res = await BaseHeader({
        method: 'get',
        url: '/chat-messages',
        params: {
          user_id: JSON.parse(localStorage.getItem('user') || '').user_id,
        },
      });
      if (res.status === 200) {
        const formattedMessages: Message[] = res.data.data.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender:
            msg.sender_id ===
            JSON.parse(localStorage.getItem('user') || '').user_id
              ? 'user'
              : 'bot',
          timestamp: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    hanleCallList();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('joinRoom');
    });

    socket.on('new_message', (data) => {
      console.log('new_message success event received:', data);
      const { message } = data;
      const senderType = message.sender_id === user?.id ? 'user' : 'bot';

      const newMsg: Message = {
        id: message.id,
        text: message.content,
        sender: senderType,
        timestamp: new Date(message.created_at),
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
    };
  }, [user?.id]);
  // console.log('messages', messages);
  return (
    <div
      className={`fixed bottom-28 right-8 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 transition-all duration-300 ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
        <div className="relative">
          <img
            src="/call2.png"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">AKA Media</div>
          <div className="text-xs text-blue-100">Đang hoạt động</div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message,index) => (
          <div
            key={`${message.id}-${index}`}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-end gap-2 max-w-[85%] ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.sender === 'bot' && (
                <img
                  src="/call2.png"
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="space-y-1">
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-xs text-gray-500 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <img
                src="/call2.png"
                alt="Bot Avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-md shadow-sm border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Viết tin nhắn..."
            className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isTyping}
            className="text-blue-600 hover:text-blue-700 p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Gửi"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
