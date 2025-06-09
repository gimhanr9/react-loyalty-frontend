"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  Redeem,
  History,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  fetchBalanceRequest,
  fetchHistoryRequest,
} from "../../store/slices/loyaltySlice";
import StatCard from "./StatCard";
import RecentTransactions from "./RecentTransactions";
import PointsChart from "./PointsChart";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { balance, transactions, loading } = useSelector(
    (state: RootState) => state.loyalty
  );
  const { user } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    dispatch(fetchBalanceRequest());
    dispatch(fetchHistoryRequest());
  }, [dispatch]);

  const recentTransactions = transactions.slice(0, 5);
  const earnedThisMonth = transactions
    .filter(
      (t) =>
        t.type === "earn" &&
        new Date(t.timestamp).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.points, 0);

  const redeemedThisMonth = transactions
    .filter(
      (t) =>
        t.type === "redeem" &&
        new Date(t.timestamp).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + t.points, 0);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  const getBalanceLabel = () => {
    if (balance >= 10000) return "Gold";
    else if (balance >= 5000) return "Silver";
    else return "Bronze";
  };

  const getBalanceColor = () => {
    if (balance >= 10000) return "warning";
    else if (balance >= 5000) return "info";
    else return "default";
  };

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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Current Balance"
            value={balance.toLocaleString()}
            subtitle="points"
            icon={<AccountBalance />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Earned This Month"
            value={earnedThisMonth.toLocaleString()}
            subtitle="points"
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Redeemed This Month"
            value={redeemedThisMonth.toLocaleString()}
            subtitle="points"
            icon={<Redeem />}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Transactions"
            value={transactions.length.toString()}
            subtitle="transactions"
            icon={<History />}
            color="info"
          />
        </Grid>

        {/* Points Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <PointsChart transactions={transactions} />
        </Grid>

        {/* Account Status */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">Loyalty Tier</Typography>
                  <Chip
                    label={getBalanceLabel()}
                    color={getBalanceColor()}
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">Next Tier Progress</Typography>
                  <Typography variant="body2">
                    {balance >= 10000
                      ? "Max Tier"
                      : `${Math.min(
                          100,
                          ((balance % 5000) / 5000) * 100
                        ).toFixed(0)}%`}
                  </Typography>
                </Box>
                {balance < 10000 && (
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, ((balance % 5000) / 5000) * 100)}
                    sx={{ mb: 2 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary">
                  {balance >= 10000
                    ? "You've reached the highest tier!"
                    : `${5000 - (balance % 5000)} points to next tier`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
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
