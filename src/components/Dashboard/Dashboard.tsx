import React, { useEffect } from "react";
import { Typography, Box, LinearProgress, Grid } from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  fetchBalanceRequest,
  fetchHistoryRequest,
} from "../../store/slices/loyaltySlice";
import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { balance, transactions, loading } = useSelector(
    (state: RootState) => state.loyalty
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBalanceRequest());
    dispatch(fetchHistoryRequest());
  }, [dispatch]);

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your loyalty program overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12 }}>
          <StatCard
            title="Current Balance"
            value={balance.toLocaleString()}
            subtitle="points"
            icon={<AccountBalance />}
            color="primary"
          />
        </Grid>

        {/* Recent Transactions */}
        <Grid size={{ xs: 12 }}>
          <RecentTransactions transactions={recentTransactions} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
