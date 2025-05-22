import React from 'react';
import { useNotification } from '../context/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications, markAsRead } = useNotification();

  return (
    <div className="fixed top-0 right-0 p-6 z-50 w-full max-w-sm">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={markAsRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;