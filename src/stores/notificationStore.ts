import { create } from 'zustand';
import BaseHeader from '../api/BaseHeader';

export type Notification = {
  id: string;
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
  content: string;
  is_read: boolean;
  action_url: string;
  time: string;
  icon: any;
};

type NotificationState = {
  userID: string | null;
  notificationsList: Notification[];
  setNotificationsList: (data: Notification[]) => void;
  fetchNotifications: () => Promise<void>;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleDeletedNotification: (id: string) => Promise<void>;
  handleMarkAsAllRead: (id:string) => Promise<void>;
  isNotificationOpen: boolean;
  overlaySize: 'third' | 'half' | 'full';
  openNotification: (size: 'third' | 'half' | 'full') => void;
  closeNotification: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => {
  const userString = localStorage.getItem('user');
  const userID = userString ? JSON.parse(userString).user.id : null;
  const fetchDataList = () => {
    return BaseHeader(`/notification-all?user_id=${userID}`);
  };

  return {
    isNotificationOpen: false,
    overlaySize: 'half',
    openNotification: (size) => set({ isNotificationOpen: true, overlaySize: size }),
    closeNotification: () => set({ isNotificationOpen: false }),
    userID,
    notificationsList: [],
    setNotificationsList: (data) => set({ notificationsList: data }),

    fetchNotifications: async () => {
      try {
        const response = await fetchDataList();
        set({ notificationsList: response.data });
      } catch (error) {
        console.error('Fetch notifications error:', error);
      }
    },

    handleMarkAsRead: async (id: string) => {
      set((state) => ({
        notificationsList: state.notificationsList.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
      }));
      try {
        const response = await BaseHeader(`/notification/${id}/read`, {
          method: 'PUT',
        });
        set({ notificationsList: response.data });
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    },

    handleDeletedNotification: async (id: string) => {
      set((state) => ({
        notificationsList: state.notificationsList.filter((n) => n.id !== id),
      }));
      try {
        await BaseHeader(`/notification/deleted/${id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Delete notification error:', error);
      }
    },

    handleMarkAsAllRead: async () => {
      set((state) => ({
        notificationsList: state.notificationsList.map((n) => ({ ...n, is_read: true })),
      }));
      try {
        await BaseHeader(`/notification/mark-all-read?user_id=${userID}`,
          { method: 'PUT' }
        );
      } catch (error) {
        console.error('Mark all as read error:', error);
      }
    },
  };
});
