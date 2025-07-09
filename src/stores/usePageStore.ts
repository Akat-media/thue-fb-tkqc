import { create } from 'zustand';

type PageState = {
    is404: boolean;
    setIs404: (val: boolean) => void;
    formatDateToVN: (isoString: string) => string;
};

export const usePageStore = create<PageState>((set) => ({
    is404: false,
    setIs404: (val) => set({ is404: val }),

    formatDateToVN: (isoString: string) => {
        const date = new Date(isoString);
        const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const hours = vnDate.getUTCHours().toString().padStart(2, '0');
        const minutes = vnDate.getUTCMinutes().toString().padStart(2, '0');
        const day = vnDate.getUTCDate().toString().padStart(2, '0');
        const month = (vnDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = vnDate.getUTCFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
}));
