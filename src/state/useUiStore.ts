import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  isNewChat: boolean;
  currentHistory: any;
  history: any;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsNewChat: (flag: boolean) => void;
  setCurrentHistory: (data:any) => void
  setHistory: (data:any) => void
};

// 示例：使用 Zustand 管理简单的 UI 状态
// 组件中可以通过 useUiStore() 读取或更新 sidebarOpen
export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  isNewChat: false,
  currentHistory: {},
  history: {},
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIsNewChat: (flag) => set({ isNewChat: flag }),
  setCurrentHistory: (data:any) => set((state) => ({ ...state, currentHistory: {...data} })),
  setHistory: (data:any) => set(() => ({ history: {
    ...history,
    ...data
  } }))
}));
