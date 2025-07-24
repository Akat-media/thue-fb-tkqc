import React, {useState} from 'react';
import { MessageSquareMore } from 'lucide-react';
import ChatModal from "../chats/ChatModal.tsx";
import {useUserStore} from "../../stores/useUserStore.ts";

const FloatingButtons: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const { user } = useUserStore();


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const openFacebook = () => {
        window.open('https://www.facebook.com/messages/t/377081285497434', '_blank');
    };

    const openZalo = () => {
        window.open('https://zalo.me/0385958416', '_blank');
    };

    const openChatModal = () => setIsChatOpen(true);
    const closeChatModal = () => setIsChatOpen(false);

    return (
        <>
            <style>
                {`
                    @keyframes zoomIn {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes pulse {
                        0% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.4);
                            opacity: 0.7;
                        }
                        100% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                    }
                    
                    .zoom-in-animation {
                       animation: zoomIn 1.2s ease-out infinite;
                    }
                    
                    .pulse-animation {
                        animation: pulse 2s infinite;
                    }
                `}
            </style>

            <div className="fixed bottom-6 right-6 z-50">
                <div className="flex flex-col space-y-7 ">
                    <div className="relative">
                        <div className="absolute inset-0 w-14 h-14  rounded-full border-2 bg-gray-200 pulse-animation"></div>
                        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-blue-500 zoom-in-animation"></div>
                        <button
                            onClick={openFacebook}
                            className="relative w-14 h-14   rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border"
                            title="Facebook"
                        >
                            <img
                                src="/buttons/fanpage.svg"
                                alt="Facebook"
                                className="w-10 h-10 object-contain"
                            />
                        </button>
                    </div>


                    {/* Zalo Button */}
                    <div className="relative">
                        <div className="absolute inset-0 w-14 h-14  rounded-full border-2 bg-gray-200 pulse-animation"></div>
                        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-blue-500 zoom-in-animation"></div>
                        <button
                            onClick={openZalo}
                            className="relative w-14 h-14 rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border"
                            title="zalo"
                        >
                            <img
                                src="/buttons/zalo.png"
                                alt="zalo"
                                className="w-10 h-10 object-contain"
                            />
                        </button>
                    </div>

                    {/* Website Button */}
                    { user && (
                        <div>
                            <div className="relative">
                                <div className="absolute inset-0 w-14 h-14  rounded-full border-2 bg-gray-200 pulse-animation"></div>
                                {/*<div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-blue-500 zoom-in-animation"></div>*/}
                                <button
                                    onClick={openChatModal}
                                    className="relative bg-blue-400 w-14 h-14 rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border"
                                    title="Facebook"
                                >
                                    <MessageSquareMore  />
                                </button>
                                {/*<button*/}
                                {/*    onClick={openChatModal}*/}
                                {/*    className="w-14 h-14 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"*/}
                                {/*    title="Chat Online - AkaAds.vn"*/}
                                {/*>*/}
                                {/*    <MessageSquareMore  />*/}
                                {/*</button>*/}
                                <ChatModal isOpen={isChatOpen} onClose={closeChatModal} />
                            </div>
                        </div>
                    )}

                    {/* Scroll to Top Button */}
                    <button
                        onClick={scrollToTop}
                        className="w-14 h-14  hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                        title="Về đầu trang"
                    >
                        <img
                            src="/buttons/top.png"
                            alt="Facebook"
                            className="w-10 h-10 object-contain"
                        />
                    </button>
                </div>
            </div>
        </>
    );
};

export default FloatingButtons;
