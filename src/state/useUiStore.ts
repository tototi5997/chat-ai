import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  isNewChat: boolean;
  currentHistory: any;
  history: any;
  needScroll: boolean;
  currentId: string;
  isLoading: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsNewChat: (flag: boolean) => void;
  setCurrentHistory: (data:any) => void;
  setHistory: (data:any) => void;
  setNeedScroll: (flag: boolean) => void;
  setCurrent: (id: string) => void;
  setIsLoading: (flag: boolean) => void;
};

// 示例：使用 Zustand 管理简单的 UI 状态
// 组件中可以通过 useUiStore() 读取或更新 sidebarOpen
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  isNewChat: false,
  currentHistory: {},
  history: {},
  needScroll: false,
  currentId: '',
  isLoading: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsNewChat: (flag) => set({ isNewChat: flag }),
  setCurrentHistory: (data:any) => set(() => ({ currentHistory: data })),
  setHistory: (data:any) => set(() => ({ history: {
    ...history,
    ...data
  } })),
  setNeedScroll: (flag) => set({ needScroll: flag }),
  setCurrent: (id) => set({ currentId: id }),
  setIsLoading: (flag) => set({ isLoading: flag }),
}));
