import React, { useEffect, useRef } from 'react';
import {
    X,
    User,
    Mail,
    Phone,
    Shield,
    Star,
    TrendingUp,
    Calendar,
} from 'lucide-react';

interface User {
    username: string;
    email: string;
    phone: string;
    role: string;
    points: number;
    percentage: number;
    created_at: string;
}

interface UserDetailModalProps {
    user: User;
    onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
    const innerBorderRef = useRef(null);

    const formatPercentage = (percentage: number) => {
        return (percentage*100) || '0.0';
    };

    const formatTimestampToDate = (timestamp: string | number | Date): string => {
        return new Date(timestamp).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (innerBorderRef.current && !(innerBorderRef.current as any).contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    // Đóng modal khi bấm ESC
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const InfoItem = ({
      icon: Icon,
      label,
      value,
      highlight = false,
    }: {
        icon: any;
        label: string;
        value: string | number;
        highlight?: boolean;
    }) => (
        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200  ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-100'}`}>
            <div className={`p-3 rounded-xl ${highlight ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">{label}</p>
                <p className={`text-lg font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'} break-words`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div
                ref={innerBorderRef}
                className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md md:max-w-4xl mx-auto transform animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
                style={{ maxWidth: '768px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-8 pb-4 md:pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Chi tiết người dùng</h2>
                            <p className="text-sm md:text-base text-gray-500">Thông tin tài khoản chi tiết</p>
                        </div>
                    </div>
                    <button
                        className="p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors group"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Nội dung chính - Responsive layout */}
                <div className="p-4  grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Cột trái - Thông tin cơ bản */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            Thông tin cơ bản
                        </h3>
                        <div className="bg-gradient-to-br from-blue-400 to-purple-50 p-4  rounded-2xl border border-blue-100 space-y-4 flex-1">
                            <InfoItem icon={User} label="Tên người dùng" value={user.username} />
                            <InfoItem icon={Mail} label="Email" value={user.email} />
                            <InfoItem icon={Phone} label="Số điện thoại" value={user.phone} />
                            <InfoItem icon={Shield} label="Vai trò" value={user.role} />
                        </div>
                    </div>

                    {/* Cột phải - Thống kê và ngày tạo */}
                    <div className="flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                            Thống kê & Thời gian
                        </h3>

                        <div className="space-y-4 flex-1">
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-2xl border border-orange-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-orange-500 rounded-xl shadow-lg">
                                        <Star className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-orange-700 uppercase tracking-wide">Điểm tích lũy</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-orange-900">{user.points?.toLocaleString('vi-VN') || '0'}</p>
                                <p className="text-sm text-orange-600 mt-1">Tổng điểm đã tích lũy</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-2xl border border-green-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-green-500 rounded-xl shadow-lg">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-green-700 uppercase tracking-wide">Phí dịch vụ</span>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-green-900">{formatPercentage(user.percentage)}%</p>
                                <p className="text-sm text-green-600 mt-1">Chi phí sử dụng dịch vụ</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-2xl border border-purple-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2.5 bg-purple-500 rounded-xl shadow-lg">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-purple-700 uppercase tracking-wide">Ngày tham gia</span>
                                </div>
                                <p className="text-xl md:text-2xl font-bold text-purple-900">{formatTimestampToDate(user.created_at)}</p>
                                <p className="text-sm text-purple-600 mt-1">Thời gian tạo tài khoản</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-8 pt-0 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 sm:justify-end">
                        {/*<button*/}
                        {/*    onClick={onClose}*/}
                        {/*    className="w-full sm:w-auto px-6 md:px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] order-2 sm:order-1"*/}
                        {/*>*/}
                        {/*    Hủy*/}
                        {/*</button>*/}
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 md:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl order-1 sm:order-2"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
