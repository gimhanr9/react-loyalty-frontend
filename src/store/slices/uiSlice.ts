import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    timestamp: number;
  }>;
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: "light",
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    addNotification: (
      state,
      action: PayloadAction<
        Omit<UiState["notifications"][0], "id" | "timestamp">
      >
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  addNotification,
  removeNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
