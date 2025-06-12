import React, { useEffect, useMemo } from 'react';
import { Bell, X, CheckCircle, Settings, User, AlertCircle, Gift } from 'lucide-react';
import { Notification, useNotificationStore } from '../../stores/notificationStore';

const NotificationOverlay: React.FC = () => {
    const {userID, isNotificationOpen,notificationsList,handleMarkAsRead, handleMarkAsAllRead, handleDeletedNotification,fetchNotifications,overlaySize, closeNotification } = useNotificationStore();
    const unreadCount = notificationsList.filter((n) => !n.is_read).length;

    useEffect(() => {
        fetchNotifications();
    }, []);
    const notificationsData = useMemo(() => {
        return notificationsList.map((item: Notification) => {
            let icon = null;
            switch (item.type) {
                case 'success':
                    icon = <CheckCircle className="w-5 h-5 text-green-500" />;
                    break;
                case 'info':
                    icon = <Settings className="w-5 h-5 text-blue-500" />;
                    break;
                case 'warning':
                    icon = <User className='w-5 h-5' />;
                    break;
                case 'error':
                    icon = <AlertCircle className='w-5 h-5' />;
                    break;
                default:
                    icon = null;
            }
            return { ...item, icon };
        });
    },[notificationsList])
    const getOverlayWidth = () => {
        return 'w-[90%] sm:w-[80%] md:w-1/2 lg:w-1/3';
    };

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50 border-green-200',
                    icon: 'text-green-600',
                    title: 'text-green-900',
                };
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    icon: 'text-red-600',
                    title: 'text-red-900',
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50 border-yellow-200',
                    icon: 'text-yellow-600',
                    title: 'text-yellow-900',
                };
            case 'info':
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    icon: 'text-blue-600',
                    title: 'text-blue-900',
                };
            default:
                return {
                    bg: 'bg-gray-50 border-gray-200',
                    icon: 'text-gray-600',
                    title: 'text-gray-900',
                };
        }
    };

    const markAsRead = (id: string) => {
        handleMarkAsRead(id)
    };

    const markAllAsRead = (userID:string) => {
        handleMarkAsAllRead(userID)
    };

    const deleteNotification = (id: string) => {
        handleDeletedNotification(id)
    
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeNotification();
            }
        };

        if (isNotificationOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isNotificationOpen, closeNotification]);

    return (
        <>
            {isNotificationOpen && (
                <div className='fixed inset-0 z-50'>
                    <div
                        className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
                        onClick={closeNotification}
                    />

                    <div
                        className={`absolute right-0 top-0 h-full ${getOverlayWidth()} bg-white shadow-2xl transform transition-transform duration-500 ease-out ${
                            isNotificationOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
                            <div className='flex items-center'>
                                <Bell className='w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3' />
                                <div>
                                    <h2 className='text-lg sm:text-xl font-semibold'>Thông báo</h2>
                                    <p className='text-blue-100 text-xs sm:text-sm'>{notificationsList.length} thông báo</p>
                                </div>
                            </div>
                            <div className='flex items-center space-x-1 sm:space-x-2'>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead(userID || "")}
                                        className='bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm transition-colors duration-200'
                                    >
                                        Đánh dấu tất cả đã đọc
                                    </button>
                                )}
                                <button
                                    onClick={closeNotification}
                                    className='p-1 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200'
                                >
                                    <X className='w-4 h-4 sm:w-5 sm:h-5' />
                                </button>
                            </div>
                        </div>

                        <div className='flex-1 overflow-y-auto'>
                            {notificationsData.length === 0 ? (
                                <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
                                    <Bell className='w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-50' />
                                    <p className='text-base sm:text-lg font-medium'>Không có thông báo nào</p>
                                    <p className='text-xs sm:text-sm'>Các thông báo mới sẽ xuất hiện ở đây</p>
                                </div>
                            ) : (
                                <div className='p-3 sm:p-4 space-y-2 sm:space-y-3 h-[calc(100vh-96px-75px)] overflow-y-auto'>
                                    {notificationsData.map((notification, index) => {
                                        const style = getNotificationStyle(notification.type);
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`border rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                                                    style.bg
                                                } ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animation: isNotificationOpen ? 'slideInRight 0.5s ease-out forwards' : '',
                                                }}
                                            >
                                                <div className='flex items-start justify-between'>
                                                    <div className='flex items-start space-x-2 sm:space-x-3 flex-1'>
                                                        <div className={`flex-shrink-0 ${style.icon}`}>{notification.icon}</div>
                                                        <div className='flex-1 min-w-0'>
                                                            <div className='flex items-center justify-between mb-1'>
                                                                <h3 className={`font-semibold text-sm sm:text-base ${style.title}`}>
                                                                    {notification.title}
                                                                </h3>
                                                                {!notification.is_read && (
                                                                    <span className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></span>
                                                                )}
                                                            </div>
                                                            <p className='text-gray-700 text-xs sm:text-sm leading-relaxed mb-1 sm:mb-2'>
                                                                {notification.content}
                                                            </p>
                                                            <div className='flex items-center justify-between'>
                                                                <span className='text-xs text-gray-500'>{notification.time}</span>
                                                                <div className='flex space-x-1 sm:space-x-2'>
                                                                    {!notification.is_read && (
                                                                        <button
                                                                            onClick={() => markAsRead(notification.id)}
                                                                            className='text-xs text-blue-600 hover:text-blue-800 font-medium'
                                                                        >
                                                                            Đánh dấu đã đọc
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                        className='text-xs text-red-600 hover:text-red-800 font-medium'
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className='border-t border-gray-200 p-3 sm:p-4 bg-gray-50'>
                            <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base'>
                                Xem tất cả thông báo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideInRight {
                  from {
                    opacity: 0;
                    transform: translateX(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }
            `}</style>
        </>
    );
};

export default NotificationOverlay;
