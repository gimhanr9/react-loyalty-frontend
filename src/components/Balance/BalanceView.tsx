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
  TrendingDown,
  Timeline,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { fetchBalanceRequest } from "../../store/slices/loyaltySlice";

const BalanceView: React.FC = () => {
  const dispatch = useDispatch();
  const { balance, transactions, loading } = useSelector(
    (state: RootState) => state.loyalty
  );

  React.useEffect(() => {
    dispatch(fetchBalanceRequest());
  }, [dispatch]);

  const thisMonthTransactions = transactions.filter(
    (t) => new Date(t.timestamp).getMonth() === new Date().getMonth()
  );

  const earnedThisMonth = thisMonthTransactions
    .filter((t) => t.type === "earn")
    .reduce((sum, t) => sum + t.points, 0);

  const redeemedThisMonth = thisMonthTransactions
    .filter((t) => t.type === "redeem")
    .reduce((sum, t) => sum + t.points, 0);

  const netThisMonth = earnedThisMonth - redeemedThisMonth;

  const getTierInfo = (points: number) => {
    if (points >= 10000)
      return { tier: "Gold", color: "warning", progress: 100, nextTier: null };
    if (points >= 5000)
      return {
        tier: "Silver",
        color: "info",
        progress: ((points - 5000) / 5000) * 100,
        nextTier: "Gold",
      };
    return {
      tier: "Bronze",
      color: "default",
      progress: (points / 5000) * 100,
      nextTier: "Silver",
    };
  };

  const tierInfo = getTierInfo(balance);

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Points Balance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your current loyalty program status
      </Typography>

      <Grid container spacing={3}>
        {/* Main Balance Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <CardContent sx={{ color: "white", p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccountBalance sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Current Balance</Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
                {balance.toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                points
              </Typography>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Equivalent to ${(balance / 200).toFixed(2)} in rewards
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tier Status */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Loyalty Tier
              </Typography>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Chip
                  label={tierInfo.tier}
                  color={tierInfo.color as any}
                  sx={{ fontSize: "1.1rem", py: 2, px: 3 }}
                />
              </Box>
              {tierInfo.nextTier && (
                <>
                  <Typography variant="body2" gutterBottom>
                    Progress to {tierInfo.nextTier}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={tierInfo.progress}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {tierInfo.progress.toFixed(0)}% complete
                  </Typography>
                </>
              )}
              {!tierInfo.nextTier && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  You've reached the highest tier!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Summary */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                This Month's Activity
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography
                      variant="h4"
                      color="success.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      +{earnedThisMonth.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points Earned
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <TrendingDown color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography
                      variant="h4"
                      color="error.main"
                      sx={{ fontWeight: "bold" }}
                    >
                      -{redeemedThisMonth.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points Redeemed
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Timeline color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography
                      variant="h4"
                      color={netThisMonth >= 0 ? "success.main" : "error.main"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {netThisMonth >= 0 ? "+" : ""}
                      {netThisMonth.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Change
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h6">{transactions.length}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Earned
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {transactions
                      .filter((t) => t.type === "earn")
                      .reduce((sum, t) => sum + t.points, 0)
                      .toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Redeemed
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {transactions
                      .filter((t) => t.type === "redeem")
                      .reduce((sum, t) => sum + t.points, 0)
                      .toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Transaction
                  </Typography>
                  <Typography variant="h6">
                    {transactions.length > 0
                      ? Math.round(
                          transactions.reduce((sum, t) => sum + t.points, 0) /
                            transactions.length
                        ).toLocaleString()
                      : "0"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BalanceView;
