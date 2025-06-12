import type React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import AppLayout from "./components/Layout/AppLayout";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Dashboard from "./components/Dashboard/Dashboard";
import EarnPoints from "./components/Points/EarnPoints";
import TransactionHistory from "./components/History/TransactionHistory";

import type { RootState } from "./store";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Set document title dynamically
  useEffect(() => {
    document.title = process.env.REACT_APP_NAME ?? "Square Loyalty Program";
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/earn" element={<EarnPoints />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;
