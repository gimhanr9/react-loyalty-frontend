import React from "react";
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
  Chip,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  LinearProgress,
} from "@mui/material";
import { TrendingUp, TrendingDown, FilterList } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { fetchHistoryRequest } from "../../store/slices/loyaltySlice";

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { transactions, loading } = useSelector(
    (state: RootState) => state.loyalty
  );
  const [filter, setFilter] = React.useState<"all" | "earn" | "redeem">("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    dispatch(fetchHistoryRequest());
  }, [dispatch]);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter = filter === "all" || transaction.type === filter;
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchTerm]);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, page]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

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
        Transaction History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View all your loyalty program transactions
      </Typography>

      <Card>
        <CardContent>
          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Search transactions"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                label="Filter"
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "earn" | "redeem")
                }
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="earn">Earned</MenuItem>
                <MenuItem value="redeem">Redeemed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Results Summary */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {paginatedTransactions.length} of{" "}
            {filteredTransactions.length} transactions
          </Typography>

          {/* Transactions Table */}
          {paginatedTransactions.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <FilterList
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No transactions found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Points</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {transaction.type === "earn" ? (
                              <TrendingUp color="success" sx={{ mr: 1 }} />
                            ) : (
                              <TrendingDown color="error" sx={{ mr: 1 }} />
                            )}
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "medium" }}
                            >
                              {transaction.type === "earn"
                                ? "Earned"
                                : "Redeemed"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={
                              transaction.type === "earn"
                                ? "success.main"
                                : "error.main"
                            }
                            sx={{ fontWeight: "bold" }}
                          >
                            {transaction.type === "earn" ? "+" : "-"}
                            {transaction.points.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status}
                            color={getStatusColor(transaction.status) as any}
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          />
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    color="primary"
                  />
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
