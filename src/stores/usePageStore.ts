import { create } from 'zustand';

type PageState = {
    is404: boolean;
    setIs404: (val: boolean) => void;
};

export const usePageStore = create<PageState>((set) => ({
    is404: false,
    setIs404: (val) => set({ is404: val }),
}));
