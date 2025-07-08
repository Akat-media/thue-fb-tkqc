import { create } from 'zustand';
import BaseHeader from '../api/BaseHeader';
import { useUserStore } from './useUserStore';

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
  notificationsList: Notification[];
  setNotificationsList: (data: Notification[]) => void;
  fetchNotifications: (userID:string) => Promise<void>;
  handleAddNotification: (data:any) => Promise<void>;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleDeletedNotification: (id: string) => Promise<void>;
  handleMarkAsAllRead: (id:string) => Promise<void>;
  isNotificationOpen: boolean;
  overlaySize: 'third' | 'half' | 'full';
  openNotification: (size: 'third' | 'half' | 'full') => void;
  closeNotification: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => {
  const fetchDataList = (user_ID:string) => {
    return BaseHeader(`/notification-all?user_id=${user_ID}`);
  };

  return {
    isNotificationOpen: false,
    overlaySize: 'half',
    openNotification: (size) => set({ isNotificationOpen: true, overlaySize: size }),
    closeNotification: () => set({ isNotificationOpen: false }),
    notificationsList: [],
    setNotificationsList: (data) => set({ notificationsList: data }),

    fetchNotifications: async (user_ID:string) => {
      try {
        const response = await fetchDataList(user_ID);
        set({ notificationsList: response.data });
      } catch (error) {
        console.error('Fetch notifications error:', error);
      }
    },
    handleAddNotification: async(data:any) => {
      const payload = {...data}
      try {
        await BaseHeader({
          method: 'post',
          url: 'notification',
          data: payload,
        });
      } catch(error){
        console.error('Add notification error:', error);
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

    handleMarkAsAllRead: async (userID:string) => {
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
