import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { createAppTheme } from "../../theme";
import NotificationBar from "./NotificationBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme: themeMode } = useSelector((state: RootState) => state.ui);

  const theme = React.useMemo(
    () => createAppTheme(themeMode === "dark" ? "dark" : "light"),
    [themeMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            ml: { sm: "240px" },
            transition: "margin 0.3s",
          }}
        >
          {children}
        </Box>
        <NotificationBar />
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
