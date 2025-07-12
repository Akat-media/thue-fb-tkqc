import React, {useState} from 'react';
import { MessageSquareMore } from 'lucide-react';
import ChatModal from "../chats/ChatModal.tsx";

const FloatingButtons: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

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
            <div className="fixed bottom-6 right-6 z-50">
                <div className="flex flex-col space-y-3">
                    {/* Facebook Button */}
                    <button
                        onClick={openFacebook}
                        className="w-14 h-14 bg-white text-white rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border "
                        title="Facebook"
                    >
                        <img
                            src="/buttons/fanpage.svg"
                            alt="Facebook"
                            className="w-10 h-10 object-contain"
                        />
                    </button>


                    {/* Zalo Button */}
                    <button
                        onClick={openZalo}
                        className="w-14 h-14 bg-white rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group border"
                        title="Zalo"
                    >
                        <img
                            src="/buttons/zalo.png"
                            alt="Facebook"
                            className="w-10 h-10 object-contain"
                        />
                    </button>

                    {/* Website Button */}
                    <button
                        onClick={openChatModal}
                        className="w-14 h-14 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-lg hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                        title="Chat Online - AkaAds.vn"
                    >
                        <MessageSquareMore  />
                    </button>
                    <ChatModal isOpen={isChatOpen} onClose={closeChatModal} />

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
