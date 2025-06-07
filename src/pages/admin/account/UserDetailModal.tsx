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
        <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 ${highlight ? 'bg-blue-50 border border-blue-100' : ''}`}>
            <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? 'text-blue-700' : 'text-gray-900'} break-words`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                ref={innerBorderRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Chi tiết người dùng</h2>
                            <p className="text-sm text-gray-500">Thông tin tài khoản</p>
                        </div>
                    </div>
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Nội dung */}
                <div className="p-6 space-y-4">
                    <InfoItem icon={User} label="Tên người dùng" value={user.username} highlight />
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={Phone} label="Số điện thoại" value={user.phone} />
                    <InfoItem icon={Shield} label="Vai trò" value={user.role} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-orange-500 rounded-lg">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Điểm</span>
                            </div>
                            <p className="text-2xl font-bold text-orange-900">{user.points?.toLocaleString('vi-VN') || '0'}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-green-500 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Phần trăm</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900">{formatPercentage(user.percentage)}%</p>
                        </div>
                    </div>

                    <InfoItem icon={Calendar} label="Ngày tạo" value={formatTimestampToDate(user.created_at)} />
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
