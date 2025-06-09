"use client";

import React from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Header from "./Header";
import Sidebar from "./Sidebar";
import NotificationBar from "./NotificationBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme: themeMode } = useSelector((state: RootState) => state.ui);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode === "dark" ? "dark" : "light",
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
          },
          secondary: {
            main: "#dc004e",
          },
          background: {
            default: themeMode === "dark" ? "#121212" : "#f5f5f5",
            paper: themeMode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
              },
            },
          },
        },
      }),
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
