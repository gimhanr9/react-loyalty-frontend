import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  FilterList,
  ArrowForward,
  Refresh,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { fetchHistoryRequest } from "../../store/slices/loyaltySlice";

interface Transaction {
  id: string;
  type: string;
  points: number;
  timestamp: string;
}

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { transactions, cursor, loading } = useSelector(
    (state: RootState) => state.loyalty
  );

  const [filteredTransactions, setFilteredTransactions] = React.useState<
    Transaction[]
  >([]);

  useEffect(() => {
    // Initial load
    dispatch(fetchHistoryRequest({ reset: true }));
  }, [dispatch]);

  // Filter transactions locally
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleLoadMore = () => {
    if (cursor && !loading) {
      dispatch(fetchHistoryRequest({ cursor }));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchHistoryRequest({ reset: true }));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Transaction History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View all your loyalty program transactions
          </Typography>
        </Box>
        <Tooltip title="Refresh transactions">
          <IconButton onClick={handleRefresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Card>
        <CardContent>
          {/* Filters */}

          {/* Results Summary */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </Typography>
          </Box>

          {/* Transactions Table */}
          {filteredTransactions.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <FilterList
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No transactions found
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {transaction.type === "ACCUMULATE_POINTS" ? (
                              <TrendingUp color="success" sx={{ mr: 1 }} />
                            ) : (
                              <TrendingDown color="error" sx={{ mr: 1 }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {transaction.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={
                              transaction.points >= 0
                                ? "success.main"
                                : "error.main"
                            }
                            sx={{ fontWeight: "bold" }}
                          >
                            {transaction.points.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(transaction.timestamp)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Load More Button */}
              {cursor && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <LinearProgress sx={{ width: 20 }} />
                      ) : (
                        <KeyboardArrowDown />
                      )
                    }
                    endIcon={!loading && <ArrowForward />}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? "Loading..." : "Load More Transactions"}
                  </Button>
                </Box>
              )}

              {/* Loading indicator for additional data */}
              {loading && transactions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionHistory;
