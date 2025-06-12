import { create } from 'zustand';

interface NotificationState {
    isNotificationOpen: boolean;
    overlaySize: 'third' | 'half' | 'full';
    openNotification: (size: 'third' | 'half' | 'full') => void;
    closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    isNotificationOpen: false,
    overlaySize: 'half',
    openNotification: (size) => set({ isNotificationOpen: true, overlaySize: size }),
    closeNotification: () => set({ isNotificationOpen: false }),
}));
